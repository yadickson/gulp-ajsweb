(function() {
  'use strict';

  const assert = require('assert');
  const expect = require('chai').expect;
  const should = require('chai').should();

  const path = require('path');

  const vendorTestScripts = require('../../libs/vendor-test-scripts');
  const mockListFile = require('../mock/mock-list-file');

  describe('vendor test scripts', function() {

    it('Initialize vendorTestScripts', function() {
      expect(!!vendorTestScripts).to.be.true;
    });

    it('Get Vendor Test Scripts', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorTestScripts.getScripts({}))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'test/vendor/module1.js'),
            path.join(process.cwd(), 'test/vendor/module2.js'),
            path.join(process.cwd(), 'test/vendor/module3.js')
          ];

          expect(!!contents).to.be.true;
          expect(contents).to.be.an('array')
          expect(contents).to.have.lengthOf(3);
          expect(contents).to.have.ordered.members(expeted)

          done();
        })
        .catch(e => {
          done(e)
        });
    });

  });
})();
