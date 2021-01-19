/**
 * 实现网络爬虫
 */

const request = require('request');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const { Logger, urlToFilename, getPageLinks } = require('./utilities')
const logger = new Logger(console.log);

function saveFile(filename, callback) {
  let filepath = path.dirname(filename);
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

function download(url, filename, callback) {
  logger.info(`Downloading ${url}`);
  request(url, (err, response, body) => {
    if (err) return callback(err)
    saveFile(filename, body, err => {
      if (err) return callback(err);
      logger.info(`${url} downloaded and saved.`)
      callback(null, body);
    })
  })
}


const spidering = new Map();
/**
 * version3 使用forEach进行异步编程, 控制并行执行
 * @param {*} url
 * @param {*} nesting
 * @param {*} callback
 */
function spider(url, nesting, callback) {
  if (spidering.has(url)) return process.nextTick(callback);
  spidering.set(url, true);

  const filename = urlToFilename(url);
  fs.readFile(filename, 'utf8', (err, body) => {
    if (err) {
      if (err.code !== 'ENOENT') return callback(err);
      return download(url, filename, (err, body) => {
        if (err) return callback(err);
        spiderLinks(url, body, nesting, callback);
      })
    }
    spiderLinks(url, body, nesting, callback);
  })
}

function spiderLinks(currentUrl, body, nesting, callback) {
  if (nesting === 0) return process.nextTick(callback)

  const links = utilities.getPageLinks(currentUrl, body);
  if (!links.length) return process.nextTick(callback)

  let completed = 0, hasErrors = false;
  function done(err) {
    if (err) {
      hasErrors = true;
      return callback(err);
    }
    if (++completed === links.length && !hasErrors) return callback();
  }

  links.forEach(link => {
    splider(link, nesting - 1, done);
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
