sparkjs
=======

SparkJS is a library for interacting with your cores and the Spark Cloud.
It uses node.js and can run on Windows, Mac OS X, and Linux fairly easily.
It's also open source so you can edit, change or even send in pull requests if you want to share!

## Documentation

Complete documentation can be found in [Spark Docs](http://docs.spark.io/javascript/)

## Instalation

First, make sure you have [node.js](http://nodejs.org/) installed!

Next, open a command prompt or terminal, and install by typing:

```shell
$ npm install -g spark
```

## Usage

```javascript
var Sparkjs = require('spark');

Sparkjs.login({ username: 'email@example.com', password: 'password' }, function(err, body) {
  console.log('API call login completed on callback:', body);
});
```

For further examples visit /examples directory: https://github.com/spark/sparkjs/tree/master/examples

**Complete documentation can be found in [Spark Docs](http://docs.spark.io/javascript/)**

## Getting Started

It's important that you login before executing any command.

Every function returns a [promise](http://promisesaplus.com/) for you to handle the async result, or you can pass a callback function.
(Please note that if a callback function is passed, the function will return null instead of a promise)

**Complete documentation can be found in [Spark Docs](http://docs.spark.io/javascript/)**

## Setup your dev environment

* Install your local dependencies:

```shell
$ npm install
```

* Install globally mocha, istanbul and jshint

```shell
$ npm install -g mocha
$ npm install -g istanbul
$ npm install -g jshint
```

### How to test

`make test`

### Lint your code

`make lint`

### Coverage report

`make cover`
