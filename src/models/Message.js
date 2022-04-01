const Sequelize = require("sequelize");
const db = require("../config/database");

const MessageModel = db.define("ev_chat_message", {
  id_chat: {
    type: Sequelize.INTEGER
  },
  id_sender: {
    type: Sequelize.INTEGER
  },
  id_receiver: {
    type: Sequelize.INTEGER
  },
  message: {
    type: Sequelize.TEXT
  },
  date: {
    type: Sequelize.INTEGER
  },
  been_seen: {
    type: Sequelize.INTEGER
  },
  email_receiver: {
    type: Sequelize.STRING
  },
  name_receiver: {
    type: Sequelize.STRING
  },
},
{
    timestamps: false,
    freezeTableName: true,
});

module.exports = MessageModel;