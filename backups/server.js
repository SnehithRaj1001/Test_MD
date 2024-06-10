const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors'); // Add cors library

const app = http.createServer();
const io = new Server(app, { cors: { origin: '*' } }); // Allow all origins for development

const port = 3000; // You can change the port number if needed

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('colorChange', (color) => {
    console.log('Received color change:', color);
    io.emit('colorChange', color); // Broadcast color change to all clients
  });
});
