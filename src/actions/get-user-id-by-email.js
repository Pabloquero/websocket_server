"use strict";
const UserModel = require("../models/User");
const ChatModel = require("../models/Chat");

module.exports = async function GetUserIDbyEmail(email, chat_id, user_id) {
    let result = null;
    if (email) {
      let res = await UserModel.findOne({
        where: {
          email: email
        }
      })
      if (res) {
          result = res.dataValues
      } else {
          result = false
      }
    } else if (chat_id) {
      let chat = await ChatModel.findOne({
        where: {
          id : chat_id
        }
      })
      let data = chat.dataValues
      
      if (data.user_one_id === user_id) {
        result = {id: data.user_two_id}
      } else if (data.user_two_id === user_id) {
        result = {id: data.user_one_id}
      }
    }
    
    return result;
}