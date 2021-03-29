const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var request = require('request');
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
var users = [];
io.on('connection', (socket) => {
  io.emit("getuser", "nothing");
  socket.on('newuser', (id) => {
    request.get(
      'http://localhost/chatonly/php/setstatus.php?id=' + id + "&status=online",
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
      }
    );
    var obj = {
      name: id,
      id: socket.id
    }
    var x = true;
    users.map((item, index) => {
      if (item.name == id) {
        x = false;
      }
    });
    if (x) {
      users.push(obj);
    }
    socket.on('disconnect', function () {
      io.emit("getuser", "nothing");
      request.get(
        'http://localhost/chatonly/php/setstatus.php?id=' + id + "&status=offline",
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
          }
        }
      );
    });
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
    io.emit("getuser", "nothing");
  });
});

http.listen(process.env.PORT, () => {
  console.log('listening on *:3000');
});
