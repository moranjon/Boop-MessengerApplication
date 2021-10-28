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
const groupList = []; /* GROUP CHAT FUNCTIONALITY HERE : groupList tracks all group name like userList */  
var io = require('socket.io');
var socketio = io.listen(server);
console.log("Socket.IO is listening at port: " + port);

function validateUsername(username){
    return (username && username.length > 4);
}
function validatePassword(password){
    //a validation requiring the password must be 6 chars or longer
    //must contain at least one digit, one lower case, and one UPPERCASE
    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password); 
}

socketio.on("connection", function (socketclient) {
    console.log("A new Socket.IO client is connected. ID= " + socketclient.id);

    // lab 3 merge
    socketclient.on("register", async (username,password)=> {
        if(validateUsername(username) && validatePassword){
            const registation_result = await
            DataLayer.addUser(username,password);
            socketclient.emit("registration",registation_result)}
        else(socketclient.emit("invalid registration"))
    })

    // lab 3 merge
    /* GROUP CHAT FUNCTIONALITY HERE : socketclient.groups[], socketclient.currentGroup*/  
    socketclient.on("login", async (username,password) => {
        console.log("Debug>Got username="+username + ";password="+password);
        if(validatePassword(password)&&validateUsername(username)){

        
            var checklogin = await DataLayer.checklogin(username,password)
            if (checklogin && userList.includes(username))
            {
                console.log("Duplicate User attempted login");
                socketclient.emit("duplicateLogin");
            }
            else if(checklogin){
                socketclient.authenticated=true;
                socketclient.emit("authenticated");
                socketclient.username=username;
                socketclient.recipient=""; // lab 3 merge - added for private messaging
                socketclient.groups=[] //an array of groups that each socket is in / has
                socketclient.currentGroup = null; //when a user enters a group chat, its name will be stored here
            
                // Show that a user is logged in (place this near "logout" button on index.html)
                var loggedinmessage = "You are logged in.";    // as " + username; //this takes most recent logged in user and puts it on all pages
                socketio.sockets.emit("loggedin", loggedinmessage);

                userList.push(username);
                console.log(userList);
                socketio.sockets.emit("Display userList", userList); 

                var welcomemessage = username + " has joined the chat system!";
                console.log(welcomemessage);
                SendToAuthenticatedClient(socketclient,"Welcome", welcomemessage);
            }
            else{
                console.log("Invalid Login Emitted");
                socketclient.emit("invalidLogin");
            }}
        else{
            console.log("Invalid login");
            socketclient.emit("invalid login");
        }
        
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
        var disconnectmessage = socketclient.username + " has disconnected from the chat system.";
        // make sure it only shows up if a user is actually logged into chat
        if(socketclient.username!=undefined){
        socketio.sockets.emit("disconnect", disconnectmessage);
        //when a user disconnects, remove them from userList
        const disconnectingUser = socketclient.username;        
        for(var i = 0; i < userList.length; i++ ){
            if(disconnectingUser == userList[i]){
                userList.splice(i, 1);       
                console.log(userList);
                socketio.sockets.emit("Display userList", userList); 
            }
        }
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
        //console.log("[<TYPING>," + msg + "] is sent to all connected clients");
    });

    /* BEGIN GROUP CHAT FUNCTIONALITY */    
    socketclient.on("createGroup", (groupName) => {
        createGroupChat(groupName, socketclient);
        //creator client now has their name in the group.members[], 
        //and the new group is in their groups[]
    });

    socketclient.on("addMember", (groupName, memberName) => {
        if (!userList.includes(memberName)){ //if member does not exist
            let errorMessage = "Error: Member not found."; 
            socketclient.emit("gcDebug", errorMessage);
            console.log("GC - addMember - ERROR: Member does not exist.");
        }
        else{
            var groupWasFound = false;
            for (var x in socketclient.groups){
                if (socketclient.groups[x].name == groupName){
                    //this is the desired group object
                    groupWasFound = true;
                    addToGroupChat(socketclient.groups[x], memberName, socketclient);
                    break;
                }
            }
            if (!groupWasFound){ //if group does not exist
                let errorMessage = "Error: Group not found.";
                socketclient.emit("gcDebug", errorMessage);
                console.log("GC - addMember - ERROR: Group does not exist.");
            }
        }
    });

    socketclient.on("getGroupChats", function(){
        var chatList = "";
        for (var g in socketclient.groups){
            chatList += socketclient.groups[g].name + ", ";
        }
        //return updated list of a user's groups
        socketclient.emit("displayGroupChats", chatList);
    }); 

    socketclient.on("isUserInGroup", (gChatName) => {
        var tf = false;
        if (!groupList.includes(gChatName)){ //if group does not exist
            let errorMessage = "Error: Group does not exist."; 
            socketclient.emit("gcDebug", errorMessage);
            console.log("GC - isUserInGroup(joinGroup) - ERROR: Group does not exist.");
        }
        else{ //if group does exist -> check if user is in the group
            for (var g in socketclient.groups){
                if (socketclient.groups[g].name == gChatName){ //if user in group
                    tf = true;
                    socketclient.currentGroup = gChatName; //set group to user's current group
                    break;
                }
            }
            if (!tf){ //if group exists but user is not member of the group
                let errorMessage = "Error: You are not a member of this group."; 
                socketclient.emit("gcDebug", errorMessage);
                console.log("GC - isUserInGroup(joinGroup) - ERROR: User is not a member of this group.");
            }
        }
        socketclient.emit("userInGroup", tf);
    });

    socketclient.on("gchat", (message) => {
        if(!socketclient.authenticated) {
            console.log("Unauthenticated client sent a chat. Suppress!");
            return;
        }
        var chatmessage = socketclient.username + " says: " + message;
        console.log("GC - gChat - " + chatmessage);

        for (var groupN in socketclient.groups){ //loop through all the client's groups
            if (socketclient.groups[groupN].name == socketclient.currentGroup){ //if group == user's currentGroup
                for (var mem in socketclient.groups[groupN].members){ //loop through all the members in the current group
                    if (userList.includes(socketclient.groups[groupN].members[mem])){ //wont msg those in group that disconnected
                        memberUsername = socketclient.groups[groupN].members[mem]; //current member's username 
                        memSocket = getMemberSocket(memberUsername); //current member's socket
                        memSocket.emit("gchat", chatmessage); //emit chat to current member's socket
                    }
                    else{
                        let oldMember = socketclient.groups[groupN].members[mem];
                        console.log("GC - gChat - ERROR: Member disconnected, did not send message to member: " + oldMember);
                    }
                }
            }
        }
    });
    /* END GROUP CHAT FUNCTIONALITY */
});


var messengerdb=require("./messengerdb") // lab 3 merge
var DataLayer = {
    info: 'Data Layer Implementation for Messenger',

    async addUser(username,password){ // lab 3 merge
        const result = await
        messengerdb.addUser(username,password);
        return result;
    },

    async checklogin(username,password){ // lab 3 merge
        var checklogin_result = await messengerdb.checklogin(username,password)
        console.log("Debug>DataLayer.checklogin->result=" + checklogin_result)
        return checklogin_result
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


    /* BEGIN GROUP CHAT FUNCTIONALITY */

    /* Every socket has a groups[] variable - a list of groups a user belongs to */
        /* The server has a currentGroup variable - indicates which group the user is in right now, so gchat knowns who to send msgs to */
        /* The server has a groupList[] variable - a list of group names that exist on the server */
    /* When a user creates a group chat, the group's name is added to the groupList[] variable (similar to userList[]), */
        /* and the CREATOR's name is added to the group's members, and finally the group is added to the CREATOR's groups[] variable */
    /* When a user adds a newNember to a group, */ 
        /* the newMember's name is added to the group's members[] variable, */
        /* the *group is then added/updated to each group member's groups[] variable*/
    /* *Note: Lots of edge case scenarios, such as if group name exists, if group already exists in member's list, or if member doesnt exist, etc. */


//Creates group chat object, appends creator to the group's member list, appends the group to the creator's group list.
function createGroupChat(name, socketclient) {
    if (groupList.includes(name)){ //if group chat name already exists
        let errorMessage = "Error: Group name already exists."; 
        socketclient.emit("gcDebug", errorMessage);
        console.log("GC - createChat - ERROR: Group Name already exists ");
    }
    else{
        groupList.push(name);
        let groupObj = {};
        groupObj.name = name;
        groupObj.members = [];
        addToGroupChat(groupObj, socketclient.username, socketclient); //add creator to group

        let debugMessage = "Created group: " + name;
        socketclient.emit("gcDebug", debugMessage);
        console.log("GC - createGroupChat - Successfully created group: " + name);
    }
}

//Appends a member's Username to a group's members[]
function addToGroupChat(newGroup, memberUsername, socketclient){
    if (!newGroup.members.includes(memberUsername)){ //if the member is not already in the group
        newGroup.members.push(memberUsername); //add member to group
        let memberClient = getMemberSocket(memberUsername); //get member's socket
        addGroupToGroups(newGroup, memberClient); //adds newGroup to member's group list
        
        //update the member's group list and display on page
        var chatList = "";
        for (var g in memberClient.groups){
            chatList += memberClient.groups[g].name + ", ";
        }
        memberClient.emit("displayGroupChats", chatList);
        
        if (socketclient.username != memberUsername){
            let debugMessage = "Added user: " + memberUsername + " to group: " + newGroup.name;
            socketclient.emit("gcDebug", debugMessage);
        }
        console.log("GC - addtoGroupChat - Successfully Added user: " + memberUsername + " to group: " + newGroup.name);
    }
    else{ //if member is already in a group
        let errorMessage = "Error: Member already in group."; 
        socketclient.emit("gcDebug", errorMessage);
        console.log("GC - addtoGroupChat - ERROR: Member already in group");
        
    }
}

//Appends a group to a socket's groups[] list
function addGroupToGroups(newGroup, memberSocket){
    if (hasGroup(newGroup, memberSocket)){ //if membersocket already has this group in their group list
        //overwrite group
        overwriteGroup(newGroup, memberSocket);
        
    }
    else{ //if membersocket does not have this group in their group list
        //add newGroup to members groups list
        memberSocket.groups.push(newGroup);    
    }    
}

//Returns T/F, if socket's group list already* contains the newGroup
function hasGroup(newGroup, memberSocket){ //given membersocket, loops through members groups
    var groupFound = false;
    for (var groupChat in memberSocket.groups){
        if (memberSocket.groups[groupChat].name == newGroup.name){
            // this means the newGroup was found in the member's group list:
            groupFound = true;
            break;
        }
    }
    return groupFound;    
}

//Overwrites a member's existing group, with the updated/new group
function overwriteGroup(newGroup, memberSocket){ //given membersocket, loops through members groups
    for (var groupChat in memberSocket.groups){
        if (memberSocket.groups[groupChat].name == newGroup.name){
            // this means the newGroup was found in the member's group list:
            memberSocket.groups[groupChat] = newGroup; //replace old group with same name, with new updated group.
            break;
        }
    }
}

//Returns a user's socket, given a user's username
function getMemberSocket(memberUsername){
    var sockets = socketio.sockets.sockets;
    var memberSocket = null;
    for(var socketId in sockets){
        var tempSocket = sockets[socketId];
        if(tempSocket.username == memberUsername){
            //This means member's socket was found
            memberSocket = tempSocket;
            break;
        }
    }
    return memberSocket;
}

    /* END GROUP CHAT FUNCTIONALITY */