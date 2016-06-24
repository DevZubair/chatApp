/**
 * Created by Zubair.
 */
'use strict';
module.exports = function(app) {
  app.log_JF = function(type, message) {
    if (type == 'error') {
      console.log("-------error--------");
      console.log(message);

    } else if (type == "success") {
      console.log("------success--------");
      console.log(message);

    } else if (type == "message") {
      console.log("-------message--------");
      console.log(message);

    }
  }
};
