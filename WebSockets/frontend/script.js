const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const messagesList = document.querySelector('#messages');

let socket;

let url = 'https://eyuell21chatappserverr.hosting.codeyourfuture.io/messages'

const addMessageToList = (message, timestamp) => {
  const li = document.createElement('li');
  const timeStr = new Date(timestamp).toLocaleString();
  li.textContent = `${message} (since: ${timeStr})`;
  messagesList.appendChild(li);
};

// Load all messages from backend initially
const loadMessages = async () => {
  try {
    const res = await fetch(url);
    const messages = await res.json();
    messagesList.innerHTML = '';
    messages.forEach(({ text, timestamp }) => addMessageToList(text, timestamp));
  } catch (err) {
    console.error('Failed to load messages:', err);
  }
};

// Send message via POST
const sendMessage = async (message) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      console.error('Message failed to send');
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
};

// Setup WebSocket connection
const setupWebSocket = () => {
  socket = new WebSocket(url);

  socket.addEventListener('open', () => {
    console.log('WebSocket connected');
  });

  socket.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data);  // JSon comment
      addMessageToList(msg.text, msg.timestamp);
    } catch {
      console.error('Invalid message from WebSocket');
    }
  });

  socket.addEventListener('close', () => {
    console.log('WebSocket disconnected, retrying in 3s...');
    setTimeout(setupWebSocket, 3000); // reconnect automatically
  });
};

// Form submit handler
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    sendMessage(message);
    input.value = '';
  }
});

// Initialize app
loadMessages();
setupWebSocket();
