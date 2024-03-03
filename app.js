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


//websocket stuff
//.on is an event listener
//.emit is sending event
io.on('connection', (socket) => { //listening for all socket connection events
    console.log(socket.id + " is connected.");

    //listen to this specific socket event
    socket.on('disconnect', () => {
        console.log(socket.id + " is disconnected.");
    });

    //custom events
    socket.on('red', (data) => {
        console.log("red event received from" + data);
        io.emit('circleChoice', 'red' + data); //send an event to all clients
    });

    socket.on('blue', (data) => {
        console.log("blue event received from" + data);
        io.emit('circleChoice', 'blue' + data); //send an event to all clients
    });
});

//start our server
server.listen(LISTEN_PORT);
console.log("Server started on port " + LISTEN_PORT);