
var express = require('express')
var http = require('http')
    app = express()
    server = http.createServer(app)
    io = require('socket.io').listen(server) 
    users = [];     
    app.use('/',express.static(__dirname + '/www'))
    server.listen(1888)

io.on('connection',function(socket){
    socket.on('login',function(username){
      if(users.indexOf(username) !== -1){
          socket.emit('usernameExited')
      }else{
        socket.username = username;
        socket.userIndex = users.length;
        users.push(username)
        io.sockets.emit('userSuccess',username,users.length,'login')
      }
    })
    socket.on('disconnect', function() {
        //将断开连接的用户从users中删除
        users.splice(socket.userIndex, 1);
        //通知除自己以外的所有人
        socket.broadcast.emit('system', socket.username, users.length,'logout');
    })
    socket.on('postMsg',function(msg){
        console.log(msg)
         socket.broadcast.emit('newMsg', socket.username,msg)
    })
})
