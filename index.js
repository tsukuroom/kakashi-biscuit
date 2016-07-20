'use strict';

const fs = require('fs');
const debug = require('debug')('index');
const theta = require('./lib/theta');
const imageProcessor = require('./lib/imageprocessor');
const birdRecognizer = require('./lib/birdrecognizer');

const imageDir = './images';

theta.captureImageAndDownload()
  .then((image) => {
    debug('capture success image=' + image.name);
    return writeImage(image, imageDir);
  })
  .then((path) => {
    debug('path=' + path);
    return imageProcessor.trimming(path);
  })
  .then((croppedFilePath) => {
    debug('croppedFilePath=' + croppedFilePath);
    return birdRecognizer.birdExists(croppedFilePath);
  })
  .then((exist) => {
    if (exist) {
      debug('bird exists');
    } else {
      debug('bird not exists');
    }
  })
  .catch(() => {
    debug('capture fail');
  });

function writeImage(image, dir) {
  return new Promise((resolve, reject) => {
    var filepath = `${process.cwd()}/${image.name}`;

    if (dir) {
      filepath = `${dir}/${image.name}`;
    }

    fs.writeFile(filepath, image.data,
                 (error) => {
                   if (error) {
                     debug(error);
                     return reject(error);
                   }
                   debug(`written file: ${filepath}`);
                   resolve(filepath);
                 });
  });
}

// theta.capture()
//   .then(() => {
//     return theta.downloadLatest();
//   })
//   .then((path) => {
//     return imageProc.trimming();
//   })
//   .then((pathList) => {
//     return birdRec.recognize();
//   })
//   .then((result) => {
//     // 鳥がいたらarduinoに指示を出す。鳥がいなければ何もしない
//   })
//   .catch(() => {

//   });
