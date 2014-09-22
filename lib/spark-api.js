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
 * @brief Basic API request handler
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

var fs = require('fs'),
    path = require('path');

/**
 * Creates a new SparkApi obj
 * @constructor {SparkApi}
 * @param {Object} args - { clientId: 'clientId', clientSecret: 'clientSecret', baseUrl: 'http://baseurl.com' }
 */
var SparkApi = function(args) {
  this.request = require('request');
  this.clientId = args.clientId;
  this.clientSecret = args.clientSecret;
  this.baseUrl = args.baseUrl;
};

/**
 * Login to the Spark Cloud
 *
 * @param {Object} params - { username, password }
 * @param {callback} callback(err, data)
 * @returns {Promise}
 * @endpoint GET /oauth/token
 */
SparkApi.prototype.login = function (params, callback) {
  this.request({
    uri: this.baseUrl + '/oauth/token',
    method: 'POST',
    json: true,
    form: {
      username: params.username,
      password: params.password,
      grant_type: 'password',
      client_id: this.clientId,
      client_secret: this.clientSecret
    }
  }, callback);
};

/**
 * Returns a list of devices for the logged in user
 *
 * @this {SparkApi}
 * @param {object} params - { accessToken }
 * @param {function} callback(err, data)
 * @returns {Promise}
 * @endpoint GET /v1/devices
 */
SparkApi.prototype.listDevices = function (params, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices?access_token=' + params.accessToken,
    method: 'GET',
    json: true
  }, callback);
};

/**
 * Returns an object describing a core device
 *
 * @this {SparkApi}
 * @param {object} params - { deviceId, accessToken }
 * @param {function} callback(err, data)
 * @returns {Promise}
 * @endpoint GET /v1/devices
 */
SparkApi.prototype.getDevice = function (params, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices/' + params.deviceId + '?access_token=' + params.accessToken,
    method: 'GET',
    json: true
  }, callback);
};

/**
 * Creates an user in the Spark cloud
 *
 * @this {SparkApi}
 * @param {string} username - Email for the user to be registered
 * @param {string} password
 * @param {function} callback(err, data) - To be executed upon API call completion
 * @returns {Promise}
 * @endpoint POST /v1/users
 */
SparkApi.prototype.createUser = function (username, password, callback) {
  this.request({
    uri: this.baseUrl + '/v1/users',
    method: 'POST',
    form: {
      username: username,
      password: password
    },
    json: true
  }, callback);
};

/**
 * Removes accessToken from the Spark cloud for the specified user.
 *
 * @this {SparkApi}
 * @param {string} username - Email for the user to be registered
 * @param {string} password
 * @param {string} accessToken - the access_token to be removed
 * @param {function} callback(err, data) - To be executed upon API call completion
 * @returns {Promise}
 * @endpoint DELETE /v1/access_tokens/<access_token>
 */
SparkApi.prototype.removeAccessToken = function (username, password, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/access_tokens/' + accessToken,
    method: 'DELETE',
    auth: {
      username: username,
      password: password
    },
    form: {
      access_token: accessToken
    },
    json: true
  }, callback);
};

/**
 * Claims a core and adds it to the user currently logged in
 *
 * @param {string} coreId - The id of the Spark core you wish to claim
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @returns {Promise}
 * @endpoint POST /v1/devices
 */
SparkApi.prototype.claimCore = function (coreId, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices',
    method: 'POST',
    form: {
      id: coreId,
      access_token: accessToken
    },
    json: true
  }, callback);
};

/**
 * Removes a core from the user currently logged in
 *
 * @param {string} coreId - The id of the Spark core you wish to claim
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @returns {Promise}
 * @endpoint DELETE /v1/devices/<core_id>
 */
SparkApi.prototype.removeCore = function (coreId, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices/' + coreId,
    method: 'DELETE',
    form: {
      id: coreId,
      access_token: accessToken
    },
    json: true
  }, callback);
};

