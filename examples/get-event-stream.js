/*jslint node: true */
"use strict";

var Spark =require('spark');

Spark.on('login', function() {

  //Get all events
  Spark.getEventStream(false, false, function(data) {
    console.log("Event: " + data);
  });

  //Get your devices events
  Spark.getEventStream(false, 'mine', function(data) {
    console.log("Event: " + data);
  });

  //Get test event for specific core
  Spark.getEventStream('test', 'CORE_ID', function(data) {
    console.log("Event: " + data);
  });


});

// Login as usual
Spark.login('email@example.com', 'password');
