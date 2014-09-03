/*jslint node: true */
"use strict";

var spark =require('spark');

// Login as usual
var promise = spark.login({ username: 'email@example.com', password: 'password' });

promise.then(
  function(token){
    // If login is successful we get and accessToken,
    // we'll use that to call Spark API ListDevices
    var devicesPr = spark.listDevices();

    devicesPr.then(
      // We get an array with devices back and we list them
      function(devices){
        console.log('API call List Devices completed on promise resolve: ', devices);
      },
      function(err) {
        console.log('API call List Devices completed on promise fail: ', err);
      }
    );
  },
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);
