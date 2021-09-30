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
            socketclient.recipient=""; // added for private messaging
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

    socketclient.on("pchat", (message,person) => {
        if(!socketclient.authenticated) {
            console.log("Unauthenticated client sent a chat. Suppress!");
            return;
        }
        var chatmessage = socketclient.username + " says: " + message;
        console.log(chatmessage);
        //socketio.sockets.emit("chat", chatmessage);
        sendPrivateMessage(socketclient,person,"pchat",chatmessage)
    });

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
    
    socketclient.on("friend", (friendName) => {
        if(!socketclient.authenticated) {
            console.log("Unauthenticated client added a friend. Suppress!");
            return;
        }
        var flag = 0;
        for(let i = 0; i < userList.length; i++ ){
            if(friendName == userList[i]){
                var friendMessage = socketclient.username + " added " + friendName + " as a friend";
                console.log(friendMessage);
                flag = 1;
            }
            if(flag == 0){
                var friendMessage = friendName + " does not exist. Please enter a valid username";
                console.log(friendMessage + i);
            }
        }

        //socketio.sockets.emit("friend", friendMessage);
        SendToAuthenticatedClient(undefined,"friend",friendMessage);
    });

    socketclient.on("<TYPE>", function(){
        //not working, non essential, just doesnt say typing is user blank
        //if (isNullOrUndefined(socketclient.username)) {return;}
        var msg = socketclient.username;
        socketio.sockets.emit("<TYPING>", msg);
        //SendToAuthenticatedClient(undefined,"<TYPING>", msg)        
        console.log("[<TYPING>," + msg + "] is sent to all connected clients");
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
//type: emit/on keyword // data = message
function sendPrivateMessage(senderclient,recipientName,type,data){
    var sockets = socketio.sockets.sockets;
    var tf = false;
    for(var socketId in sockets){
        var socketclient = sockets[socketId];
        if(socketclient.username == recipientName){
            tf = true;
            //senderclient.recipient = recipientName;
            senderclient.emit(type,data);
            socketclient.emit(type,data); //socketclient is recipient, emits "chat" request to them containing msg
            var logmsg= " * Private Message sent to " +
                socketclient.username + " with ID=" + socketId;
            console.log(logmsg);
        }
    }
    if (!tf){
        data = "User " + recipientName + " not found."
        senderclient.emit(type,data);
        var logmsg= " **** User: " +
                recipientName + " not found.";
            console.log(logmsg);
    }
}