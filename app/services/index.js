/**
 * Created by Zubair.
 */
'use strict';

module.exports = function(app, q, lodash) {
    //require('./user')(app,q);
    require('./checkSessionToken')(app,q, lodash);
    require('./aes')(app,q, lodash);
    require('./socket')(app,q, lodash);
    require('./user')(app,q, lodash);
    require('./admin')(app,q, lodash);
    require('./validator')(app,q, lodash);
    require('./auth')(app,q, lodash);
    require('./conversationRoom')(app,q, lodash);

};
