const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const messagesList = document.querySelector('#messages');

let socket;

let url = 'https://eyuell21chatappserverr.hosting.codeyourfuture.io'

// Add message to DOM
const addMessageToList = (message, timestamp, likes, dislikes) => {
  // Check if already exists
  if (document.getElementById(`message-${timestamp}`)) return;

  const li = document.createElement('li');
  li.id = `message-${timestamp}`;
  const timeStr = new Date(timestamp).toLocaleString();
  li.textContent = `${message} (since: ${timeStr})`;

  // Spans
  const likesSpan = document.createElement('span');
  likesSpan.id = `likes-${timestamp}`;
  likesSpan.textContent = ` Likes: ${likes}`;

  const dislikesSpan = document.createElement('span');
  dislikesSpan.id = `dislikes-${timestamp}`;
  dislikesSpan.textContent = ` Dislikes: ${dislikes}`;

  // Buttons
  const likeButton = document.createElement('button');
  likeButton.textContent = 'Like';

  const dislikeButton = document.createElement('button');
  dislikeButton.textContent = 'Dislike';

  // Handlers
  likeButton.addEventListener('click', () => handleLikeDislike('like', timestamp));
  dislikeButton.addEventListener('click', () => handleLikeDislike('dislike', timestamp));

  // Append
  li.appendChild(document.createElement('br'));
  li.appendChild(likesSpan);
  li.appendChild(dislikesSpan);
  li.appendChild(document.createElement('br'));
  li.appendChild(likeButton);
  li.appendChild(dislikeButton);

  messagesList.appendChild(li);
};

// Handle Like/Dislike
const handleLikeDislike = async (action, timestamp) => {
  try {
    const endpoint = action === 'like' ? '/like' : '/dislike';
    const res = await fetch(`${url}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp }),
    });

    if (res.ok) {
      const updated = await res.json();
      updateMessageCounts(updated);
    } else {
      console.error(`Failed to ${action}`);
    }
  } catch (err) {
    console.error(`Error during ${action}:`, err);
  }
};

// Update counts in DOM
const updateMessageCounts = ({ timestamp, likes, dislikes }) => {
  const likeSpan = document.getElementById(`likes-${timestamp}`);
  const dislikeSpan = document.getElementById(`dislikes-${timestamp}`);
  if (likeSpan) likeSpan.textContent = ` Likes: ${likes}`;
  if (dislikeSpan) dislikeSpan.textContent = ` Dislikes: ${dislikes}`;
};

// Load initial messages
const loadMessages = async () => {
  try {
    const res = await fetch(`${url}/messages`);
    const messages = await res.json();
    messagesList.innerHTML = '';
    messages.forEach(({ text, timestamp, likes, dislikes }) => {
      addMessageToList(text, timestamp, likes, dislikes);
    });
  } catch (err) {
    console.error('Failed to load messages:', err);
  }
};

const sendMessage = async (message) => {
  try {
    const res = await fetch(`${url}/messages`, {
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

// setup a websocket connection
const setupWebSocket = () => {
  socket = new WebSocket(url);

  socket.addEventListener('open', () => {
    console.log('WebSocket connected');
  });

  socket.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data);
      const { text, timestamp, likes, dislikes } = msg;

      if (document.getElementById(`message-${timestamp}`)) {
        updateMessageCounts(msg);
      } else {
        addMessageToList(text, timestamp, likes, dislikes);
      }
    } catch (err) {
      console.error('Invalid WebSocket message', err);
    }
  });

  socket.addEventListener('close', () => {
    console.log('WebSocket disconnected. Reconnecting...');
    setTimeout(setupWebSocket, 3000);
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

// Initialise app
loadMessages();
setupWebSocket();
