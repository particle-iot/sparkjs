/*jslint node: true */
"use strict";

var Sparkjs =require('sparkjs');

Sparkjs.on('login', function() {
  // If login is successful we get and accessToken,
  // we'll use that to call Spark API

  var callback = function(err, data) {
    if (err) {
      console.log('An error occurred while flashing the core:', err);
    } else {
      console.log('Core flashing started successfully:', data);
    }
  };

  Sparkjs.compileCode(['./path/to/your/file1', './path/to/your/file2'], callback);
});

// Login as usual
Sparkjs.login({ username: 'email@example.com', password: 'password' });
