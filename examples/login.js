/*jslint node: true */
"use strict";

// We start by requiring sparkjs as usual
// this will give you back an instance of the SparkApi library
var Sparkjs =require('sparkjs');

// Spark API login
// You can interact with the api using callbacks, events or promises
// choose the one you feel more comfortable with.

// Registering a listerner for the login event.
Sparkjs.on('login', function(err, body) {
  console.log('API call completed on Login event:', body);
});

// Storing the promise returned by the the Sparkjs.login() fn and also passing a callback.
// The callback will be executed upon completion and returns err and data.
var promise = Sparkjs.login('email@example.com', 'password', function(err, body) {
  console.log('API call login completed on callback:', body);
});

// Registering functions for promise resolve and reject results.
promise.then(
  function(token){
    console.log('API call completed on promise resolve: ', token);
  },
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);
