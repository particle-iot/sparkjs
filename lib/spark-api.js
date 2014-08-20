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

var SparkApi = function() {
  this.request = require('request');
  this.clientId = "CLIENT_ID";
  this.clientSecret = "CLIENT_SECRET";
  this.baseUrl = 'https://api.spark.io';
  this.accessToken = "";
};

util.inherits(SparkApi, EventEmitter);

/* login(username, password, callback)
 * Returns: promise
 * API EndPoint: GET /oauth/token
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
      defer.reject(body.error);
    }

    this.emit('login', err, this.accessToken);

    if ('function' === typeof(callback)) {
      callback(err, this.accessToken);
    }
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

/* defaultHandler(eventName, defer, callback)
 * Returns: handler function
 * Description:
 *  Returns a default handler function for generic APICalls.
 */
SparkApi.prototype.defaultHandler = function(eventName, defer, callback) {
  var handler = function(err, response, body) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(body);
    }

    this.emit(eventName, err, body);

    if ('function' === typeof(callback)) {
      callback(err, body);
    }
  }.bind(this);

  return handler;
};

/* login(user, pass, callback)
 * returns: promise
 * API EndPoint: GET /v1/devices
 * Description:
 *  Returns a list of all devices registered to the user.
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

    this.emit('listDevices', err, this.devices);

    if ('function' === typeof(callback)) {
      callback(err, this.devices);
    }
  }.bind(this);

  this.request({
    uri: this.baseUrl + "/v1/devices?access_token=" + this.accessToken,
    method: "GET",
    json: true
  }, handler);

  return defer.promise;
};

/* ready()
 * Returns: boolean
 * Description:
 *  Returns true if SparkApi has an accessToken
 */
SparkApi.prototype.ready = function() {
  var hasToken = !!this.accessToken;

  return hasToken;
};

/* createUser(username, password, callback)
 * Returns: promise
 * API EndPoint: POST /v1/users
 * Description:
 *  Creates an user in the Spark cloud.
 */
SparkApi.prototype.createUser = function (username, password, callback) {
  var defer = when.defer(),
      emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  if (!username || (username === '') || (!emailRegex.test(username))) {
    var errMsg = 'Username must be an email address.';

    this.emit('createUser', errMsg, null);

    if ('function' === typeof(callback)) {
      callback(errMsg, null);
    }

    return when.reject(errMsg);
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

    this.emit('createUser', err, body);

    if ('function' === typeof(callback)) {
      callback(err, body);
    }
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

/* removeAccessToken(username, password, callback)
 * Returns: promise
 * API EndPoint: DELETE /v1/access_tokens/<access_token>
 * Description:
 *  Removes accessToken for the specified user.
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

/* claimCore(coreId, callback)
 * Returns: promise
 * API EndPoint: POST /v1/devices
 * Description:
 *  Claims a core and adds it to the user with the current accessToken.
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

/* removeCore(coreId, callback)
 * Returns: promise
 * API EndPoint: DELETE /v1/devices/<core_id>
 * Description:
 *  Removes a core from the user with the current accessToken.
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

/* renameCore(coreId, name, callback)
 * Returns: promise
 * API EndPoint: PUT /v1/devices/<core_id>
 * Description:
 *  Renames a core for the user with the current accessToken.
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

SparkApi.prototype.lookupAttributes = function (cores) {
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

SparkApi.prototype.getAllAttributes = function () {
  if (this._attributeCache) {
    return when.resolve(this._attributeCache);
  }

  // TODO: Probably bind to this in pipeline execution
  return pipeline([
    this.listDevices,
    this.lookupAttributes
  ]);
};

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

SparkApi.prototype.createWebhook = function (event, url, coreId, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('createWebhook', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/webhooks",
    method: "POST",
    form: {
      event: event,
      url: url,
      deviceid: coreId,
      access_token: this.accessToken
    },
    json: true
  }, handler);

  return defer.promise;
};

SparkApi.prototype.deleteWebhook = function (hookID, callback) {
  var defer = when.defer(),
      handler = this.defaultHandler('deleteWebhook', defer, callback).bind(this);

  this.request({
    uri: this.baseUrl + "/v1/webhooks/" + hookID + "?access_token=" + this.accessToken,
    method: "DELETE",
    json: true
  }, handler);

  return defer.promise;
};

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
