var Spark = source('spark-api');

describe("Spark", function() {
  describe("login", function() {

    describe("with wrong credentials", function() {
      it("returns invalid client message", function() {
        login_promise = Spark.login();
        error = 'invalid_client';

        return expect(login_promise).to.be.rejectedWith(error);
      });

      it("returns invalid grant message", function() {
        login_promise = Spark.login('user', 'password');
        error = 'invalid_grant'

        return expect(login_promise).to.be.rejectedWith(error);
      });
    });
  });
});
