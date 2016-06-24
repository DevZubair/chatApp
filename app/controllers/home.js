/**
 * Created by Muhammad on 6/22/2016.
 */
'use strict';
module.exports = function(app) {
    app.controllers._welcome = function(req,res){

        res.send('Welcome to Prachi App Server');
    };
};