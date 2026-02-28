const express = require('express');
const router = express.Router();
const QA = require('../models/QA');
const staticChatData = require('./chat'); 


// Hybrid logic route
router.post('/', async (req, res) => {
  const userMessage = req.body.message.toLowerCase();

  try {
    // First, check MongoDB for a keyword match
    const dbMatch = await QA.findOne({ 
      keywords: { $in: userMessage.split(" ") } 
    });

    if (dbMatch) {
      return res.json({ reply: dbMatch.answer });
    }

    // Fallback to static chat.js keyword logic
    for (let item of staticChatData) {
      for (let keyword of item.keywords) {
        if (userMessage.includes(keyword)) {
          return res.json({ reply: item.answer });
        }
      }
    }

    // Default fallback
    res.json({ reply: "I'm sorry, I don't have an answer for that. Would you like to talk to a human expert?" });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
