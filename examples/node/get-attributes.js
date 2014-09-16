/*jslint node: true */
"use strict";

var spark =require('spark');

spark.on('login', function() {
  // If login is successful we get and accessToken,
  // we'll use that to call Spark API ListDevices
  var devicesPr = spark.listDevices();

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

      // When you get the list of devices each of them has all retrieved attributes
      // inside an object with the same name `core.attributes`, also the attributes
      // are aliased to the device main object like so `core.attributes.id === core.id`
      var core = devices[0];
      console.log('core own attributes:', core);
      console.log('core.attributes:', core.attributes);

      // You can also get a set of extra attributes and force an update by calling
      // `core.getAttributes`.
      core.getAttributes(function(err, data) {
        console.log('core.getAttributes():', core);
      });

      // You also have the option of calling getAttributes directly on the spark
      // instance by passing the deviceId
      spark.getAttributes(devices[0].id, attrsCb);
    },
    function(err) {
      console.log('API call failed: ', err);
    }
  );
});

// Login as usual
spark.login({ username: 'email@example.com', password: 'password' });
