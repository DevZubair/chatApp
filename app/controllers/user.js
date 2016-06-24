/**
 * Created by Zubair.
 */
'use strict';
module.exports = function(app,q, lodash) {
    app.controllers._registerUser = function(req,res){
        var registerPayload = {
            emailAddress : req.body.emailAddress,
            pinCode : req.body.pinCode,
            username : req.body.username
        };
        var profilePayload = {
            emailAddress : req.body.emailAddress,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            pinCode : req.body.pinCode,
            phoneNumber : req.body.phoneNumber,
            username : req.body.username,
            profession : req.body.profession,
            profilePic : req.body.profilePic
        };
        app.services._validator(profilePayload, app.constants.studentRegister)
            .then(function(){
                return app.services._registerUser(registerPayload,profilePayload);
            })
            .then(function(response){
                res.send(response)
            })
            .catch(function(error){
                res.send(error)
            });
    };

    app.controllers._getAllUsers = function(req, res){
        app.services._getAllUsers(req.___new__token)
            .then(function(response){
                res.send({
                    message : response,
                    token : req.___new__token
                })
            })
            .catch(function(error){
                res.send({
                    message : error,
                    token : req.___new__token
                })
            });
    };

};