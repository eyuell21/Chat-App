const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const messagesList = document.querySelector('#messages');

// Fetch all messages from the server
const loadMessages = async () => {
  try {
    const url = 'https://eyuell21-quote-server440.hosting.codeyourfuture.io/messages'
    const res = await fetch(url);
    const messages = await res.json();
    messagesList.innerHTML = '';
    messages.forEach(addMessageToList);
  } catch (err) {
    console.error('Failed to load messages:', err);
  }
};

// Send a message to the server
const sendMessage = async (message) => {
  try {
    const url = 'https://eyuell21-quote-server440.hosting.codeyourfuture.io/messages'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (res.ok) {
      addMessageToList(message);
      input.value = '';
    } else {
      console.error('Message failed to send');
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
};

// Add a message to the list
const addMessageToList = (message) => {
  const li = document.createElement('li');
  li.textContent = message;
  messagesList.appendChild(li);
};

// Form submit handler
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) sendMessage(message);
});

// Load messages on page load
loadMessages();
