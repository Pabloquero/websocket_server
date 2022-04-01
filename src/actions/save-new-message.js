"use strict";
const ChatModel = require("../models/Chat");
const MessageModel = require("../models/Message");
const { Op, QueryTypes } = require("sequelize");
const db = require("../config/database");

module.exports = async function SaveNewMessage({
  args: { id_sender, id_receiver, message, been_seen, email_receiver, name_receiver, chat_id },
}) {
    let date = Math.floor(Date.now()/1000);
    let selChat = await ChatModel.findOne({
      where: {
        [Op.or] : [
          {[Op.and] : [{id: chat_id}, {[Op.not] : {id: null}}]},
          {[Op.and] : [{user_one_id: id_sender}, {user_two_id: id_receiver}, {[Op.not] : {user_two_id: null}}]},
          {[Op.and] : [{user_one_id: id_receiver}, {user_two_id: id_sender}]},
          {[Op.and] : [{user_one_id: id_sender}, {email_receiver: email_receiver}, {[Op.not] : {email_receiver: null}}]},
        ]
      }
    })
    if (selChat) {
      let addedMessage = await saveThisMessage(selChat.id, id_sender, id_receiver, message, date, been_seen, email_receiver, name_receiver)
      return addedMessage;
    } else {
      let createChat = await db.query(
        'INSERT INTO `ev_chat` (`user_one_id`,`user_two_id`,`email_receiver`,`name_receiver`) VALUES (:user_one_id,:user_two_id,:email_receiver,:name_receiver)',
        {
          replacements: {user_one_id: id_sender, user_two_id: id_receiver, email_receiver: email_receiver, name_receiver: name_receiver},
          type: QueryTypes.INSERT
        }
      );
      
      if (createChat[1]) {
        let addedMessage = await db.query(
        'INSERT INTO `ev_chat_message` (`id_chat`,`id_sender`,`id_receiver`,`message`,`date`,`been_seen`,`email_receiver`,`name_receiver`) VALUES (:id_chat,:id_sender,:id_receiver,:message,:date,:been_seen,:email_receiver,:name_receiver)',
          {
            replacements: {id_chat: createChat[0], id_sender: id_sender, id_receiver: id_receiver, message: message, date: date, been_seen: been_seen, email_receiver: email_receiver, name_receiver: name_receiver},
            type: QueryTypes.INSERT
          }
        );
        if(addedMessage[1]) {
          let thisMsg = await MessageModel.findOne({
            where: {
              id: addedMessage[0]
            }
          })
          thisMsg["dataValues"]["new_created"] = true;
          return thisMsg;
        }
      }
  }
}

async function saveThisMessage(id_chat, id_sender, id_receiver, message, date, been_seen, email_receiver, name_receiver) {
  MessageModel.removeAttribute('id');
  let createMessage = await MessageModel.create({id_chat, id_sender, id_receiver, message, date, been_seen, email_receiver, name_receiver})
  if (createMessage) {
    return createMessage
  } else {
    return "error"
  }
}