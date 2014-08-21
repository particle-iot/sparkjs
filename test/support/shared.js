exports.stubRequest = function (body){
  beforeEach(function() {
    sinon.stub(Spark, 'request').yields(null, null, body);
  });

  afterEach(function() {
    Spark.request.restore();
  });
};

exports.behavesLikeInvalidGrant = function(subject, eventName) {
  describe("with invalid grant", function() {
    shared.stubRequest({error:'invalid_grant'});

    shared.behavesLikeError(eventName, subject, 'invalid_grant');
  });
};

exports.behavesLikeError = function(eventName, subject, error){
  describe("error", function() {

    it("returns body error", function() {
      return expect(subject()).to.be.rejectedWith(error);
    });

    it("executes callback with error", function(done) {
      callback = shared.verifiedCallback(error, null, done);

      subject(callback);
    });

    it("emits event with error", function(done) {
      shared.validateEvent(eventName, subject, new Error(error), null, done);
    });

  });
};

exports.behavesLikeSuccess = function (eventName, subject, body, result) {
  describe("with correct credentials", function() {
    var promise;

    it("handles fulfilled promises", function() {
      promise = subject();

      it("is fulfilled", function() {
        return expect(promise).to.be.fulfilled;
      });

      it("returns expected result", function() {
        return expect(promise).to.eventually.equal(result);
      });
    });

    it("executes callback with result", function(done) {
      callback = shared.verifiedCallback(null, result, done);

      subject(callback);
    });

    it("emits event", function(done) {
      shared.validateEvent(eventName, subject, null, result, done);
    });
  });
};

exports.verifiedCallback = function(e, b, done) {
  return function(err, body) {
    expect(body).to.eq(b);
    if (err) {
      expect(err.message).to.eq(e);
    }
    done();
  }.bind(done);
};

exports.validateEvent = function(eventName, subject, err, result, done) {
  var spy = sinon.spy(done());

  Spark.on(eventName, spy);
  subject();
  Spark.removeListener(eventName, spy);

  expect(spy.withArgs(err, result)).to.be.calledOnce;
};

