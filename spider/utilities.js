/**
* 实现工具类
*/
const chalk = require('chalk')
function urlToFilename(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash += url[i].charCodeAt()
  }
  return hash + '';
}
class Logger {
  constructor(print) {
    if (!this instanceof Logger) return new Logger(print)
    this.logger = print;
  }
  warn(str) {
    this.logger(chalk.yellow('[warn]: ' + str))
  }
  info(str) {
    this.logger(chalk.green('[info]: ' + str))
  }
  trace(str) {
    this.logger(chalk.white('[trace]: ' + str))
  }
  error(str) {
    this.logger(chalk.red('[error]: ' + str))
  }
}
function getPageLinks(url) {
  let filename = urlToFilename(url);
  // TODO: html 文本解析，解析html中的所有Url文本
  let urls = []
  return urls;
}

class TaskQueue {
  constructor(concurreny) {
    this.concurreny = concurreny;
    this.queue = [];
    this.running = 0;
  }
  pushTask(task) {
    this.queue.push(task)
  }

  next() {
    while (this.running < this.concurreny && this.queue.length) {
      const task = this.queue.shift();
      task(() => {
        this.running--;
        this.next()
      });
      this.running++;
    }
  }
}

module.exports = {
  urlToFilename,
  Logger,
  TaskQueue,
  getPageLinks
}
