const Sequelize = require("sequelize");
const db = require("../config/database");

const UserModel = db.define("ev_usuarios", {
  email: {
    type: Sequelize.STRING
  },
  nombre: {
    type: Sequelize.STRING
  },
  apellido_paterno: {
    type: Sequelize.STRING
  },
  apellido_materno: {
    type: Sequelize.STRING
  },
  img_perfil: {
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

module.exports = UserModel;