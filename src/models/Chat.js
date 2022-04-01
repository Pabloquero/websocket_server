const Sequelize = require("sequelize");
const db = require("../config/database");

const ChatModel = db.define("ev_chat", {
  user_one_id: {
    type: Sequelize.INTEGER
  },
  user_two_id: {
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

module.exports = ChatModel;