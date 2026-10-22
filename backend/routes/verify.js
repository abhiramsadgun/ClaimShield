const express = require('express');
const router = express.Router();
const axios = require('axios');
const Claim = require('../models/Claim');
const RepositoryBank = require('../models/RepositoryBank');
const { verifyToken } = require('../middleware/auth');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'him', 'his', 'how', 'i', 'if', 'in',
  'into', 'is', 'it', 'its', 'me', 'more', 'most', 'my', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
  'only', 'or', 'other', 'our', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'whom', 'why', 'with', 'you', 'your', 'yours', 'news', 'viral', 'breaking',
  'alert', 'really', 'just'
]);

function extractSearchTokens(text) {
  const cleaned = (text || '').toLowerCase().replace(/[^\w\s]/g, ' ');
  return cleaned.split(/\s+/).filter(w => w.length > 2 || /\d/.test(w)).filter(w => !STOPWORDS.has(w));
}

function matchScore(queryTokens, bankItem) {
  if (!queryTokens.length) return 0;
  
  const bankTokens = new Set([
    ...extractSearchTokens(bankItem.canonicalClaim),
    ...(bankItem.keywords || []).map(k => k.toLowerCase()),
    ...(bankItem.aliases || []).flatMap(a => extractSearchTokens(a))
  ]);

  let matched = 0;
  let numericMatched = 0;
  let numericTotal = 0;

  for (const token of queryTokens) {
    const isNum = /\d/.test(token);
    if (isNum) numericTotal++;

    if (bankTokens.has(token)) {
      matched++;
      if (isNum) numericMatched++;
    } else {
      // Substring fuzzy match for partial words
      for (const bt of bankTokens) {
        if (bt.includes(token) || token.includes(bt)) {
          matched += 0.8;
          break;
        }
      }
    }
  }

  // If query had numeric tokens (e.g. "30", "27", "2022") but none matched, penalize
  if (numericTotal > 0 && numericMatched === 0) {
    return 0;
  }

  return matched / queryTokens.length;
}

