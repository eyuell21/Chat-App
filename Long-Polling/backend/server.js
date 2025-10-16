import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory storage
let messages = [];
let clients = [];

// Serve the latest messages (long-polling)
app.get('/messages', (req, res) => {
  if (messages.length > 0) {
    res.json(messages); // Send immediately if messages exist (initial load)
  } else {
    // Hold the request open for long polling
    const timer = setTimeout(() => {
      res.json([]); // No messages within 30s
      clients = clients.filter(c => c !== res);
    }, 30000); // 30 seconds timeout

    // Clean up on client disconnect
    req.on('close', () => {
      clearTimeout(timer);
      clients = clients.filter(c => c !== res);
    });

    clients.push(res);
  }
});

// Post a new message
app.post('/messages', (req, res) => {
  const { message } = req.body;
  if (message?.trim()) {
    const newMessage = {
      text: message.trim(),
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    res.status(201).json({ success: true });

    // Send new message to all long-polling clients
    clients.forEach(clientRes => clientRes.json([newMessage]));
    clients = [];
  } else {
    res.status(400).json({ error: 'Message is required' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
