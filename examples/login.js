/*jslint node: true */
"use strict";

// We start by requiring sparkjs as usual
// this will give you back an instance of the SparkApi library
var Sparkjs =require('sparkjs');

// Spark API login
// You can interact with the api using callbacks, events or promises
// choose the one you feel more comfortable with.
// We are using events and callbacks in this example, usually you would
// only use one of the two, we are using both here just as an example.

// Registering a listerner for the login event.
Sparkjs.on('login', function(err, body) {
  console.log('API call completed on Login event:', body);
});

// The callback will be executed upon completion and returns err and data.
Sparkjs.login({ username: 'email@example.com', password: 'password' }, function(err, body) {
  console.log('API call login completed on callback:', body);
});
