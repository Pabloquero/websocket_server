"use strict";
const MessageModel = require("../models/Message");
const { Op } = require("sequelize");

module.exports = async function UpdateBeenSeen({user_id, chat_id, socket_id}) {
    let result;
    let res = await MessageModel.update({been_seen: 1}, {
      where: {
        [Op.and]: [{id_chat: chat_id},{id_receiver: user_id}, {been_seen: 0}]
      }
    })
    if (!res) {
        result = false;
    } else {
        result = true;
    }
    return result;
}
