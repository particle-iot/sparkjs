/*jslint node: true */
"use strict";

var spark =require('spark');

// Login as usual
var promise = spark.login({ username: 'email@example.com', password: 'password' });

promise.then(
  function(token){
    // If login is successful we get an accessToken
    // that is stored in the Spark lib for future use.

    // We use the coreId to claim the core
    spark.claimCore('theCoreId', function(err, data) {
      console.log('Spark.claimCore err:', err);
      console.log('Spark.claimCore data:', data);
    });
  },
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);

