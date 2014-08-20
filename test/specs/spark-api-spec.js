describe("Spark", function() {
  describe("login", function() {

    var body = { access_token: 'access_token' };
    var subject = function(callback) {
      Spark.login('spark', 'spark', callback);
    }

    shared.handlesWrongCredentials();
    shared.behavesLikeApi('login', subject, body, 'access_token');
  });

  describe("listDevices", function() {
    shared.handlesWrongCredentials();
  });
});

