describe('Device', function() {
  var device, api,
      callback = function() {},
      newAttributes = when.defer(),
      api = {
        claimCore: sinon.spy(),
        removeCore: sinon.spy(),
        renameCore: sinon.spy(),
        signalCore: sinon.spy(),
        flashCore: sinon.spy(),
        sendPublicKey: sinon.spy(),
        callFunction: sinon.spy(),
        getEventStream: sinon.spy(),
        createWebhook: sinon.spy(),
        getVariable: sinon.spy(),
        getAttributes: function() { return newAttributes.promise }
      };

  beforeEach(function() {
    var attributes = {
      id: 'id',
      name: 'name',
      connected: true,
      variables: {var: 'string'},
      functions: ['fn'],
      version: '1.0',
      requiresUpdate: true
    };
    device = new Device(attributes, api);
  });

  it('has expected attributes', function() {
    expect(device.name).to.eq('name');
    expect(device.connected).to.eq(true);
    expect(device.variables.var).to.eq('string');
    expect(device.functions).to.include('fn');
    expect(device.version).to.eq('1.0');
    expect(device.requiresUpdate).to.eq(true);
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

  it('can be signaled', function() {
    device.signal(callback);
    expect(api.signalCore.withArgs('id', true, callback)).to.be.calledOnce;
  });

  it('can stop signal', function() {
    device.stopSignal(callback);
    expect(api.signalCore.withArgs('id', false, callback)).to.be.calledOnce;
  });

  it('can be flashed', function() {
    device.flash([], callback);
    expect(api.flashCore.withArgs('id', [], callback)).to.be.calledOnce;
  });

  it('can receive public key', function() {
    device.sendPublicKey('', callback);
    expect(api.sendPublicKey.withArgs('id', '', callback)).to.be.calledOnce;
  });

  it('can call a function', function() {
    device.call('setTemp', '10', callback);
    expect(api.callFunction.withArgs('id', 'setTemp', '10', callback)).to.be.calledOnce;
  });

  it('can get event stream', function() {
    device.subscribe('change', callback);
    expect(api.getEventStream.withArgs('change', 'id', callback)).to.be.calledOnce;
  });

  it('can create webhook', function() {
    device.createWebhook('change', 'url', callback);
    expect(api.createWebhook.withArgs('change', 'url', 'id', callback)).to.be.calledOnce;
  });

  it('can get a variable', function() {
    device.getVariable('name', callback);
    expect(api.getVariable.withArgs('id', 'name', callback)).to.be.calledOnce;
  });

  it('updates attributes successfuly', function() {
    device.update();

    newAttributes.resolve({
      name: 'name',
      connected: false,
      cc3000_patch_version: '2.1',
      requires_deep_update: false
    });

    setTimeout(function() {
       expect(device.connected).to.eq(false);
       expect(device.requiresUpdate).to.eq(false);
       expect(device.version).to.eq('2.1')
    }, 0);
  });
});
