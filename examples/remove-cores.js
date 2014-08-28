/*jslint node: true */
"use strict";

var Sparkjs =require('sparkjs');

// Login as usual
var promise = Sparkjs.login({ username: 'email@example.com', password: 'password' });

promise.then(
  function(token){
    // If login is successful we get and accessToken,
    // we'll use that to call Spark API ListDevices
    var devicesPr = Sparkjs.listDevices();

    devicesPr.then(
      // We get an array with devices back and we list them
      function(devices){
        console.log('API call List Devices completed on promise resolve: ', devices);

        // callback to be executed by each cored we try to remove
        var rmCb = function(err, data) {
          if (err) {
            console.log('An error occurred while removing core:', err);
          } else {
            console.log('removeCore call response:', data);
          }
        };

        // We cycle through the cores and remove them one at a time
        // We can see here how easily we can change between using
        // promises, events or callbacks, in this case we passed
        // a callback to be executed.
        for (var i in devices) {
          Sparkjs.removeCore(devices[i].id, rmCb);
        }
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
