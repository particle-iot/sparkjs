exports.stubRequest = function(err, data, args) {
  var request, clock;
  beforeEach(function() {
    request = sinon.stub(Spark.api, 'request')
    clock = sinon.useFakeTimers(0, 'Date');

    request.yields(err, null, data).returns({
      form: function() {},
      pipe: function() {}
    });
  });

  afterEach(function() {
    if (!!args) {
      expect(request.withArgs(args)).to.be.calledOnce;
    }
    clock.restore();
    Spark.api.request.restore();
  });
};

exports.behavesLikeAPI = function(eventName, subject, data, args) {
  shared.behavesLikeSuccess(eventName, subject, data, args);
  shared.behavesLikeError(eventName, subject, 'invalid_grant');
  shared.behavesLikeRequestError(eventName, subject);
};

exports.behavesLikeError = function(eventName, subject, error) {
  describe('data error', function() {

    shared.stubRequest(null, {error: error});

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

    shared.stubRequest(new Error('err'), null);

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

exports.behavesLikeSuccess = function (eventName, subject, data, args) {
  describe('success', function() {
    shared.stubRequest(null, data, args);

    describe('handles fulfilled promises', function() {
      it('is fulfilled', function() {
        return expect(subject()).to.be.fulfilled;
      });

      it('returns expected data', function() {
        return expect(subject()).to.eventually.equal(data);
      });
    });

    it('executes callback with data', function(done) {
      callback = shared.verifiedCallback(null, data, done);

      subject(callback);
    });

    it('emits event', function(done) {
      shared.validateEvent(eventName, subject, null, data, done);
    });
  });
};

exports.verifiedCallback = function(e, d, done) {
  return function(err, data) {
    expect(data).to.eq(d);
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
