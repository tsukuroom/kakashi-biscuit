'use strict';

const debug = require('debug')('theta');
const gphoto2 = require('abc/lib/gphoto2');

class Theta {

  captureImageAndDownload() {
    debug('captureAndDownload');
    return gphoto2.init()
      .then(() => {
        return gphoto2.triggerCapture()
          .then()
          .catch(error => {
            debug(error);
          });
      })
      .then(gphoto2.getNewFile)
      .then((file) => {
        gphoto2.exit();
        return file;
      })
      .catch((error) => {
        debug(error);
        gphoto2.exit();
        return Promise.reject(error);
      });
  }
}

module.exports = new Theta();
