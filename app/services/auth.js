'use strict';
module.exports = function(app,q, lodash) {
    var Device = app.db.Device,
        Registration = app.db.Registration,
        jwt = require('jsonwebtoken');

    app.services._login = function(payload){
        var deferred = q.defer();
        app.services.encrypt(payload.username,function(user){
            payload.username  = user.content;
            app.services.encrypt(payload.pinCode,function(pin){
                payload.pinCode  = pin.content;
                Registration.find({username: payload.username, pinCode: payload.pinCode}, function (err, user) {
                    if (err){
                        deferred.reject({
                            code: 401,
                            content : 'Internal Server Error',
                            message: 'API not called properly'
                        });
                    }
                    else if (user!='') {
                        if(payload.deviceID && payload.deviceType){
                            /*Delete old Token*/
                            delete user[0]._doc.sessionToken;
                            user[0]._doc.__timeStamp = new Date();
                            // create a token
                            var token = jwt.sign(user, "prachiChatApp", {
                                expiresInMinutes: 1400 // expires in 24 hours
                            });
                            Registration.update({"emailAddress": user[0]._doc.emailAddress}, {

                                "sessionToken": token

                            }, function () {
                                Device.findOneAndUpdate({'username': payload.username},
                                    { $addToSet:
                                    { device:
                                    {
                                        deviceID: payload.deviceID,
                                        deviceType : payload.deviceType
                                    }
                                    }
                                    },{
                                        upsert: true
                                    }, function () {

                                        delete user[0]._doc.pinCode;

                                        deferred.resolve({
                                            code: 200,
                                            content : 'OK',
                                            message: 'Authentication Successful',
                                            user : user,
                                            token : token
                                        });
                                    });
                            });
                        }
                    }
                    else {
                        deferred.reject({
                            code: 404,
                            content : 'Not Found',
                            message: 'Username or PIN not correct'
                        });
                    }
                });
            });
        });
        return deferred.promise ;
    };
};