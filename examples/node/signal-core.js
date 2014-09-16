/*jslint node: true */
"use strict";

var spark =require('spark');

spark.on('login', function() {
  // If login is successful we get and accessToken,
  // we'll use that to call spark API ListDevices
  var devicesPr = spark.listDevices();

  devicesPr.then(
    // We get an array with devices back and we list them
    function(devices){
      console.log('API call List Devices: ', devices);

      // callback to be executed by each core
      var signalCb = function(err, data) {
        if (err) {
          console.log('An error occurred while sending a signal to the core:', err);
        } else {
          console.log('Core signal sent successfully:', data);
        }
      };

      // Send a signal to the core to start playing rainbow in the LED.
      // Send a 0 if you want the rainbow animation to stop.
      var core = devices[0];
      core.signal(devices[0].id, 1, signalCb);

      // You also have the option to call it direclty on the spark instance
      // by passing the device.id
      spark.signalCore(devices[0].id, 1, signalCb);
    },
    function(err) {
      console.log('API call failed: ', err);
    }
  );
});

// Login as usual
spark.login({ username: 'email@example.com', password: 'password' });