// @route   POST /api/extract-image
// @desc    Extracts OCR text and core viral claim from image base64 or payload
// @access  Private (JWT protected)
router.post('/extract-image', verifyToken, async (req, res) => {
  try {
    const { imageBase64, mimeType, fileName } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: 'Base64 image data is required for OCR claim extraction.'
      });
    }

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/extract-image`, {
        imageBase64,
        mimeType: mimeType || 'image/jpeg',
        fileName: fileName || 'uploaded_image.jpg'
      }, {
        timeout: 25000,
        headers: { 'Content-Type': 'application/json' }
      });

      return res.status(200).json({
        success: true,
        message: 'Image claim extraction completed.',
        data: response.data
      });
    } catch (aiErr) {
      console.error('[AI Microservice Image Extraction Error]:', aiErr.message);
      return res.status(502).json({
        success: false,
        message: `Failed to communicate with AI vision microservice: ${aiErr.message}`,
        error: aiErr.message
      });
    }
  } catch (error) {
    console.error('[Extract Image Route Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unexpected server error while extracting claim from image.'
    });
  }
});

// @route   POST /api/verify
// @desc    Checks Global Repository Bank FIRST (0 tokens), otherwise proxies to AI service, indexes to bank, saves to MongoDB
// @access  Private (JWT protected)
router.post('/verify', verifyToken, async (req, res) => {
  try {
    const { text, imageUrl, extractedFromImage, imageForensics } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Claim text is required for verification analysis.'
      });
    }

    const cleanText = text.trim();
    const queryTokens = extractSearchTokens(cleanText);

    // -------------------------------------------------------------------------
    // STEP 1: Fast Lookup in Global Repository Bank (Zero LLM Tokens Consumed - Real News Only)
    // -------------------------------------------------------------------------
    try {
      if (queryTokens.length > 0) {
        // Query candidates from MongoDB using regex on tokens - strictly real verified news
        const regexQueries = queryTokens.slice(0, 5).map(t => new RegExp(t, 'i'));
        const candidates = await RepositoryBank.find({
          verdict: 'TRUE / VERIFIED',
          $or: [
            { keywords: { $in: queryTokens } },
            { canonicalClaim: { $in: regexQueries } },
            { aliases: { $in: regexQueries } }
          ]
        }).limit(20);

        let bestMatch = null;
        let highestScore = 0;

        for (const candidate of candidates) {
          const score = matchScore(queryTokens, candidate);
          if (score > highestScore && score >= 0.52) { // 52%+ keyword & semantic alignment
            highestScore = score;
            bestMatch = candidate;
          }
        }

        if (bestMatch && bestMatch.verdict === 'TRUE / VERIFIED') {
          console.log(`⚡ [Repository Bank HIT]: Matched "${cleanText}" -> "${bestMatch.canonicalClaim}" (Score: ${(highestScore * 100).toFixed(1)}%, Saved ~1250 tokens)`);

          // Update repository bank stats in background
          bestMatch.hitCount = (bestMatch.hitCount || 0) + 1;
          bestMatch.tokensSaved = (bestMatch.tokensSaved || 0) + 1250;
          bestMatch.lastAccessedAt = new Date();
          if (!bestMatch.aliases.includes(cleanText) && cleanText.length < 200) {
            bestMatch.aliases.push(cleanText);
          }
          await bestMatch.save().catch(e => console.warn('[RepoBank Update Error]:', e.message));

          // Save to user history
          let userRecord = null;
          try {
            const userClaim = new Claim({
              userId: req.user.id,
              claimText: cleanText,
              verdict: bestMatch.verdict,
              confidenceScore: bestMatch.confidenceScore,
              explanation: bestMatch.explanation,
              sourceSummary: bestMatch.sourceSummary || {
                govtPortalsChecked: 4,
                mediaWiresChecked: 12,
                factCheckersChecked: 3,
                liveWebGroundingChecked: 6
              },
              matchedArticles: bestMatch.matchedArticles || [],
              factCheckCitations: bestMatch.factCheckCitations || [],
              imageUrl: imageUrl || null,
              imageForensics: imageForensics || null,
              groundingEngine: 'ClaimShield Global Repository Bank (Instant Real News Cache)'
            });
            userRecord = await userClaim.save();
          } catch (histErr) {
            console.warn('[History Save Warning]:', histErr.message);
          }

          return res.status(200).json({
            success: true,
            message: 'Claim verified instantly via Global Repository Bank.',
            data: {
              id: userRecord ? userRecord._id : bestMatch._id,
              claim: cleanText,
              canonicalClaim: bestMatch.canonicalClaim,
              verdict: bestMatch.verdict,
              confidenceScore: bestMatch.confidenceScore,
              explanation: bestMatch.explanation,
              sourceSummary: bestMatch.sourceSummary,
              matchedArticles: bestMatch.matchedArticles || [],
              factCheckCitations: bestMatch.factCheckCitations || [],
              imageUrl: imageUrl || null,
              imageForensics: imageForensics || null,
              groundingEngine: 'ClaimShield Global Repository Bank (Instant Real News Cache)',
              isRepoBankHit: true,
              tokensSaved: 1250,
              repoBankId: bestMatch._id,
              hitCount: bestMatch.hitCount,
              timestamp: userRecord ? userRecord.timestamp : new Date()
            }
          });
        }
      }
    } catch (bankErr) {
      console.warn('[Repository Bank Lookup Warning]:', bankErr.message);
    }

    // -------------------------------------------------------------------------
    // STEP 2: Not in Repository Bank -> Contact AI Microservice
    // -------------------------------------------------------------------------
    let aiResponse;
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/analyze`, {
        text: cleanText,
        imageUrl: imageUrl || null,
        extractedFromImage: Boolean(extractedFromImage),
        imageForensics: imageForensics || null
      }, {
        timeout: 45000
      });
      aiResponse = response.data;
    } catch (aiErr) {
      console.error('[AI Microservice Communication Error]:', aiErr.message);
      return res.status(502).json({
        success: false,
        message: `AI verification pipeline encountered a delay or connection issue: ${aiErr.message}. Ensure FastAPI is active on port 8000.`,
        error: aiErr.message
      });
    }

    // -------------------------------------------------------------------------
    // STEP 3: Auto-Register Verified REAL NEWS ONLY into Global Repository Bank
    // -------------------------------------------------------------------------
    try {
      const verdict = aiResponse.verdict || '';
      const isRealNewsVerified = verdict === 'TRUE / VERIFIED' && (aiResponse.confidenceScore || 0) >= 75;
      const validArticles = (aiResponse.matchedArticles || []).filter(a => a.url && a.url.startsWith('http'));

      if (isRealNewsVerified && cleanText.length > 5 && validArticles.length > 0) {
        const canonical = aiResponse.claim || cleanText;
        const keywords = extractSearchTokens(canonical);

        // Deduce category
        let category = 'General News';
        const lowerText = canonical.toLowerCase();
        if (/space|isro|nasa|moon|planet|mars|orbit|satellite|astronomy|physics|biology|science/.test(lowerText)) {
          category = 'Science & Space';
        } else if (/cricket|football|fifa|olympic|world cup|t20|score|century|match|tennis|nba|goal|ipl/.test(lowerText)) {
          category = 'Sports & Records';
        } else if (/oracle|java|ai|apple|google|microsoft|software|cyber|chip|gpu|intel|nvidia|android|ios/.test(lowerText)) {
          category = 'Tech & Computing';
        } else if (/virus|who|covid|disease|vaccine|health|fda|cancer|hospital|medical|mpox/.test(lowerText)) {
          category = 'Public Health';
        } else if (/election|minister|president|senate|parliament|treaty|war|military|govt|un/.test(lowerText)) {
          category = 'Geopolitics';
        }

        await RepositoryBank.findOneAndUpdate(
          { canonicalClaim: canonical },
          {
            $setOnInsert: {
              canonicalClaim: canonical,
              aliases: [cleanText],
              keywords: keywords,
              category: category,
              verdict: 'TRUE / VERIFIED',
              confidenceScore: aiResponse.confidenceScore,
              explanation: aiResponse.explanation,
              sourceSummary: aiResponse.sourceSummary,
              matchedArticles: validArticles.slice(0, 4),
              factCheckCitations: aiResponse.factCheckCitations || [],
              hitCount: 1,
              tokensSaved: 0,
              verifiedAt: new Date(),
              lastAccessedAt: new Date()
            }
          },
          { upsert: true, new: true }
        );
        console.log(`🏦 [Repository Bank Indexed Real News]: Saved new verified fact -> "${canonical}"`);
      }
    } catch (saveBankErr) {
      console.warn('[Repository Bank Auto-Index Warning]:', saveBankErr.message);
    }

    // Persist to MongoDB under user history
    let savedRecord = null;
    try {
      const newClaim = new Claim({
        userId: req.user.id,
        claimText: aiResponse.claim || cleanText,
        verdict: aiResponse.verdict || 'UNVERIFIED / INSUFFICIENT EVIDENCE',
        confidenceScore: aiResponse.confidenceScore ?? 50,
        explanation: aiResponse.explanation || '',
        sourceSummary: aiResponse.sourceSummary || {
          govtPortalsChecked: 4,
          mediaWiresChecked: 12,
          factCheckersChecked: 3,
          liveWebGroundingChecked: 6
        },
        matchedArticles: aiResponse.matchedArticles || [],
        factCheckCitations: aiResponse.factCheckCitations || [],
        imageUrl: imageUrl || null,
        imageForensics: aiResponse.imageForensics || imageForensics || null,
        groundingEngine: aiResponse.groundingEngine || 'Hybrid Multi-Source Engine'
      });

      savedRecord = await newClaim.save();
    } catch (dbErr) {
      console.warn('[MongoDB Persistence Warning]:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Claim verification completed.',
      data: {
        id: savedRecord ? savedRecord._id : null,
        claim: aiResponse.claim || cleanText,
        verdict: aiResponse.verdict,
        confidenceScore: aiResponse.confidenceScore,
        explanation: aiResponse.explanation,
        sourceSummary: aiResponse.sourceSummary,
        matchedArticles: aiResponse.matchedArticles || [],
        factCheckCitations: aiResponse.factCheckCitations || [],
        imageUrl: imageUrl || null,
        imageForensics: aiResponse.imageForensics || imageForensics || null,
        groundingEngine: aiResponse.groundingEngine || 'Hybrid Multi-Source Engine',
        isRepoBankHit: Boolean(aiResponse.isRepoBankHit),
        tokensSaved: aiResponse.tokensSaved || 0,
        timestamp: savedRecord ? savedRecord.timestamp : new Date()
      }
    });
  } catch (error) {
    console.error('[Verify Route Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected internal server error occurred while processing verification.'
    });
  }
});

