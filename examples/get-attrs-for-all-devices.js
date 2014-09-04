/*jslint node: true */
"use strict";

var spark =require('spark');

spark.on('login', function() {
  // If login is successful we get and accessToken,
  // we'll use it to retrieve attrs for all cores
  var devicesPr = spark.getAttributesForAll();

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
spark.login({ username: 'email@example.com', password: 'password' });
