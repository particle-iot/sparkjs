/*jslint node: true */
"use strict";

var spark =require('spark');

spark.on('login', function() {
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
  spark.compileCode(['./path/to/your/file1', './path/to/your/file2'], callback);
});

// Login as usual
spark.login({ username: 'email@example.com', password: 'password' });
