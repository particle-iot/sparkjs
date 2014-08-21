/*jslint node: true */
"use strict";

var Sparkjs =require('sparkjs');

// Login as usual
var promise = Sparkjs.login('email@example.com', 'password');

promise.then(
  function(accessToken){
    // If login is successful we get and accessToken,
    // we'll use it just to remove it

    Sparkjs.removeAccessToken('edgar.osc@gmail.com', 'passw0rd', accessToken, function(err, data) {
      console.log('error on removing accessToken?:', err);
      console.log('data on removing accessToken:', data);
    });
  },
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);
