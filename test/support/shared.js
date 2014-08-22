exports.stubRequest = function (data){
  beforeEach(function() {
    sinon.stub(Spark, 'request').yields(null, null, data);
  });

  afterEach(function() {
    Spark.request.restore();
  });
};

exports.behavesLikeError = function(eventName, subject, error){
  describe("error", function() {

    shared.stubRequest({error: error});

    it("promise rejected with error", function() {
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

exports.behavesLikeSuccess = function (eventName, subject, data) {
  describe("success", function() {
    var promise;

    shared.stubRequest(data);

    it("handles fulfilled promises", function() {
      promise = subject();

      it("is fulfilled", function() {
        return expect(promise).to.be.fulfilled;
      });

      it("returns expected data", function() {
        return expect(promise).to.eventually.equal(data);
      });
    });

    it("executes callback with data", function(done) {
      callback = shared.verifiedCallback(null, data, done);

      subject(callback);
    });

    it("emits event", function(done) {
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

