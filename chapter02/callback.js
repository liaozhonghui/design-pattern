/**
 * 回调模式
 * api约定：
 * 1. 回调函数放在参数尾部
 * 2. 暴露错误优先
 * 3. 错误传播
 * 4. 对于未捕获异常使用process.on('uncaughtException') 进行异常捕捉
 */

// core callback model
function fn(a, b, callback) {
    let [err, res] = processLogic(a, b);
    if (err) return callback(err);
    
    callback(null, res);
}
process.on('uncaughtException', (err) => {
    console.log('');
    // 发送短信通知，邮件通知，或者修改报警监控文件状态
    process.exit(1);
})


// example: file read

const fs = require('fs');
const cache = {};

function inconsistentRead (filename, callback) {
    if (cache[filename]) {
        return process.nextTick(() => callback(null, cache[filename]));
    }

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) return callback(err);
        cache[filename] = data;
        callback(null, data);
    })
} 

/**
 * test cases
 */
{
    let filename = './test/url.txt';
    inconsistentRead(filename, (err, data) => {
        if(err) console.error(err);
        else {
            console.log('res:', JSON.stringify(data));
        }
    })
}
{
    // 使用监听器方式调用inconsistentRead函数
    function createFileReader(filename) {
        const listeners = [];
        inconsistentRead(filename, (err, value) => {
            listeners.forEach(listener => {
                listener(err, value);
            });
        })
        return {
            on: listener => listeners.push(listener)
        }
    }

    let filename = './test/url.txt';
    let reader = createFileReader(filename);
    reader.on((err, data) => {
        if (err) return console.error(err);
        console.log('first. data:', data);

        let reader1 = createFileReader(filename);
        reader1.on((err, data1) => {
            if (err) return console.error(err);

            console.log('second. data:', data1);
        })
    })
}