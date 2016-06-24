/**
 * Created by Zubair.
 */
'use strict';

module.exports = function(app, q, lodash) {
    //require('./user')(app,q);
    //require('./chksession')(app,q, lodash);
    require('./socket')(app,q, lodash);
    require('./admin')(app,q, lodash);
    require('./user')(app,q, lodash);
    require('./auth')(app,q, lodash);
    require('./profile')(app,q, lodash);
    require('./home')(app,q, lodash);

};
