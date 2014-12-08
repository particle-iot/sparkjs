/*jslint node: true */
"use strict";

var spark = require('spark');

spark.on('login', function() {

  //Get updates for global test event
  spark.onEvent('event', function(data) {
    console.log("Event: " + data);
  });

  //Get test event for specific core
  spark.listDevices().then(function(devices){
    devices[0].onEvent('test', function(data) {
      console.log("Event: " + data);
    });
  });

});

// Login as usual
spark.login({ username: 'email@example.com', password: 'password'});
//spark.login({ accessToken: '012345' });
