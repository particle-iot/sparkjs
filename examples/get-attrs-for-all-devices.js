/*jslint node: true */
"use strict";

var Spark =require('spark');

Spark.on('login', function() {
  // If login is successful we get and accessToken,
  // we'll use it to retrieve attrs for all cores
  var devicesPr = Spark.getAttributesForAll();

  devicesPr.then(
    // We get an array with devices back and we list them
    function(devices){
      console.log('API call List Devices: ', devices);
    },
    function(err) {
      console.log('API call failed: ', err);
    }
  );
});

// Login as usual
Spark.login({ username: 'email@example.com', password: 'password' });
