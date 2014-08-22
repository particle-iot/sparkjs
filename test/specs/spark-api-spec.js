describe("Spark", function() {
  describe("login", function() {

    var subject = function(callback) {
      return Spark.login('spark', 'spark', callback);
    };

    shared.behavesLikeInvalidGrant(subject, 'login');

    describe("with correct params", function() {
      var eventName = 'login',
      data = { access_token: 'access_token' };

      shared.stubRequest(data);
      shared.behavesLikeSuccess('login', subject, data);
    });
  });

  describe("listDevices", function() {

    var subject = function(callback) {
      return Spark.listDevices(callback);
    };

    describe("with correct params", function() {
      var eventName = 'listDevices',
      data = [{name: 'sparky'}];

      shared.stubRequest(data);
      shared.behavesLikeSuccess(eventName, subject, data);
    });

    shared.behavesLikeInvalidGrant(subject, 'listDevices');
  });

  describe("createUser", function() {

    var subject = function(callback) {
      return Spark.createUser('user@gmail.com', 'pass', callback);
    };

    describe("with correct params", function() {
      var eventName = 'createUser',
      data = {ok: true};

      shared.stubRequest(data);
      shared.behavesLikeSuccess(eventName, subject, data);
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

