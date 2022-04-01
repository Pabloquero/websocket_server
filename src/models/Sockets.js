const Sequelize = require("sequelize");
const db = require("../config/database");

const SocketModel = db.define("ev_sockets", {
  user_id: {
    type: Sequelize.INTEGER
  },
  user_email: {
    type: Sequelize.STRING
  },
  socket_id: {
    type: Sequelize.STRING
  },
},
{
    timestamps: false,
    freezeTableName: true,
});

module.exports = SocketModel;