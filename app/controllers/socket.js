/**
 * Created by Zubair.
 */
'use strict';
module.exports = function(app,q) {
  app.controllers._socketEvents = function(io){
    io.on('connection',function(socket){


      app.services._registerSocket(io);

      socket.on('register', function(data){
        console.log( "We have a connection! " + socket.client.id);
        app.services._addToSocket(socket.client.id, data);
      });

      socket.on('disconnect', function(){
        console.log( "User is  disconnected "+ socket.id);
        app.services._disconnect(socket.client.id)
      });

      socket.on('new_message', function(data){

        var payload = {
          currentDate : new Date().valueOf,
          roomID :  data.roomID,
          roomName: data.roomName,
          message : data.message,
          userEmail : data.userEmail,
          roomUsers: data.roomUsers,
          uniqueID : mongoose.Types.ObjectId()
        };

        console.log( data.userEmail + " has sent a message ");
        app.services._addNewMessage(socket.client.id,payload)
      });

      socket.on('image_file', function(data){

        var payload = {
          currentDate : new Date().valueOf,
          roomID :  data.roomID,
          imageURL : data.imageURL,
          roomUsers : data.roomUsers,
          uniqueID : data.uniqueID,
          userEmail : data.userEmail
        };

        console.log( data.userEmail + " has sent a message ");
        app.services._addNewImage(socket.client.id,payload)
      });
    });
  };
};
