/**
 * Created by Zubair.
 */
'use strict';

module.exports = function(app, q) {

    require('./admin')(app);
    require('./login')(app);
    require('./user')(app);
    require('./profile')(app);
    require('./conversationRoom')(app);
};
