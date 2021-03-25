/**
 * @author tangyufeng
 * @email tangyufeng@szltech.com
 * @create date 2021-03-25 15:58:36
 * @modify date 2021-03-25 15:58:36
 * @desc 针对TimeManager.prototype.start的单元测试
 */

var TimeManager = require('../index.cjs.js')

test('timeManager start before set', function () {
  var timeManager = new TimeManager({
    name: 'startTest1',
    persisted: false
  })
  expect(() => timeManager.start()).toThrow()
})

test('timeManager set 4 start run twice stepCallBack and once endCallBack', function (done) {
  var timeManager = new TimeManager({
    name: 'startTest2',
    persisted: false
  })
  let stepIndex = 0
  timeManager
    .set(4)
    .start({
      stepCallBack: () => {
        stepIndex+=1
      },
      endCallBack: () => {
        expect(stepIndex).toBe(2)
        done()
      }
    })
})

test('timeManager set 4 start add 2 run quartic stepCallBack and once endCallBack', function (done) {
  var timeManager = new TimeManager({
    name: 'startTest3',
    persisted: false
  })
  let stepIndex = 0
  timeManager
    .set(2)
    .start({
      stepCallBack: () => {
        stepIndex+=1
      },
      endCallBack: () => {
        expect(stepIndex).toBe(2)
        done()
      }
    })
    .add(2)
})

test('timeManager set 4 start reduce 1  run once stepCallBack and once endCallBack', function (done) {
  var timeManager = new TimeManager({
    name: 'startTest4',
    persisted: false
  })
  let stepIndex = 0
  timeManager
    .set(4)
    .start({
      stepCallBack: () => {
        stepIndex+=1
      },
      endCallBack: () => {
        expect(stepIndex).toBe(1)
        done()
      }
    })
    .reduce(1)
})

test('timeManager set 4 start reduce 4 run zero stepCallBack and once endCallBack', function (done) {
  var timeManager = new TimeManager({
    name: 'startTest5',
    persisted: false
  })
  let stepIndex = 0
  timeManager
    .set(4)
    .start({
      stepCallBack: () => {
        stepIndex+=1
      },
      endCallBack: () => {
        expect(stepIndex).toBe(0)
        done()
      }
    })
    .reduce(4)
})

test('timeManager start stop test', function (done) {
  var timeManager = new TimeManager({
    name: 'startTest6',
    persisted: false
  })
  let stepIndex = 0
  timeManager
    .set(3)
    .start({
      stepCallBack: () => {
        stepIndex+=1
        if (stepIndex === 1) {
          timeManager.stop()
          setTimeout(() => {
            timeManager.reStart()
          }, 100)
        }
      },
      endCallBack: () => {
        // 为什么是 是因为中间展暂停后在启动要减去启动本身的那个间隔
        expect(stepIndex).toBe(1)
        done()
      }
    })
})

test('timeManager start status', function (done) {
  var timeManager = new TimeManager({
    name: 'startTest7',
    persisted: false
  })
  timeManager
    .set(2)
    .start({
      stepCallBack: storage => {
        expect(storage.status).toBe("RUNNING")
      },
      endCallBack: storage => {
        expect(storage.status).toBe("END")
        done()
      }
    })
})