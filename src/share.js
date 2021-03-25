/**
 * @author tangyufeng
 * @email tangyufeng@szltech.com
 * @create date 2020-04-22 15:36:54
 * @modify date 2020-04-22 15:36:54
 * @desc 工具js
 */


/**
 * 判断数据是否为空值['', undefined, null]
 * @author tangyufeng
 * @date 2019-10-24
 * @param {any} params 任何类型
 * @returns {boolean} 是否为空数据
 * @memberof Service
 */
export const isNoValue = params => {
  const noValue = ['', undefined, null]
  return noValue.includes(params)
}

/**
 * 字符转小写
 * @author tangyufeng
 * @date 2019-10-24
 * @param {String} params
 * @returns {String} 小写后的字符串
 * @memberof Service
 */
export const toLowerCase = params => {
  if (!isString(params)) {
    throw new Error(`${params} toLowerCase is no a String`)
  }
  return params.toLowerCase()
}


// 类型判断
export const isArray = value => getType(value) === 'array'
export const isPlainObj = value => getType(value) === 'object'
export const isString = value => getType(value) === 'string'
export const isNumber = value => getType(value) === 'number'
export const isBoolean = value => getType(value) === 'boolean'
export const isRegExp = value => getType(value) === 'regexp'
export const isError = value => getType(value) === 'error'
export const isDomexcEption = value => getType(value) === 'domexception'
export const isPlainNumber = value => isNumber(value) && !isNaN(value)
export const isNestType = value => isArray(value) || isPlainObj(value)
export const isNullObj = value => isPlainObj(value) && JSON.stringify(value) === '{}'

/**
 * 通过Object的toString方法获取对象类型
 * @author tangyufeng
 * @date 2019-10-24
 * @param {*} obj
 * @returns 
 */
export const getType = obj => {
  return Object.prototype.toString.call(obj).replace(/\[object|\]|\s/g, '').toLowerCase()
}

/**
 * 判断对象是不是plain obj 字符串
 * @author tangyufeng
 * @date 2020-04-18
 * @param {String} data
 * @returns 
 */
export const isJsonStr = data => {
  return isString(data) && data.startsWith('{') && data.endsWith('}')
}

/**
 * 获取时间戳
 * @author tangyufeng
 * @date 2020-04-22
 * @returns timestamp
 */
export const getTimeStamp = () => {
  return `${new Date().getTime()}`
}
/**
 * 简单实现对象覆盖
 * @param  {Object} originObj 原对象
 * @param  {Object} targetObj 覆盖对象
 */
export const esayCover = (originObj, targetObj) => {
  if (!isPlainObj(originObj) || !isPlainObj(targetObj)) {
    throw new Error('esayCover函数的入参数仅接受plainObj')
  }
  return Object.keys(originObj).reduce((obj, key) => {
    obj[key] = (isNoValue(targetObj[key]) && originObj[key]) || targetObj[key]
    return obj
  }, {})
}


/**
 * 是否为浏览器环境
 */
export const isBrowser = () => !isNoValue(window)