const fs = require('fs');
const path = require('path')
const mkdirp = require('mkdirp');
const request = require('request')
const { urlToFilename, TaskQueue, getPageLinks, Logger } = require('./utilities');
const logger = new Logger(console.log);
const downloadQueue = new TaskQueue(2);

/**
 * 使用同步并发队列实现
 */

function download(url, filename, callback) {
  logger.info(`Downloading ${url}`)
  request(url, (err, resp, body) => {
    if (err) return callback(err);
    saveFile(filename, body, (err) => {
      if (err) return callback(err);
      logger.info(`${url} Downloaded`)
      callback(null, body)
    })
  })
}

function saveFile(filename, body, callback) {
  const filepath = path.dirname(filename);

  mkdirp(filepath).then(() => {
    fs.writeFile(filename, body, err => {
      if (err) return callback(err);
      logger.info(`${filename} save success.`)
      callback(null, filename, true)
    })
  }).catch(e => {
    callback(err);
  })
}

const spidering = new Map();
function spider(url, nesting, callback) {
  if (spidering.has(url)) return callback()
  spidering.set(url, true);

  const filename = urlToFilename(url);
  fs.readFile(filename, (err, body) => {
    if (err) {
      download(url, filename, (err) => {
        if (err) return callback(err)
        spiderLinks(url, body, nesting, callback);
      })
    }
    spiderLinks(url, body, nesting, callback)
  })
}
function spiderLinks(url, body, nesting, callback) {
  const links = getPageLinks(url);
  if (links.length === 0) return process.nextTick(callback)
  let completed = 0, hasErrors = false;

  links.forEach(link => {
    downloadQueue.pushTask((done) => {
      spider(link, nesting - 1, err => {
        if (err) {
          hasErrors = true;
          return callback(err);
        }
        if (++completed === links.length && !hasErrors) {
          callback()
        }
        done()
      })
    })
  })
}

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    logger.error(err);
  } else if (downloaded) {
    logger.info('Downloaded:' + filename)
  } else {
    logger.info(`${filename} has already downloaded.`)
  }
})
