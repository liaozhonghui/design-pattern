/**
 * 实现一个简单的网络爬虫
 */
const request = require('request');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const { Logger, urlToFilename } = require('./utilities')
const logger = new Logger(console.log);

/**
 * version 连续回调的方式实现
 * @param {*} url
 * @param {*} callback
 */
function spider(url, callback) { // version 0.0
  const filename = urlToFilename(url);
  logger.info('filename: ', filename)
  fs.exists(filename, exists => {
    if (!exists) {
      logger.info(`Downloading ${url}`);
      request(url, (err, response, body) => {
        if (err) return callback(err);
        logger.info('走')
        logger.info('body:' + body)
        let filepath = path.dirname(filename);
        logger.info('filepath:', filepath);
        mkdirp(filepath).then(() => {
          logger.info('走2')
          fs.writeFile(filename, body, err => {
            if (err) return callback(err);
            callback(null, filename, true)
          })
        }).catch(e => {
          callback(err);
        })
      })
    } else {
      callback(null, filename, false)
    }
  })
}

// main 主程序逻辑
spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    logger.error(err);
  } else if (downloaded) {
    logger.info(`Downloaded. ${filename}`)
  } else {
    logger.info(`${filename} has already downloaded.`)
  }
})

