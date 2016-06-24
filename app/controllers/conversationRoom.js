/**
 * Created by Muhammad on 6/22/2016.
 */
'use strict';
module.exports = function(app,q, lodash) {

    app.controllers._getAdminRoom = function (req, res) {
        var payload = {
            emailAddress : req.params.emailAddress
        };

        app.services._validator(payload, app.constants.getAdminRoom)
            .then(function(){
                return app.services._getAdminRoom(payload,req.___new__token);
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

    app.controllers._getAllAdminRooms = function (req, res) {

        return app.services._getAllAdminRooms()

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

    app.controllers._getChatRooms = function (req, res) {

        var payload = {
            emailAddress : req.params.emailAddress
        };
        return app.services._getChatRooms(payload)

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

    app.controllers._getRoomMessages = function (req, res) {

        var payload = {
            emailAddress : req.body.emailAddress,
            roomID : req.body.roomID
        };
        return app.services._getRoomMessages(payload)

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

    app.controllers._updateAdminRoom = function (req, res) {
        var payload = {
            emailAddress : req.body.emailAddress,
            roomStatus :  req.body.roomStatus,
            roomName :  req.body.roomName
        };

        app.services._validator(payload, app.constants.updateAdminRoom)
            .then(function(){
                return app.services._updateAdminRoom(payload,req.___new__token);
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

    app.controllers._getAdminRoomByProfession = function (req, res) {

        var payload = {
            profession : req.params.profession
        };

        return app.services._getAdminRoomByProfession(payload)

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

    app.controllers._getAdminRoomByStatus = function (req, res) {

        var payload = {
            roomStatus : req.params.roomStatus
        };

        return app.services._getAdminRoomByStatus(payload)

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

    app.controllers._uploadRoomImage = function (req, res) {

        var payload = {
            roomID : req.params.roomID || req.body.roomID,
            emailAddress : req.params.emailAddress || req.body.emailAddress,
            currentDate : new Date().valueOf()
        };

        return app.services._uploadRoomImage(req,res,payload)

            .then(function(response){
                res.send({
                    message : response
                })
            })
            .catch(function(error){
                res.send({
                    message : error
                })
            });
    };
};