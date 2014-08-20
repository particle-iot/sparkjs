/*
 ******************************************************************************
 * @file lib/spark-api.js
 * @company Spark ( https://www.spark.io/ )
 * @source https://github.com/spark/sparkjs
 *
 * @Contributors
 *    David Middlecamp (david@spark.io)
 *    Edgar Silva (https://github.com/edgarsilva)
 *    Javier Cervantes (https://github.com/solojavier)
 *
 * @brief Basic API wrapper module
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
"use strict";

var when = require('when'),
    pipeline = require('when/pipeline');

var http = require('http'),
    fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

/**
 * Creates a new SparkApi obj
 * @constructor {SparkApi}
 */
var SparkApi = function() {
  this.request = require('request');
  this.clientId = "CLIENT_ID";
  this.clientSecret = "CLIENT_SECRET";
  this.baseUrl = 'https://api.spark.io';
  this.accessToken = "";
};

util.inherits(SparkApi, EventEmitter);

/**
 * Login to the Spark Cloud
 *
 * @this {SparkApi}
 * @param {string} username - Email for the user
 * @param {string} password
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /oauth/token
 */
SparkApi.prototype.login = function (username, password, callback) {
  var defer = when.defer();

  var handler = function(err, responses, body) {
    if (err) {
      defer.reject(err);
    } else if (body && body.access_token) {
      this.accessToken = body.access_token;
      defer.resolve(this.accessToken);
    } else {
      this.accessToken = null;
      defer.reject(new Error(body.error));
    }

    this.emitAndCallback('login', err, this.accessToken, callback);
  }.bind(this);

  this.request({
    uri: this.baseUrl + '/oauth/token',
    method: 'POST',
    json: true,
    form: {
      username: username,
      password: password,
      grant_type: 'password',
      client_id: this.clientId,
      client_secret: this.clientSecret
    }
  }, handler);

  return defer.promise;
};

/**
 * Returns a default handler for generic ApiCalls
 *
 * @this {SparkApi}
 * @param {string} eventName - The event name to be triggered
 * @param {Defer} defer - The deferer to resolve/reject the promise
 * @param {function} callback - Callback to be executed upon completion
 * @returns: {function} handler - the handler function to be passed to the request
 */
SparkApi.prototype.defaultHandler = function(eventName, defer, callback) {
  var handler = function(err, response, body) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(body);
    }

    this.emitAndCallback(eventName, err, body, callback);
  }.bind(this);

  return handler;
};

/**
 * Emits an event and executes the callback
 *
 * @this {SparkApi}
 * @param {string} eventName - Name of the event to be emitted.
 * @param {error} err - Error thrown if any, or null.
 * @param {object} params - To be passed to the callback and event emitted.
 * @param {function} callback - To be executed, only if typeof returns 'function'.
 * @returns null
 */
SparkApi.prototype.emitAndCallback = function(eventName, err, params, callback) {
  this.emit(eventName, err, params);
  if ('function' === typeof(callback)) { callback(err, params); }
};

/**
 * Returns a list of devices for the logged in user
 *
 * @this {SparkApi}
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /v1/devices
 */
SparkApi.prototype.listDevices = function (callback) {
  var defer = when.defer();

  var handler = function (err, response, body) {
    if (err) {
      defer.reject(err);
    } else {
      this.devices = Array.isArray(body) ? body : [];
      defer.resolve(body);
    }

    this.emitAndCallback('listDevices', err, this.devices, callback);
  }.bind(this);

  this.request({
    uri: this.baseUrl + "/v1/devices?access_token=" + this.accessToken,
    method: "GET",
    json: true
  }, handler);

  return defer.promise;
};

/**
 * Returns true if SparkApi has an accessToken and is able to make API calls
 *
 * @this {SparkApi}
 * @returns {boolean}
 */
SparkApi.prototype.ready = function() {
  var hasToken = !!this.accessToken;

  return hasToken;
};

/**
 * Creates an user in the Spark cloud
 *
 * @this {SparkApi}
 * @param {string} username - Email for the user to be registered
 * @param {string} password
 * @param {function} callback - To be executed upon API call completion
 * @returns {Promise}
 * @endpoint POST /v1/users
 */
