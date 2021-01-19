function race(tasks = []) {
  return new Promise((resolve, reject) => {

    let completed = 0;
    tasks.forEach(task => {
      task(() => {
        if (++completed === tasks.length) {
          resolve();
        }
      }, (err) => {
        reject(err);
      })
    })
  })
}

console.time('haha')
function finish(data) {
  // all the tasks completed
  console.log('finished.')
  console.timeEnd('haha')
}


const tasks = [(callback) => {
  setTimeout(() => {
    console.log(1)
    callback()
  }, 1000)
}, (callback) => {
  setTimeout(() => {
    console.log(2)
    callback()
  }, 1000)
}, (callback) => {
  setTimeout(() => {
    callback()
    console.log(3)
  }, 1000)
}];
race(tasks).then(finish).catch(console.error);


// 控制并发执行任务
function concurrenyDeal(tasks = []) {
  let concurreny = 2, running = 0, completed = 0, index = 0;

  function next() {
    while (running < concurreny && index < tasks.length) {
      task = tasks[index++]
      task(() => {
        if (completed === tasks.length) {
          return finish();
        }
        completed++, running--;
        next()
      })
      running++;
    }
  }
  next();
}

concurrenyDeal(tasks);


class TaskQueue {
  constructor(concurreny) {
    this.concurreny = concurreny;
    this.running = 0;
    this.queue = [];

  }
  pushTask(task) {
    this.queue.push(task);
    this.next()
  }
  next() {
    while (running < concurreny && this.queue.length) {
      const task = this.queue.shift();
      task(() => {
        this.running--;
        this.next();
      });
      this.running++;
    }
  }
}
