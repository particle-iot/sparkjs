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
      var callback = function(err, data) {
        if (err) {
          console.log('An error occurred while getting core attrs:', err);
        } else {
          console.log('Core attr retrieved successfully:', data);
        }
      };

      // The function needs to be defined  in the firmware uploaded to the
      // the Spark core and registered to the Spark cloud, same thing we do
      // with variables. You pass along the name of the function and the params.
      Sparkjs.callFunction(devices[0].id, 'brew', 'D0:HIGH', callback);
    },
    function(err) {
      console.log('API call failed: ', err);
    }
  );
});

// Login as usual
Sparkjs.login({ username: 'email@example.com', password: 'password' });
