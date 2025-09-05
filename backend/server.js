import express from 'express';
import cors from 'cors'

const app = express();
const PORT = 3000;

app.use(cors())

let messages = [];

app.use(express.static('public'));
app.use(express.json());

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const { message } = req.body;
  if (message?.trim()) {
    messages.push(message.trim());
    res.status(201).json({ success: true });
  } else {
    res.status(400).json({ error: 'Message is required' });
  }
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