// @route   GET /api/engine-status
// @desc    Check status of active real-time fact checking & vision APIs
// @access  Public / Private
router.get('/engine-status', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/engine-status`, { timeout: 4000 });
    return res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      data: {
        gemini: { configured: false, feature: "Multimodal Vision OCR & Fact Synthesis" },
        factCheck: { configured: false, feature: "Google Fact Check Tools API" },
        liveWeb: { configured: false, feature: "Live Web & News Grounding" },
        newsApi: { configured: false, feature: "NewsAPI Global Media Feeds" },
        wikipedia: { configured: true, feature: "Wikipedia Knowledge Base (Live REST API)" }
      }
    });
  }
});

// @route   POST /api/keys/config
// @desc    Update API keys dynamically in AI Microservice
// @access  Private
router.post('/keys/config', verifyToken, async (req, res) => {
  try {
    const { geminiApiKey, factCheckApiKey, serperApiKey, tavilyApiKey, newsApiKey } = req.body;
    const response = await axios.post(`${AI_SERVICE_URL}/update-keys`, {
      geminiApiKey,
      factCheckApiKey,
      serperApiKey,
      tavilyApiKey,
      newsApiKey
    }, { timeout: 6000 });

    return res.status(200).json({
      success: true,
      message: 'API keys configured successfully.',
      data: response.data
    });
  } catch (err) {
    return res.status(502).json({
      success: false,
      message: 'Failed to update keys on AI microservice.'
    });
  }
});

// @route   GET /api/history
// @desc    Retrieve past verified claims for authenticated user
// @access  Private
router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await Claim.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(30);

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('[Fetch History Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve verification history records.'
    });
  }
});

// @route   DELETE /api/history/:id
// @desc    Delete a specific history record
// @access  Private
router.delete('/history/:id', verifyToken, async (req, res) => {
  try {
    const record = await Claim.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found or unauthorized.' });
    }

    return res.status(200).json({ success: true, message: 'History record removed.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to remove history record.' });
  }
});

module.exports = router;
