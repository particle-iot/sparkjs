/*jslint node: true */
"use strict";

var Sparkjs =require('sparkjs');

// We pass creds and accessToken to be removed
Sparkjs.removeAccessToken('email@example.com', 'password', 'accessTokenToBeRemoved', function(err, data) {
  console.log('error on removing accessToken?:', err);
  console.log('data on removing accessToken:', data);
});
