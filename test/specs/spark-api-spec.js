describe('Spark', function() {
  describe('login', function() {

    describe('with access token', function() {
      it('callback', function() {
        Spark.login({accessToken: 'access_token'}, function(err, data) {
          expect(err).to.eq(null);
          expect(data.accessToken).to.eq('access_token');
          expect(Spark.ready()).to.eq(true);
        });
      });

      it('promise', function() {
        promise = Spark.login({accessToken: 'access_token'});
        return expect(promise).to.be.fulfilled;
      });
    });

    describe('with username/password', function() {
      var subject = function(callback) {
        return Spark.login({username: 'spark', password: 'spark'}, callback);
      };
      var data = {accessToken: 'access_token'};
      var args = {
        uri: 'https://api.spark.io/oauth/token',
        method: 'POST',
        json: true,
        form: {
          username: 'spark',
          password: 'spark',
          grant_type: 'password',
          client_id: 'Spark',
          client_secret: 'Spark'
        }
      };

      shared.behavesLikeAPI('login', subject, data, args);

      it('sets accessToken correctly');

      it('is ready');
    });
  });

  describe('listDevices', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.listDevices(callback);
    };
    var data = [{id: 'id', name: 'sparky'}];
    var args = {
      uri: 'https://api.spark.io/v1/devices?access_token=token',
      method: 'GET',
      json: true
    };

    shared.behavesLikeAPI('listDevices', subject, data, args);

    it('sets devices correctly');
  });

  describe('createUser', function() {
    var subject = function(callback) {
      return Spark.createUser('user@gmail.com', 'pass', callback);
    };
    var data = {ok: true};
    var args = {
      uri: 'https://api.spark.io/v1/users',
      method: 'POST',
      form: {
        username: 'user@gmail.com',
        password: 'pass'
      },
      json: true
    };

    it('promise', function() {
      promise = Spark.login({accessToken: 'access_token'});
      return expect(promise).to.be.fulfilled;
    });

    shared.behavesLikeAPI('createUser', subject, data, args);

    describe('with invalid username', function() {
      it('returns correct error message', function() {
        subject = function(callback) {
          return Spark.createUser('', 'pass', callback);
        };

        shared.behavesLikeError('createUser', subject, 'Username must be an email address.');
      });
    });
  });

  describe('removeAccessToken', function() {
    var subject = function(callback) {
      return Spark.removeAccessToken('user@gmail.com', 'pass', 'access_token', callback);
    };
    var data = {ok: true};
    var args = {
      uri: 'https://api.spark.io/v1/access_tokens/access_token',
      method: 'DELETE',
      auth: {
        username: 'user@gmail.com',
        password: 'pass'
      },
      form: {
        access_token: 'access_token'
      },
      json: true
    };

    shared.behavesLikeAPI('removeAccessToken', subject, data, args);
  });

  describe('claimCore', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.claimCore('core_id', callback);
    };
    var data = {
      access_token: 'access_token',
      token_type: 'bearer',
      expires_in: 7776000
    };
    var args = {
      uri: 'https://api.spark.io/v1/devices',
      method: 'POST',
      form: {
        id: 'core_id',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeAPI('claimCore', subject, data, args);
  });

  describe('removeCore', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.removeCore('core_id', callback);
    };
    var data = {ok: true};
    var args = {
      uri: 'https://api.spark.io/v1/devices/core_id',
      method: 'DELETE',
      form: {
        id: 'core_id',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeAPI('removeCore', subject, data, args);
  });

  describe('renameCore', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.renameCore('core_id', 'new_name', callback);
    };
    var data = {ok: true};
    var args = {
      uri: 'https://api.spark.io/v1/devices/core_id',
      method: 'PUT',
      form: {
        name: 'new_name',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeAPI('renameCore', subject, data, args);
  });

  describe('getAttributes', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
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
    var args = {
      uri: 'https://api.spark.io/v1/devices/core_id?access_token=token',
      method: 'GET',
      json: true
    };

    shared.behavesLikeAPI('getAttributes', subject, data, args);
  });

  describe('getVariable', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.getVariable('core_id', 'var', callback);
    };
    var data = {
      'cmd': 'VarReturn',
      'name': 'var',
      'result': 10,
      'coreInfo': {
        'last_app': '',
        'last_heard': '2014-08-25T16:18:42.534Z',
        'connected': true,
        'deviceID': 'core_id'
      }
    };
    var args = {
      uri: 'https://api.spark.io/v1/devices/core_id/var?access_token=token',
      method: 'GET',
      json: true
    };

    shared.behavesLikeAPI('getVariable', subject, data, args);
  });

  describe('signalCore', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.signalCore('core_id', true, callback);
    };
    var data = {
      id: 'core_id',
      connected: true,
      signaling: true
    };
    var args = {
      uri: 'https://api.spark.io/v1/devices/core_id',
      method: 'PUT',
      form: {
        signal: 1,
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeAPI('signalCore', subject, data, args);
  });

  describe('flashCore', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.flashCore('core_id', [], callback);
    };
    var data = {
      id: 'core_id',
      status: 'Update started'
    };
    var args ={
      uri: 'https://api.spark.io/v1/devices/core_id?access_token=token',
      method: 'PUT',
      json: true
    };

    shared.behavesLikeAPI('flashCore', subject, data, args);

    it('appends files correctly')
  });

  describe('compileCode', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.compileCode([], callback);
    };
    var data = {
      ok: true
    };
    var args ={
      uri: 'https://api.spark.io/v1/binaries?access_token=token',
      method: 'POST',
      json: true
    };

    shared.behavesLikeAPI('compileCode', subject, data, args);
    it('appends files correctly')
  });

  describe('downloadBinary', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.downloadBinary('/v1/algo/123456789', 'file', callback);
    };
    var data = {
      ok: true
    };
    var args = {
      uri: 'https://api.spark.io/v1/algo/123456789?access_token=token',
      method: 'GET'
    };

    shared.behavesLikeAPI('downloadBinary', subject, data, args);
    it('writes file correctly')
  });

  describe('sendPublicKey', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.sendPublicKey('core_id', 'buffer', callback);
    };
    var data = {
      ok: true
    };
    var args = {
      uri: 'https://api.spark.io/v1/provisioning/core_id',
      method: 'POST',
      form: {
        deviceID: 'core_id',
        publicKey: 'buffer',
        order: 'manual_0',
        filename: 'cli',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeAPI('sendPublicKey', subject, data, args);
    it('writes file correctly')
  });

  describe('callFunction', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.callFunction('core_id', 'function', 'arg', callback);
    };
    var data = {
      id: 'core_id',
      name: 'core_name',
      last_app: 'last_app',
      connected: true,
      return_value: 42
    };
    var args = {
      uri: 'https://api.spark.io/v1/devices/core_id/function',
      method: 'POST',
      form: {
        arg: 'arg',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeAPI('callFunction', subject, data, args);
  });

  describe('getEventStream', function() {
    var request;

    afterEach(function() {
      request.restore();
    });

    it('retrieves all events url', function() {
      request = sinon.stub(Spark.api, 'request')
      var args = {
        uri: 'https://api.spark.io/v1/events?access_token=token',
        method: 'GET'
      };

      Spark.getEventStream(false);
      return expect(request.withArgs(args)).to.be.calledOnce;
    });

    it('retrieves event url', function() {
      request = sinon.stub(Spark.api, 'request')
      var args = {
        uri: 'https://api.spark.io/v1/events/event_name?access_token=token',
        method: 'GET'
      };

      Spark.getEventStream('event_name');
      return expect(request.withArgs(args)).to.be.calledOnce;
    });

    it('retrieves mine events url', function() {
      request = sinon.stub(Spark.api, 'request')
      var args = {
        uri: 'https://api.spark.io/v1/devices/events?access_token=token',
        method: 'GET'
      };

      Spark.getEventStream(false, 'mine');
      return expect(request.withArgs(args)).to.be.calledOnce;
    });

    it('retrieves coreId events url', function() {
      request = sinon.stub(Spark.api, 'request')
      var args = {
        uri: 'https://api.spark.io/v1/devices/coreId/events?access_token=token',
        method: 'GET'
      };

      Spark.getEventStream(false, 'coreId');
      return expect(request.withArgs(args)).to.be.calledOnce;
    });
  });

  describe('getAttributesForAll', function() {

    var data = [ {id: '1', name: 'sparki'} ];
    var args = {
      uri: 'https://api.spark.io/v1/devices?access_token=token',
      method: 'GET',
      json: true
    };

    shared.stubRequest(null, data, args);

    it('returns devices attributes', function() {
      subject = function() {
       return Spark.getAttributesForAll();
      }
      return expect(subject()).to.eventually.include({id: '1', name: 'sparki'});
    });
  });

  describe('publishEvent', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.publishEvent('event_name', 'data', callback);
    };
    var data = {
      ok: true,
    };
    var args = {
      uri: 'https://api.spark.io/v1/devices/events',
      method: 'POST',
      form: {
        name: 'event_name',
        data: 'data',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeAPI('publishEvent', subject, data, args);
  });

  describe('createWebhook', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.createWebhook('event_name', 'url', 'core_id', callback);
    };
    var data = {
      ok: true,
    };
    var args = {
      uri: 'https://api.spark.io/v1/webhooks',
      method: 'POST',
      form: {
        event: 'event_name',
        url: 'url',
        deviceid: 'core_id',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeAPI('createWebhook', subject, data, args);
  });

  describe('deleteWebhook', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.deleteWebhook('hook_id', callback);
    };
    var data = {
      ok: true,
    };
    var args = {
      uri: 'https://api.spark.io/v1/webhooks/hook_id?access_token=token',
      method: 'DELETE',
      json: true
    };

    shared.behavesLikeAPI('deleteWebhook', subject, data, args);
  });

  describe('listWebhooks', function() {
    var subject = function(callback) {
      Spark.accessToken = 'token';
      return Spark.listWebhooks(callback);
    };
    var data = [];
    var args = {
      uri: 'https://api.spark.io/v1/webhooks/?access_token=token',
      method: 'GET',
      json: true
    };

    shared.behavesLikeAPI('listWebhooks', subject, data, args);
  });
});
