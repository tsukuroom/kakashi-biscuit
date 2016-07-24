'use strict';

const debug = require('debug')('imageprocessor');
const im = require('imagemagick');

const trimArea = '600x1000+2388+1100';

function trimming(filepath) {
  debug('trimming path=' + filepath);
  return new Promise((resolve, reject) => {
    var insertIdx = filepath.length - 4;
    var outFilePath = filepath.slice(0, insertIdx) + '_trim' + filepath.slice(insertIdx, filepath.length);
    im.convert(['-crop', trimArea, filepath, outFilePath],
               (err, stdout) => {
                 if (err) {
                   debug(err);
                   reject(err);
                 }
                 debug('trimming success');
                 resolve(outFilePath);
               });
  });
}

module.exports.trimming = trimming;
