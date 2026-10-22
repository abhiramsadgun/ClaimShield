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

const ImageForensicSchema = new mongoose.Schema({
  detectedText: { type: String, default: '' },
  coreClaim: { type: String, default: '' },
  contextType: { type: String, default: 'Social Media Screenshot' },
  confidence: { type: Number, default: 85 },
  visualTamperRisk: { type: String, default: 'Low' },
  forensicNotes: { type: String, default: '' },
  dimensions: { type: String, default: '' },
  fileSizeKb: { type: Number, default: 0 }
}, { _id: false });

const SourceSummarySchema = new mongoose.Schema({
  govtPortalsChecked: { type: Number, default: 0 },
  mediaWiresChecked: { type: Number, default: 0 },
  factCheckersChecked: { type: Number, default: 0 },
  liveWebGroundingChecked: { type: Number, default: 0 }
}, { _id: false });

const ClaimSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  claimText: {
    type: String,
    required: [true, 'Claim text is required'],
    trim: true
  },
  verdict: {
    type: String,
    required: true
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
  imageUrl: {
    type: String,
    default: null
  },
  imageForensics: ImageForensicSchema,
  groundingEngine: {
    type: String,
    default: 'Hybrid Multi-Source Engine'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Claim', ClaimSchema);
