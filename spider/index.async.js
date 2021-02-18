/**
 * async module use
 *
 */

const async = require('async');
const request = require('request');
const mkdirp = require('mkdirp');
const path = require('path');
const { urlToFilename } = require('./utilities');
const fs = require('fs');

function download(url, filename, callback) {
  console.log(`Downloading....`);

  async.waterfall([
    (callback) => {
      request(url, (err, response, body) => {
        if (err) return callback(err);
        callback(null, body)
      })
    },
    (body, callback) => {
      mkdirp(path.dirname(filename)).then(() => callback()).catch(e => callback(e))
      callback(body)
    },
    (body, callback) => {
      fs.writeFile(filename, body, (err) => {
        if (err) return callback(err);
        else callback()
      })
    }
  ], err => {
    if (err) return callback(err);
    console.log(`Downloaded and saved: ${url}`);
    callback(null, body);
  });
}

download('http://baidu.com', 'baidu', (err) => {
  if (err) console.error(err);
  else return console.log('Download success.')
});

async.waterfall([
  function (callback) {
    callback(null, 'one', 'two');
  },
  function (arg1, arg2, callback) {
    console.log('arg1, arg2', arg1, arg2)
    // arg1 now equals 'one' and arg2 now equals 'two'
    callback(null, 'three');
  },
  function (arg1, callback) {
    console.log('arg1', arg1)
    // arg1 now equals 'three'
    callback(null, 'done');
  }
], function (err, result) {
  // result now equals 'done'
  console.log(result)
});
