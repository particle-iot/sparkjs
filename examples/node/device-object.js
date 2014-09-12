/*jslint node: true */
"use strict";

var spark =require('spark');

spark.on('login', function() {
  var myDevices = spark.listDevices();

  myDevices.then(
    function(devices) {
        console.log("My device: ", devices[0]);
        var core = devices[0];
        // test sending signal
        core.stopSignal(function(err, data) {
            if (err) {
                console.log('Error sending a signal to the core:', err);
            } else {
                console.log('Core signal sent successfully:', data);
            }
        });
        // test calling a function in the core
        core.callFunction('blinky', 'on', function(err, data) {
            if (err) {
                console.log("An error occurred: ", err);
            } else {
                console.log("Function called successfully: ", data);
            }
        });
    }
  );
});

spark.login({ username: 'username@example.com', password: 'password' });
