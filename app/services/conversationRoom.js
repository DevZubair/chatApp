/**
 * Created by Muhammad on 6/22/2016.
 */
'use strict';
module.exports = function(app,q, lodash) {
    var Conversation_Room = app.db.Conversation_Room,
        fs = require('fs'),
        busboy = require('connect-busboy'),
        mkdirp = require('mkdirp');

    app.services._getAdminRoom = function (payload, token) {
        var deferred = q.defer();
        Conversation_Room.findOne({RoomOwner: payload.emailAddress}, function (err, messages) {
            if (err) {
                deferred.reject({
                    status: 404,
                    message: 'Error in getting Public Admin Room',
                    error: err,
                    token: token
                });
            }
            else if (messages != null) {
                if (messages.ChatMessages.length != 0) {

                    for (var j = 0; j < messages.ChatMessages.length; j++) {
                        app.services.decrypt(messages.ChatMessages[j].msg, function (userMessage) {
                            messages.ChatMessages[j].msg = userMessage;
                            if (j == messages.ChatMessages.length - 1) {
                                deferred.resolve({
                                    message: 'Successfully got admin room',
                                    room: messages,
                                    token: token
                                });
                            }
                        })
                    }
                }
                else {
                    deferred.resolve({
                        message: 'Successfully got admin room',
                        room: messages,
                        token: token
                    });
                }
            }
            else {
                deferred.reject({
                    status: 404,
                    message: 'Room not found',
                    error: err,
                    token: token
                });
            }
        });
        return deferred.promise;
    };

    app.services._addMessageToRoom = function (payload,callback) {
        var deferred = q.defer();
        app.services.encrypt(payload.message, function (userMessage) {
            var _encryptMessage = userMessage.content;

            Conversation_Room.findByIdAndUpdate({_id: payload.roomID}, {
                $push: {
                    ChatMessages: {
                        messageID: payload.uniqueID.toString(),
                        msg: _encryptMessage,
                        image: '',
                        sender: payload.userEmail,
                        dateTime: payload.currentDate,
                        seenBy: [],
                        receiveAtServer: true,
                        receiveAtUser: []
                    }
                }},function (err, Room) {
                if (err) {
                    callback('Internal Server Error');
                }
                else if (Room != null) {

                    callback({
                        messageID: payload.uniqueID.toString(),
                        msg: payload.message,
                        image: '',
                        sender: payload.userEmail,
                        dateTime: payload.currentDate
                    });
                }
                else {
                    callback('Room ID not found');
                }
            })
        });
        return deferred.promise;
    };

    app.services._getAllAdminRooms = function () {
        var deferred = q.defer();
        Conversation_Room.find({RoomType: "Admin"},{ RoomName: 1, RoomIcon: 1, RoomStatus: 1, RoomOwner: 1 , profession: 1}, function (err, rooms) {
            if (err) {
                deferred.reject({
                    status: 404,
                    message: 'Error in getting Admin Rooms',
                    error: err
                });
            }
            else if (rooms != null) {

                deferred.resolve({
                    message: 'Successfully got all admin rooms',
                    room: rooms
                });
            }
            else {
                deferred.reject({
                    status: 404,
                    message: 'Room not found',
                    error: err
                });
            }
        });
        return deferred.promise;
    };

    app.services._getChatRooms = function (payload) {
        var deferred = q.defer();

        Conversation_Room.find({
                $and: [
                    {Users:payload.emailAddress},
                    {Users : {$size:2}}
                ]},
            {
                ChatMessages : {$slice: -1 }
            }, function (err, chatRooms) {
                if (err) {
                    deferred.reject({
                        status: 404,
                        message: 'Error in getting Chat Rooms',
                        error: err
                    });
                }
                else if(chatRooms.length!=0){
                    for(var i=0;i<chatRooms.length;i++){
                        if(i==chatRooms.length-1 && chatRooms[i].ChatMessages.length==0){
                            deferred.reject({
                                status: 200,
                                message : chatRooms,
                                msg: 'Message headers retrieved successfully'
                            });
                        }
                        if(chatRooms[i].ChatMessages.length!=0){
                            for(var j=0;j<chatRooms[i].ChatMessages.length;j++){
                                app.services.decrypt(chatRooms[i].ChatMessages[j].msg,function(userMessage) {
                                    chatRooms[i].ChatMessages[j].msg = userMessage;
                                    if(i==chatRooms.length-1 && j==chatRooms[i].ChatMessages.length-1){
                                        deferred.reject({
                                            code: 200,
                                            content : chatRooms,
                                            msg: 'Message headers retrieved successfully'
                                        });
                                    }
                                })
                            }
                        }
                    }
                }
                else {
                    deferred.reject({
                        status: 404,
                        message: 'Room not found',
                        error: err
                    });
                }
            });
        return deferred.promise;
    };

    app.services._getRoomMessages = function (payload) {
        var deferred = q.defer();

        Conversation_Room.find({_id: payload.roomID}
            ,function (err, chatRooms) {
                if (err) {
                    deferred.reject({
                        status: 404,
                        message: 'Error in getting Room Messages',
                        error: err
                    });
                }
                else if (chatRooms != null) {
                    if(chatRooms.ChatMessages.length != 0) {

                        for (var j = 0; j < chatRooms.ChatMessages.length; j++) {
                            app.services.decrypt(chatRooms.ChatMessages[j].msg, function (userMessage) {
                                chatRooms.ChatMessages[j].msg = userMessage;
                                if (j == chatRooms.ChatMessages.length - 1) {
                                    deferred.reject({
                                        status: 200,
                                        message : chatRooms.ChatMessages,
                                        msg: 'Message headers retrieved successfully'
                                    });
                                }
                            })
                        }
                    }
                    else{
                        deferred.reject({
                            status: 200,
                            message : chatRooms.ChatMessages,
                            msg: 'Message headers retrieved successfully'
                        });
                    }
                }
                else {
                    deferred.reject({
                        status: 404,
                        message: 'Room not found',
                        error: err
                    });
                }
            });
        return deferred.promise;
    };

    app.services._updateAdminRoom = function(payload,token){

        var deferred = q.defer();

        Conversation_Room.update({"RoomOwner": payload.emailAddress}, {

            "RoomStatus" : payload.roomStatus,
            "RoomName" : payload.roomName

        }, function () {
            deferred.resolve({
                message: 'Successfully updated admin room',
                token : token
            });
        });
        return deferred.promise ;
    };

    app.services._getAdminRoomByProfession = function (payload) {
        var deferred = q.defer();
        Conversation_Room.find({RoomType: "Admin", profession: payload.profession},{ RoomName: 1, RoomIcon: 1, RoomStatus: 1, RoomOwner: 1 , profession: 1}, function (err, rooms) {
            if (err) {
                deferred.reject({
                    status: 404,
                    message: 'Error in getting Admin Rooms',
                    error: err
                });
            }
            else if (rooms != null) {

                deferred.resolve({
                    message: 'Successfully got all admin rooms by profession',
                    room: rooms
                });
            }
            else {
                deferred.reject({
                    status: 404,
                    message: 'Room not found',
                    error: err
                });
            }
        });
        return deferred.promise;
    };

    app.services._getAdminRoomByStatus = function (payload) {
        var deferred = q.defer();
        Conversation_Room.find({RoomType: "Admin", RoomStatus: payload.roomStatus},{ RoomName: 1, RoomIcon: 1, RoomStatus: 1, RoomOwner: 1 , profession: 1}, function (err, rooms) {
            if (err) {
                deferred.reject({
                    status: 404,
                    message: 'Error in getting Admin Rooms',
                    error: err
                });
            }
            else if (rooms != null) {

                deferred.resolve({
                    message: 'Successfully got all admin rooms by status',
                    room: rooms
                });
            }
            else {
                deferred.reject({
                    status: 404,
                    message: 'Room not found',
                    error: err
                });
            }
        });
        return deferred.promise;
    };

    app.services._uploadRoomImage = function(req, res, payload){

        var deferred = q.defer();
        mkdirp('images/conversationRooms/'+payload.roomID, function (err) {
            if (err) {
                console.error(err);
                deferred.reject({
                    status:404,
                    message: 'Error in Image Uploading API',
                    error: err
                });
            }
            else {
                console.log('New Directory Made!');
                req.pipe(req.busboy);
                req.busboy.on('file', function (fieldname, file, filename) {
                    console.log("Uploading: " + filename);
                    var _fstream = fs.createWriteStream("images/conversationRooms/" + payload.roomID + '/' + filename);
                    file.pipe(_fstream);
                    _fstream.on('close', function () {

                        var uniqueID = mongoose.Types.ObjectId();
                        var _imageURL = 'http://hivewire1.cloudapp.net/getRoomImage/?imageName=' + filename + '&roomID=' + payload.roomID;

                        Conversation_Room.update({_id: payload.roomID},
                            {
                                $push: {
                                    ChatMessages: {
                                        messageID: uniqueID.toString(),
                                        msg: '',
                                        image: _imageURL,
                                        sender: payload.emailAddress,
                                        dateTime: payload.currentDate,
                                        seenBy: [],
                                        receiveAtServer: true,
                                        receiveAtUser: []
                                    }
                                }
                            }, function (error, response) {

                                if (err) {
                                    console.log('Room not found');
                                    deferred.resolve({
                                        status: 400,
                                        error: error,
                                        message: 'Error! Image is not uploaded'
                                    });
                                }
                                else {
                                    console.log('Picture Response is sent to frontend');
                                    deferred.resolve({
                                        status: 200,
                                        content: 'OK',
                                        message: 'Image is uploaded',
                                        imageURL: _imageURL,
                                        conversationID: payload.roomID,
                                        sender: payload.emailAddress,
                                        messageID: uniqueID.toString()
                                    });
                                }
                            });
                    })
                })
            }
        });
        return deferred.promise ;
    };
};