exports.stubRequest = function(eventName, err, data) {
  var request, clock;
  beforeEach(function() {
    request = sinon.stub(Spark.api, eventName);
    clock = sinon.useFakeTimers(0, 'Date');

    request.yields(err, null, data).returns({
      pipe: function() {}
    });
  });

  afterEach(function() {
    clock.restore();
    request.restore();
  });
};

exports.behavesLikeAPI = function(eventName, subject, data) {
  shared.behavesLikeSuccess(eventName, subject, data);
  shared.behavesLikeError(eventName, subject, 'invalid_grant');
  shared.behavesLikeRequestError(eventName, subject);
};

exports.behavesLikeEndpoint = function(subject, args) {
  var request, clock;
  var api = new SparkApi({
    clientId: 'Spark',
    clientSecret: 'Spark',
    baseUrl: 'https://api.spark.io'
  });

  beforeEach(function() {
    clock = sinon.useFakeTimers(0, 'Date');
    request = sinon.stub(api, 'request').returns({
      form: function() {}
    });
  });

  afterEach(function() {
    api.request.restore();
    clock.restore();
  });

  describe('request', function() {
    it('is called with correct params', function() {
      subject(api);
      return expect(request.withArgs(args)).to.be.calledOnce;
    });
  });
};

exports.behavesLikeError = function(eventName, subject, error) {
  describe('data error', function() {

    shared.stubRequest(eventName, null, {error: error});

    it('promise rejected with error', function() {
      return expect(subject()).to.be.rejectedWith(error);
    });

    it('executes callback with error', function(done) {
      callback = shared.verifiedCallback(error, null, done);

      subject(callback);
    });

    it('emits event with error', function(done) {
      shared.validateEvent(eventName, subject, new Error(error), null, done);
    });
  });
};

exports.behavesLikeRequestError = function(eventName, subject) {
  describe('request error', function() {

    shared.stubRequest(eventName, new Error('err'), null);

    it('promise rejected with error', function() {
      return expect(subject()).to.be.rejectedWith('err');
    });

    it('executes callback with error', function(done) {
      callback = shared.verifiedCallback('err', null, done);

      subject(callback);
    });

    it('emits event with error', function(done) {
      shared.validateEvent(eventName, subject, new Error('err'), null, done);
    });
  });
};

exports.behavesLikeSuccess = function (eventName, subject, data) {
  describe('success', function() {
    shared.stubRequest(eventName, null, data);

    describe('handles fulfilled promises', function() {
      it('is fulfilled', function() {
        return expect(subject()).to.be.fulfilled;
      });

      it('returns expected data', function() {
        if (eventName === 'listDevices') {
          return expect(subject()).to.eventually.become([new Device(data[0], Spark)]);
        } else {
          return expect(subject()).to.eventually.equal(data);
        }
      });
    });

    it('executes callback with data', function(done) {
      if (eventName === 'listDevices') {
        callback = shared.verifiedCallback(null, [new Device(data[0], Spark)], done);
      } else {
        callback = shared.verifiedCallback(null, data, done);
      }

      subject(callback);
    });

    it('emits event', function(done) {
      if (eventName === 'listDevices' ) {
        shared.validateEvent(eventName, subject, null, [new Device(data[0], Spark)], done);
      } else {
        shared.validateEvent(eventName, subject, null, data, done);
      }
    });
  });
};

exports.verifiedCallback = function(e, d, done) {
  return function(err, data) {
    expect(data).to.deep.equal(d);
    if (err) {
      expect(err.message).to.eq(e);
    }
    done();
  }.bind(done);
};

exports.validateEvent = function(eventName, subject, err, data, done) {
  var spy = sinon.spy(done());

  Spark.on(eventName, spy);
  subject();
  Spark.removeListener(eventName, spy);

  expect(spy.withArgs(err, data)).to.be.calledOnce;
};
