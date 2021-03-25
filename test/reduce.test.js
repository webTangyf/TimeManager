/**
 * @author tangyufeng
 * @email tangyufeng@szltech.com
 * @create date 2021-03-25 15:58:36
 * @modify date 2021-03-25 15:58:36
 * @desc 针对TimeManager.prototype.reduce的单元测试
 */

var TimeManager = require('../index.cjs.js')

test('timeManager set 10 reduce 7 get 3', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest1',
    persisted: false
  })
  expect(timeManager.set(10).reduce(7).getGap()).toBe(3)
})

test('timeManager set 10 reduce 0 get 10', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest2',
    persisted: false
  })
  expect(timeManager.set(10).reduce(0).getGap()).toBe(10)
})

test('timeManager set 10 reduce -10 get 10', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest3',
    persisted: false
  })
  expect(
    timeManager
    .set(10)
    .reduce(-10)
    .getGap()
  ).toBe(10)
})

test('timeManager set 10 reduce null toThrow', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest4',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .reduce(null)
  expect(fn).toThrow()
})

test('timeManager set 10 reduce string toThrow', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest5',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .reduce('')
  expect(fn).toThrow()
})

test('timeManager set 10 reduce undefined toThrow', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest6',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .reduce(undefined)
  expect(fn).toThrow()
})

test('timeManager set 10 reduce [] toThrow', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest7',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .reduce([])
  expect(fn).toThrow()
})


test('timeManager set 10 reduce {} toThrow', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest8',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .reduce({})
  expect(fn).toThrow()
})

test('timeManager set 10 reduce boolean toThrow', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest9',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .reduce(false)
  expect(fn).toThrow()
})


test('timeManager set 10 reduce function toThrow', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest10',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .reduce(() => {})
  expect(fn).toThrow()
})


test('timeManager set 10 reduce symbol toThrow', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest11',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .reduce(Symbol('1'))
  expect(fn).toThrow()
})

test('timeManager set 10 reduce 1 add 2 get 7', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest12',
    persisted: false
  })
  expect(
    timeManager
    .set(10)
    .reduce(1)
    .reduce(2)
    .getGap()
  ).toBe(7)
})

test('timeManager set 10 reduce 20 get 0', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest13',
    persisted: false
  })
  expect(
    timeManager
    .set(10)
    .reduce(20)
    .getGap()
  ).toBe(0)
})

test('timeManager reduce 10 toThrow', function () {
  var timeManager = new TimeManager({
    name: 'reduceTest14',
    persisted: false
  })
  const fn = () => timeManager
  .reduce(10)
  expect(fn).toThrow()
})
