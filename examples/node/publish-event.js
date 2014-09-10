/*jslint node: true */
"use strict";

var spark = require('spark');

spark.on('login', function() {
  //This feature is in a limited beta, and is not yet generally available
  var publishEventPr = spark.publishEvent('test', {});

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
spark.login('email@example.com', 'password');
