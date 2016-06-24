/**
 * Created by Zubair on 5/29/16.
 */
'use strict';
module.exports = function(app,q, lodash) {
    var Registration = app.db.Registration,
        Device = app.db.Device;

    app.services._registerUser = function(registerPayload,profilePayload){
        var deferred = q.defer();
        app.services.encrypt(registerPayload.username,function(user){
            registerPayload.username  = user.content;
            app.services.encrypt(registerPayload.pinCode,function(pin){
                registerPayload.pinCode  = pin.content;
                registerPayload.role = 'NonAdmin';
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
                                    sessionToken : '',
                                    role : 'NonAdmin',
                                    profession : profilePayload.profession,
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
                                        deferred.resolve({
                                            code: 200,
                                            message: 'Non-Admin User Registered'
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

    app.services._getAllUsers = function(token){
        var deferred = q.defer();
        Registration
            .find({role : "User"})
            //.select(filers)
            .exec(function(error, Users) {
                if (error) {
                    deferred.reject({
                        status:404,
                        message: 'Error in API',
                        error: error,
                        token : token
                    });
                } else {
                    deferred.resolve({
                        message: 'Successfully get users (Non-Admin)',
                        data: Users,
                        token : token
                    });
                }
            });
        return deferred.promise;
    };

};