/*
 ******************************************************************************
 * @file lib/device.js
 * @company Spark ( https://www.spark.io/ )
 * @source https://github.com/spark/sparkjs
 *
 * @Contributors
 *    David Middlecamp (david@spark.io)
 *    Edgar Silva (https://github.com/edgarsilva)
 *    Javier Cervantes (https://github.com/solojavier)
 *
 * @brief Basic Device class
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

var Device = function (attributes, spark) {
  this._spark = spark;
  this.attributes = {};
  this._updateAttrs(attributes);
  this.requirePlugins();
};

Device.prototype.remove = function(callback) {
  return this._spark.removeCore(this.id, callback);
};

Device.prototype.rename = function(name, callback) {
  return this._spark.renameCore(this.id, name, callback);
};

Device.prototype.signal = function(callback) {
  return this._spark.signalCore(this.id, true, callback);
};

Device.prototype.stopSignal = function(callback) {
  return this._spark.signalCore(this.id, false, callback);
};

Device.prototype.flash = function(files, callback) {
  return this._spark.flashCore(this.id, files, callback);
};

Device.prototype.sendPublicKey = function(buffer, callback) {
  return this._spark.sendPublicKey(this.id, buffer, callback);
};

Device.prototype.callFunction = function(name, params, callback) {
  return this._spark.callFunction(this.id, name, params, callback);
};

Device.prototype.subscribe = function(eventName, callback) {
  return this._spark.getEventStream(eventName, this.id, callback);
};

Device.prototype.createWebhook = function(eventName, url, callback) {
  return this._spark.createWebhook(eventName, url, this.id, callback);
};

Device.prototype.getVariable = function(name, callback) {
  return this._spark.getVariable(this.id, name, callback);
};

Device.prototype.getAttributes = function(callback) {
  this._spark.getAttributes(this.id, function(err, data) {
    if (!err) {
      this._updateAttrs(data);
    }
    callback(err, data);
  }.bind(this));
};

Device.prototype.onEvent = function(eventName, callback) {
  return this._spark.getEventStream(eventName, this.id, callback);
};

Device.prototype._updateAttrs = function(attrs) {
  var replacer = function(match){
    return match.toUpperCase().replace('_','');
  };

  var tmpKey = '';

  for (var key in attrs) {
    tmpKey = key.replace(/(\_[a-z])/g, replacer);
    this[tmpKey] =attrs[key];
    this.attributes[tmpKey] = attrs[key];
  }
};

Device.prototype.requirePlugins = function() {
  var plugins = this._spark.plugins;
  var Plugin = null;
  var name = '';
  var moduleName = '';

  for (var i in plugins) {
    name = plugins[i];
    moduleName = 'spark-' + name;
    Plugin = require(moduleName);
    this[name] = new Plugin(this.id, this._spark);
  }
};

module.exports = Device;
