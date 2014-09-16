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

      // callback to be executed by each core
      var signalCb = function(err, data) {
        if (err) {
          console.log('An error occurred while flashing the core:', err);
        } else {
          console.log('Core flashing started successfully:', data);
        }
      };

      // We pass the firmware.ino file we want to flash to the core, we'll use the first
      // core retrieved in devices array.
      var core = devices[0];
      core.flash('./path/to/your/file1.ino', signalCb);

      // You can also call the sparj instance passing the device id.
      // spark.flashCore(devices[0].id, ['./path/to/your/file1', './path/to/your/file2'], signalCb);
    },
    function(err) {
      console.log('API call failed: ', err);
    }
  );
});

// Login as usual
spark.login({ username: 'email@example.com', password: 'password' });
