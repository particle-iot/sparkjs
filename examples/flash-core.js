/*jslint node: true */
"use strict";

var Sparkjs =require('sparkjs');

Sparkjs.on('login', function() {
  // If login is successful we get and accessToken,
  // we'll use that to call Spark API ListDevices
  var devicesPr = Sparkjs.listDevices();

  devicesPr.then(
    // We get an array with devices back and we list them
    function(devices){
      console.log('API call List Devices: ', devices);

      // callback to be executed by each core
      var signalCb = function(err, data) {
        if (err) {
          console.log('An error occurred while flashing the core:', err);
        } else {
          console.log('Core flashing started successfully:', data);
        }
      };

      Sparkjs.flashCore(devices[0].id, ['./path/to/your/file1', './path/to/your/file2'], signalCb);
    },
    function(err) {
      console.log('API call failed: ', err);
    }
  );
});

// Login as usual
Sparkjs.login('email@example.com', 'password');
