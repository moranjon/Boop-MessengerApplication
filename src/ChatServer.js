var http = require('http')
var app = require('express')()
var server = http.createServer(app)
const port = process.env.PORT || 8080
server.listen(port);
console.log(`Express HTTP Server is listening at port ${port}`)
app.get('/', (request, response) => {
  //console.log("Got an HTTP request")  
  response.sendFile(__dirname+'/index.html')
})
const userList = [];
var io = require('socket.io');
var socketio = io.listen(server);
console.log("Socket.IO is listening at port: " + port);

socketio.on("connection", function (socketclient) {
    console.log("A new Socket.IO client is connected. ID= " + socketclient.id);

    socketclient.on("login", (username,password) => {
        console.log("Debug>Got username="+username + ";password="+password);
        if(DataLayer.checklogin(username,password)){
            socketclient.authenticated=true;
            socketclient.emit("authenticated");
            socketclient.username=username;
            var welcomemessage = username + " has joined the chat system!";
            console.log(welcomemessage);
            userList.push(username);
            console.log(userList);            
            //socketio.sockets.emit("welcome", welcomemessage);
            SendToAuthenticatedClient(socketclient,"welcome", welcomemessage);
        }
        //socketclient.username = username;
        //var welcomemessage = username + " has joined the chat system!";
        //console.log(welcomemessage);
        //socketio.sockets.emit("Welcome", welcomemessage);
    });
    
    socketclient.on("chat", (message) => {
        if(!socketclient.authenticated) {
            console.log("Unauthenticated client sent a chat. Suppress!");
            return;
        }
        var chatmessage = socketclient.username + " says: " + message;
        console.log(chatmessage);
        //socketio.sockets.emit("chat", chatmessage);
        SendToAuthenticatedClient(undefined,"chat",chatmessage);
    });
    
    console.log("Connected clients:");
    var sockets = socketio.sockets.sockets;
    for(var socketId in sockets)
    {
        var socketclient = sockets[socketId];
        console.log(socketclient.id); //socketclient.client.conn.remoteAddress+":"+
    }
    
    // when a user disconnects (closes the tab)
    socketclient.on('disconnect', function(){
        console.log( //socketclient.client.conn.remoteAddress+":"+
        socketclient.username+" with ID:"+socketclient.id + ' has disconnected');
        var disconnectmessage = socketclient.username + " has disconnected from the chat system. :(";
        // make sure it only shows up if a user is actually logged into chat
        if(socketclient.username!=undefined){
        socketio.sockets.emit("disconnect", disconnectmessage);
        }
    });    
});

var DataLayer = {
    info: 'Data Layer Implementation for Messenger',
    checklogin(username,password){
        //for testing only
        console.log("checklogin: " + username + "/" + password);
        console.log("Just for testing - return true");
        return true;
    }
}

function SendToAuthenticatedClient(sendersocket,type,data){
    var sockets = socketio.sockets.sockets;
    for(var socketId in sockets){
        var socketclient = sockets[socketId];
        if(socketclient.authenticated){
            socketclient.emit(type,data);
            var logmsg= "Debug:>sent to " +
                socketclient.username + " with ID=" + socketId;
            console.log(logmsg);
        }
    }
}