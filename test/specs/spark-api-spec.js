describe("Spark", function() {
  describe("login", function() {
    var subject = function(callback) {
      return Spark.login('spark', 'spark', callback);
    };
    var data = {access_token:'access_token'};

    shared.behavesLikeInvalidGrant(subject, 'login');
    shared.behavesLikeSuccess('login', subject, data);

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
    var data = [{name: 'sparky'}];

    shared.behavesLikeSuccess('listDevices', subject, data);
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
    var data = {ok: true};

    shared.behavesLikeSuccess('createUser', subject, data);
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
    var data = {ok: true};

    shared.behavesLikeSuccess('removeAccessToken', subject, data);
    shared.behavesLikeInvalidGrant(subject, 'removeAccessToken');
  });

  describe("claimCore", function() {
    var subject = function(callback) {
      return Spark.claimCore('core_id', callback);
    };
    var data = { access_token: 'access_token',
      token_type: 'bearer',
      expires_in: 7776000 };

    shared.behavesLikeSuccess('claimCore', subject, data);
    shared.behavesLikeInvalidGrant(subject, 'claimCore');
  });

  describe("removeCore", function() {
    var subject = function(callback) {
      return Spark.removeCore('core_id', callback);
    };
    var data = {ok: true};

    shared.behavesLikeSuccess('removeCore', subject, data);
    shared.behavesLikeInvalidGrant(subject, 'removeCore');
  });

  describe("renameCore", function() {
    var subject = function(callback) {
      return Spark.renameCore('core_id', 'new_name', callback);
    };
    var data = {ok: true};

    shared.behavesLikeSuccess('renameCore', subject, data);
    shared.behavesLikeInvalidGrant(subject, 'renameCore');
  });

  describe("getAttributes", function() {
    var subject = function(callback) {
      return Spark.getAttributes('core_id', callback);
    };
    var data = { id: 'core_id', name: 'name', connected: false,
      variables: null, functions: null, cc3000_patch_version: '1.24',
      requires_deep_update: true };

    shared.behavesLikeSuccess('getAttributes', subject, data);
    shared.behavesLikeInvalidGrant(subject, 'getAttributes');
  });
});
