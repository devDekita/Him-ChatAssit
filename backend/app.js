// const express = require('express'); 
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();

// const connectDB = require('./config/db'); 
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.use('/api/chatbot', require('./routes/chatbotRoutes'));
// app.use('/api/chat', require('./routes/chat'));

// // Default route
// app.get('/', (req, res) => {
//   res.send('HIM Chatbot API is Running');
// });

// // Server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);

// });


const express = require('express'); 
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/chatbot', require('./routes/chatbotRoutes'));  // <- hybrid logic lives here
app.use('/api/chat', require('./routes/chat'));              // optional, if you're using it

// Default route
app.get('/', (req, res) => {
  res.send('HIM Chatbot API is Running');
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
