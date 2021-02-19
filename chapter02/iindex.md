# 第二章

#### 回调模式
1. 回调函数放到函数参数末尾位置
2. 错误优先暴露
3. 错误具有传播性
4. 对于未捕获异常使用Process.on('uncaughtException')方式进行监听，并及时报警且process.exit(1)退出应用程序