/**
 * Created by Zubair on 5/29/16.
 */
'use strict';
module.exports = function(app,q, lodash) {
    app.services._validator = function(payload,fields){
        var deferred = q.defer();
        var temp=[];
        lodash.forEach(fields, function(field) {
            temp.push(field);
            if(payload[field] == undefined){
                deferred.reject({
                    status:404,
                    message:field + 'is required'
                });
            }
        });
        deferred.resolve(temp);
        return deferred.promise;
    };
};