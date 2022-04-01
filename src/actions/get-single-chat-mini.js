"use strict";
const { Op } = require("sequelize");
const UserModel = require("../models/User");
const ChatModel = require("../models/Chat");
const MessageModel = require("../models/Message");

module.exports = async function GetSingleChatMini(chatsArray, user_id) {
    let result = [];
    await Promise.all(
        chatsArray.map(async (single) => {
            let miniature = {}
            let lastMessage = await MessageModel.findOne({
                where: {
                    id_chat : single.chat_id
                },
                order: [
                    ["date", "DESC"]
                ]
                })
            let countUnreads = await MessageModel.count({
                where: {
                    [Op.and]: [{id_chat: single.chat_id}, {[Op.not]: {id_sender: user_id}}, {been_seen: 0}]
                }
            })

            let chat = await ChatModel.findOne({
                where: {
                    id: single.chat_id
                }
            })

            if (chat.dataValues) {
                let thisChat = chat.dataValues
                let receiverID = thisChat.user_one_id === user_id ? thisChat.user_two_id : thisChat.user_two_id === user_id ?  thisChat.user_one_id : null;
                if (receiverID) {
                    let userData = await UserModel.findOne({
                        where: {
                            id: receiverID
                        }
                    })
                    let data = userData.dataValues
                    miniature = {
                        chat_id: single.chat_id,
                        receiver_id: data.id,
                        receiver_email: data.email,
                        receiver_name: capitalizeWords(capitalizeFirstLetter(data.nombre) + " " + capitalizeFirstLetter(data.apellido_paterno)),
                        last_message: truncate(lastMessage.message, 30),
                        last_time: lastMessage.date,
                        unread_amount: countUnreads,
                        receiver_image: data.img_perfil ? data.img_perfil : "default-profile.png"
                    }
                } else {
                    miniature = {
                        chat_id: single.chat_id,
                        receiver_id: single.receiver_id,
                        receiver_email: single.receiver_email,
                        receiver_name: single.receiver_name,
                        last_message: truncate(lastMessage.message, 30),
                        last_time: lastMessage.date,
                        unread_amount: countUnreads,
                        receiver_image: "default-profile.png"
                    }
                }
            } 
            result = [...result, miniature]
        })
    )

    result.sort(function(b, a) {
        return a.last_time - b.last_time;
    });

    return result;
}

function truncate(source, size) {
    return source.length > size ? source.slice(0, size - 1) + "…" : source;
  }

  function capitalizeFirstLetter(string) {
	return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function capitalizeWords(string) {
	return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};