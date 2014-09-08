/*jslint node: true */
"use strict";

// We start by requiring Spark as usual
// this will give you back an instance of the SparkApi library
var spark =require('spark');

// Spark API login
// You can interact with the api using callbacks, events or promises
// choose the one you feel more comfortable with.
// We are using events and callbacks in this example, usually you would
// only use one of the two, we are listing both here for reference:

// Registering a listerner for the login event.
// Spark.on('login', function(err, body) {
//   console.log('API call completed on Login event:', body);
// });

// The callback will be executed upon completion and returns err and data.
spark.login({ username: 'email@example.com', password: 'password' }, function(err, body) {
  console.log('API call login completed on callback:', body);
});
