"use strict";
const { Op } = require("sequelize");
const ChatModel = require("../models/Chat");

module.exports = async function GetAllChats(user_id, amount) {
    let resultTotalChatsID = [];
    let totalChats = await ChatModel.findAll({
      where: {
        [Op.or] : {user_one_id: user_id, user_two_id: user_id}
      }
    })
    
    if (!totalChats || totalChats.length === 0) {
        resultTotalChatsID = [];
    } else {
        totalChats.map((chat)=>{
            let thisChat = chat.dataValues
            let chatInfo = {
                chat_id: thisChat.id,
                user_id: user_id,
                receiver_id: thisChat.user_one_id !== user_id ? thisChat.user_one_id : thisChat.user_two_id,
                receiver_email: thisChat.email_receiver ? thisChat.email_receiver : null,
                receiver_name: thisChat.name_receiver ? thisChat.name_receiver : null,
                amount: amount
            }
            resultTotalChatsID = [...resultTotalChatsID, chatInfo]
        })
    }
    return resultTotalChatsID;
}