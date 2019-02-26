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

    it('Get Source Dir Default', function() {
      var src = opt.getSourceDir();
      should.exist(src);
      assert.equal(src, 'app');
    });

    it('Get Source Dir Value', function() {
      var src = opt.getSourceDir({
        sourceDir: 'xyz'
      });
      should.exist(src);
      assert.equal(src, 'xyz');
    });

    it('Get Process Default False', function() {
      var process = opt.isProcess();
      expect(process).to.be.false;
    });

    it('Get Process True', function() {
      var process = opt.isProcess({
        process: true
      });
      expect(process).to.be.true;
    });

    it('Get Process False', function() {
      var process = opt.isProcess({
        process: false
      });
      expect(process).to.be.false;
    });

    it('Get Destination Dir Default', function() {
      var src = opt.getDestination();
      should.exist(src);
      assert.equal(src, 'build');
    });

    it('Get Destination Dir Value', function() {
      var src = opt.getDestination({
        dest: 'xyz'
      });
      should.exist(src);
      assert.equal(src, 'xyz');
    });

  });
})();
