(function() {
  'use strict';

  const fs = require('vinyl-fs');
  const map = require('map-stream');
  const path = require('path');

  function toList(input, func) {
    return new Promise((res, rej) => {
      let contents = [];

      const vFile = fs.src(input, {
        base: '.'
      });

      vFile
        .pipe(func())
        .pipe(map((file, cb) => {
          contents.push(file.path);
          cb(null, file);
        }))
        .on('error', e => {
          rej(e);
        })
        .on('end', () => {
          res(contents);
        });
    });
  }

  module.exports = toList
})();
