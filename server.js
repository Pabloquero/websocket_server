var socket = require("socket.io"),
    express = require("express"),
    http = require("http");

    //Actions
const SaveNewMessage = require("./src/actions/save-new-message");
const GetUserSocketID = require("./src/actions/get-user-socketid");
const GetUserIDbyEmail = require("./src/actions/get-user-id-by-email")
const GetMessagesAmount = require("./src/actions/get-messages-amount");
const UpdateUserSocketID = require("./src/actions/update-user-socketid");
const GetAllChats = require("./src/actions/get-all-chats");
const GetSingleChatMini = require("./src/actions/get-single-chat-mini");
const GetAllMessages = require("./src/actions/get-all-messages");
const GetUserData = require("./src/actions/get-user-data");
const UpdateBeenSeen = require("./src/actions/update-been-seen");
const SaveNewSocket = require("./src/actions/save-new-socket");
const RemoveSocket = require("./src/actions/remove-socket");

var app = express();
var http_server = http.createServer(app).listen(process.env.PORT);

function chatServer(http_server) {
    var io = socket(http_server, {
        cors: {
            origin: "*",
        }
    });

    io.sockets.on('connection', function (socket) {
        socket.on('save-new-socket', async function({user_id, user_email, socket_id}) {
            await SaveNewSocket({user_id, user_email, socket_id})
            await globalNotifications(user_id, socket_id, io)
        })
        socket.on('send-message', async function(message){
            let receiverID = await GetUserIDbyEmail(message.email_receiver, message.chat_id, message.id_sender)
            message.id_receiver = receiverID && receiverID.id ? receiverID.id : null;
            let addedMessage = await SaveNewMessage({
                args: message
            })
            let involved = [];
            await GetUserSocketID(message.id_sender).then((res)=>{
                if (res && res.length > 0) {
                    res.map((s)=>{
                        involved = [...involved, s]
                    })
                }
            });
            if (message.id_receiver) {
                await GetUserSocketID(message.id_receiver).then((res)=>{
                    if (res && res.length > 0) {
                        res.map((s)=>{
                            involved = [...involved, s]
                        })
                    }
                });
            }
            if (involved.length > 0) {
                involved.map((user) => {
                    if (user) {
                        io.to(user.socket_id).emit("sent-message", addedMessage)
                        globalNotifications(user.user_id, user.socket_id, io)
                        loadChats(user.user_id, user.socket_id, io)
                    }
                })
            }
        })
        socket.on('disconnect', async function(){
            await RemoveSocket(socket.id)
        });
        socket.on('require-chats', async function({user_id, socket_id}){
            await loadChats(user_id, socket_id, io)
        })
        socket.on('load-chat', async function (data) {
            data["messages"] = await GetAllMessages(data)
            io.to(data.socket_id).emit("loaded-chat", data)
        })
        socket.on('update-socket', async function({user_id, socket_id}) {
            UpdateUserSocketID(user_id, socket_id)
        })
        socket.on('new-chat', async function(data) {
            let response = {}
            let receiverID = await GetUserIDbyEmail(data.receiver_email, false, data.sender_id)
            let receiver = receiverID && receiverID.id ? receiverID.id : null;
            response = await GetUserData(receiver, data)
            io.to(data.socket_id).emit("loaded-new-chat", response)
        })
        socket.on("set_seen_notifications", async function(data) {
            await UpdateBeenSeen(data)
            await globalNotifications(data.user_id, data.socket_id, io)
        })
    })
}

let loadChats = async(user_id, socket_id, io) => {
    let userChats = await GetAllChats(user_id)
    let singleList = [];
    if (userChats.length > 0) {
        singleList = await GetSingleChatMini(userChats, user_id)
        io.to(socket_id).emit("sent-chats", singleList)
    }
}

let globalNotifications = async(user_id, socket_id, io) => {
    let amount = await GetMessagesAmount(user_id)
    io.to(socket_id).emit("sent-chat-amount", amount)
}

chatServer(http_server);

