const mongoose = require('mongoose');

const QASchema = new mongoose.Schema({
  question: String,          // Full question text
  keywords: [String],        // Keywords for matching (e.g., ['fees', 'bca'])
  answer: String             // Answer to return
});

module.exports = mongoose.model('QA', QASchema);
