const request = require('request');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const { Logger, urlToFilename, getPageLinks } = require('./utilities')
const logger = new Logger(console.log);

/**
 * version1 使用递归的方式进行处理，并且用iterate函数进行处理， 使用iterate进行串行执行机制
 * @param {*}} filename
 * @param {*} callback
 */
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

// main 主程序逻辑
spider(process.argv[2] || 'http://baidu.com', (err, filename, downloaded) => {
  if (err) {
    logger.error(err);
  } else if (downloaded) {
    logger.info(`Downloaded. ${filename}`)
  } else {
    logger.info(`${filename} has already downloaded.`)
  }
})
