const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public')); // Optional: for CSS, JS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const {
  WHATSAPP_PHONE_NUMBER_ID,
  ACCESS_TOKEN,
  CLOUD_API_VERSION,
} = process.env;

const WHATSAPP_API_URL = `https://graph.facebook.com/${CLOUD_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

// Serve the form
app.get('/', (req, res) => {
  res.render('index', { status: null });
});

// Handle form POST
app.post('/send-message', async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        text: { body: message },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    res.render('index', { status: 'Message sent successfully!' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.render('index', {
      status: 'Failed to send message. See server logs for details.',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
