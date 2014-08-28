/*jslint node: true */
"use strict";

var Sparkjs =require('sparkjs');

// Login as usual
var promise = Sparkjs.login({ username: 'email@example.com', password: 'password' });

promise.then(
  function(token){
    // If login is successful we get an accessToken
    // that is stored in the Sparkjs lib for future use.

    Sparkjs.claimCore('theCoreId', function(err, data) {
      console.log('Sparkjs.claimCore err:', err);
      console.log('Sparkjs.claimCore data:', data);
    });
  },
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);

