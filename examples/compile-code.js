/*jslint node: true */
"use strict";

var Spark =require('spark');

Spark.on('login', function() {
  // If login is successful we get and accessToken,
  // we'll use that to call Spark API

  var callback = function(err, data) {
    if (err) {
      console.log('An error occurred while flashing the core:', err);
    } else {
      console.log('Core flashing started successfully:', data);
    }
  };

  // we pass an array of files to be compiled
  Spark.compileCode(['./path/to/your/file1', './path/to/your/file2'], callback);
});

// Login as usual
Spark.login({ username: 'email@example.com', password: 'password' });
