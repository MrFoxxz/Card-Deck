var express = require("express");

var app = express();
var server = app.listen(3000);

app.use(express.static("public"));

console.log("el servidor esta corriendo");

var socket = require("socket.io");

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    //console.log('new connection:1' + socket.id);

    socket.on('cardsdeck', CardDeck)

    function CardDeck(data) {
        socket.broadcast.emit('cardsdeck', data);
        //io.socket.emit('cardsdeck', data)
        //console.log(data)
    }

}