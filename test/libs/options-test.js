(function() {
  'use strict';

  const assert = require('assert');
  const expect = require('chai').expect;
  const should = require('chai').should();

  const opt = require('../../libs/options');

  describe('options', function() {

    it('Initialize opt', function() {
      expect(!!opt).to.be.true;
    });

    it('Get default options', function() {
      var options = opt.getOptions();
      expect(!!options).to.be.true;
      should.exist(options);
    });

    it('Get current options', function() {
      var options = opt.getOptions({
        test: false
      });
      expect(!!options).to.be.true;
      expect(options).to.have.property('test').to.be.false;
    });

    it('Get Minimal Default False', function() {
      var minimal = opt.isMinimal();
      expect(minimal).to.be.false;
    });

    it('Get Minimal True', function() {
      var minimal = opt.isMinimal({
        minimal: true
      });
      expect(minimal).to.be.true;
    });

    it('Get Minimal False', function() {
      var minimal = opt.isMinimal({
        minimal: false
      });
      expect(minimal).to.be.false;
    });

  });
})();
