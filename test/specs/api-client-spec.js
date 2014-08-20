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
    });

  });
});
