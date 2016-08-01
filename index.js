'use strict';

const fs = require('fs');
const debug = require('debug')('index');
const theta = require('./lib/theta');
const imageProcessor = require('./lib/imageprocessor');
const birdRecognizer = require('./lib/birdrecognizer');
const SerialPort = require('serialport');
const exec = require('child_process').exec;

const imageDir = './images';

function processBirdDetect() {
  debug('processBirdDetect');
  
  port.write('recognize\n');
  
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
        setTimeout(() => {
          exec('play sound/gun-fire05.wav', (err, stdout, stderr) => {
            if (err) {
              debug(err);
            }
            // debug(stdout);
            // debug(stderr);
          });
        }, 900);
      } else {
        debug('bird not exists');
        port.write('blue\n');
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

var ignoreFromArduino = false;
var port;

var serialopts = {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
  parser: SerialPort.parsers.readline("\n")
};

SerialPort.list((err, ports) => {
  var arduinoPort = ports.find((elem, index, array) => {
    return elem.vendorId == "0x2341";
  });
  debug(arduinoPort.comName);
  
  port = new SerialPort(arduinoPort.comName, serialopts);
  
  port.on('open', (err) => {
    if (err) {
      debug(err);
      return;
    }
    
    setTimeout(() => {
      port.write('monitor 50\n', (err) => {
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
    if (input.startsWith("chikai")) {
      processBirdDetect();
    }
  });
  
  port.on('err', (err) => {
    debug(err);
  });
});
