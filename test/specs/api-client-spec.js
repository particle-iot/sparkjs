var Spark = source('spark-api');

describe("Spark", function() {
  describe("login", function() {

    afterEach(function() {
      Spark.request.restore();
    });

    describe("with wrong credentials", function() {

      var body = { error: 'invalid_client' };

      beforeEach(function() {
        sinon.stub(Spark, 'request').yields(null, null, body);
      });

      it("returns body error", function() {
        login_promise = Spark.login('user', 'pass');
        error = 'invalid_client';

        return expect(login_promise).to.be.rejectedWith(error);
      });

      it("executes callback with error", function(done) {
        var error;
        var callback = function(err, body) {
          error = err;
          done();
        }.bind(done);

        Spark.login('user', 'pass', callback);

        expect(error).to.eq('invalid_client');
      });

      it("emits login event with error", function(done) {
        var spy = sinon.spy(done());

        Spark.on('login', spy);
        Spark.login('user', 'pass');
        Spark.removeListener('login', spy);

        expect(spy.withArgs('invalid_client', body)).to.be.calledOnce;
      });

    });

    describe("with correct credentials", function() {

      var body = { access_token: 'access_token' };

      beforeEach(function() {
        sinon.stub(Spark, 'request').yields(null, null, body);
      });

      it("is fulfilled", function() {
        login_promise = Spark.login('spark', 'spark');
        return expect(login_promise).to.be.fulfilled;
      });

      it("returns access token", function() {
        login_promise = Spark.login('spark', 'spark');
        return expect(login_promise).to.eventually.equal('access_token');
      });

      it("calls callback with access token", function(done) {
        var access_token;
        var callback = function(err, token) {
          access_token = token;
          done();
        }.bind(done);

        Spark.login('spark', 'spark', callback);

        expect(access_token).to.eq('access_token');
      });

      it("emits login event", function(done) {
        var spy = sinon.spy(done());

        Spark.on('login', spy);
        Spark.login('spark', 'spark');
        Spark.removeListener('login', spy);

        expect(spy.withArgs(null, body)).to.be.calledOnce;
      });

    });

  });
});
