const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let messages = [];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const { message } = req.body;
  if (message && message.trim()) {
    const newMsg = {
      text: message.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };
    messages.push(newMsg);

    // Broadcast to all WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newMsg));
      }
    });

    res.status(201).json({ success: true });
  } else {
    res.status(400).json({ error: 'Message is required' });
  }
});

// Like a message
app.post('/like', (req, res) => {
  const { timestamp } = req.body;
  const message = messages.find(m => m.timestamp === timestamp);
  if (message) {
    message.likes += 1;

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });

    res.status(200).json(message);
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

// Dislike a message
app.post('/dislike', (req, res) => {
  const { timestamp } = req.body;
  const message = messages.find(m => m.timestamp === timestamp);
  if (message) {
    message.dislikes += 1;

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });

    res.status(200).json(message);
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
