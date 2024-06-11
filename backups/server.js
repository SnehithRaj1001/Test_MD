const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Create socket.io instance

const port = 3000; // You can change the port number if needed

// Function to get the server's IP address (insecure)
function getServerIp() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const address of interfaces[name]) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
}

const serverIp = getServerIp(); // Get the server's IP address
console.log(`Server listening on http://${serverIp}:${port}`);

app.use(express.static(__dirname)); // Serve static files from the current directory

app.get('*', (req, res) => {
  res.sendFile('client.html', { root: __dirname }); // Send client.html for all unmatched routes
});

io.on('connection', (socket) => {
  console.log('Client connected');
  let currentColor = 'none'; // Set initial color to "none" on connection

  socket.on('colorChange', (color) => {
    console.log('Received color change:', color);
    currentColor = color; // Update currentColor based on received color
    io.emit('colorChange', currentColor); // Broadcast the updated color change to all clients
  });

  // Send the initial color ("none") to the newly connected client
  socket.emit('colorChange', currentColor);
});

server.listen(port, () => {
  console.log(`Server listening on http://${serverIp}:${port}`);
});
