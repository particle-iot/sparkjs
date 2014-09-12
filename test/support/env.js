'use strict';

process.env.NODE_ENV = 'test';

var path = require('path');

var chai = require('chai'),
sinon = require('sinon'),
sinonChai = require('sinon-chai'),
chaiAsPromised = require('chai-as-promised'),
when = require('when');

when.Promise.onPotentiallyUnhandledRejection = function() {};
chai.use(sinonChai);
chai.use(chaiAsPromised);

global.chai = chai;
global.sinon = sinon;
global.when = when;

global.should = chai.should();
global.expect = chai.expect;
global.assert = chai.assert;
global.AssertionError = chai.AssertionError;

global.spy = sinon.spy;
global.stub = sinon.stub;
global.shared = require('./shared');

// convenience function to require modules in lib directory
global.source = function(module) {
  return require(path.normalize('./../../lib/' + module));
};

global.Spark = source('spark');
global.Device = source('device');
global.SparkApi = source('spark-api');
