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
    };
    messages.push(newMsg);

    // Broadcast new message to all WS clients
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

// Create HTTP server and attach Express app
const server = http.createServer(app);

// Create WebSocket server on top of HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
