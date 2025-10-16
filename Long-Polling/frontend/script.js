const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const messagesList = document.querySelector('#messages');

// Poll messages every 30 seconds
const pollMessages = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // Abort after 30s

    const res = await fetch('http://localhost:3000/messages', {
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (res.ok) {
      const newMessages = await res.json();
      newMessages.forEach(({ text, timestamp }) => {
        addMessageToList(text, timestamp);
      });
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Polling error:', err);
    }
  } finally {
    // Re-poll after 30 seconds regardless of result
    setTimeout(pollMessages, 30000);
  }
};

// Send a new message to the backend
const sendMessage = async (message) => {
  try {
    const res = await fetch('http://localhost:3000/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (res.ok) {
      input.value = '';
    } else {
      console.error('Message failed to send');
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
};

// Add a new message to the UI
const addMessageToList = (message, timestamp) => {
  const li = document.createElement('li');
  const timeStr = new Date(timestamp).toLocaleString();
  li.textContent = `${message} (since: ${timeStr})`;
  messagesList.appendChild(li);
};

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) sendMessage(message);
});

// Start long polling on page load
pollMessages();
