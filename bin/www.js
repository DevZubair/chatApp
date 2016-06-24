/**
 * Created by Zubair.
 */

var debug = require('debug')('expressapp');
var app = require('../app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'),function(){
  console.log(server.address().port);
  debug('Express server listing on port : ' + server.address().port);
});

//Socket.IO Server

var io = require('socket.io')(server);

app.controllers._socketEvents(io);


