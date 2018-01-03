ParticleJS: A Javascript library for Particle devices
=======

ParticleJS is a library for interacting with your cores and the Particle Cloud.
It uses node.js and can run on Windows, Mac OS X, and Linux fairly easily. It can also run in the browser without node.js.
It's also open source so you can edit, change or even send in pull requests if you want to share!

## Documentation

Complete documentation can be found in [ParticleJS Docs](http://docs.particle.io/core/javascript/)

## Installation

First, make sure you have [node.js](http://nodejs.org/) installed!

Next, open a command prompt or terminal, and install by typing:

```shell
$ npm install -g spark
```

## Usage

```javascript
var Spark = require('spark');

Spark.login({ username: 'email@example.com', password: 'password' }, function(err, body) {
  console.log('API call login completed on callback:', body);
});
```

For further examples visit /examples directory: https://github.com/particle-iot/sparkjs/tree/master/examples

**Complete documentation can be found in [ParticleJS Docs](http://docs.particle.io/core/javascript/)**

## Getting Started

It's important that you login before executing any command.

Every function returns a [promise](http://promisesaplus.com/) for you to handle the async result, or you can pass a callback function.
(Please note that if a callback function is passed, the function will return null instead of a promise)

More examples on how to use promises/callbacks visit: https://github.com/particle-iot/sparkjs/tree/master/examples

### Supported commands

* compileCode
* createUser
* callFunction
* claimCore
* downloadBinary
* flashCore
* getAttributes
* getAttributesForAll
* getEventStream
* getVariable
* listDevices
* login
* onEvent
* publishEvent
* removeCore
* removeToken
* renameCore
* signalCore

### Device object

You can get a list of devices by calling: Spark.devices

Each device has the following parameters:

* name
* connected
* variables
* functions
* version
* requiresUpgrade

And you can call the following commands on it:

* callFunction
* claim
* flash
* subscribe
* getVariable
* onEvent
* remove
* rename
* sendPublicKey
* signal
* stopSignal
* getAttributes

**Complete documentation can be found in [ParticleJS Docs](http://docs.particle.io/core/javascript/)**

## Setup your dev environment

Install your local dependencies:

```shell
$ npm install
```

Install globally mocha, istanbul uglify-js and jshint

```shell
$ npm install -g mocha
$ npm install -g istanbul
$ npm install -g uglify-js
$ npm install -g jshint
```

### How to test

`make test`

### Lint your code

`make lint`

### Coverage report

`make cover`

## Release History

- Version 0.1.0 Initial release
- Version 0.2.1 Publishing, test release
- Version 0.2.2 Pulling in getDevice
- Version 0.2.4 adding some basic parsing to the getEventStream function, now returns an object
- Version 0.2.5 fixing a callback param bug in getEventStream
- Version 0.2.6 fixing minified js
- Version 1.1.0 Fix [#77](https://github.com/particle-iot/sparkjs/issues/77), [#75](https://github.com/particle-iot/sparkjs/issues/75). Add `listAccessTokens`.