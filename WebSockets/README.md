# WebSocket Chat Implementation

A real-time chat application using **WebSockets** for full-duplex bidirectional communication with interactive features like message reactions.

## 🔌 What is WebSocket?

WebSocket is a protocol that provides a persistent, full-duplex communication channel over a single TCP connection. Unlike HTTP, which is request-response based, WebSocket allows the server to push data to clients at any time.

### How It Works Here

1. Client opens the chat page and establishes a WebSocket connection to the server
2. Server accepts the connection and adds the client to its list of active connections
3. Client can send messages via HTTP POST to `/messages`
4. Server receives the message, stores it, and **immediately broadcasts** it to all connected WebSocket clients
5. All clients receive the message in real-time through their open WebSocket connection
6. Connection remains open until client closes the browser or disconnects

## 📂 Structure

```
WebSockets/
├── package.json          # Root dependencies
├── backend/
│   ├── package.json      # Backend-specific configuration
│   └── sever.js          # Express server with WebSocket support
└── frontend/
    ├── index.html        # Chat interface with reactions
    └── script.js         # WebSocket client logic
```

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
node sever.js
```

Server runs on `http://localhost:3000`

### Frontend

Open in browser:
```
file:///path/to/Chat-App/WebSockets/frontend/index.html
```

Or serve with a static server:
```bash
cd frontend
python3 -m http.server 8080
# Visit http://localhost:8080
```

## 📡 API Reference

### GET /messages
Retrieves all stored messages.

**Response (200 OK):**
```json
[
  {
    "text": "Hello, world!",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "likes": 5,
    "dislikes": 1
  }
]
```

### POST /messages
Sends a new message and broadcasts to all WebSocket clients.

**Request:**
```json
{
  "message": "Hello, world!"
}
```

**Response (201 Created):**
```json
{
  "success": true
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Message is required"
}
```

### POST /like
Adds a like to a message.

**Request:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response (200 OK):**
```json
{
  "text": "Hello, world!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "likes": 6,
  "dislikes": 1
}
```

### POST /dislike
Adds a dislike to a message.

**Request:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response (200 OK):**
```json
{
  "text": "Hello, world!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "likes": 5,
  "dislikes": 2
}
```

## 💡 How to Use

1. Open the chat page in your browser
2. Type your message in the input field
3. Click "Send" or press Enter
4. Your message appears immediately with like/dislike buttons
5. Click the **Like** or **Dislike** button on any message
6. Reactions update in real-time across all connected clients
7. Open another browser tab/window to see real-time updates between instances

## 🧠 Code Walkthrough

### Server-Side Logic (`backend/sever.js`)

**WebSocket Server Setup:**
```javascript
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
```

**Broadcasting Messages:**
```javascript
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

    // Broadcast to ALL WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newMsg));
      }
    });

    res.status(201).json({ success: true });
  }
});
```

**Handling Reactions:**
```javascript
app.post('/like', (req, res) => {
  const { timestamp } = req.body;
  const message = messages.find(m => m.timestamp === timestamp);
  
  if (message) {
    message.likes += 1;

    // Broadcast updated message to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });

    res.status(200).json(message);
  }
});
```

### Client-Side Logic (`frontend/script.js`)

**Establishing WebSocket Connection:**
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('Connected to WebSocket server');
  fetchMessages();  // Load initial messages
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  updateMessage(message);  // Update UI with new/edited message
};
```

**Sending a Message:**
```javascript
document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = document.getElementById('message-input').value;
  
  await fetch('http://localhost:3000/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  document.getElementById('message-input').value = '';
});
```

**Sending a Like:**
```javascript
async function likeMessage(timestamp) {
  await fetch('http://localhost:3000/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timestamp })
  });
}
```

## ⚙️ Configuration

### WebSocket Port
By default, WebSocket uses the same port as HTTP (3000). Modify in `backend/sever.js`:
```javascript
const PORT = 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
```

### Message Storage
Messages are stored in an array and lost on restart. For persistence:
```javascript
let messages = [];  // Replace with database query
```

## ✅ Advantages

- ✅ True real-time communication
- ✅ Lower latency (no polling overhead)
- ✅ Efficient bandwidth usage
- ✅ Server can push updates anytime
- ✅ Better scalability than long-polling
- ✅ Interactive features like reactions possible
- ✅ Feels responsive and modern

## ❌ Disadvantages

- ❌ Requires WebSocket support (older browsers may not support)
- ❌ More complex to implement
- ❌ Not all proxies/firewalls support WebSocket
- ❌ Requires more server resources to maintain connections
- ❌ Debugging can be more difficult

## 🔍 Debugging Tips

- **Open browser DevTools → Network tab** and filter by "WS" to see WebSocket connections
- **Check "Messages" tab** in WebSocket connection to see sent/received data
- **Monitor server console** for connection/disconnection logs
- **Use browser console** to check for JavaScript errors
- **Test with multiple browser tabs** to verify real-time updates

## 🚀 Production Considerations

- Implement message persistence (database)
- Add authentication and user identification
- Use `wss://` (WebSocket Secure) instead of `ws://` with SSL/TLS
- Implement automatic reconnection with exponential backoff
- Add heartbeat/ping to detect dead connections
- Implement message rate limiting
- Add proper error handling
- Use a load balancer with session affinity (sticky sessions)
- Consider using Socket.io for better browser compatibility
- Add logging and monitoring

## 📊 Performance Metrics

- **Connection Setup**: ~50-100ms
- **Message Latency**: <10ms (local network)
- **Memory per Connection**: ~10-50KB
- **Max Concurrent Connections**: Depends on server resources (typical: 10,000+)

## 🐛 Known Issues

- **Filename Typo**: Backend file is named `sever.js` (should be `server.js`)
- **No Reconnection Logic**: Client doesn't automatically reconnect on disconnect
- **No User Authentication**: All actions are anonymous

## 📖 Further Reading

- [WebSocket API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [ws - WebSocket Client & Server](https://github.com/websockets/ws)
- [Socket.io Documentation](https://socket.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [HTTP Server Documentation](https://nodejs.org/api/http.html)

## 🆕 Advanced Features to Add

- **Private Rooms**: Multiple chat rooms with group messaging
- **User Nicknames**: Identify who sent each message
- **Typing Indicators**: Show when someone is typing
- **Read Receipts**: Confirm message delivery and reading
- **Message History**: Scroll through past conversations
- **File Sharing**: Send images and documents
- **Emoji Support**: React with emoji instead of just like/dislike
- **Admin Controls**: Moderate messages and manage users
