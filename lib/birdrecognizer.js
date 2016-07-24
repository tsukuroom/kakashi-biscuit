'use strict';

const debug = require('debug')('birdrecognizer');
const Clarifai = require('clarifai');
const base64 = require('node-base64-image');

const clientId = process.env.CLARIFAI_ID;
const clientSecret = process.env.CLARIFAI_SECRET;
debug(clientId);
debug(clientSecret);

Clarifai.initialize({
  'clientId': clientId,
  'clientSecret': clientSecret
});
  
function birdExists(imageFilePath) {
  debug('birdExists imageFile=' + imageFilePath);
  return new Promise((resolve, reject) => {
    base64.encode(imageFilePath, {'string': true, 'local': true}, (err, response) => {
      if (err) {
        debug(err);
        reject(err);
      }
      
      Clarifai.getTagsByImageBytes(response, {'selectClasses': 'bird'})
        .then((token, error) => {
          if (error) {
            debug(error);
            reject(error);
          }

          var birdProb = parseFloat(token.results[0].result.tag.probs[0]);
          var birdExist = false;

          debug(birdProb);
          
          if (birdProb > 0.60) {
            birdExist = true;
          } else {
            birdExist = false;
          }
          
          resolve(birdExist);
        });
    });
  });
}

module.exports.birdExists = birdExists;
