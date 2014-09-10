/*jslint node: true */
"use strict";

var spark =require('spark');

// We call createUser and pass the corresponding params.
// We use a callback, in this example, to check completion
spark.createUser('example@email.com', 'password', function(err, data) {
  console.log('err on create user:', err);
  console.log('data on create user:', data);

  if (!err) {
    // We try to login and get back an accessToken to verify user creation
    var loginPromise = spark.login('example@email.com', 'password');

    // We'll use promises to check the result of the login process
    loginPromise.then(
      function(accessToken) {
        console.log('Login successful! accesstoken ==>', accessToken);
      },
      function(err) {
        console.log('Login failed:', err);
      }
    );
  }
});
