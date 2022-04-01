"use strict";
const MessageModel = require("../models/Message");

module.exports = async function GetAllMessages(data) {
    let messages = [];
    let chatID = data.chat_id
    let allMessages = await MessageModel.findAll({
        where: {
            id_chat : chatID
        },
        order: [
            ["date", "ASC"]
        ]
    })
    await Promise.all(
        allMessages.map(async (single) => {
            let obj = single.dataValues
            let body = {
                date: obj.date,
                email_receiver: obj.email_receiver,
                id_receiver: obj.id_receiver,
                id_sender: obj.id_sender,
                message: obj.message
            }
            messages = [...messages, body]
        })
    )

    return messages;
}
