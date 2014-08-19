describe("Spark", function() {
  describe("login", function() {
    it("returns error if no param sent", function() {
      expect(Spark.login()).to.equal("Please provide username:password or access_token");
    });
  });
});
