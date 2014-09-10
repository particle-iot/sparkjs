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

  // We compile our firmware.ino file to get an url back to download
  // if you already have the url you can pass it along instead of
  // compiling the file.
  var promise = spark.compileCode('./path/to/your/file1', callback);

  promise.then(
    function(data) {
      // we set a little timeout to make sure the file has finished compiling
      setTimeout(function() {
        // we pass the binary url and what we want our binary to be named
        spark.downloadBinary(data.binary_url, 'MyBinary', function(err, data) {
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
spark.login({ username: 'email@example.com', password: 'password' });