SparkApi.prototype.createUser = function (username, password, callback) {
  var defer = when.defer(),
      emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  if (!username || (username === '') || (!emailRegex.test(username))) {
    var err = new Error('Username must be an email address.');

    this.emitAndCallback('createUser', err, null, callback);

    return when.reject(err);
  }

  var handler = function (err, response, body) {
    if (err) {
      defer.reject(err);
    } else if (body && body.ok) {
      this.username = username;
      this.password = password;
      defer.resolve(body);
    } else {
      defer.reject(body);
    }

    this.emitAndCallback('createUser', err, body, callback);
  }.bind(this);

  this.request({
    uri: this.baseUrl + "/v1/users",
    method: "POST",
    form: {
        username: username,
        password: password
    },
    json: true
  }, handler);

  return defer.promise;
};

/**
 * Removes accessToken from the Spark cloud for the specified user.
 *
 * @this {SparkApi}
 * @param {string} username - Email for the user to be registered
 * @param {string} password
 * @param {string} accessToken - the access_token to be removed
 * @param {function} callback - To be executed upon API call completion
 * @returns {Promise}
 * @endpoint DELETE /v1/access_tokens/<access_token>
 */
SparkApi.prototype.removeAccessToken = function (username, password, accessToken, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('removeAccessToken', defer, callback).bind(this);

  accessToken = accessToken || this.accessToken;

  this.request({
    uri: this.baseUrl + "/v1/access_tokens/" + accessToken,
    method: "DELETE",
    auth: {
      username: username,
      password: password
    },
    form: {
      access_token: accessToken
    },
    json: true
  }, handler);

  return defer.promise;
};

/**
 * Claims a core and adds it to the user currently logged in
 *
 * @param {string} coreId - The id of the Spark core you wish to claim
 * @param {function} callback
 * @returns {Promise}
 * @endpoint POST /v1/devices
 */
SparkApi.prototype.claimCore = function (coreId, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('claimCore', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/devices",
    method: "POST",
    form: {
      id: coreId,
      access_token: this.accessToken
    },
    json: true
  }, handler);

  return defer.promise;
};

/**
 * Removes a core from the user currently logged in
 *
 * @param {string} coreId - The id of the Spark core you wish to claim
 * @param {function} callback
 * @returns {Promise}
 * @endpoint DELETE /v1/devices/<core_id>
 */
SparkApi.prototype.removeCore = function (coreId, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('removeCore', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/devices/" + coreId,
    method: "DELETE",
    form: {
      id: coreId,
      access_token: this.accessToken
    },
    json: true
  }, handler);

  return defer.promise;
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
SparkApi.prototype.renameCore = function (coreId, name, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('renameCore', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/devices/" + coreId,
    method: "PUT",
    form: {
      name: name,
      access_token: this.accessToken
    },
    json: true
  }, handler);

  return defer.promise;
};

/**
 * Gets all attributes for a given core
 *
 * @param {string} coreId - The id of the Spark core you wish get attrs for
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /v1/devices/<core_id>
 */
