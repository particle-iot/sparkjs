exports.handlesWrongCredentials = function(){

  describe("with wrong credentials", function() {

    var body = { error: 'invalid_grant' };

    beforeEach(function() {
      sinon.stub(Spark, 'request').yields(null, null, body);
    });

    afterEach(function() {
      Spark.request.restore();
    });

    it("returns body error", function() {
      login_promise = Spark.login('user', 'pass');
      error = 'invalid_grant';

      return expect(login_promise).to.be.rejectedWith(error);
    });

    it("executes callback with error", function(done) {
      callback = shared.verifiedCallback('invalid_grant', undefined, done);

      Spark.login('user', 'pass', callback);
    });

    it("emits login event with error", function(done) {
      trigger = function () {
        Spark.login('user', 'pass');
      };

      shared.validateEvent('login', trigger, 'invalid_grant', body, done);
    });

  });
};

exports.behavesLikeApi = function (eventName, trigger, body, result) {
  describe("with correct credentials", function() {
    var promise;

    beforeEach(function() {
      sinon.stub(Spark, 'request').yields(null, null, body);
    });

    afterEach(function() {
      Spark.request.restore();
    });

    it("handles fulfilled promises", function() {
      promise = trigger();

      it("is fulfilled", function() {
        return expect(promise).to.be.fulfilled;
      });

      it("returns expected result", function() {
        return expect(promise).to.eventually.equal(result);
      });
    });

    it("executes callback with access token", function(done) {
      callback = shared.verifiedCallback(null, result, done);

      trigger(callback);
    });

    it("emits event", function(done) {
      shared.validateEvent(eventName, trigger, null, body, done);
    });
  });
};

exports.verifiedCallback = function(e, b, done) {
  return function(err, body) {
    expect(body).to.eq(b);
    expect(err).to.eq(e);
    done();
  }.bind(done);
};

exports.validateEvent = function(eventName, trigger, err, body, done) {
  var spy = sinon.spy(done());

  Spark.on(eventName, spy);
  trigger();
  Spark.removeListener(eventName, spy);

  expect(spy.withArgs(err, body)).to.be.calledOnce;
};

