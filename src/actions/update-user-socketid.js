"use strict";
const UserModel = require("../models/User");

module.exports = async function UpdateUserSocketID(user_id, socket_id) {
    let result;
    let res = await UserModel.update({socket_id: socket_id}, {
      where: {
        id: user_id
      }
    })
    if (!res) {
        result = false;
    } else {
        result = true;
    }
    return result;
}