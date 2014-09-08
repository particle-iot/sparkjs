/*jslint node: true */
"use strict";

var spark =require('spark');

// We pass creds and accessToken to be removed
spark.removeAccessToken('email@example.com', 'password', 'accessTokenToBeRemoved', function(err, data) {
  console.log('error on removing accessToken?:', err);
  console.log('data on removing accessToken:', data);
});
