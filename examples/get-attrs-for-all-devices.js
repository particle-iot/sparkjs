/*jslint node: true */
"use strict";

var Sparkjs =require('sparkjs');

Sparkjs.on('login', function() {
  // If login is successful we get and accessToken,
  // we'll use it to retrieve attrs for all cores
  var devicesPr = Sparkjs.getAttributesForAll();

  devicesPr.then(
    // We get an array with devices back and we list them
    function(devices){
      console.log('API call List Devices: ', devices);

      // callback to be executed by each core
      var callback = function(err, data) {
        if (err) {
          console.log('An error occurred while getting core attrs:', err);
        } else {
          console.log('Core attrs retrieved successfully:', data);
        }
      };
    },
    function(err) {
      console.log('API call failed: ', err);
    }
  );
});

// Login as usual
Sparkjs.login('email@example.com', 'password');
