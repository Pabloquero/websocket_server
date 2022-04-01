"use strict";
const SocketModel = require("../models/Sockets");

module.exports = async function GetUserSocketID(user_id) {
    let result = [];
    let res = await SocketModel.findAll({
      where: {
        user_id: user_id
      }
    })
    if (!res || res.length < 1) {
        result = [];
    } else {
        await Promise.all(
          res.map(async (single) => {
              let obj = single.dataValues
              let thisSocket = {
                user_id: obj.user_id,
                socket_id: obj.socket_id
              }
              result = [...result, thisSocket]
          })
      )
    }
    return result;
}