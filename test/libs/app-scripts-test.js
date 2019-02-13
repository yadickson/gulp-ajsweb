(function() {
  'use strict';

  const assert = require('assert');
  const expect = require('chai').expect;
  const should = require('chai').should();

  const path = require('path');
  const addScripts = require('../../libs/app-scripts');
  const mockListFile = require('../mock/mock-list-file');

  describe('app scripts', function() {

    it('Initialize addScripts', function() {
      expect(!!addScripts).to.be.true;
    });

    it('Get Scripts', function() {

      var src = addScripts.getScripts({
        sourceDir: 'app'
      });

      assert.equal(src, 'app/scripts/**/*.js');
    });

    it('Get Scripts Default Path', function() {

      var src = addScripts.getScripts({});

      assert.equal(src, 'app/scripts/**/*.js');
    });

    it('Get Scripts Base', function(done) {

      var src = addScripts.getScripts({
        sourceDir: 'test/resource/app'
      });

      mockListFile(src, addScripts.getScriptsBase({}))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/app/main.js'),
            path.join(process.cwd(), 'js/app/services/service.js'),
            path.join(process.cwd(), 'js/app/controllers/controller.js')
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

      var src = addScripts.getScripts({
        sourceDir: 'test/resource/app'
      });

      mockListFile(src, addScripts.getScriptsBase({
          minimal: true
        }))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'js/app.js')
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

  });
})();
