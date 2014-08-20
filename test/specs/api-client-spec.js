var Spark = source('spark-api');

describe("Spark", function() {
  describe("login", function() {

    afterEach(function() {
      Spark.request.restore();
    });

    describe("with wrong credentials", function() {

      beforeEach(function() {
        sinon.stub(Spark, 'request').yields(null, null, {
          error: 'invalid_client'
        });
      });

      it("returns body error", function() {
        login_promise = Spark.login('user', 'pass');
        error = 'invalid_client';

        return expect(login_promise).to.be.rejectedWith(error);
      });

      it("calls callback with error", function(done) {
        var error;
        var callback = function(err, body) {
          error = err;
          done();
        }.bind(done);

        Spark.login('user', 'pass', callback);

        expect(error).to.eq('invalid_client');
      });

    });

    describe("with correct credentials", function() {

      beforeEach(function() {
        sinon.stub(Spark, 'request').yields(null, null, {
          access_token: 'access_token'
        });
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

    });

  });
});
