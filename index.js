'use strict';

const fs = require('fs');
const debug = require('debug')('index');
const theta = require('./lib/theta');
const imageProcessor = require('./lib/imageprocessor');
const birdRecognizer = require('./lib/birdrecognizer');
const SerialPort = require('serialport');

const imageDir = './images';

function processBirdDetect() {
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
        port.write('cracker\n');
      } else {
        debug('bird not exists');
      }
      ignoreFromArduino = false;
    })
    .catch(() => {
      debug('capture fail');
    });
}

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
                     reject(error);
                     return;
                   }
                   debug(`written file: ${filepath}`);
                   resolve(filepath);
                 });
  });
}

var serialopts = {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
  parser: SerialPort.parsers.readline("\n")
};

const port = new SerialPort('/dev/cu.usbmodem1411', serialopts);

var ignoreFromArduino = false;

port.on('open', (err) => {
  if (err) {
    debug(err);
    return;
  }

  setTimeout(() => {
    port.write('start 50\n', (err) => {
      if (err) {
        debug(err);
        return;
      }

      debug('written');
    }, 2000);
  });
});

port.on('data', (input) => {
  if (ignoreFromArduino) {
    return;
  }
  ignoreFromArduino = true;
  processBirdDetect();
});

port.on('err', (err) => {
  debug(err);
});
