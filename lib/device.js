Device = function (id, api) {
  this.id = id;
  this._api = api;
  this.name = null;
  this.connected = false;
  this.variables = null;
  this.functions = null;
  this.version   = null;
  this.requiresUpdate = false;

  api.getAttributes(this.id).then(
    function(attributes) {
      this.name = attributes.name;
      this.connected = !!attributes.connected;
      this.variables = attributes.variables;
      this.functions = attributes.functions;
      this.version = attributes.cc3000_patch_version;
      this.requiresUpdate = !!attributes.requires_deep_update;
    }.bind(this),
    function(err) {
      console.log('Failed to get attributes for device ' + this.id + ':' + err);
    }
  );
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

Device.prototype.rename = function(name, callback) {
  return this._api.renameCore(this.id, name, callback);
};
