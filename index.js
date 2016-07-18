'use strict';

const theta = require('./lib/theta');
// const imageProcessor = require('lib/imageprocessor');
// const birdRecognizer = require('lib/birdrecognizer');

theta.capture()
  .then(() => {
    return theta.downloadLatest();
  })
  .catch(() => {
    console.log('error');
  });

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
