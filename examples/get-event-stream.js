/*jslint node: true */
"use strict";

var Sparkjs =require('sparkjs');

Sparkjs.on('login', function() {

  //Get all events
  Sparkjs.getEventStream(false, false, function(data) {
    console.log("Event: " + data);
  });

  //Get your devices events
  Sparkjs.getEventStream(false, 'mine', function(data) {
    console.log("Event: " + data);
  });

  //Get test event for specific core
  Sparkjs.getEventStream('test', 'CORE_ID', function(data) {
    console.log("Event: " + data);
  });


});

// Login as usual
Sparkjs.login('email@example.com', 'password');
