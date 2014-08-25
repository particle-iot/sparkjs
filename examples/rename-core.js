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

      // callback to be executed by each cored we try to remove
      var renameCb = function(err, data) {
        if (err) {
          console.log('An error occurred while renaming core:', err);
        } else {
          console.log('Core renamed successfully:', data);
        }
      };

      Sparkjs.renameCore(devices[0].id, 'new-name', renameCb);
    },
    function(err) {
      console.log('API call List Devices completed on promise fail: ', err);
    }
  );
});

// Login as usual
Sparkjs.login('email@example.com', 'password');
