// backend/controllers/chatbotController.js

const axios = require('axios');
const { WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = require('../config/whatsappConfig');

// Predefined FAQs and answers
const predefinedResponses = {
  "what courses are offered": "We offer BCA, BBA, MCA, and MBA courses at HIM Sonepat.",
  "how to apply": "You can apply online through our website Admission section or visit the college directly.",
  "where is the college located": "HIM is located in Sonepat, Haryana. Visit our Contact Us page for exact address.",
  // Add more simple FAQs if needed
};

// Controller: Handle User Query
const handleUserQuery = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const lowerCaseMessage = message.toLowerCase();

  // Check if user's query matches any predefined questions
  const response = predefinedResponses[lowerCaseMessage];

  if (response) {
    // Auto-respond if match found
    return res.json({ reply: response });
  } else {
    // If not found, forward to WhatsApp
    try {
      await axios.post(
        `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: process.env.EXPERT_PHONE_NUMBER,   // College expert's WhatsApp number
          text: { body: `New Query from Website Visitor: ${message}` }
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return res.json({ reply: "Your query has been forwarded to our expert on WhatsApp. They'll connect with you shortly." });

    } catch (error) {
      console.error('WhatsApp API Error:', error.response ? error.response.data : error.message);
      return res.status(500).json({ error: "Failed to forward query to expert." });
    }
  }
};

// Controller: WhatsApp Webhook Verification (Optional)
const whatsappWebhook = (req, res) => {
  const verify_token = process.env.WHATSAPP_VERIFY_TOKEN; // Add in your .env file
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

module.exports = { handleUserQuery, whatsappWebhook };
