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
        sourceDir: 'app'
      });

      assert.equal(src, 'app/scripts/**/*.js');
    });

    it('Get Scripts Default Path', function() {

      var src = appFiles.getScripts({});

      assert.equal(src, 'app/scripts/**/*.js');
    });

  });
})();
