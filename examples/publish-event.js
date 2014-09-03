/*jslint node: true */
"use strict";

var Spark = require('spark');

Spark.on('login', function() {
  //This feature is in a limited beta, and is not yet generally available
  var publishEventPr = Spark.publishEvent('test', {});

  publishEventPr.then(
    function(data) {
      if (data.ok) { console.log("Event published succesfully"); }
    },
    function(err) {
      console.log("Failed to publish event: " + err);
    }
  );
});

// Login as usual
Spark.login('email@example.com', 'password');
