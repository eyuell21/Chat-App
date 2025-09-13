const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const messagesList = document.querySelector('#messages');

// Load all messages from backend and display with timestamps
const loadMessages = async () => {
  try {
    const res = await fetch('https://eyuell21-quote-server440.hosting.codeyourfuture.io/');
    const messages = await res.json();
    messagesList.innerHTML = '';
    messages.forEach(({ text, timestamp }) => addMessageToList(text, timestamp));
  } catch (err) {
    console.error('Failed to load messages:', err);
  }
};

// Send new message to backend
const sendMessage = async (message) => {
  try {
    const res = await fetch('https://eyuell21-quote-server440.hosting.codeyourfuture.io/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (res.ok) {
      const now = new Date().toISOString();
      addMessageToList(message, now);
      input.value = '';
    } else {
      console.error('Message failed to send');
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
};

// Append message + timestamp to the list
const addMessageToList = (message, timestamp) => {
  const li = document.createElement('li');
  // Format timestamp to something readable
  const timeStr = new Date(timestamp).toLocaleString();
  li.textContent = `${message} (since: ${timeStr})`;
  messagesList.appendChild(li);
};

// Handle form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) sendMessage(message);
});

// Load messages initially
loadMessages();
