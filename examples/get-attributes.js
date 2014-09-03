/*jslint node: true */
"use strict";

var Spark =require('spark');

Spark.on('login', function() {
  // If login is successful we get and accessToken,
  // we'll use that to call Spark API ListDevices
  var devicesPr = Spark.listDevices();

  devicesPr.then(
    // We get an array with devices back and we list them
    function(devices){
      console.log('API call List Devices: ', devices);

      // callback to be executed by each cored we want to retrieve attrs for
      var attrsCb = function(err, data) {
        if (err) {
          console.log('An error occurred while getting core attrs:', err);
        } else {
          console.log('Core attrs retrieved successfully:', data);
        }
      };

      Spark.getAttributes(devices[0].id, attrsCb);
    },
    function(err) {
      console.log('API call failed: ', err);
    }
  );
});

// Login as usual
Spark.login({ username: 'email@example.com', password: 'password' });
