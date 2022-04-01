"use strict";
const db = require("../config/database");
const { QueryTypes } = require("sequelize");

module.exports = async function SaveNewSocket({user_id, user_email, socket_id}) {
    let result;
    let res = await db.query(
      'INSERT INTO `ev_sockets` (`user_id`,`user_email`,`socket_id`) VALUES (:user_id,:user_email,:socket_id)',
        {
          replacements: {user_id: user_id, user_email: user_email, socket_id: socket_id},
          type: QueryTypes.INSERT
        }
      );
    if (!res) {
        result = false;
    } else {
        result = true;
    }
    return result;
}