/**
 * Created by Muhammad on 6/22/2016.
 */
'use strict';
module.exports = function(app,q, lodash) {
    app.controllers._uploadProfileImage = function (req, res) {
        var payload = {
            emailAddress : req.body.emailAddress,
            profilePic : req.body.profilePic
        };

        app.services._validator(payload, app.constants.profile)
            .then(function(){
                return app.services._uploadProfileImage(req, res,payload);
            })
            .then(function(response){
                res.send(response)
            })
            .catch(function(error){
                res.send(error)
            });
    };

    app.controllers._updateProfileImage = function (req, res) {
        var payload = {
            emailAddress : req.body.emailAddress,
            profilePic : req.body.profilePic
        };

        app.services._validator(payload, app.constants.profile)
            .then(function(){
                return app.services._updateProfileImage(req, res,payload);
            })
            .then(function(response){
                res.send(response)
            })
            .catch(function(error){
                res.send(error)
            });
    };

    app.controllers._getProfileImage = function (req, res) {
        var payload = {
            imageName : req.body.imageName || req.query.imageName || req.headers['x-access-imageName'] || req.params.imageName,
            emailAddress : req.body.emailAddress || req.query.emailAddress || req.headers['x-access-emailAddress'] || req.params.emailAddress
        };

        app.services._validator(payload, app.constants.getProfileImage)
            .then(function(){
                return app.services._getProfileImage(req, res,payload);
            })
            .then(function(response){
                res.send(response)
            })
            .catch(function(error){
                res.send(error)
            });
    };

    app.controllers._updateUserProfile = function (req, res) {
        var payload = {
            emailAddress : req.body.emailAddress,
            phoneNumber : req.body.phoneNumber
        };

        app.services._validator(payload, app.constants.userProfile)
            .then(function(){
                return app.services._updateUserProfile(payload,req.___new__token);
            })
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

    app.controllers._getProfileByEmail = function (req, res) {
        var payload = {
            emailAddress : req.params.emailAddress
        };

        app.services._validator(payload, app.constants.getProfile)
            .then(function(){
                return app.services._getProfileByEmail(payload,req.___new__token);
            })
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

    app.controllers._updateProfileStatus = function (req, res) {
        var payload = {
            emailAddress : req.body.emailAddress,
            status :  req.body.status
        };

        app.services._validator(payload, app.constants.statusProfile)
            .then(function(){
                return app.services._updateProfileStatus(payload,req.___new__token);
            })
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