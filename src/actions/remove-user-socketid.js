"use strict";
const UserModel = require("../models/User");

module.exports = async function RemoveUserSocketID(socket_id) {
    let result;
    let res = await UserModel.update({socket_id: null}, {
      where: {
        socket_id: socket_id
      }
    })
    if (!res) {
        result = false;
    } else {
        result = true;
    }
    return result;
}