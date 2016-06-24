/**
 * Created by Zubair.
 */
'use strict';
module.exports = function(app,q, lodash) {
  var lodash  = require('lodash');
  var io;

  app.services._registerSocket = function(sio){
    io= sio;
  };

  app.services._addToSocket = function(socketID, data){

    io.sockets.connected[socketID].emit('connectedToSocket', {user : data});
  };

  app.services._disconnect = function(socketID){

    io.sockets.connected[socketID].emit('disconnectedFromSocket', {socketID : socketID});

  };

  app.services._addNewMessage = function(socketID, data){

    app.services._addMessageToRoom(data,function(message){

      var  clients = io.sockets.sockets;
      for(var k in clients) {
        //socket emit method
        if (data.roomUsers.indexOf(clients[k].emailAddress) >= 0) {
          // we tell the client to execute 'new message'
          io.sockets.connected[clients[k].id].emit('new_message', {
            userEmail: data.userEmail,
            message: message,
            messageID: data.uniqueID.toString(),
            roomID: data.roomID,
            dateTime: data.currentDate,
            roomName: data.roomName,
            roomUsers: data.roomUsers});
        }
      }
    })
  };

  app.services._addNewImage = function(socketID, data){

    var  clients = io.sockets.sockets;
    for(var k in clients) {
      //socket emit method
      if (data.roomUsers.indexOf(clients[k].emailAddress) >= 0) {

        io.sockets.connected[clients[k].id].emit('image_file', {
          currentDate : data.currentDate,
          roomID :  data.roomID,
          imageURL : data.imageURL,
          roomUsers : data.roomUsers,
          uniqueID : data.uniqueID,
          userEmail : data.userEmail
        });
      }
    }
  };
};