## TimeManager

### 文档结构

1. 简介以及场景
2. 开始使用
3. 状态介绍
4. 全局静态变量以及方法
5. api 介绍(等待完善)
6. 小提示
7. 构建基本介绍
8. 待完善

#### 1. 简介以及场景

##### 背景

因公司业务需求，可能会出现多倒计时管理，针对倒计时设计引发了一些基本的思考，并抽取了出来形成基本的倒计时工具 TimeManager

##### 场景

- hook 封装
- 时间操作封装
- 可靠性机制封装（有缺陷）

#### 2. 开始使用

time manager 支持多种多种引入方式

通过 cmd 方式

```js
// 引入构造函数
import TimeManager from "index.js";
```

通过 amd 方式

```js
// 引入构造函数
const TimeManager = require("index.js");
```

通过 script 方式

```html
<script src="./index.js"></script>
<script>
  console.log(window.TimeManager);
  // construct
</script>
```

##### 实例化

上方的函数，是针对 sdk 的构造函数，我们以 cmd 为案例，展示我们应该如何进行 sdk 的实例化以及调用

```js
import TimeManager from "index.umd.js";
const timeManager = new TimeManager({
  // 名称 （默认： 创建时的毫秒）
  name: 'myName'
  // 是否为调试模式（默认: false）
  DEBUG: false,
  // 时间间隔单位（默认: 秒）
  STEP: TimeManager.DATE.SECUND,
  // 是否持久化（默认: true）
  persisted: true,
});
```

#### 3. 状态介绍

每一个时间管理实例都会拥有 4 种对应的状态，另被 destroy 的管理实例是不会再有状态的请注意 ⚠️⚠️⚠️

- INIT 初始化
- RUNNING 运行中
- END 已结束
- STOP 暂停中

#### 4. 全局静态变量以及方法

- TimeManager.DATE 时间常量

  - SECUND 秒
  - MIN 分钟
  - HOUR 小时
  - DAY 天
  - MONTH 月
  - YEAR 年

- TimeManager.STATUS 状态常量

  - INIT 初始化
  - RUNNING 运行中
  - END 已结束
  - STOP 暂停中

- TimeManager.names 全局实例化的 name 数组

#### 5. api 介绍

- timeManager.set(...)
  设置时间 api

  ```js
  timeManager.set(10); // 为当前实列设置10秒的倒计时
  timeManager.getGap(); // 10
  ```

- timeManager.add(...)
  增加当前时间间隔 api，包含各种不同状态的处理，在非运行(`RUNNING`)状态的时候,作为单纯的逻辑辅助，可在原有设置的间隔基础上增加

  ```js
  // INIT
  timeManager.set(10).add(5);
  timeManager.getGap(); // 15
  ```

  如果在已经 `RUNNING` 状态下的 `timeManager` 去增加间隔，会引起 `timeManager` 重新调整目标时间，增加至调整后

  ```js
  // RUNNING
  timeManager.set(10).start({
    endCallBack: () => {
      // 15秒后
      console.log("end");
    },
  });
  // 异步增加时间
  setTimeout(() => {
    timeManager.add(5);
  }, TimeManager.DATE.SECUND * 2);
  ```

- timeManager.reduce(...)
  减少当前时间间隔 api，包含各种不同状态的处理，在非运行(`RUNNING`)状态的时候,作为单纯的逻辑辅助，可在原有设置的间隔基础上增加

  ```js
  // INIT
  timeManager.set(10).reduce(5);
  timeManager.getGap(); // 5
  ```

  如果在已经 `RUNNING` 状态下的 `timeManager` 去减少间隔，会引起 `timeManager` 重新调整目标时间，减少至调整后，如减少后当前时间已经到达结束时间，那么`timeManager`立即结束将会立即执行 start 挂载的`endCallBack`方法

  ```js
  // RUNNING
  timeManager.set(10).start({
    endCallBack: () => {
      // 5秒后
      console.log("end");
    },
  });
  // 异步增加时间
  setTimeout(() => {
    timeManager.reduce(5);
  }, TimeManager.DATE.SECUND * 2);
  ```

- timeManager.start(...)
  开始当前所设置的倒计时

  ```js
  // 两种尾部调用方式
  // callback的方式
  timeManager.set(10).start({
    stepCallBack: (info) => {
      console.log("stepCallBack");
    },
    endCallBack: (info) => {
      console.log("endCallBack");
    },
  });
  // Promise 的方式
  timeManager
    .set(10)
    .start({
      stepCallBack: (info) => {
        console.log("stepCallBack");
      },
    })
    .then((info) => {
      console.log("endCallBack");
    });
  ```

- timeManager.stop(...)
  暂停正在运行的`timeManager`, 暂停后可以通过`timeManager.reStart()`方法重启已经停止的`timeManager`

  ```js
  // RUNNING
  timeManager.set(10).start({
    endCallBack: () => {
      // 12秒后
      console.log("end");
    },
  });

  setTimeout(() => {
    timeManager.stop();
  }, TimeManager.DATE.SECUND * 2);

  setTimeout(() => {
    timeManager.reStart();
  }, TimeManager.DATE.SECUND * 4);
  ```

- timeManager.reStart(...)
  同 stop 所说作用

- timeManager.end(...)
  直接结束当前倒计时

  ```js
  timeManager.end();
  ```

- timeManager.getStatus(...)
  获取当前`timeManager`的状态

- timeManager.getGap(...)
  获取当前`timeManager`的所设置的时间间隔

- timeManager.destory(...)
  销毁当前实例，清除所有内部信息，同时当前实例的所有方法将会无法调用

#### 6. 小提示

1. 全局操作类函数均可使用链式调用，建议使用，使整体看起来干净整洁
2. 初始化的时候建议手动声明`name`，方便后续管理当前时间管理器
3. 当前全局静态方法`reStarts`方法仅可以根据浏览器存储的信息，重新构建全部实例并且放回对应的 map，但是相关的回调会全部消失，所以建议在`timeManager.reStart(...)`方法重新挂载，入参同`start`方法。

#### 7. 构建基本介绍

使用`rollup.js`作为构建工具

命令行

```
# 启动本地静态文件服务器
npm run serve

# 本地调试 同rollup的watch状态
npm run dev

# 打包 默认umd
npm run build

# 为了做单元测试打包 输出cjs文件
npm run build:test

# 运行单元测试
npm run test
```

8. 待完善

- 持久化自重启方案
- 运行环境适配（小程序）
- 目标时间设置启动方案
- 异步合并方案
- 参数名优化
- 文档优化
