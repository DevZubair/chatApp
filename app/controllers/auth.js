'use strict';
module.exports = function(app,q, lodash) {
	app.controllers._login = function(req,res){
		var payload = {
            username : req.body.username,
    		pinCode : req.body.pinCode,
    		deviceID : req.body.deviceID,
    		deviceType : req.body.deviceType
        };
        app.services._validator(payload, app.constants.login)
            .then(function(){
               return app.services._login(payload);
            })
            .then(function(response){
                res.send(response)
            })
            .catch(function(error){
                res.send(error)
            });
	};
};