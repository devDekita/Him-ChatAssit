const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/chatMessage");
const QA = require("../models/QA");

// Formatter function to handle different formats
function formatAnswer(answer) {
  if (typeof answer === "string") {
    // Replace \n with <br/>
    return answer.replace(/\n/g, "<br/>");
  }

  if (Array.isArray(answer)) {
    // Format each item in the array
    return answer.map(item => formatAnswer(item)).join("<br/>");
  }

  if (typeof answer === "object" && answer !== null) {
    let formatted = "";
    for (const key in answer) {
      if (Object.hasOwnProperty.call(answer, key)) {
        const value = answer[key];

        if (typeof value === "string" || typeof value === "number") {
          formatted += `<p><strong>${capitalize(key)}:</strong> ${formatAnswer(value)}</p>`;
        } else if (Array.isArray(value)) {
          formatted += `<p><strong>${capitalize(key)}:</strong><br/>${value.map(item => formatAnswer(item)).join("<br/>")}</p>`;
        } else if (typeof value === "object") {
          formatted += `<div><strong>${capitalize(key)}:</strong>${formatAnswer(value)}</div>`;
        }
      }
    }
    return formatted;
  }

  return String(answer); // fallback
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Main POST endpoint
router.post("/", async (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();
  let reply = "";

  try {
    const allQAs = await QA.find({});

    const matchedQA = allQAs.find((qa) =>
      qa.keywords.some((keyword) => lowerMsg.includes(keyword.toLowerCase()))
    );

    if (matchedQA) {
      reply = formatAnswer(matchedQA.answer);
    }
  } catch (err) {
    console.error("MongoDB QA Search Error:", err.message);
  }

  // Fallback static replies
  if (!reply) {
    if (lowerMsg.includes("course")) {
      reply = `<p>We offer BBA, BCA, MBA, and MCA courses.</p>
      <p><strong>Choose a course to know more :</strong></p>
      <button data-message="BBA details">BBA</button>
      <button data-message="BCA details">BCA</button>
      <button data-message="MBA details">MBA</button>
      <button data-message="MCA details">MCA</button>`;
    } else if (lowerMsg.includes("location") || lowerMsg.includes("where")) {
      reply = "We are located in Sonepat, Haryana.";
    } else if (lowerMsg.includes("admission") || lowerMsg.includes("apply")) {
      reply = "Admissions are open! You can apply online through our official HIM website.";
    } else if (lowerMsg.includes("fees") || lowerMsg.includes("fee")) {
      reply = `<p>our fee Structure varies from course to course. please select a course.</p>
      <p><strong>Choose a course to know more :</strong></p>
      <button data-message="BBA fee details">BBA</button>
      <button data-message="BCA fee details">BCA</button>
      <button data-message="MBA fee details">MBA</button>
      <button data-message="MCA fee details">MCA</button>`;
    } else if (lowerMsg.includes("contact") || lowerMsg.includes("phone")) {
      reply = "You can call us at +91-1234567890 or email info@himsonepat.org.";
    } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
      reply = "Hello! How can I help you today?";
    } else {
      reply = `I'm not sure I understand. 🤔<br/>
      Would you like to chat with an expert on WhatsApp?<br/>
      <button onclick="window.open('https://wa.me/919996010016', '_blank')" style="
        background-color:rgb(28, 49, 119);
        border: none;
        color: white;
        padding: 8px 16px;
        margin-top: 8px;
        font-size: 14px;
        border-radius: 4px;
        cursor: pointer;
      ">📱 Chat on WhatsApp</button>`;
    }
  }

  // Save message and reply to MongoDB
  const newChat = new ChatMessage({
    userMessage: message,
    botReply: reply,
  });

  try {
    await newChat.save();
  } catch (err) {
    console.error("MongoDB Save Error:", err);
  }

  res.json({ reply });
});

module.exports = router;
