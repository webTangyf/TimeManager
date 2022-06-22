/**
 * @author tangyufeng
 * @email 542853503@qq.com
 * @create date 2020-05-25 14:35:51
 * @modify date 2021-03-25 11:45:33
 * @desc 倒计时管理
 */

import * as ERR from './error'
import * as WARN from './warn'
import { esayCover, isBrowser, isNumber, getTimeStamp, isDomexcEption, isString } from './share'
import * as DATE from './time'
import * as STATUS from './status'

/*
* 默认配置项
*/
let defaultOption = {
  // 是否为调试模式
  DEBUG: false,
  // 时间间隔单位
  STEP: DATE.SECUND,
  // 是否浏览器持久化
  persisted: true
}

/**
 * 获取当前的存储对象
 */
const _getStorage = function () {
  return window[TimeManager.OPTION.DEFAULT_METHOD]
}

/**
 * 设置对应的数据
 */
 const _setTimeStorage = function (storage) {
  Object.keys(storage).forEach(key => {
    this._storage_[key] = storage[key]
  })
}

/**
 * 获取剩余的间隔时间
 * @returns {Number} 剩余的间隔时间
 */
const _getLastGap = function () {
  return Math.ceil((this._storage_.targetTimestamp - new Date().getTime()) / this._opt_.STEP)
}

/**
 * 判断当前倒计时是否已经结束
 * @returns {Boolean} 结束
 */
const _isEnd = function () {
  return this._getLastGap() <= 0
}

/**
 * 运行前参数预备
 * @desc 同时这里在start 做了二次存储预备
 */
const _init = function (isStopOpen = false) {
  const _gapStamp = this._storage_[isStopOpen ? 'stopGap' : 'gap'] * this._opt_.STEP
  const _nowStamp = new Date().getTime()
  this._storage_.beginTimestamp = _nowStamp
  this._storage_.targetTimestamp = _nowStamp + _gapStamp
  this._storage_.status = STATUS.RUNNING
}

/**
 * 计时运行函数
 */
const _run = function () {
  if (this._storage_.status !== STATUS.RUNNING) {
    return
  }
  this._timer = setTimeout(() => {
    if (this._isEnd()) {
      this.end()
      return
    }
    this._stepCallBack && this._stepCallBack(this._storage_)
    this._run()
  }, this._opt_.STEP)
}

/**
 * 获取当前所有的key值
 * @returns key值数组
 */
 const _getStorageKeys = function () {
  let index = 0
  const storage =  _getStorage()
  let key = storage.key(index)
  let keys = []
  while(isString(key)) {
    keys.push(key)
    index++
    key = storage.key(index)
  }
  return keys.filter(item => item.indexOf(TimeManager.OPTION.DEFAULT_PREFIX) === 0)
}

/**
 * 判断当前错误信息是否为超出存储空间
 * @param  {Error} error 错误信息
 */
const _isOverStorage = function (error) {
  if (isDomexcEption(error)){
    const message = error.message
    return message.includes('exceeded')
  }
}

/**
 * 根据target规则进行本地
 * @param  {Object} target 存储对象
 */
const _save2Storage = function (target) {
  const storage =  _getStorage()
  try{
    storage[`${TimeManager.OPTION.DEFAULT_PREFIX}${target.name}`] = JSON.stringify(target)
  } catch(err) {
    const isOverErr = _isOverStorage(err)
    if (isOverErr) {
      const keys = _getStorageKeys()
      if (keys.length > 0) {
        const storage =  _getStorage()
        keys.forEach(key => {
          const obj = JSON.parse(storage[key])
          if (obj.status === STATUS.END) {
            storage.removeItem(key)
          }
        })
        try{
          storage[`${TimeManager.OPTION.DEFAULT_PREFIX}${target.name}`] = JSON.stringify(target)
        } catch (err) {
          console.warn(err)
        }
      }
    }
    console.warn(err)
  }
}

/**
 * 设置代理对象
 */
const _setProxy = function () {
  let _this = this
  this._storage_ = new Proxy(this._storage_, {
    set: function (target, propKey, value, receiver) {
      const flag = Reflect.set(target, propKey, value, receiver)
      _this._save2Storage(target)
      if (_this._opt_.DEBUG) {
        console.log('proxy:',target.name , propKey, value)
      }
      return flag
    }
  })
}


