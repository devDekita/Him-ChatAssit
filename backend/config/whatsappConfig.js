const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID
};
