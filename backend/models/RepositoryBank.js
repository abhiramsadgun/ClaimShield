const mongoose = require('mongoose');

const MatchedArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, default: 'External Wire' },
  url: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Mainstream News Wire' },
  statusCheck: { type: String, default: 'Corroborated' }
}, { _id: false });

const FactCheckCitationSchema = new mongoose.Schema({
  publisher: { type: String, default: 'Fact Check Desk' },
  rating: { type: String, default: 'Evaluated' },
  url: { type: String, default: '' },
  claimDate: { type: String, default: '' },
  claimant: { type: String, default: '' },
  title: { type: String, default: '' }
}, { _id: false });

const SourceSummarySchema = new mongoose.Schema({
  govtPortalsChecked: { type: Number, default: 0 },
  mediaWiresChecked: { type: Number, default: 0 },
  factCheckersChecked: { type: Number, default: 0 },
  liveWebGroundingChecked: { type: Number, default: 0 }
}, { _id: false });

const RepositoryBankSchema = new mongoose.Schema({
  canonicalClaim: {
    type: String,
    required: [true, 'Canonical claim text is required'],
    trim: true,
    unique: true,
    index: true
  },
  aliases: [{
    type: String,
    trim: true
  }],
  keywords: [{
    type: String,
    index: true
  }],
  category: {
    type: String,
    default: 'General News',
    enum: ['General News', 'Science & Space', 'Sports & Records', 'Tech & Computing', 'Public Health', 'Geopolitics', 'Economy & Finance', 'Entertainment']
  },
  verdict: {
    type: String,
    required: true,
    enum: ['TRUE / VERIFIED', 'FALSE / DEBUNKED', 'UNVERIFIED / INSUFFICIENT EVIDENCE']
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  explanation: {
    type: String,
    default: ''
  },
  sourceSummary: SourceSummarySchema,
  matchedArticles: [MatchedArticleSchema],
  factCheckCitations: [FactCheckCitationSchema],
  hitCount: {
    type: Number,
    default: 1
  },
  tokensSaved: {
    type: Number,
    default: 1250 // Estimated ~1,250 LLM input/output tokens saved per query
  },
  verifiedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Text index on canonical claim, aliases, and keywords for fast search
RepositoryBankSchema.index({
  canonicalClaim: 'text',
  aliases: 'text',
  keywords: 'text'
});

module.exports = mongoose.model('RepositoryBank', RepositoryBankSchema);
