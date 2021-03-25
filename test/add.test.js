/**
 * @author tangyufeng
 * @email tangyufeng@szltech.com
 * @create date 2021-03-25 15:58:36
 * @modify date 2021-03-25 15:58:36
 * @desc 针对TimeManager.prototype.add的单元测试
 */

var TimeManager = require('../index.cjs.js')

test('timeManager set 10 add 10 get 20', function () {
  var timeManager = new TimeManager({
    name: 'addTest1',
    persisted: false
  })
  expect(timeManager.set(10).add(10).getGap()).toBe(20)
})

test('timeManager set 10 add 0 get 10', function () {
  var timeManager = new TimeManager({
    name: 'addTest2',
    persisted: false
  })
  expect(timeManager.set(10).add(0).getGap()).toBe(10)
})

test('timeManager set 10 add -10 get 10', function () {
  var timeManager = new TimeManager({
    name: 'addTest3',
    persisted: false
  })
  expect(
    timeManager
    .set(10)
    .add(-10)
    .getGap()
  ).toBe(10)
})

test('timeManager set 10 add null toThrow', function () {
  var timeManager = new TimeManager({
    name: 'addTest4',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .add(null)
  expect(fn).toThrow()
})

test('timeManager set 10 add string toThrow', function () {
  var timeManager = new TimeManager({
    name: 'addTest5',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .add('')
  expect(fn).toThrow()
})

test('timeManager set 10 add undefined toThrow', function () {
  var timeManager = new TimeManager({
    name: 'addTest6',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .add(undefined)
  expect(fn).toThrow()
})

test('timeManager set 10 add [] toThrow', function () {
  var timeManager = new TimeManager({
    name: 'addTest7',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .add([])
  expect(fn).toThrow()
})


test('timeManager set 10 add {} toThrow', function () {
  var timeManager = new TimeManager({
    name: 'addTest8',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .add({})
  expect(fn).toThrow()
})

test('timeManager set 10 add boolean toThrow', function () {
  var timeManager = new TimeManager({
    name: 'addTest9',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .add(false)
  expect(fn).toThrow()
})


test('timeManager set 10 add function toThrow', function () {
  var timeManager = new TimeManager({
    name: 'addTest10',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .add(() => {})
  expect(fn).toThrow()
})


test('timeManager set 10 add symbol toThrow', function () {
  var timeManager = new TimeManager({
    name: 'addTest11',
    persisted: false
  })
  const fn = () => timeManager
  .set(10)
  .add(Symbol('1'))
  expect(fn).toThrow()
})

test('timeManager set 10 add 10 add 2 get 22', function () {
  var timeManager = new TimeManager({
    name: 'addTest12',
    persisted: false
  })
  expect(
    timeManager
    .set(10)
    .add(10)
    .add(2)
    .getGap()
  ).toBe(22)
})

test('timeManager add 10 toThrow', function () {
  var timeManager = new TimeManager({
    name: 'addTest13',
    persisted: false
  })
  const fn = () => timeManager
  .add(10)
  expect(fn).toThrow()
})