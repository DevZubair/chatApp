'use strict';
module.exports = function(app, db) {
    var Schema = db.Schema;
    var uniqueValidator = require('mongoose-unique-validator');

    var RegistrationSchema = new Schema({

        emailAddress: {type: String, required: true, unique: true},
        block: {type: Boolean},
        username: {type: String, required: true, unique: true},
        pinCode: {type: String},
        sessionToken: {type: String},
        role: {type: String},
        created_at: {type: Date},
        last_login: {type: Date}
    });

    var _Registration = db.model('Registration', RegistrationSchema);
    RegistrationSchema.plugin(uniqueValidator, {message: 'Error, Email/Username match found'});
    app.db.Registration = _Registration;
};