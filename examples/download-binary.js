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

  var promise = Sparkjs.compileCode('./path/to/your/file1', callback);

  promise.then(
    function(data) {
      setTimeout(function() {
        Sparkjs.downloadBinary(data.binary_url, 'MyBinary', function(err, data) {
          if (err) {
            console.log('Error occurred while downloading binary! -->', err);
          } else {
            console.log('Binary downloaded successfully! -->', data);
          }
        });
      }, 5000);
    }
  );
});

// Login as usual
Sparkjs.login({ username: 'email@example.com', password: 'password' });
