/*jslint node: true */
"use strict";

// We start by requiring sparkjs as usual
// this will give you back an instance of the SparkApi library
var spark =require('spark');

// Spark API login
// You can interact with the api using callbacks, events or promises
// choose the one you feel more comfortable with, in this example we'll
// be using Promises

// Storing the promise returned by the the spark.login() fn.
// Have in mind that if callback is provided or event listener
// registered the returned value will be null instead of a Promise.
var promise = spark.login({ username: 'email@example.com', password: 'password' });

// Registering functions for promise resolve and reject.
promise.then(
  function(token){
    console.log('API call completed on promise resolve: ', token);
  },
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);
