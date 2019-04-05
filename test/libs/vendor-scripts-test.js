(function() {
  'use strict';

  const assert = require('assert');
  const expect = require('chai').expect;
  const should = require('chai').should();

  const path = require('path');

  const vendorScripts = require('../../libs/vendor-scripts');
  const mockListFile = require('../mock/mock-list-file');

  describe('vendor scripts', function() {

    it('Initialize vendorScripts', function() {
      expect(!!vendorScripts).to.be.true;
    });

    it('Get Scripts Base', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorScripts.getScriptsBase({}))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor/module1.js'),
            path.join(process.cwd(), 'js/vendor/module2.js'),
            path.join(process.cwd(), 'js/vendor/module3.js')
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

    it('Get Scripts Base Minimal', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorScripts.getScriptsBase({
          minimal: true
        }))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor.js')
          ];

          expect(!!contents).to.be.true;
          expect(contents).to.be.an('array')
          expect(contents).to.have.lengthOf(1);
          expect(contents).to.have.ordered.members(expeted)

          done();
        })
        .catch(e => {
          done(e)
        });
    });

    it('Get Scripts Base Add Sources', function(done) {

      var src = 'test/resource/node_modules/**/index.js';

      mockListFile(src, vendorScripts.getScriptsBase({
          addpaths: 'test/resource/node_modules/module3/libs/filter.js'
        }))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor/module1.js'),
            path.join(process.cwd(), 'js/vendor/module2.js'),
            path.join(process.cwd(), 'js/vendor/module3.js')
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

    it('Get Scripts Base Exclude Sources', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorScripts.getScriptsBase({
          excludepaths: ['!test/resource/node_modules/module1/index.js']
        }))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor/module2.js'),
            path.join(process.cwd(), 'js/vendor/module3.js')
          ];

          expect(!!contents).to.be.true;
          expect(contents).to.be.an('array')
          expect(contents).to.have.lengthOf(2);
          expect(contents).to.have.ordered.members(expeted)

          done();
        })
        .catch(e => {
          done(e)
        });
    });

    it('Get Scripts Base Not Process Source', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorScripts.getScriptsBase({
          notprocess: ['module1']
        }))
        .then(output => {
          const contents = output;

          var expeted = [
						path.join(process.cwd(), 'js/vendor/module1.js'),
            path.join(process.cwd(), 'js/vendor/module2.js'),
            path.join(process.cwd(), 'js/vendor/module3.js')
          ];

          expect(!!contents).to.be.true;
          expect(contents).to.be.an('array')
        //  expect(contents).to.have.lengthOf(2);
          expect(contents).to.have.ordered.members(expeted)

          done();
        })
        .catch(e => {
          done(e)
        });
    });

    it('Get Scripts Base Order By Source', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorScripts.getScriptsBase({
          orderBy: ['module2.js', 'module1.js', 'module3.js']
        }))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor/module2.js'),
            path.join(process.cwd(), 'js/vendor/module1.js'),
            path.join(process.cwd(), 'js/vendor/module3.js')
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

    it('Get Scripts Full', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorScripts.getScriptsFull({}))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor/module1.js'),
            path.join(process.cwd(), 'js/vendor/module2.js'),
            path.join(process.cwd(), 'js/vendor/module3.js')
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

    it('Get Scripts Full Minimal', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorScripts.getScriptsFull({
          minimal: true
        }))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor.js')
          ];

          expect(!!contents).to.be.true;
          expect(contents).to.be.an('array')
          expect(contents).to.have.lengthOf(1);
          expect(contents).to.have.ordered.members(expeted)

          done();
        })
        .catch(e => {
          done(e)
        });
    });

    it('Get Scripts Full Add Sources', function(done) {

      var src = 'test/resource/node_modules/**/index.js';

      mockListFile(src, vendorScripts.getScriptsFull({
          addpaths: 'test/resource/node_modules/module3/libs/filter.js'
        }))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor/module1.js'),
            path.join(process.cwd(), 'js/vendor/module2.js'),
            path.join(process.cwd(), 'js/vendor/module3.js')
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

    it('Get Scripts Full Exclude Sources', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorScripts.getScriptsFull({
          excludepaths: ['!test/resource/node_modules/module1/index.js']
        }))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor/module2.js'),
            path.join(process.cwd(), 'js/vendor/module3.js')
          ];

          expect(!!contents).to.be.true;
          expect(contents).to.be.an('array')
          expect(contents).to.have.lengthOf(2);
          expect(contents).to.have.ordered.members(expeted)

          done();
        })
        .catch(e => {
          done(e)
        });
    });

    it('Get Scripts Full Not Process Source', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorScripts.getScriptsFull({
          notprocess: ['module2']
        }))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor/module1.js'),
						path.join(process.cwd(), 'js/vendor/module2.js'),
            path.join(process.cwd(), 'js/vendor/module3.js')
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

    it('Get Scripts Base Order By Source', function(done) {

      var src = 'test/resource/node_modules/**/*.js';

      mockListFile(src, vendorScripts.getScriptsBase({
          orderBy: ['module2.js', 'module1.js', 'module3.js']
        }))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/vendor/module2.js'),
            path.join(process.cwd(), 'js/vendor/module1.js'),
            path.join(process.cwd(), 'js/vendor/module3.js')
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