/**
 * 用于设置时间
 * @param  {Number} gap
 */
const set = function (gap) {
  if (!isNumber(gap)) {
    throw ERR.TypeError('gap')
  }
  if (gap < 0) {
    WARN.GapWarn()
    gap = 0
   }
  this._storage_.gap = gap
  return this
}

/**
 * 增加时间
 * @param  {Number} gap
 */
const add = function (gap) {
  if (!isNumber(gap)) {
    throw ERR.TypeError('gap')
  }
  if (!isNumber(this._storage_.gap)) {
    throw ERR.AddAfterSet()
  }
  if (gap <= 0) {
    WARN.GapWarn()
    return this
   }
  const addGap = gap * this._opt_.STEP
  const status = this._storage_.status
  if (status === STATUS.RUNNING) {
    this._storage_.targetTimestamp += addGap
    this._storage_.gap += gap
  }
  // 这里使用includes 不使用else是考虑到后续的拓展性
  if ([STATUS.INIT, STATUS.STOP, STATUS.END].includes(status)) {
    this._storage_.gap += gap
  }
  return this
}

/**
 * 减少时间
 * @param  {Number} gap
 */
 const reduce = function (gap) {
  if (!isNumber(gap)) {
    throw ERR.TypeError('gap')
  }
  if (!isNumber(this._storage_.gap)) {
    throw ERR.ReduceAfterSet()
  }
  if (gap <= 0) {
    WARN.GapWarn()
    return this
   }
  const addGap = gap * this._opt_.STEP
  const status = this._storage_.status
  if (status === STATUS.RUNNING) {
    this._storage_.targetTimestamp -= addGap
    this._storage_.gap -= gap
    if (this._isEnd()) {
      return this.end()
    }
  }
  // 这里使用includes 不使用else是考虑到后续的拓展性
  if ([STATUS.INIT, STATUS.STOP, STATUS.END].includes(status)) {
    this._storage_.gap -= gap
    if (this._storage_.gap < 0) {
      WARN.GapReduceWarn()
      this._storage_.gap = 0
    }
  }
  return this
}

/**
 * 开始进行倒计时
 * @param  {Object} obj 配置信息
 * @param  {Function} obj.stepCallBack 每个间隙触发的函数
 * @param  {Function} obj.endCallback 每个间隙触发的函数
 */
const start = function (obj = {}) {
  if (this._storage_.status === STATUS.RUNNING) {
    WARN.hasStartedWarn(this._storage_.name)
    return this
  }
  if (!isNumber(this._storage_.gap)) {
    throw ERR.StartAfterSet()
  }
  const { stepCallBack, endCallBack } = obj
  if (endCallBack) {
    this._endCallBack = endCallBack
  }
  this._stepCallBack = stepCallBack
  this._init()
  this._run()
  if (endCallBack) {
    return this
  }
  // 参数检查
  return new Promise((resolve, reject) => {
    this._endCallBack = resolve
  })
}

/**
 * 重新开始倒计时
 * @param  {Object} obj 配置信息
 * @param  {Function} obj.stepCallBack 每个间隙触发的函数
 * @param  {Function} obj.endCallback 每个间隙触发的函数
 * @param  {Boolean} repFlag 仅针对状态是STOP的时间管理者，是否替换原本的回调函数
 */
 const reStart = function (obj = {}, repFlag) {
  let status = this._storage_.status
  const { stepCallBack, endCallback } = obj
  if (status === STATUS.STOP) {
    this._init(true)
    this._storage_.stopGap = null
    setTimeout(() => {
      if (this._isEnd()) {
        this.end()
      }
      this._run()
    })
    if (repFlag) {
      this._stepCallBack = stepCallBack
      this.endCallback = endCallback
      if (!endCallback) {
        return new Promise((resolve, reject) => {
          this._endCallBack = resolve
        })
      }
    }
    return this
  }
  if (endCallback) {
    this._endCallBack = endCallback
  }
  this._stepCallBack = stepCallBack
  if (status === STATUS.INIT) {
    return this.start(obj)
  }
  if (status === STATUS.RUNNING) {
    setTimeout(() => {
      if (this._isEnd()) {
        this.end()
      }
      this._run()
    })
    return this
  }
  // 参数检查
  return new Promise((resolve, reject) => {
    this._endCallBack = resolve
  })
}