/**
 * Renames a core for the user currently logged in
 *
 * @param {string} coreId - The id of the Spark core you wish to claim
 * @param {string} name - New core name
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @returns {Promise}
 * @endpoint PUT /v1/devices/<core_id>
 */
SparkApi.prototype.renameCore = function (coreId, name, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices/' + coreId,
    method: 'PUT',
    form: {
      name: name,
      access_token: accessToken
    },
    json: true
  }, callback);
};

/**
 * Gets all attributes for a given core
 *
 * @param {string} coreId - The id of the Spark core you wish get attrs for
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /v1/devices/<core_id>
 */
SparkApi.prototype.getAttributes = function (coreId, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices/' + coreId + '?access_token=' + accessToken,
    method: 'GET',
    json: true
  }, callback);
};

/**
 * Gets an attribute for a specific Core
 *
 * @param {string} coreId - The id of the Spark core you wish get attrs for
 * @param {string} name - The name of the variable/attr to retrieve
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /v1/devices/<core_id>/<variable_name>
 */
SparkApi.prototype.getVariable = function (coreId, name, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices/' + coreId + '/' + name + '?access_token=' + accessToken,
    method: 'GET',
    json: true
  }, callback);
};

/**
 * Send a signal to a Core
 *
 * @param {string} coreId - The id of the Spark core you wish to signal
 * @param {boolean} name - If the core should be emitting signals or not
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @returns {Promise}
 * @endpoint PUT /v1/devices/<core_id>
 */
SparkApi.prototype.signalCore = function (coreId, beSignalling, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices/' + coreId,
    method: 'PUT',
    form: {
      signal: (beSignalling) ? 1 : 0,
      access_token: accessToken
    },
    json: true
  }, callback);
};

/**
 * Flash Tinker firmware to a Core
 *
 * @param {string} coreId - The id of the Spark core you wish to signal
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @returns {Promise}
 * @endpoint PUT /v1/devices/<core_id>
 */
SparkApi.prototype.flashTinker = function (coreId, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices/' + coreId,
    method: 'PUT',
    form: {
      access_token: accessToken,
      app: 'tinker'
    },
    json: true
  }, callback);
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
SparkApi.prototype.flashCore = function (coreId, files, accessToken, callback) {
  files = Array.isArray(files) ? files : [files];

  var r = this.request({
    uri: this.baseUrl + '/v1/devices/' + coreId + '?access_token=' + accessToken,
    method: 'PUT',
    json: true
  }, callback);

  var form = r.form(),
      paramName = 'file';

  for (var i in files) {
    form.append(paramName, fs.createReadStream(path.join(process.cwd(), files[i])), {
      filename: path.basename(files[i])
    });
    paramName = 'file' + i;
  }
};

/**
 * Compiles files in the Spark cloud
 *
 * @param {[string]} files - An array of strings containing the files to compile
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @returns {Promise}
 * @endpoint PUT /v1/binaries
 */
SparkApi.prototype.compileCode = function(files, accessToken, callback) {
  files = Array.isArray(files) ? files : [files];

  var r = this.request({
    uri: this.baseUrl + '/v1/binaries?access_token=' + accessToken,
    method: 'POST',
    json: true
  }, callback);

  var form = r.form(),
      paramName = 'file';

  for (var i in files) {
    form.append(i, fs.createReadStream(path.join(process.cwd(), files[i])), {
      filename: path.basename(files[i])
    });
    paramName = 'file' + i;
  }
};

/**
 * Download binary file from the spark cloud
 *
 * @param {string} url - The url for the binary
 * @param {string} filename
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /<url>
 */
SparkApi.prototype.downloadBinary = function (url, filename, accessToken, callback) {
  var response = this.request({
    uri: this.baseUrl + url + '?access_token=' + accessToken,
    method: 'GET'
  }, callback);

  return response;
};

