/**
 * Created by Muhammad on 6/22/2016.
 */
'use strict';
module.exports = function(app, db) {
    var Schema = db.Schema;
    var uniqueValidator = require('mongoose-unique-validator');

    var Conversation_Room = new Schema({
        RoomIcon: {type:String},
        RoomName: {type:String},
        RoomStatus: {type:String},
        RoomOwner: {type:String, required: true, unique: true},
        RoomType: {type:String},
        profession: {type:String},
        ChatMessages: {type:Array},
        Users: {type:Array},
        createDate : {type:Date}
    });

    var _ConversationRoom = db.model('Conversation_Room', Conversation_Room);
    Conversation_Room.plugin(uniqueValidator, {message: 'Error, Email match found'});
    app.db.Conversation_Room = _ConversationRoom;

};