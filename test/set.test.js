/**
 * @author tangyufeng
 * @email tangyufeng@szltech.com
 * @create date 2021-03-25 15:57:48
 * @modify date 2021-03-25 15:57:48
 * @desc 针对TimeManager.prototype.set的单元测试
 */
var TimeManager = require('../index.cjs.js')

test('timeManager set 10 getGap 10', function () {
  var timeManager = new TimeManager({
    name: 'setTest1',
    persisted: false
  })
  var gap = 10
  timeManager.set(gap)
  expect(timeManager.getGap()).toBe(gap)
})

test('timeManager set 0 getGap 0', function () {
  var timeManager = new TimeManager({
    name: 'setTest2',
    persisted: false
  })
  var gap = 0
  timeManager.set(gap)
  expect(timeManager.getGap()).toBe(0)
})

test('timeManager set -1 getGap 0', function () {
  var timeManager = new TimeManager({
    name: 'setTest3',
    persisted: false
  })
  var gap = -1
  timeManager.set(gap)
  expect(timeManager.getGap()).toBe(0)
})

test('timeManager set null toThrow', function () {
  var timeManager = new TimeManager({
    name: 'setTest4',
    persisted: false
  })
  expect(() => timeManager.set(null)).toThrow()
})

test('timeManager set string toThrow', function () {
  var timeManager = new TimeManager({
    name: 'setTest5',
    persisted: false
  })
  expect(() => timeManager.set('')).toThrow()
})

test('timeManager set undefined toThrow', function () {
  var timeManager = new TimeManager({
    name: 'setTest6',
    persisted: false
  })
  expect(() => timeManager.set(undefined)).toThrow()
})


test('timeManager set [] toThrow', function () {
  var timeManager = new TimeManager({
    name: 'setTest7',
    persisted: false
  })
  expect(() => timeManager.set([])).toThrow()
})

test('timeManager set {} toThrow', function () {
  var timeManager = new TimeManager({
    name: 'setTest9',
    persisted: false
  })
  expect(() => timeManager.set({})).toThrow()
})

test('timeManager set boolean toThrow', function () {
  var timeManager = new TimeManager({
    name: 'setTest10',
    persisted: false
  })
  expect(() => timeManager.set(false)).toThrow()
})

test('timeManager set function toThrow', function () {
  var timeManager = new TimeManager({
    name: 'setTest11',
    persisted: false
  })
  expect(() => timeManager.set(() => {})).toThrow()
})

test('timeManager set symbol toThrow', function () {
  var timeManager = new TimeManager({
    name: 'setTest12',
    persisted: false
  })
  expect(() => timeManager.set(Symbol('1'))).toThrow()
})

test('timeManager set 10 set 12 getGap 12', function () {
  var timeManager = new TimeManager({
    name: 'setTest13',
    persisted: false
  })
  timeManager.set(10).set(12)
  expect(timeManager.getGap()).toBe(12)
})