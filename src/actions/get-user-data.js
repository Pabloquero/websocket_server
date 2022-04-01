"use strict";
const UserModel = require("../models/User");
const ChatModel = require("../models/Chat");
const { Op } = require("sequelize");

module.exports = async function GetUserData(receiver, sender_data) {
    let result = {};
    if (receiver !== null) {
      let receiver_data = await UserModel.findOne({
        where: {
          id: receiver
        }
      })

      if (receiver_data && receiver_data.dataValues) {
          let rec_id = receiver_data.dataValues.id;
          result = receiver_data.dataValues
          let chat = await ChatModel.findOne({
            where: {
              [Op.or] : [
                {[Op.and] : [{user_one_id: sender_data.sender_id}, {user_two_id: rec_id}, {[Op.not] : {user_two_id: null}}]},
                {[Op.and] : [{user_one_id: rec_id}, {user_two_id: sender_data.sender_id}]},
                {[Op.and] : [{user_one_id: sender_data.sender_id}, {email_receiver: sender_data.receiver_email}, {[Op.not] : {email_receiver: null}}]}
              ]
            }
          })
          if (chat && chat.dataValues.id) {
            result = {
              sender_id: sender_data.sender_id,
              chat_id: chat.dataValues.id,
              receiver_name: sender_data.receiver_name,
              receiver_image: sender_data.receiver_image,
              receiver_email: null
            }
          } else {
            result = {
              sender_id: sender_data.sender_id,
              chat_id: null,
              receiver_name: sender_data.receiver_name,
              receiver_image: sender_data.receiver_image,
              receiver_email: sender_data.receiver_email
            }
          }
      } else {
        result = {
          sender_id: sender_data.sender_id,
          chat_id: null,
          receiver_name: sender_data.receiver_name,
          receiver_image: sender_data.receiver_image,
          receiver_email: sender_data.receiver_email
        }
      }
    } else {
      let chat_dos = await ChatModel.findOne({
        where: {
          [Op.and] : [{user_one_id: sender_data.sender_id}, {email_receiver: sender_data.receiver_email}, {[Op.not] : {email_receiver: null}}]
        }
      })

      if (chat_dos && chat_dos.dataValues.id) {
        result = {
          sender_id: sender_data.sender_id,
          chat_id: chat_dos.dataValues.id,
          receiver_name: sender_data.receiver_name,
          receiver_image: sender_data.receiver_image,
          receiver_email: sender_data.receiver_email
        }
      } else {
        result = {
          sender_id: sender_data.sender_id,
          chat_id: null,
          receiver_name: sender_data.receiver_name,
          receiver_image: sender_data.receiver_image,
          receiver_email: sender_data.receiver_email
        }
      }
    }

    return result;
}