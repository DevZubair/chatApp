'use strict';
module.exports = function(app,q, lodash) {
    var mongoose = require('mongoose');
    var Profile = app.db.Profile,
        fs = require('fs'),
        busboy = require('connect-busboy'),
        mkdirp = require('mkdirp');

    app.services._uploadProfileImage = function(req, res,payload){

        var deferred = q.defer();
        mkdirp('images/profile_pic/'+payload.emailAddress, function (err) {
            if (err) {
                console.error(err);
                deferred.reject({
                    status:404,
                    message: 'Error in Image Uplaoding API',
                    error: err
                });
            }
            else {
                console.log('New Directory Made!');
                req.pipe(req.busboy);
                req.busboy.on('file', function (fieldname, file, filename) {
                    console.log("Uploading: " + filename);
                    var _fstream = fs.createWriteStream("images/profile_pic/" + payload.emailAddress + '/' + filename);
                    file.pipe(_fstream);
                    _fstream.on('close', function () {
                        var _imageURL = 'http://hivewire1.cloudapp.net/getProfileImage/?imageName=' + filename + '&emailAddress=' + payload.emailAddress;
                        deferred.resolve({
                            message: 'Successfully uploaded profile image',
                            imageURL: _imageURL
                        });
                    })
                })
            }
        });
        return deferred.promise ;
    };

    app.services._updateProfileImage = function(req, res,payload){

        var deferred = q.defer();
        mkdirp('images/profile_pic/'+payload.emailAddress, function (err) {
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
                    var _fstream = fs.createWriteStream("images/profile_pic/" + payload.emailAddress + '/' + filename);
                    file.pipe(_fstream);
                    _fstream.on('close', function () {
                        var _imageURL = 'http://hivewire1.cloudapp.net/getProfileImage/?imageName=' + filename + '&emailAddress=' + payload.emailAddress;

                        Profile.update({"emailAddress": payload.emailAddress}, {

                            "profilePic" : _imageURL,
                            "updated_at": new Date()

                        }, function () {
                            deferred.resolve({
                                message: 'Successfully uploaded profile image',
                                imageURL: _imageURL
                            });
                        });
                    })
                })
            }
        });
        return deferred.promise ;
    };

    app.services._getProfileImage = function(req, res,payload){
        var deferred = q.defer();
        var imageRootPath = 'images/profile_pic/'+ payload.emailAddress,
            options = {
                root: ".",
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };

        res.sendFile(imageRootPath +'/' + payload.imageName, options, function (err) {
            if (err) {
                console.log(err);

            }
            else {
                console.log('Sent:', payload.imageName);

            }
        });
        return deferred.promise;
    };

    app.services._updateUserProfile = function(payload,token){

        var deferred = q.defer();

        Profile.update({"emailAddress": payload.emailAddress}, {

            "phoneNumber" : payload.phoneNumber,
            "updated_at": new Date()

        }, function () {
            deferred.resolve({
                message: 'Successfully updated user profile',
                token : token
            });
        });

        return deferred.promise ;
    };

    app.services._getProfileByEmail = function(payload,token){
        var deferred = q.defer();
        Profile.findOne({emailAddress: payload.emailAddress}, function (err, profile) {
            if (err) {
                deferred.reject({
                    status:404,
                    message: 'Error in getting Profile',
                    error: err,
                    token : token
                });
            }
            else if(profile!=null || profile!=''){
                deferred.resolve({
                    message: 'Successfully updated user profile',
                    profile: profile,
                    token : token
                });
            }
        });
        return deferred.promise;
    };

    app.services._updateProfileStatus = function(payload,token){

        var deferred = q.defer();

        Profile.update({"emailAddress": payload.emailAddress}, {

            "status" : payload.status,
            "updated_at": new Date()

        }, function () {
            deferred.resolve({
                message: 'Successfully updated user profile',
                token : token
            });
        });
        return deferred.promise ;
    };
};