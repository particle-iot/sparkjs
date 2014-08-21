describe("Spark", function() {
  describe("login", function() {
    var eventName = 'login',
    body = { access_token: 'access_token' },
    result = 'access_token',
    subject = function(callback) {
      Spark.login('spark', 'spark', callback);
    }

    shared.handlesWrongCredentials();
    shared.behavesLikeApi('login', subject, body, 'access_token');
  });

  describe("listDevices", function() {
    var eventName = 'listDevices',
    body = { devices: [{name: 'sparky'}] },
    result = body,
    subject = function(callback) {
      Spark.listDevices(callback);
    }

    shared.handlesWrongCredentials();
    //shared.behavesLikeApi(eventName, subject, body, result);
  });

  describe("createUser", function() {
    var eventName = 'createUser',
    body = { ok: true },
    result = body,
    subject = function(callback) {
      Spark.listDevices(callback);
    }

    shared.handlesWrongCredentials();
    //shared.behavesLikeApi(eventName, subject, body, result);
  });
});

