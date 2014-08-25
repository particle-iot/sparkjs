describe("Spark", function() {
  describe("login", function() {
    var subject = function(callback) {
      return Spark.login('spark', 'spark', callback);
    };
    var data = {access_token:'access_token'};

    shared.behavesLikeSuccess('login', subject, data);
    shared.behavesLikeError('login', subject, 'invalid_grant');

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
    shared.behavesLikeError('listDevices', subject, 'invalid_grant');

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
    shared.behavesLikeError('createUser', subject, 'invalid_grant');

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
    shared.behavesLikeError('removeAccessToken', subject, 'invalid_grant');
  });

  describe("claimCore", function() {
    var subject = function(callback) {
      return Spark.claimCore('core_id', callback);
    };
    var data = { access_token: 'access_token',
      token_type: 'bearer',
      expires_in: 7776000 };

    shared.behavesLikeSuccess('claimCore', subject, data);
    shared.behavesLikeError('claimCore', subject, 'invalid_grant');
  });

  describe("removeCore", function() {
    var subject = function(callback) {
      return Spark.removeCore('core_id', callback);
    };
    var data = {ok: true};

    shared.behavesLikeSuccess('removeCore', subject, data);
    shared.behavesLikeError('removeCore', subject, 'invalid_grant');
  });

  describe("renameCore", function() {
    var subject = function(callback) {
      return Spark.renameCore('core_id', 'new_name', callback);
    };
    var data = {ok: true};

    shared.behavesLikeSuccess('renameCore', subject, data);
    shared.behavesLikeError('renameCore', subject, 'invalid_grant');
  });

  describe("getAttributes", function() {
    var subject = function(callback) {
      return Spark.getAttributes('core_id', callback);
    };
    var data = {
      id: 'core_id',
      name: 'name',
      connected: false,
      variables: null,
      functions: null,
      cc3000_patch_version: '1.24',
      requires_deep_update: true
    };

    shared.behavesLikeSuccess('getAttributes', subject, data);
    shared.behavesLikeError('getAttributes', subject, 'invalid_grant');
  });

  describe("getVariable", function() {
    var subject = function(callback) {
      return Spark.getVariable('core_id', 'var', callback);
    };
    var data = {
      "cmd": "VarReturn",
      "name": "var",
      "result": 10,
      "coreInfo": {
        "last_app": "",
        "last_heard": "2014-08-25T16:18:42.534Z",
        "connected": true,
        "deviceID": "core_id"
      }
    };

    shared.behavesLikeSuccess('getVariable', subject, data);
    shared.behavesLikeError('getVariable', subject, 'invalid_grant');
  });

  describe("signalCore", function() {
    var subject = function(callback) {
      return Spark.signalCore('core_id', true, callback);
    };
    var data = {
      id: 'core_id',
      connected: true,
      signaling: true
    };

    shared.behavesLikeSuccess('signalCore', subject, data);
    shared.behavesLikeError('signalCore', subject, 'invalid_grant');
  });

  describe("flashCore", function() {
    var subject = function(callback) {
      return Spark.flashCore('core_id', [], callback);
    };
    var data = {
      id: 'core_id',
      status: "Update started"
    };

    shared.behavesLikeSuccess('flashCore', subject, data);
    shared.behavesLikeError('flashCore', subject, 'invalid_grant');
    //TODO: Files appended correctly
  });

  describe("compileCode", function() {
    var subject = function(callback) {
      return Spark.compileCode([], callback);
    };
    var data = {
      ok: true
    };

    shared.behavesLikeSuccess('compileCode', subject, data);
    shared.behavesLikeError('compileCode', subject, 'invalid_grant');
   //TODO: Files appended correctly
  });

  describe("downloadBinary", function() {
    var subject = function(callback) {
      return Spark.downloadBinary('http://bin.io', 'file', callback);
    };
    var data = {
      ok: true
    };

    shared.behavesLikeSuccess('downloadBinary', subject, data);
    shared.behavesLikeError('downloadBinary', subject, 'invalid_grant');
    //TODO: File is written correctly
  });

  describe("sendPublicKey", function() {
    var subject = function(callback) {
      return Spark.sendPublicKey('core_id', 'buffer', callback);
    };
    var data = {
      ok: true
    };

    shared.behavesLikeSuccess('sendPublicKey', subject, data);
    shared.behavesLikeError('sendPublicKey', subject, 'invalid_grant');
    //TODO: File is written correctly
  });

  describe("callFunction", function() {
    var subject = function(callback) {
      return Spark.callFunction('core_id', 'function', 'arg', callback);
    };
    var data = {
      id: 'core_id',
      name: 'core_name',
      last_app: 'last_app',
      connected: true,
      return_value: 42
    };

    shared.behavesLikeSuccess('callFunction', subject, data);
    shared.behavesLikeError('callFunction', subject, 'invalid_grant');
  });

  describe("publishEvent", function() {
    var subject = function(callback) {
      return Spark.publishEvent('event_name', 'data', callback);
    };
    var data = {
      ok: true,
    };

    shared.behavesLikeSuccess('publishEvent', subject, data);
    shared.behavesLikeError('publishEvent', subject, 'invalid_grant');
  });

  describe("createWebhook", function() {
    var subject = function(callback) {
      return Spark.createWebhook('event_name', 'url', 'core_id', callback);
    };
    var data = {
      ok: true,
    };

    shared.behavesLikeSuccess('createWebhook', subject, data);
    shared.behavesLikeError('createWebhook', subject, 'invalid_grant');
  });

  describe("deleteWebhook", function() {
    var subject = function(callback) {
      return Spark.deleteWebhook('hook_id', callback);
    };
    var data = {
      ok: true,
    };

    shared.behavesLikeSuccess('deleteWebhook', subject, data);
    shared.behavesLikeError('deleteWebhook', subject, 'invalid_grant');
  });

  describe("listWebhooks", function() {
    var subject = function(callback) {
      return Spark.listWebhooks(callback);
    };
    var data = [];

    shared.behavesLikeSuccess('listWebhooks', subject, data);
    shared.behavesLikeError('listWebhooks', subject, 'invalid_grant');
  });
});
