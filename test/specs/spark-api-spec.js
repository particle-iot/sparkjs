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

    it("sets accessToken correctly", function(){
      subject(function() {
        expect(Spark.accessToken).to.eq('access_token');
      });
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

    it("sets devices correctly", function(){
      subject(function() {
        expect(Spark.devices).to.eq([{name: 'sparky'}]);
      });
    });
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

  describe("removeAccessToken", function() {

    var subject = function(callback) {
      return Spark.removeAccessToken('user@gmail.com', 'pass', 'access_token', callback);
    };

    describe("with correct params", function() {
      var eventName = 'removeAccessToken',
      data = {ok: true};

      shared.stubRequest(data);
      shared.behavesLikeSuccess(eventName, subject, data);
    });
  });

  describe("claimCore", function() {

    var subject = function(callback) {
      return Spark.claimCore('core_id', callback);
    };

    describe("with correct params", function() {
      var eventName = 'claimCore',
      data = { access_token: 'access_token',
        token_type: 'bearer',
        expires_in: 7776000 };


      shared.stubRequest(data);
      shared.behavesLikeSuccess(eventName, subject, data);
  describe("removeCore", function() {

    var subject = function(callback) {
      return Spark.removeCore('core_id', callback);
    };

    describe("with correct params", function() {
      var data = {ok: true};

      shared.stubRequest(data);
      shared.behavesLikeSuccess('removeCore', subject, data);
    });
  });
});


