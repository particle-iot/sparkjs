/*
 ******************************************************************************
 * @file lib/spark.js
 * @company Spark ( https://www.spark.io/ )
 * @source https://github.com/spark/sparkjs
 *
 * @Contributors
 *    David Middlecamp (david@spark.io)
 *    Edgar Silva (https://github.com/edgarsilva)
 *    Javier Cervantes (https://github.com/solojavier)
 *
 * @brief Main Spark Api class
 ******************************************************************************
  Copyright (c) 2014 Spark Labs, Inc.  All rights reserved.

  This program is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation, either
  version 3 of the License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this program; if not, see <http://www.gnu.org/licenses/>.
  ******************************************************************************
 */

/*jslint node: true */
'use strict';

var when = require('when'),
    pipeline = require('when/pipeline');

var fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    Device = require('./device'),
    SparkApi = require('./spark-api');

/**
 * Creates a new Spark obj
 * @constructor {Spark}
 */
var Spark = function() {
  this.clientId = 'Spark';
  this.clientSecret = 'Spark';
  this.baseUrl = 'https://api.spark.io';
  this.accessToken = null;
  this.plugins = [];
  this.devices = [];
  this.api = new SparkApi({
    clientId: this.clientId,
    clientSecret: this.clientSecret,
    baseUrl: this.baseUrl
  });
};

util.inherits(Spark, EventEmitter);

/**
 * Resolves an api response
 *
 * @this {Spark}
 * @param {string} defer - The defer object that will be resolved
 * @param {string} err - The error returned from reponse
 * @param {object} data - The data of the response
 * @param {function} callback - Function to execute on complete
 * @returns: null
 */
Spark.prototype.resolveDefer = function(defer, err, data, callback) {
  if (defer) {
    if (err) {
      defer.reject(err);
    } else{
      defer.resolve(data);
    }
  }
};
/**
 * Creates and returns a defet obj based on listeners and callback provided.
 *
 * @this {Spark}
 * @param {string} eventName
 * @param {function} callback
 * @returns: null
 */
Spark.prototype.createDefer = function(eventName, callback) {
  var defer = null;

  if (!callback && (this.listeners(eventName).length === 0)) {
    defer = when.defer();
  }

  return defer;
};

/**
 * Returns a default normalized err, created either by request or by response
 *
 * @this {Spark}
 * @param {Err} err - The err returned by request
 * @param {Object} data - Data returned by request
 * @param {function} callback - Callback to be executed upon completion
 * @returns: {Error} err - Normalized error
 */
Spark.prototype.normalizeErr = function(err, data, callback) {
  if (!err && data.error) {
    err = new Error(data.error);
  }

  return err;
};

/**
 * Emits an event and executes the callback
 *
 * @this {Spark}
 * @param {string} eventName - Name of the event to be emitted.
 * @param {error} err - Error thrown if any, or null.
 * @param {object} params - To be passed to the callback and event emitted.
 * @param {function} callback - To be executed, only if typeof returns 'function'.
 * @returns null
 */
Spark.prototype.emitAndCallback = function(eventName, err, data, callback) {
  if (!!err) { data = null; }
  this.emit(eventName, err, data);
  if ('function' === typeof(callback)) { callback(err, data); }
};

/**
 * Returns a default handler for generic ApiCalls
 *
 * @this {Spark}
 * @param {string} eventName - The event name to be triggered
 * @param {Defer} defer - The deferer to resolve/reject the promise
 * @param {function} userCb - Callback passed by the user to be executed on completion of request
 * @param {function} sparkCb - Callback created to setup attrs on request completion
 * @returns: {function} handler - the handler function to be passed to the request
 */
Spark.prototype.defaultHandler = function(eventName, defer, userCb, sparkCb) {
  var handler = function(err, response, data) {
    err = this.normalizeErr(err, data);
    if (!err && (typeof(sparkCb) === 'function')) { sparkCb(data); }
    this.resolveDefer(defer, err, data);
    this.emitAndCallback(eventName, err, data, userCb);
  }.bind(this);

  return handler;
};

Spark.prototype.include = function(plugins) {
  plugins = (Array.isArray(plugins) ? plugins : [plugins]);

  for (var i in plugins) {
    if (this.plugins.indexOf(plugins[i]) == -1) {
      this.plugins.push(plugins[i]);
    }
  }

};