/**
 * Sends a public key to the Spark cloud
 *
 * @param {string} coreId - The id of the Core
 * @param {Buffer} buffer - The buffer for the public key
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @returns {Promise}
 * @endpoint GET /v1/provisioning/<core_id>
 */
SparkApi.prototype.sendPublicKey = function (coreId, buffer, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/provisioning/' + coreId,
    method: 'POST',
    form: {
      deviceID: coreId,
      publicKey: buffer.toString(),
      order: 'manual_' + ((new Date()).getTime()),
      filename: 'cli',
      access_token: accessToken
    },
    json: true
  }, callback);
};

/**
 * Call a function on a Core
 *
 * @param {string} coreId - The id of the Core
 * @param {string} functionName - The name of the function to call
 * @param {string} funcParam - Param for the function
 * @param {string} accessToken - current access token
 * @returns {Promise}
 * @endpoint GET /v1/devices/<core_id>/<function_name>
 */
SparkApi.prototype.callFunction = function (coreId, functionName, funcParam, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices/' + coreId + '/' + functionName,
    method: 'POST',
    form: {
      args: funcParam,
      access_token: accessToken
    },
    json: true
  }, callback);
};

/**
 * Get eventListener to an event stream in the Spark cloud
 *
 * @param {string} url - Url for the event stream
 * @param {string} accessToken - current access token
 * @endpoint GET /v1/devices/<core_id>/events
 *
 * @returns {Request}
 */
SparkApi.prototype.getEventStream = function (eventName, coreId, accessToken) {
  var url;

  if (!coreId) {
    url = '/v1/events';
  } else if (coreId == 'mine') {
    url = '/v1/devices/events';
  } else {
    url = '/v1/devices/' + coreId + '/events';
  }

  if (eventName) {
    url += '/' + eventName;
  }

  var requestObj = this.request({
    uri: this.baseUrl + url + '?access_token=' + accessToken,
    method: 'GET'
  });

  return requestObj;
};

/**
 * Register an event stream in the Spark cloud
 * (This feature is in a limited beta, and is not yet generally available)
 *
 * @param {string} eventName - Event to register
 * @param {string} data - To be passed to the to the event
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @endpoint POST /v1/devices/events
 *
 * @returns {Promise}
 */
SparkApi.prototype.publishEvent = function (eventName, data, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/devices/events',
    method: 'POST',
    form: {
      name: eventName,
      data: data,
      access_token: accessToken
    },
    json: true
  }, callback);
};

/**
 * Creates a new webhook in the Spark cloud
 * (Spark server implementation is WIP)
 *
 * @param {string} eventName - Event to register
 * @param {string} url - To hook to
 * @param {string} coreId - Id of the Core
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @endpoint POST /v1/webhooks
 *
 * @returns {Promise}
 */
SparkApi.prototype.createWebhook = function (eventName, url, coreId, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/webhooks',
    method: 'POST',
    form: {
      event: eventName,
      url: url,
      deviceid: coreId,
      access_token: accessToken
    },
    json: true
  }, callback);
};

/**
 * Deletes a webhook
 * (Spark server implementation is WIP)
 *
 * @param {string} hookId - Id of the webhook
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @endpoint DELETE /v1/webhooks/<hook_id>
 *
 * @returns {Promise}
 */
SparkApi.prototype.deleteWebhook = function (hookId, accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/webhooks/' + hookId + '?access_token=' + accessToken,
    method: 'DELETE',
    json: true
  }, callback);
};

/**
 * Gets a list of all webhooks
 * (Spark server implementation is WIP)
 *
 * @param {string} accessToken - current access token
 * @param {function} callback
 * @endpoint GET /v1/webhooks
 *
 * @returns {Promise}
 */
SparkApi.prototype.listWebhooks = function (accessToken, callback) {
  this.request({
    uri: this.baseUrl + '/v1/webhooks/?access_token=' + accessToken,
    method: 'GET',
    json: true
  }, callback);
};

module.exports = SparkApi;
