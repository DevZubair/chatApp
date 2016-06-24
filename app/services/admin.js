/**
 * Created by Zubair on 5/29/16.
 */
'use strict';
module.exports = function(app,q, lodash) {
    var mongoose = require('mongoose');
    var Admin = app.db.Admin,
        Profile = app.db.Profile,
        Conversation_Room = app.db.Conversation_Room,
        Registration = app.db.Registration;

    app.services._registerAdmin = function(registerPayload,profilePayload){

        var deferred = q.defer();
        app.services.encrypt(registerPayload.username,function(user){
            registerPayload.username  = user.content;
            app.services.encrypt(registerPayload.pinCode,function(pin){
                registerPayload.pinCode  = pin.content;
                registerPayload.role = 'Admin';
                registerPayload.created_at = new Date().valueOf();
                registerPayload.last_login = new Date().valueOf();
                registerPayload.block  = false;

                var register_info= new Registration(registerPayload);
                register_info.save(function(error,data){
                    if(error){
                        deferred.reject({
                            code : 400,
                            content : 'Bad Request',
                            message : error
                        });
                    }
                    else
                    {
                        var device_info=new Device({
                            username : registerPayload.username,
                            emailAddress : registerPayload.emailAddress,
                            device : []
                        });
                        device_info.save(function(error,data) {
                            if (error) {
                                deferred.reject({
                                    code: 400,
                                    content: 'Bad Request',
                                    message: 'Email match found'
                                });
                            }
                            else {
                                var profile_info=new Profile({
                                    username : registerPayload.username,
                                    emailAddress : profilePayload.emailAddress,
                                    firstName: profilePayload.firstName,
                                    lastName: profilePayload.lastName,
                                    role : 'Admin',
                                    profession : profilePayload.profession,
                                    sessionToken : '',
                                    phoneNumber : profilePayload.phoneNumber,
                                    profilePic: profilePayload.profilePic,
                                    status : 'Online'
                                });
                                profile_info.save(function(error,data) {
                                    if (error) {
                                        deferred.reject({
                                            code: 400,
                                            content: 'Bad Request',
                                            message: 'Email match found'
                                        });
                                    }
                                    else {
                                        var chatRoom_data=new Conversation_Room({
                                            RoomIcon: '',
                                            RoomName: profilePayload.firstName + '' + profilePayload.lastName + "'s Public Room",
                                            Users: [profilePayload.emailAddress],
                                            ChatMessages: [],
                                            profession : profilePayload.profession,
                                            createDate : new Date().valueOf(),
                                            RoomStatus : 'Online',
                                            RoomOwner : profilePayload.emailAddress,
                                            RoomType : 'Public'
                                        });
                                        chatRoom_data.save(function(error,data) {
                                            if (error) {
                                                deferred.reject({
                                                    code: 400,
                                                    content: 'Bad Request',
                                                    message: 'Email match found'
                                                });
                                            }
                                            else {
                                                deferred.resolve({
                                                    code: 200,
                                                    message: 'Admin Registered'
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });
        return deferred.promise ;
    };

    app.services._getAllAdmin = function(token){
        var deferred = q.defer();
        Registration
            .find({role : "Admin"})
            //.select(filers)
            .exec(function(error, Admins) {
                if (error) {
                    deferred.reject({
                        status:404,
                        message: 'Error in API',
                        error: error,
                        token : token
                    });
                } else {
                    deferred.resolve({
                        message: 'Successfully get Admins',
                        data: Admins,
                        token : token
                    });
                }
            });
        return deferred.promise;
    };

};