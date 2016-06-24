/**
 * Created by Zubair.
 */
'use strict';

module.exports = function(app, db) {

    require('./Profile')(app, db);
    require('./Device')(app, db);
    require('./Registration')(app, db);
    require('./conversationRoom')(app, db);

};
