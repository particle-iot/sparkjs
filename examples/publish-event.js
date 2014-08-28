/*jslint node: true */
"use strict";

var Sparkjs = require('sparkjs');

Sparkjs.on('login', function() {
  //This feature is in a limited beta, and is not yet generally available
  var publishEventPr = Sparkjs.publishEvent('test', {});

  publishEventPr.then(
    function(data) {
      if (data.ok) { console.log("Event published succesfully") }
    },
    function(err) {
      console.log("Failed to publish event: " + err)
    }
  );
});

// Login as usual
Sparkjs.login('email@example.com', 'password');
