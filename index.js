var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use('/', bodyParser.urlencoded({
    extended: true
}));

http.listen(3000, function () {
    console.log("server started");
});

app.get('/', function (req, res) {
    res.render('index.ejs')
});

app.post('/chat', function (req, res) {
    var reqb = req.body;
    var props = {name : reqb.name, color : reqb.color};
    res.render('chat.ejs',{user: props});
});

var users = {};
var id = 0;
io.on('connection', function (socket) {
    socket.on('message', function (data) {
        io.emit('message', data);
    });

    socket.on('new user', function (data) {
        users[socket.id]={id:id++, data: data};
        io.emit('new user',users);
    });

    socket.on('disconnect', function () {
        io.emit('disconnect', users[socket.id].id);
        delete users[socket.id];
    })
});