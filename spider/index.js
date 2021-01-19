/**
 * 实现网络爬虫
 */

const request = require('request');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const { Logger, urlToFilename } = require('./utilities')
const logger = new Logger(console.log);

/**
 * version0 连续回调的方式实现
 * @param {*} url
 * @param {*} callback
 */
function spider0(url, callback) { // version 0.0
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

/**
 * version1 使用递归的方式进行处理，并且用iterate函数进行处理， 使用iterate进行串行执行机制
 * @param {*}} filename
 * @param {*} callback
 */
function saveFile(filename, callback) {
  let filepath = path.dirname(filename);
  mkdirp(filepath).then(() => {
    logger.info('走2')
    fs.writeFile(filename, body, err => {
      if (err) return callback(err);
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
      logger.info(`Downloaded and saved.`)
      callback(null, body);
    })
  })
}

function spider(url, nesting, callback) {
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

function spiderLinks(url, body, nesting, callback) {
  if (nesting === 0) return process.nextTick(callback);
  const links = getPageLinks(currentUrl, body);
  function iterate(index) {
    if (index === links.length) return callback()
    spider(links[index], nesting - 1, err => {
      if (err) return callback(err)
      else iterate(index + 1)
    })
  }
  iterate(0);
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
  spider.set(url, true);

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
