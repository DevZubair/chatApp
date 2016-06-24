/**
 * Created by Zubair.
 */
'use strict';
module.exports = function(app, q, lodash) {
  var  Registration = app.db.Registration,
      jwt = require('jsonwebtoken');

  app.services._checkSessionToken = function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token,
        _emailAddress = req.body.emailAddress || req.query.emailAddress || req.headers['x-access-emailaddress'];

    // decode token
    if (token && _emailAddress) {

      Registration.findOne({emailAddress : _emailAddress , sessionToken:token}, function (err,user) {
        if(err){
          res.send({
            code: 404,
            content : 'Not Found',
            msg: 'Missing token or email address'
          });
        }
        else if(user!=null){
          if(user._doc.block == false){
            jwt.verify(token, 'prachiChatApp', function(err, decoded) {
              if (err) {
                return res.send({
                  code: 400 ,
                  content : 'Bad Request',
                  msg: 'Token is Expired'
                });
              } else {
                // issue a new token
                delete user._doc.sessionToken;
                user._doc.__timeStamp = new Date();
                var refreshed_token = jwt.sign(user, 'prachiChatApp', {expiresIn: '1d'});
                req.___new__token = refreshed_token;
                Registration.update({"emailAddress" : _emailAddress}, {

                  "sessionToken": refreshed_token

                }, function () {
                  next();
                });
              }
            });
          }
          else{
            res.send({
              code: 400 ,
              content : 'Bad Request',
              msg: 'Your account is blocked, please contact admin'
            });
          }
        }
        else{
          res.send({
            code: 400 ,
            content : 'Bad Request',
            msg: 'Email and token mismatch'
          });
        }

      });
    }
    else {
      // if there is no token return an error
      res.send({
        code: 404,
        content : 'Not Found',
        msg: 'Missing token or email address'
      });
    }
  };
};