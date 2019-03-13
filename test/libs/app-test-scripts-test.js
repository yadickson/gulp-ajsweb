(function() {
  'use strict';

  const assert = require('assert');
  const expect = require('chai').expect;
  const should = require('chai').should();

  const path = require('path');

  const appFiles = require('../../libs/app-files');
  const appTestScript = require('../../libs/app-test-scripts');
  const mockListFile = require('../mock/mock-list-file');

  describe('test scripts', function() {

    it('Initialize appTestScript', function() {
      expect(!!appTestScript).to.be.true;
    });

    it('Get Test Scripts', function(done) {

      var src = appFiles.getTestScripts({
        testDir: 'test/resource/test'
      });

      mockListFile(src, appTestScript.getScripts({}))
        .then(output => {
          const contents = output;

          var expeted = [
            path.join(process.cwd(), 'test/spec/main_test.js'),
            path.join(process.cwd(), 'test/spec/services/a_const_test.js'),
            path.join(process.cwd(), 'test/spec/services/a_value_test.js'),
            path.join(process.cwd(), 'test/spec/services/a_service_test.js'),
            path.join(process.cwd(), 'test/spec/services/a_factory_test.js'),
            path.join(process.cwd(), 'test/spec/provider/a_provider_test.js'),
            path.join(process.cwd(), 'test/spec/directive/a_directive_test.js'),
            path.join(process.cwd(), 'test/spec/filter/a_filter_test.js'),
            path.join(process.cwd(), 'test/spec/decorator/a_decorator_test.js'),
            path.join(process.cwd(), 'test/spec/component/a_component_test.js'),
            path.join(process.cwd(), 'test/spec/controllers/a_ctrl_test.js')
          ];

          expect(!!contents).to.be.true;
          expect(contents).to.be.an('array')
          expect(contents).to.have.lengthOf(11);
          expect(contents).to.have.ordered.members(expeted)

          done();
        })
        .catch(e => {
          done(e)
        });
    });

  });
})();
