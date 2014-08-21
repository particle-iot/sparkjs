describe("Spark", function() {
  describe("login", function() {

    var subject = function(callback) {
      return Spark.login('spark', 'spark', callback);
    };

    shared.behavesLikeInvalidGrant(subject, 'login');

    describe("with correct params", function() {
      var eventName = 'login',
      body = { access_token: 'access_token' },
      result = 'access_token';

      shared.stubRequest(body);
      shared.behavesLikeSuccess('login', subject, body, 'access_token');
    });
  });

  describe("listDevices", function() {

    var subject = function(callback) {
      return Spark.listDevices(callback);
    };

    describe("with correct params", function() {
      var eventName = 'listDevices',
      body = [{name: 'sparky'}],
      result = body;

      shared.stubRequest(body);
      shared.behavesLikeSuccess(eventName, subject, body, result);
    });

    shared.behavesLikeInvalidGrant(subject, 'listDevices');
  });

  describe("createUser", function() {

    var subject = function(callback) {
      return Spark.createUser('user@gmail.com', 'pass', callback);
    };

    describe("with correct params", function() {
      var eventName = 'createUser',
      body = {ok: true},
      result = body;

      shared.stubRequest(body);
      shared.behavesLikeSuccess(eventName, subject, body, result);
    });

    shared.behavesLikeInvalidGrant(subject, 'createUser');

    describe('with invalid username', function() {
      it('returns correct error message', function() {
        subject = function(callback) {
          return Spark.createUser('', 'pass', callback);
        };

        shared.behavesLikeError('createUser', subject, 'Username must be an email address.');
      });
    });
  });
});

