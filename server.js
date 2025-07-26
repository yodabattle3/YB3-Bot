// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Load from env
});
const openai = new OpenAIApi(configuration);

app.post('/api/ask', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are YB3, a helpful AI that knows everything about Roblox.' },
        { role: 'user', content: userMessage },
      ]
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ reply: 'Error getting response from OpenAI.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`YB3 Server running on port ${PORT}`));
