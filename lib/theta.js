'use strict';

const debug = require('debug')('theta');

class Theta {

  capture() {
    debug('capture');
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  downloadLatest() {
    debug('downloadLatest');
  }
}

module.exports = new Theta();