SparkApi.prototype.getAttributes = function (coreId, callback) {
  var defer = when.defer(),
      handler =  this.defaultHandler('getAttributes', defer, callback);

  this.request({
    uri: this.baseUrl + "/v1/devices/" + coreId + "?access_token=" + this.accessToken,
    method: "GET",
    json: true
  }, handler);

  return defer.promise;
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
SparkApi.prototype.getVariable = function (coreId, name, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('getVariable', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/devices/" + coreId + "/" + name + "?access_token=" + this.accessToken,
    method: "GET",
    json: true
  }, handler);

  return defer.promise;
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
SparkApi.prototype.signalCore = function (coreId, beSignalling, callback) {
  var defer = when.defer(),
      handler =  this.defaultHandler('signalCore', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/devices/" + coreId,
    method: "PUT",
    form: {
      signal: (beSignalling) ? 1 : 0,
      access_token: this.accessToken
    },
    json: true
  }, handler);

  return defer.promise;
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
SparkApi.prototype.flashCore = function (coreId, files, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('flashCore', defer, callback).bind(this);

  var r = this.request({
    uri: this.baseUrl + "/v1/devices/" + coreId + "?access_token=" + this.accessToken,
    method: "PUT",
    json: true
  }, handler);

  var form = r.form();

  for (var name in files) {
    form.append(name, fs.createReadStream(files[name]), {
      filename: files[name]
    });
  }

  return defer.promise;
};

/**
 * Compiles files in the Spark cloud
 *
 * @param {[string]} files - An array of strings containing the files to compile
 * @param {function} callback
 * @returns {Promise}
 * @endpoint PUT /v1/binaries
 */
SparkApi.prototype.compileCode = function(files, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('compileCode', defer, callback);

  var r = this.request({
    uri: this.baseUrl + "/v1/binaries?access_token=" + this.accessToken,
    json: true
  }, handler);

  var form = r.form();

  for (var name in files) {
    //console.log("pushing file: " + files[name]);
    form.append(name, fs.createReadStream(files[name]), {
      filename: files[name]
    });
  }

  return defer.promise;
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
SparkApi.prototype.downloadBinary = function (url, filename, callback) {
  var defer = when.defer(),
      outFs = fs.createWriteStream(filename),
      handler = this.defaultHandler('downloadBinary', defer, callback).bind(this);

  //console.log("grabbing binary from: " + this.baseUrl + url);
  this.request({
    uri: this.baseUrl + url + "?access_token=" + this.accessToken,
    method: "GET"
  }, handler.pipe(outFs));

  return defer.promise();
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
SparkApi.prototype.sendPublicKey = function (coreId, buffer, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('sendPublicKey', defer, callback).bind(this);
  //console.log('attempting to add a new public key for core ' + coreId);

  this.request({
    uri: this.baseUrl + "/v1/provisioning/" + coreId,
    method: "POST",
    form: {
      deviceID: coreId,
      publicKey: buffer.toString(),
      order: "manual_" + ((new Date()).getTime()),
      filename: "cli",
      access_token: this.accessToken
    },
    json: true
  }, handler);

  return defer.promise;
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
SparkApi.prototype.callFunction = function (coreId, functionName, funcParam, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('callFunction', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/devices/" + coreId + "/" + functionName,
    method: "POST",
    form: {
      arg: funcParam,
      access_token: this.accessToken
    },
    json: true
  }, handler);

  return defer.promise;
};

/**
 * Lookup all attrs for a list of Cores
 *
 * @param {[string]} cores - An array of all the cores to get attributes for
 * @returns {Promise}
 */
SparkApi.prototype.lookupAttributesForAll = function (cores) {
  var defer = when.defer();

  if (!cores || (cores.length === 0)) {
    this._attributeCache = null;
  } else {
    var promises = [];

    for (var i = 0; i < cores.length; i++) {
      var coreid = cores[i].id;

      if (cores[i].connected) {
        promises.push(this.getAttributes(coreid));
      } else {
        promises.push(when.resolve(cores[i]));
      }
    }

    when.all(promises).then(function (cores) {
      //sort alphabetically
      cores = cores.sort(function (a, b) {
        return (a.name || "").localeCompare(b.name);
      });

      this._attributeCache = cores;

      defer.resolve(cores);
    });
  }

  return defer.promise;
};

/**
 * Retrieves all attributes for all cores for the currently logged in user
 *
 * @returns {Promise}
 */
SparkApi.prototype.getAttributesForAll = function () {
  if (this._attributeCache) {
    return when.resolve(this._attributeCache);
  }

  // TODO: Probably bind to this in pipeline execution
  return pipeline([
    this.listDevices,
    this.lookupAttributesForAll
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
SparkApi.prototype.getEventStream = function (eventName, coreId, callback) {
  var url;

  if (!coreId) {
    url = "/v1/events";
  } else if (coreId == "mine") {
    url = "/v1/devices/events";
  } else {
    url = "/v1/devices/" + coreId + "/events";
  }

  if (eventName) {
    url += "/" + eventName;
  }

  var requestObj = this.request({
    uri: this.baseUrl + url + "?access_token=" + this.accessToken,
    method: "GET"
  });

  if (callback) {
    requestObj.on('data', callback);
  }

  return requestObj;
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
SparkApi.prototype.publishEvent = function (eventName, data, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('publishEvent', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/devices/events",
    method: "POST",
    form: {
      name: eventName,
      data: data,
      access_token: this.accessToken
    },
    json: true
  }, this);

  return defer.promise;
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
SparkApi.prototype.createWebhook = function (eventName, url, coreId, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('createWebhook', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/webhooks",
    method: "POST",
    form: {
      event: eventName,
      url: url,
      deviceid: coreId,
      access_token: this.accessToken
    },
    json: true
  }, handler);

  return defer.promise;
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
SparkApi.prototype.deleteWebhook = function (hookId, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('deleteWebhook', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/webhooks/" + hookId + "?access_token=" + this.accessToken,
    method: "DELETE",
    json: true
  }, handler);

  return defer.promise;
};

/**
 * Gets a list of all webhooks
 *
 * @param {function} callback
 * @endpoint GET /v1/webhooks
 *
 * @returns {Promise}
 */
SparkApi.prototype.listWebhooks = function (callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('listWebhooks', defer,  callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/webhooks/" + "?access_token=" + this.accessToken,
    method: "GET",
    json: true
  }, handler);

  return defer.promise;
};

module.exports = new SparkApi();
