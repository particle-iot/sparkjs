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

var when = require('when'),
    pipeline = require('when/pipeline');

var request = require('request'),
    http = require('http'),
    fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

var SparkApi = function() {
  this.clientId = "CLIENT_ID";
  this.clientSecret = "CLIENT_SECRET";
  this.baseUrl = 'https://api.spark.io';
  this.accessToken = "";
};

util.inherits(SparkApi, EventEmitter);

SparkApi.prototype.request = request;

/* login(username, password, callback)
 * Returns: promise
 * API EndPoint: GET /oauth/token
 */
SparkApi.prototype.login = function (username, password, callback) {
  var defer = when.defer();

  var handler = function(err, responses, body) {
    console.log(body);
    if (err) {
      defer.reject(err);
    } else if (body && body.access_token) {
      this.accessToken = body.access_token;
      defer.resolve(body.access_token);
    } else {
      defer.reject(body.error);
    }

    this.emit('login', err, body);

    if ('function' === typeof(callback)) {
      callback(err, body);
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
    } else if (body && body.ok){
      defer.resolve(body);
    } else {
      defer.reject(body.error);
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
    } else if (body && body.ok) {
      this.devices = body;
      defer.resolve(body);
    } else {
      defer.reject(body.error);
    }

    this.emit('listDevices', err, body);

    if ('function' === typeof(callback)) {
      callback(err, body);
    }
  }.bind(this);

  request({
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
  var defer = when.defer();

  var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  if (!username || (username === '') || (!emailRegex.test(username))) {
    var errMsg = 'Username must be an email address.';

    this.emit('createUser', errMsg, body);

    if ('function' === typeof(callback)) {
      callback(errMsg, body);
    }

    return when.reject(errMsg);
  }

  var handler = function (error, response, body) {
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

  request({
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
  var defer = when.defer();

  var handler = defaultHandler('removeAccessToken', defer, callback).bind(this);

  accessToken = accessToken || this.accessToken;

  request({
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
  var defer = when.defer();

  var handler = this.defaultHandler('claimCore', defer, callback).bind(this);

  request({
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
  var defer = when.defer();

  var handler = this.defaultHandler('removeCore', defer, callback).bind(this);

  request({
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
  var defer = when.defer();

  var handler = this.defaultHandler('renameCore', defer, callback).bind(this);

  request({
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

// TODO: Javs missing latest updates from here to the bottom.
SparkApi.prototype.getAttributes = function (coreId, callback) {
  var defer = when.defer();

  request({
    uri: this.baseUrl + "/v1/devices/" + coreId + "?access_token=" + this.accessToken,
    method: "GET",
    json: true
  }, this.defaultHandler('getAttributes', defer, callback));

  return dfd.promise;
};

SparkApi.prototype.getVariable = function (coreId, name, callback) {
  var defer = when.defer();

  request({
    uri: this.baseUrl + "/v1/devices/" + coreId + "/" + name + "?access_token=" + this.accessToken,
    method: "GET",
    json: true
  }, this.defaultHandler('getVariable', defer, callback));

  return defer.promise;
};

SparkApi.prototype.signalCore = function (coreId, beSignalling, callback) {
  var defer = when.defer();

  request({
    uri: this.baseUrl + "/v1/devices/" + coreId,
    method: "PUT",
    form: {
      signal: (beSignalling) ? 1 : 0,
      access_token: this.accessToken
    },
    json: true
  }, this.defaultHandler('signalCore', defer, callback));

  return defer.promise;
};

SparkApi.prototype.flashCore = function (coreId, files, callback) {
  var defer = when.defer();
  console.log('attempting to flash firmware to your core ' + coreId);

  var r = request({
    uri: this.baseUrl + "/v1/devices/" + coreId + "?access_token=" + this.accessToken,
    method: "PUT",
    json: true
  }, this.defaultHandler('flashCore', defer, callback));

  var form = r.form();
  for (var name in files) {
    form.append(name, fs.createReadStream(files[name]), {
      filename: files[name]
    });
  }

  return defer.promise;
};

SparkApi.prototype.compileCode = function(files, callback) {
  var defer = when.defer();
  console.log('attempting to compile firmware ');

  var r = request({
    uri: this.baseUrl + "/v1/binaries?access_token=" + this.accessToken,
    json: true
  }, this.defaultHandler('compileCode', defer, callback));

  var form = r.form();
  for (var name in files) {
    console.log("pushing file: " + files[name]);
    form.append(name, fs.createReadStream(files[name]), {
      filename: files[name]
    });
  }

  return defer.promise;
};

SparkApi.prototype.downloadBinary = function (url, filename, callback) {
  var defer = when.defer();
  var outFs = fs.createWriteStream(filename);

  console.log("grabbing binary from: " + this.baseUrl + url);
  request({
    uri: this.baseUrl + url + "?access_token=" + this.accessToken,
    method: "GET"
  }, this.defaultHandler('downloadBinary', defer, callback)).pipe(outFs);

  return defer.promise();
};

SparkApi.prototype.sendPublicKey = function (coreId, buffer, callback) {
  var defer = when.defer();
  console.log('attempting to add a new public key for core ' + coreId);

  request({
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
  }, this.defaultHandler('sendPublicKey', defer, callback));

  return defer.promise;
};

SparkApi.prototype.callFunction =  function (coreId, functionName, funcParam, callback) {
  var defer = when.defer();

  request({
    uri: this.baseUrl + "/v1/devices/" + coreId + "/" + functionName,
    method: "POST",
    form: {
      arg: funcParam,
      access_token: this.accessToken
    },
    json: true
  }, this.defaultHandler('callFunction', defer, callback));

  return defer.promise;
};

//TODO: Remove that, callback and emit event
SparkApi.prototype.getAllAttributes = function () {
  if (this._attributeCache) {
    return when.resolve(this._attributeCache);
  }

  console.log("polling server to see what cores are online, and what functions are available");

  var that = this;
  var lookupAttributes = function (cores) {
    var defer = when.defer();

    if (!cores || (cores.length === 0)) {
      console.log("No cores found.");
      that._attributeCache = null;
      defer.reject("No cores found");
    }
    else {
      var promises = [];
      for (var i = 0; i < cores.length; i++) {
        var coreid = cores[i].id;
        if (cores[i].connected) {
          promises.push(that.getAttributes(coreid));
        }
        else {
          promises.push(when.resolve(cores[i]));
        }
      }

      when.all(promises).then(function (cores) {
        //sort alphabetically
        cores = cores.sort(function (a, b) {
          return (a.name || "").localeCompare(b.name);
        });

        that._attributeCache = cores;
        defer.resolve(cores);
      });
    }
    return defer.promise;
  };

  return pipeline([
    that.listDevices.bind(that),
    lookupAttributes
  ]);
};

SparkApi.prototype.getEventStream = function (eventName, coreId, callback) {
  var url;
  if (!coreId) {
    url = "/v1/events";
  }
  else if (coreId == "mine") {
    url = "/v1/devices/events";
  }
  else {
    url = "/v1/devices/" + coreId + "/events";
  }

  if (eventName) {
    url += "/" + eventName;
  }

  console.log("Listening to: " + url);
  var requestObj = request({
    uri: this.baseUrl + url + "?access_token=" + this.accessToken,
    method: "GET"
  });

  if (callback) {
    requestObj.on('data', callback);
  }

  return requestObj;
};

SparkApi.prototype.publishEvent = function (eventName, data, callback) {
  var defer = when.defer();

  request({
    uri: this.baseUrl + "/v1/devices/events",
    method: "POST",
    form: {
      name: eventName,
      data: data,
      access_token: this.accessToken
    },
    json: true
  }, this.defaultHandler('publishEvent', defer, callback));

  return defer.promise;
};

SparkApi.prototype.createWebhook = function (event, url, coreId, callback) {
  var defer = when.defer();

  request({
    uri: this.baseUrl + "/v1/webhooks",
    method: "POST",
    form: {
      event: event,
      url: url,
      deviceid: coreId,
      access_token: this.accessToken
    },
    json: true
  }, this.defaultHandler('createWebhook', defer, callback));

  return defer.promise;
};

SparkApi.prototype.deleteWebhook = function (hookID, callback) {
  var defer = when.defer();

  request({
    uri: this.baseUrl + "/v1/webhooks/" + hookID + "?access_token=" + this.accessToken,
    method: "DELETE",
    json: true
  }, this.defaultHandler('deleteWebhook', defer, callback));

  return defer.promise;
};

SparkApi.prototype.listWebhooks = function (callback) {
  var defer = when.defer();

  request({
    uri: this.baseUrl + "/v1/webhooks/" + "?access_token=" + this.accessToken,
    method: "GET",
    json: true
  }, this.defaultHandler('listWebhooks', defer,  callback));

  return defer.promise;
};

module.exports = new SparkApi();
