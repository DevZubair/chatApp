'use strict';
module.exports = function(app, db) {
    var Schema = db.Schema;

    var Device = new Schema({
        emailAddress: {type: String},
        username: {type: String},
        device: [{
            deviceID: {type: String},
            deviceType: {type: String}
        }]
    });

    var _Device = db.model('Device', Device);
    app.db.Device = _Device;

};