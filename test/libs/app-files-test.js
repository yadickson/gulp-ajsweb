(function() {
  'use strict';

  const assert = require('assert');
  const expect = require('chai').expect;
  const should = require('chai').should();

  const appFiles = require('../../libs/app-files');

  describe('app files', function() {

    it('Initialize appFiles', function() {
      expect(!!appFiles).to.be.true;
    });

    it('Get Scripts', function() {

      var src = appFiles.getScripts({
        sourceDir: 'src'
      });

      assert.equal(src, 'src/scripts/**/*.js');
    });

    it('Get Scripts Default Path', function() {

      var src = appFiles.getScripts({});

      assert.equal(src, 'app/scripts/**/*.js');
    });

    it('Get Test Scripts', function() {

      var src = appFiles.getTestScripts({
        testDir: 'src/test'
      });

      assert.equal(src, 'src/test/spec/**/*.js');
    });

    it('Get Test Scripts Default Path', function() {

      var src = appFiles.getTestScripts({});

      assert.equal(src, 'test/spec/**/*.js');
    });

  });
})();
