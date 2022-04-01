"use strict";
const MessageModel = require("../models/Message");
const { Op } = require("sequelize");

module.exports = async function GetMessagesAmount(user_id) {
    let result;
    let res = await MessageModel.count({
      where: {
          [Op.and]: [{id_receiver: user_id},{been_seen: 0}]
      },
      distinct: true,
      col: 'id_chat'
    })
    if (!res) {
        result = 0;
    } else {
        result = res
    }
    return result;
}