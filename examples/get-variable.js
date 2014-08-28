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
      var attrsCb = function(err, data) {
        if (err) {
          console.log('An error occurred while getting core attrs:', err);
        } else {
          console.log('Core attr retrieved successfully:', data);
        }
      };

      // The variable needs to be defined  in the code running in
      // the Spark core.
      Sparkjs.getVariable(devices[0].id, 'temp', attrsCb);
    },
    function(err) {
      console.log('API call failed: ', err);
    }
  );
});

// Login as usual
Sparkjs.login({ username: 'email@example.com', password: 'password' });
