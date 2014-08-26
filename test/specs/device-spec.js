describe('Device', function() {
  var device, api,
      callback = function() {},
      attributes = when.defer(),
      api = {
        claimCore: sinon.spy(),
        removeCore: sinon.spy(),
        renameCore: sinon.spy(),
        getAttributes: function() { return attributes.promise }
      };

  beforeEach(function() {
    device = new Device('id', api);
    attributes.resolve({
      name: 'name',
      connected: true,
      variables: {var: 'string'},
      functions: ['fn'],
      cc3000_patch_version: '1.0',
      requires_deep_update: true
    });
  });

  it('has expected attributes', function() {
    setTimeout(function(){
      expect(device.name).to.eq('name');
      expect(device.connected).to.eq(true);
      expect(device.variables.var).to.eq('string');
      expect(device.functions).to.include('fn');
      expect(device.version).to.eq('1.0');
      expect(device.requiresUpdate).to.eq(true);
    }, 0);
  });

  it('can be claimed', function() {
    device.claim(callback);
    expect(api.claimCore.withArgs('id', callback)).to.be.calledOnce;
  });

  it('can be removed', function() {
    device.remove(callback);
    expect(api.claimCore.withArgs('id', callback)).to.be.calledOnce;
  });

  it('can be renamed', function() {
    device.rename('new_name', callback);
    expect(api.renameCore.withArgs('id', 'new_name', callback)).to.be.calledOnce;
  });
});
