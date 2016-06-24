/**
 * Created by Zubair on 6/22/2016.
 */
'use strict';
module.exports = function(app, db) {
    var Schema = db.Schema;
    var uniqueValidator = require('mongoose-unique-validator');

    var ProfileSchema = new Schema({
        username : {type:String, unique:true},
        firstName: {type:String},
        lastName: {type:String},
        emailAddress: {type:String, required:true, unique:true},
        role : {type:String},
        profession : {type:String},
        phoneNumber : {type: String},
        profilePic: {type:String},
        updated_at: {type: Date},
        status : {type : String}
    });

    var _Profile = db.model('Profile', ProfileSchema);
    ProfileSchema.plugin(uniqueValidator, {message: 'Error, Email/Username match found'});
    app.db.Profile = _Profile;
};