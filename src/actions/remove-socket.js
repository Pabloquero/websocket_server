"use strict";
const SocketModel = require("../models/Sockets");

module.exports = async function RemoveSocket(socket_id) {
    let result;
    let res = await SocketModel.destroy({
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