/**
 * 停止倒计时
 */
const stop = function () {
  if (this._storage_.status === STATUS.STOP) {
    WARN.hasStopedWarn(this._storage_.name)
    return this
  }
  if (this._isEnd()) {
    this.end()
    return this
  }
  clearTimeout(this._timer)
  this._storage_.stopGap = this._getLastGap()
  this._storage_.status = STATUS.STOP
  this._storage_.beginTimestamp = null
  this._storage_.targetTimestamp = null
  return this
}

/**
 * 结束倒计时
 */
const end = function () {
  this._timer = null
  this._storage_.status = STATUS.END
  this._endCallBack && this._endCallBack(this._storage_)
  this._endCallBack = null
  this._stepCallBack = null
  return this.reset()
}

/**
 * 销毁时间管理对象
 */
const destory = function () {
  // 需要在文档里说名
  if (this._storage_.status === STATUS.RUNNING) {
    this.end()
  }
  // 排除名单
  TimeManager.names = TimeManager.names.filter(name => name !== this._storage_.name)
  // 移除本地储存
  _getStorage().removeItem(this._storage_.name)
  // 移除相关信息元
  this._storage_ = null
  this._opt_ = null
  this._endCallBack = null
  this._stepCallBack = null
  // 覆盖方法
  Object.keys(TimeManager.prototype).forEach(key => {
    this[key] = () => {
      throw ERR.runAnyAfterDestory
    }
  })
}

/**
 * 重制部分数据内容
 */
const reset = function () {
  this._storage_.gap = 0
  this._storage_.stopGap = null
  this._storage_.beginTimestamp = null
  this._storage_.targetTimestamp = null
  return this
}

/**
 * 获取状态
 */
 const getStatus = function () {
  return this._storage_.status
}
/**
 * 获取离结束的时间间隔
 */
const getGap = function () {
  return this._storage_.gap
}


/**
 * 根据当前配置重新开始
 */
const reStarts = function () {
  let keys = _getStorageKeys()
  if (keys.length === 0) {
    return {}
  }
  let map = {}
  keys.forEach(key => {
    try{
      let _storage_ = JSON.parse(_getStorage()[key])
      console.log(_storage_)
      let timeManager = new TimeManager(_storage_.option)
      timeManager._setTimeStorage(_storage_)
      map[key] = timeManager
    } catch (err) {
      console.log(err)
    }
  })
  return map
}


/**
 * 构建函数
 * @param  {Object} config 全局初始化配置
 */
const TimeManager = function (config = {persisted: true}) {
  this._opt_ = esayCover(defaultOption, config)
  if (!isBrowser() && this._opt_.persisted) {
    throw ERR.ENVError()
  }
  // TODO: 检查运行环境， 目前只支持浏览器环境
  if (this._opt_.DEBUG) {
    console.log(this._opt_)
  }
  this._storage_ = {
    name: config.name || `${getTimeStamp()}`,
    beginTimestamp: null,
    targetTimestamp: null,
    gap: null,
    stopGap: null,
    status: STATUS.INIT,
    option: this._opt_,
  }
  if (TimeManager.names.includes(this._storage_.name)) {
    throw Error(`${this._storage_.name}已经存在`)
  }
  // 避免重复命名
  TimeManager.names.push(this._storage_.name)
  if (this._opt_.persisted) {
    this._setProxy()
  }
}

// 把基础的时间常量暴露除去
TimeManager.OPTION = {
  // 全局静态的默认存储方式
  DEFAULT_METHOD: 'sessionStorage',
  // 全局存储的默认命名作用域
  DEFAULT_PREFIX: '__TIME_MANAGER__'
}
TimeManager.DATE = DATE
TimeManager.STATUS = STATUS
TimeManager._getStorage = _getStorage
TimeManager.reStarts = reStarts
TimeManager.names = []
TimeManager.prototype = {
  set,
  add,
  reduce,
  start,
  stop,
  end,
  reset,
  destory,
  reStart,
  getStatus,
  getGap,
  _init,
  _isEnd,
  _run,
  _setProxy,
  _setTimeStorage,
  _getLastGap,
  _isOverStorage,
  _save2Storage
}


export default TimeManager
