/*jslint node: true */
"use strict";

var Spark =require('Spark');

// We pass creds and accessToken to be removed
Spark.removeAccessToken('email@example.com', 'password', 'accessTokenToBeRemoved', function(err, data) {
  console.log('error on removing accessToken?:', err);
  console.log('data on removing accessToken:', data);
});
