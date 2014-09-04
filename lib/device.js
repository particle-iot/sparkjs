Device = function (attributes, api) {
  this._api = api;

  for (var key in attributes) {
    this[key] = attributes[key];
  }
};

Device.prototype.claim = function(callback) {
  return this._api.claimCore(this.id, callback);
};

Device.prototype.remove = function(callback) {
  return this._api.removeCore(this.id, callback);
};

Device.prototype.rename = function(name, callback) {
  return this._api.renameCore(this.id, name, callback);
};

Device.prototype.signal = function(callback) {
  return this._api.signalCore(this.id, true, callback);
};

Device.prototype.stopSignal = function(callback) {
  return this._api.signalCore(this.id, false, callback);
};

Device.prototype.flash = function(files, callback) {
  return this._api.flashCore(this.id, files, callback);
};

Device.prototype.sendPublicKey = function(buffer, callback) {
  return this._api.sendPublicKey(this.id, buffer, callback);
};

Device.prototype.call = function(name, params, callback) {
  return this._api.callFunction(this.id, name, params, callback);
};

Device.prototype.subscribe = function(eventName, callback) {
  return this._api.getEventStream(eventName, this.id, callback);
};

Device.prototype.createWebhook = function(eventName, url, callback) {
  return this._api.createWebhook(eventName, url, this.id, callback);
};

Device.prototype.getVariable = function(name, callback) {
  return this._api.getVariable(this.id, name, callback);
};

Device.prototype.update = function() {
  this._api.getAttributes(this.id).then(
    function(attributes) {
      this.name = attributes.name;
      this.connected = !!attributes.connected;
      this.variables = attributes.variables;
      this.functions = attributes.functions;
      this.version = attributes.cc3000_patch_version;
      this.requiresUpdate = !!attributes.requires_deep_update;
      console.log('Device updated succesfully');
    }.bind(this),
    function(err) {
      console.log('Failed to get attributes for device ' + this.id + ':' + err);
    }.bind(this)
  );
};

module.exports = Device;
