const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const LISTEN_PORT = 8080;

//middleware to serve static files from public folder
app.use(express.static(__dirname + '/public'));

//create our routes
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//create our routes
app.get('/player1', function(req, res) {
    res.sendFile(__dirname + '/public/player1.html');
});

//create our routes
app.get('/player2', function(req, res) {
    res.sendFile(__dirname + '/public/player2.html');
});

//websocket stuff
//.on is an event listener
//.emit is sending event
io.on('connection', (socket) => { //listening for all socket connection events
    console.log(socket.id + " is connected.");

//     var clients_in_the_room = io.sockets.adapter.rooms[roomId];
//     for (var clientId in clients_in_the_room ) {
//     console.log('client: %s', clientId); // Seeing is believing
//    // var client_socket = io.sockets.connected[clientId]; // Do whatever you want with this
//     }

    //listen to this specific socket event
    socket.on('disconnect', () => {
        console.log(socket.id + " is disconnected.");
    });

    // //custom events
    // socket.on('red', (data) => {
    //     console.log("red event received.");
    //     io.emit('color_change', {r:255, g:0, b:0}); //send an event to all clients
    // });

    // socket.on('blue', (data) => {
    //     console.log("blue event received.");
    //     io.emit('color_change', {r:0, g:0, b:255}); //send an event to all clients
    // });
});

//start our server
server.listen(LISTEN_PORT);
console.log("Server started on port " + LISTEN_PORT);