const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Create socket.io instance

const port = 3000; // You can change the port number if needed

// Function to get the server's IP address (not secure for production)
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
console.log(`Server IP Address: ${serverIp}`); // Print the IP address to the console

app.use(express.static(__dirname)); // Serve static files from the current directory

app.get('*', (req, res) => {
  res.sendFile('client.html', { root: __dirname }); // Send client.html for all unmatched routes
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('colorChange', (color) => {
    console.log('Received color change:', color);
    io.emit('colorChange', color); // Broadcast color change to all clients
  });
});

server.listen(port, () => {
  console.log(`Server listening on http://${serverIp}:${port}`); // Use captured IP in the log
});
