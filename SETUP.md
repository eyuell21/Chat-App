# Setup Guide

This guide will help you get the Chat App project up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **git** (optional but recommended)
- A modern **web browser** (Chrome, Firefox, Safari, Edge)

### Verify Installation

```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show 6.0.0 or higher
```

## Project Overview

This project contains two implementations of a real-time chat application:

1. **Long-Polling** - Traditional HTTP-based polling
2. **WebSockets** - Persistent WebSocket connections

## Installation Steps

### Step 1: Clone or Download the Project

**Using Git:**
```bash
git clone <repository-url>
cd Chat-App
```

**Manual Download:**
- Download the ZIP file
- Extract it to your desired location
- Open terminal/command prompt in the extracted folder

### Step 2: Install Root Dependencies

```bash
npm install
```

This installs dependencies listed in the root `package.json`.

## Running the Applications

### Option A: Long-Polling Implementation

**Terminal 1 - Start Backend Server:**
```bash
cd Long-Polling/backend
npm install              # Only needed first time
node server.js
```

Expected output:
```
Server running at http://localhost:3000
```

**Terminal 2 - Open Frontend in Browser:**

Method 1: Direct file access
```
file:///absolute/path/to/Chat-App/Long-Polling/frontend/index.html
```

Method 2: Using Python's built-in server
```bash
cd Long-Polling/frontend
python3 -m http.server 8000
# Then open: http://localhost:8000
```

### Option B: WebSockets Implementation

**Terminal 1 - Start Backend Server:**
```bash
cd WebSockets/backend
npm install              # Only needed first time
node sever.js
```

Expected output:
```
Server running at http://localhost:3000
```

**Terminal 2 - Open Frontend in Browser:**

Method 1: Direct file access
```
file:///absolute/path/to/Chat-App/WebSockets/frontend/index.html
```

Method 2: Using Python's built-in server
```bash
cd WebSockets/frontend
python3 -m http.server 8000
# Then open: http://localhost:8000
```

## Testing Both Implementations

To test both implementations side-by-side:

1. **Start Long-Polling server** on port 3000
2. **Open Long-Polling frontend** in Browser Tab 1
3. Open a **new terminal window**
4. **Stop** the Long-Polling server (Ctrl+C)
5. **Start WebSockets server** on port 3000
6. **Open WebSockets frontend** in Browser Tab 2
7. Send messages in both tabs to see the difference

## File Structure

```
.
├── package.json                              # Root project config
├── README                                    # Main documentation
├── SETUP.md                                  # This file
├── CONTRIBUTING.md                           # Contribution guidelines
├── ARCHITECTURE.md                           # Architecture overview
│
├── Long-Polling/                             # Long-polling implementation
│   ├── README.md                             # Implementation-specific docs
│   ├── backend/
│   │   └── server.js                         # Express server with polling
│   └── frontend/
│       ├── index.html                        # Chat interface
│       └── script.js                         # Polling logic
│
└── WebSockets/                               # WebSocket implementation
    ├── README.md                             # Implementation-specific docs
    ├── package.json                          # Dependencies
    ├── backend/
    │   ├── package.json                      # Backend config
    │   └── sever.js                          # Express + WebSocket server
    └── frontend/
        ├── index.html                        # Chat interface
        └── script.js                         # WebSocket logic
```

## Troubleshooting

### Issue: "Port 3000 already in use"

**Solution:** Kill the process using port 3000

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Alternative:** Change the port in the server file

### Issue: "Cannot find module 'express'"

**Solution:** Install dependencies

```bash
cd <backend-folder>
npm install
npm list                # Verify packages are installed
```

### Issue: CORS errors in console

**Solution:** Ensure the backend server is running on `http://localhost:3000`

Check server output - should show:
```
Server running at http://localhost:3000
```

### Issue: WebSocket connection fails

**Solution:** 
1. Verify backend is running
2. Check that you're using the correct port (3000)
3. Try a different browser in case of browser compatibility issues

### Issue: "Cannot GET /" when accessing frontend locally

**Solution:** Use one of two methods:

1. **Direct file access** - Open index.html directly in browser
2. **Local server** - Use Python's built-in HTTP server:
   ```bash
   cd frontend
   python3 -m http.server 8000
   ```

## Development Tips

### Enable Debug Logging

**Backend - Add to server.js:**
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

**Frontend - Add to script.js:**
```javascript
// Add console.logs in key functions
console.log('Sending message:', message);
console.log('Received message:', data);
```

### Use IDE Extensions

- **VS Code REST Client** - Test API endpoints directly
- **Thunder Client** - Alternative REST client
- **Postman** - Full-featured API testing

### Example: Test Endpoints with curl

```bash
# Get all messages
curl http://localhost:3000/messages

# Send a message
curl -X POST http://localhost:3000/messages \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello World"}'

# Like a message (WebSockets only)
curl -X POST http://localhost:3000/like \
  -H "Content-Type: application/json" \
  -d '{"timestamp":"2024-01-15T10:30:00.000Z"}'
```

## Next Steps

- Read the [main README](README) for feature overview
- Check [Long-Polling README](Long-Polling/README.md) for polling details
- Check [WebSockets README](WebSockets/README.md) for WebSocket details
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for design details

## Performance Optimization

### For Development
- Keep both implementations running in separate terminals
- Use browser DevTools to monitor Network and Console tabs
- Monitor server logs for request patterns

### For Testing
- Test with multiple browser tabs open
- Test with browser DevTools throttling enabled
- Test with different network speeds

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the server console output for errors
3. Check browser console (F12) for JavaScript errors
4. Verify all files are in the correct location
5. Ensure Node.js and npm are properly installed

## Next: Run the Application

Ready to go? Choose one of the implementations and follow the "Running the Applications" section above!