/**
 * Login to the Spark Cloud
 *
 * @param {string} username - Email for the user
 * @param {string} password
 * @param {callback} callback(err, data)
 * @returns {Promise}
 * @endpoint GET /oauth/token
 */
Spark.prototype.login = function (params, callback) {
  var defer = this.createDefer('login', callback);

  var handler = this.defaultHandler('login', defer, callback, function(data) {
    this.accessToken = data.access_token || data.accessToken;
  }.bind(this));

  if (params.accessToken) {
    handler(null, params, params);
  } else {
    this.api.login(params, handler);
  }

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Returns a list of devices for the logged in user
 *
 * @this {Spark}
 * @param {function} callback(err, data)
 * @returns {Promise}
 * @endpoint GET /v1/devices
 */
Spark.prototype.listDevices = function (callback) {
  var defer = this.createDefer('listDevices', callback);

  var handler = function(err, response, data) {
    err = this.normalizeErr(err, data);
    this.devices = [];
    if (Array.isArray(data)) {
      for (var i in data) {
        this.devices.push(new Device(data[i], this));
      }
    }
    this.resolveDefer(defer, err, this.devices);
    this.emitAndCallback('listDevices', err, this.devices, callback);
  }.bind(this);

  this.api.listDevices({ accessToken: this.accessToken }, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Returns true if Spark has an accessToken and is able to make API calls
 *
 * @this {Spark}
 * @returns {boolean}
 */
Spark.prototype.ready = function() {
  return !!this.accessToken;
};

/**
 * Creates an user in the Spark cloud
 *
 * @this {Spark}
 * @param {string} username - Email for the user to be registered
 * @param {string} password
 * @param {function} callback(err, data) - To be executed upon API call completion
 * @returns {Promise}
 * @endpoint POST /v1/users
 */
Spark.prototype.createUser = function (username, password, callback) {
  var defer = this.createDefer('createUser', callback),
      emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  if (!username || (username === '') || (!emailRegex.test(username))) {
    var err = new Error('Username must be an email address.');
    this.emitAndCallback('createUser', err, null, callback);
    if (!!defer) { defer.reject(err); }
  } else {
    var handler = this.defaultHandler('createUser', defer, callback, function(data) {
      this.username = username;
      this.password = password;
    }.bind(this));

    this.api.createUser(username, password, handler);
  }

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Removes accessToken from the Spark cloud for the specified user.
 *
 * @this {Spark}
 * @param {string} username - Email for the user to be registered
 * @param {string} password
 * @param {string} accessToken - the access_token to be removed
 * @param {function} callback(err, data) - To be executed upon API call completion
 * @returns {Promise}
 * @endpoint DELETE /v1/access_tokens/<access_token>
 */
Spark.prototype.removeAccessToken = function (username, password, accessToken, callback) {
  var defer = this.createDefer('removeAccessToken', callback),
      handler = this.defaultHandler('removeAccessToken', defer, callback).bind(this);

  accessToken = accessToken || this.accessToken;

  this.api.removeAccessToken(username, password, accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Claims a core and adds it to the user currently logged in
 *
 * @param {string} coreId - The id of the Spark core you wish to claim
 * @param {function} callback
 * @returns {Promise}
 * @endpoint POST /v1/devices
 */
Spark.prototype.claimCore = function (coreId, callback) {
  var defer = this.createDefer('claimCore', callback),
      handler = this.defaultHandler('claimCore', defer, callback).bind(this);

  this.api.claimCore(coreId, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Removes a core from the user currently logged in
 *
 * @param {string} coreId - The id of the Spark core you wish to claim
 * @param {function} callback
 * @returns {Promise}
 * @endpoint DELETE /v1/devices/<core_id>
 */
Spark.prototype.removeCore = function (coreId, callback) {
  var defer = this.createDefer('removeCore', callback),
      handler = this.defaultHandler('removeCore', defer, callback).bind(this);

  this.api.removeCore(coreId, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Renames a core for the user currently logged in
 *
 * @param {string} coreId - The id of the Spark core you wish to claim
 * @param {string} name - New core name
 * @param {function} callback
 * @returns {Promise}
 * @endpoint PUT /v1/devices/<core_id>
 */
Spark.prototype.renameCore = function (coreId, name, callback) {
  var defer = this.createDefer('renameCore', callback),
      handler = this.defaultHandler('renameCore', defer, callback).bind(this);

  this.api.renameCore(coreId, name, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Gets all attributes for a given core
 *
 * @param {string} coreId - The id of the Spark core you wish get attrs for
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /v1/devices/<core_id>
 */
Spark.prototype.getAttributes = function (coreId, callback) {
  var defer = this.createDefer('getAttributes', callback),
      handler =  this.defaultHandler('getAttributes', defer, callback);

  this.api.getAttributes(coreId, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Gets an attribute for a specific Core
 *
 * @param {string} coreId - The id of the Spark core you wish get attrs for
 * @param {string} name - The name of the variable/attr to retrieve
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /v1/devices/<core_id>/<variable_name>
 */
Spark.prototype.getVariable = function (coreId, name, callback) {
  var defer = this.createDefer('getVariable', callback),
      handler = this.defaultHandler('getVariable', defer, callback).bind(this);

  this.api.getVariable(coreId, name, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Send a signal to a Core
 *
 * @param {string} coreId - The id of the Spark core you wish to signal
 * @param {boolean} name - If the core should be emitting signals or not
 * @param {function} callback
 * @returns {Promise}
 * @endpoint PUT /v1/devices/<core_id>
 */
Spark.prototype.signalCore = function (coreId, beSignalling, callback) {
  var defer = this.createDefer('signalCore', callback),
      handler = this.defaultHandler('signalCore', defer, callback).bind(this);

  this.api.signalCore(coreId, beSignalling, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Flash Tinker firmware to a Core
 *
 * @param {string} coreId - The id of the Spark core you wish to signal
 * @param {function} callback
 * @returns {Promise}
 * @endpoint PUT /v1/devices/<core_id>
 */
Spark.prototype.flashTinker = function (coreId, callback) {
  var defer = this.createDefer('flashTinker', callback),
      handler = this.defaultHandler('flashTinker', defer, callback).bind(this);

  this.api.flashTinker(coreId, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Flash firmware to a Core
 *
 * @param {string} coreId - The id of the Spark core you wish to signal
 * @param {[string]} files - An array of strings containing the files to flash
 * @param {function} callback
 * @returns {Promise}
 * @endpoint PUT /v1/devices/<core_id>
 */
Spark.prototype.flashCore = function (coreId, files, callback) {
  var defer = this.createDefer('flashCore', callback),
      handler = this.defaultHandler('flashCore', defer, callback).bind(this);

  this.api.flashCore(coreId, files, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Compiles files in the Spark cloud
 *
 * @param {[string]} files - An array of strings containing the files to compile
 * @param {function} callback
 * @returns {Promise}
 * @endpoint PUT /v1/binaries
 */
Spark.prototype.compileCode = function(files, callback) {
  var defer = this.createDefer('compileCode', callback),
      handler = this.defaultHandler('compileCode', defer, callback);

  this.api.compileCode(files, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Download binary file from the spark cloud
 *
 * @param {string} url - The url for the binary
 * @param {string} filename
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /<url>
 */
Spark.prototype.downloadBinary = function (url, filename, callback) {
  var defer = this.createDefer('downloadBinary', callback),
      outFs = fs.createWriteStream(filename),
      handler = this.defaultHandler('downloadBinary', defer, callback).bind(this);

  this.api.downloadBinary(url, filename, this.accessToken, handler).pipe(outFs);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Sends a public key to the Spark cloud
 *
 * @param {string} coreId - The id of the Core
 * @param {Buffer} buffer - The buffer for the public key
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /v1/provisioning/<core_id>
 */
Spark.prototype.sendPublicKey = function (coreId, buffer, callback) {
  var defer = this.createDefer('sendPublicKey', callback),
      handler = this.defaultHandler('sendPublicKey', defer, callback).bind(this);

  this.api.sendPublicKey(coreId, buffer, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Call a function on a Core
 *
 * @param {string} coreId - The id of the Core
 * @param {string} functionName - The name of the function to call
 * @param {string} funcParam - Param for the function
 * @returns {Promise}
 * @endpoint GET /v1/devices/<core_id>/<function_name>
 */
Spark.prototype.callFunction = function (coreId, functionName, funcParam, callback) {
  var defer = this.createDefer('callFunction', callback),
      handler = this.defaultHandler('callFunction', defer, callback).bind(this);

  this.api.callFunction(coreId, functionName, funcParam, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Lookup all attrs for a list of Cores
 *
 * @param {[string]} cores - An array of all the cores to get attributes for
 * @returns {Promise}
 */
Spark.prototype.lookupAttributesForAll = function (cores) {
  var defer = this.createDefer('lookupAttributesForAll', null);

  if (!cores || (cores.length === 0)) {
    this._attributeCache = null;
  } else {
    var promises = [];

    for (var i = 0; i < cores.length; i++) {
      var coreId = cores[i].id;

      if (cores[i].connected) {
        promises.push(this.getAttributes(coreId));
      } else {
        promises.push(when.resolve(cores[i]));
      }
    }

    when.all(promises).then(function (cores) {
      //sort alphabetically
      cores = cores.sort(function (a, b) {
        return (a.name || '').localeCompare(b.name);
      });

      this._attributeCache = cores;
      defer.resolve(cores);
    }.bind(this));
  }

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Retrieves all attributes for all cores for the currently logged in user
 *
 * @returns {Promise}
 */
Spark.prototype.getAttributesForAll = function () {
  if (this._attributeCache) {
    return when.resolve(this._attributeCache);
  }

  // TODO: Probably bind to this in pipeline execution
  return pipeline([
    this.listDevices.bind(this),
    this.lookupAttributesForAll.bind(this)
  ]);
};

/**
 * Get eventListener to an event stream in the Spark cloud
 *
 * @param {string} eventName - Event to register
 * @param {[string]} coreId - Optional Id for the core for which to get the listener
 * @param {function} callback
 * @endpoint GET /v1/devices/<core_id>/events
 *
 * @returns {Request}
 */
Spark.prototype.getEventStream = function (eventName, coreId, callback) {
  var requestObj = this.api.getEventStream(eventName, coreId, this.accessToken);

  if (callback) {
    requestObj.on('data', function(event) {
      event = event.toString().replace('\n', '');
      if ((event !== '') && (typeof(callback) === 'function')) { callback(event); }
    });
  }

  return requestObj;
};

/**
 * Subscribe callback to a global event in the Spark cloud
 *
 * @param {string} eventName - Event to listen
 * @param {function} callback
 *
 * @returns {Request}
 */
Spark.prototype.onEvent = function(eventName, callback) {
  this.getEventStream(eventName, false, callback);
};

/**
 * Register an event stream in the Spark cloud
 *
 * @param {string} eventName - Event to register
 * @param {string} data - To be passed to the to the event
 * @param {function} callback
 * @endpoint POST /v1/devices/events
 *
 * @returns {Promise}
 */
Spark.prototype.publishEvent = function (eventName, data, callback) {
  var defer = this.createDefer('publishEvent', callback),
      handler = this.defaultHandler('publishEvent', defer, callback).bind(this);

  this.api.publishEvent(eventName, data, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Creates a new webhook in the Spark cloud
 *
 * @param {string} eventName - Event to register
 * @param {string} url - To hook to
 * @param {string} coreId - Id of the Core
 * @param {function} callback
 * @endpoint POST /v1/webhooks
 *
 * @returns {Promise}
 */
Spark.prototype.createWebhook = function (eventName, url, coreId, callback) {
  var defer = this.createDefer('createWebhook', callback),
      handler = this.defaultHandler('createWebhook', defer, callback).bind(this);

  this.api.createWebhook(eventName, url, coreId, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Deletes a webhook
 *
 * @param {string} hookId - Id of the webhook
 * @param {function} callback
 * @endpoint DELETE /v1/webhooks/<hook_id>
 *
 * @returns {Promise}
 */
Spark.prototype.deleteWebhook = function (hookId, callback) {
  var defer = this.createDefer('deleteWebhook', callback),
      handler = this.defaultHandler('deleteWebhook', defer, callback).bind(this);

  this.api.deleteWebhook(hookId, this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

/**
 * Gets a list of all webhooks
 *
 * @param {function} callback
 * @endpoint GET /v1/webhooks
 *
 * @returns {Promise}
 */
Spark.prototype.listWebhooks = function (callback) {
  var defer = this.createDefer('listWebhooks', callback),
      handler = this.defaultHandler('listWebhooks', defer,  callback).bind(this);

  this.api.listWebhooks(this.accessToken, handler);

  var promise = (!!defer) ? defer.promise : null;
  return promise;
};

module.exports = new Spark();
