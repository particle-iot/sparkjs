describe('SparkApi', function() {

  describe('login', function() {
    var subject = function(api, callback) {
      return api.login({username: 'spark', password: 'spark'}, callback);
    };
    var args = {
      uri: 'https://api.particle.io/oauth/token',
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

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('listDevices', function() {
    var subject = function(api, callback) {
      return api.listDevices({accessToken: 'token'}, callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/devices?access_token=token',
      method: 'GET',
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('createUser', function() {
    var subject = function(api, callback) {
      return api.createUser('user@gmail.com', 'pass', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/users',
      method: 'POST',
      form: {
        username: 'user@gmail.com',
        password: 'pass'
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('listAccessTokens', function() {
    var subject = function(api, callback) {
      return api.listAccessTokens('user@gmail.com', 'pass', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/access_tokens',
      method: 'GET',
      auth: {
        username: 'user@gmail.com',
        password: 'pass'
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('removeAccessToken', function() {
    var subject = function(api, callback) {
      return api.removeAccessToken('user@gmail.com', 'pass', 'access_token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/access_tokens/access_token',
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

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('claimCore', function() {
    var subject = function(api, callback) {
      return api.claimCore('core_id', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/devices',
      method: 'POST',
      form: {
        id: 'core_id',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('removeCore', function() {
    var subject = function(api, callback) {
      return api.removeCore('core_id', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/devices/core_id',
      method: 'DELETE',
      form: {
        id: 'core_id',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('renameCore', function() {
    var subject = function(api, callback) {
      return api.renameCore('core_id', 'new_name', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/devices/core_id',
      method: 'PUT',
      form: {
        name: 'new_name',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('getAttributes', function() {
    var subject = function(api, callback) {
      return api.getAttributes('core_id', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/devices/core_id?access_token=token',
      method: 'GET',
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('getVariable', function() {
    var subject = function(api, callback) {
      return api.getVariable('core_id', 'var', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/devices/core_id/var?access_token=token',
      method: 'GET',
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('signalCore', function() {
    var subject = function(api, callback) {
      return api.signalCore('core_id', true, 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/devices/core_id',
      method: 'PUT',
      form: {
        signal: 1,
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('flashTinker', function() {
    var subject = function(api, callback) {
      return api.flashTinker('core_id', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/devices/core_id',
      method: 'PUT',
      form: {
        access_token: 'token',
        app: 'tinker'
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('flashCore', function() {
    var subject = function(api, callback) {
      return api.flashCore('core_id', [], 'token', callback);
    };
    var args ={
      uri: 'https://api.particle.io/v1/devices/core_id?access_token=token',
      method: 'PUT',
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
    it('appends files correctly');
  });

  describe('compileCode', function() {
    var subject = function(api, callback) {
      return api.compileCode([], 'token', callback);
    };
    var args ={
      uri: 'https://api.particle.io/v1/binaries?access_token=token',
      method: 'POST',
      json: true,
      formData: {}
    };

    shared.behavesLikeEndpoint(subject, args);
    it('appends files correctly');

    describe('handles options in signature', function() {
      subject = function(api, callback) {
        return api.compileCode([], { deviceID: 'did', productID: 'prid', platformID: 'plid' }, 'token', callback);
      };
      args = {
        uri: 'https://api.particle.io/v1/binaries?access_token=token',
        method: 'POST',
        json: true,
        formData: {
          device_id: 'did',
          product_id: 'prid',
          platform_id: 'plid'
        }
      };

      shared.behavesLikeEndpoint(subject, args);
    });
  });

  describe('downloadBinary', function() {
    var subject = function(api, callback) {
      return api.downloadBinary('/v1/algo/123456789', 'file', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/algo/123456789?access_token=token',
      method: 'GET'
    };

    shared.behavesLikeEndpoint(subject, args);
    it('writes file correctly')
  });

  describe('sendPublicKey', function() {
    var subject = function(api, callback) {
      return api.sendPublicKey('core_id', 'buffer', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/provisioning/core_id',
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

    shared.behavesLikeEndpoint(subject, args);
    it('writes file correctly')
  });

  describe('callFunction', function() {
    var subject = function(api, callback) {
      return api.callFunction('core_id', 'function', 'arg', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/devices/core_id/function',
      method: 'POST',
      form: {
        args: 'arg',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('getEventStream', function() {
    describe('all events', function() {
      var subject = function(api, callback) {
        api.getEventStream(null, false, 'token', callback);
      };
      var args = {
        uri: 'https://api.particle.io/v1/events?access_token=token',
        method: 'GET'
      };
      shared.behavesLikeEndpoint(subject, args);
    });

    describe('single event', function() {
      var subject = function(api, callback) {
        api.getEventStream('event_name', false, 'token', callback);
      };
      var args = {
        uri: 'https://api.particle.io/v1/events/event_name?access_token=token',
        method: 'GET'
      };

      shared.behavesLikeEndpoint(subject, args);
    });

    describe('mine events', function() {
      var subject = function(api, callback) {
        api.getEventStream(null, 'mine', 'token', callback);
      };
      var args = {
        uri: 'https://api.particle.io/v1/devices/events?access_token=token',
        method: 'GET'
      };

      shared.behavesLikeEndpoint(subject, args);
    });

    describe('core events', function() {
      var subject = function(api, callback) {
        api.getEventStream(null, 'coreId', 'token', callback);
      };
      var args = {
        uri: 'https://api.particle.io/v1/devices/coreId/events?access_token=token',
        method: 'GET'
      };

      shared.behavesLikeEndpoint(subject, args);
    });
  });

  describe('publishEvent', function() {
    var subject = function(api, callback) {
      return api.publishEvent('event_name', 'data', 'token', null, callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/devices/events',
      method: 'POST',
      form: {
        name: 'event_name',
        data: 'data',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('publishEvent with optional argument', function() {
    var subject = function(api, callback) {
      return api.publishEvent('event_name', 'data', 'token', {private: false, ttl:123}, callback);
    };
    var args = {
      uri: 'https://api.spark.io/v1/devices/events',
      method: 'POST',
      form: {
        name: 'event_name',
        data: 'data',
        access_token: 'token',
        private: false,
        ttl: 123
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('createWebhook', function() {
    var subject = function(api, callback) {
      return api.createWebhook('event_name', 'url', 'core_id', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/webhooks',
      method: 'POST',
      form: {
        event: 'event_name',
        url: 'url',
        deviceid: 'core_id',
        access_token: 'token'
      },
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('deleteWebhook', function() {
    var subject = function(api, callback) {
      return api.deleteWebhook('hook_id', 'token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/webhooks/hook_id?access_token=token',
      method: 'DELETE',
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });

  describe('listWebhooks', function() {
    var subject = function(api, callback) {
      return api.listWebhooks('token', callback);
    };
    var args = {
      uri: 'https://api.particle.io/v1/webhooks/?access_token=token',
      method: 'GET',
      json: true
    };

    shared.behavesLikeEndpoint(subject, args);
  });


});
