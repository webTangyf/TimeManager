/**
 * @author tangyufeng
 * @email tangyufeng@szltech.com
 * @create date 2021-03-24 17:26:57
 * @modify date 2021-03-24 17:26:57
 * @desc 提醒封装
 */

/**
 * 时间间隔错误warn
 */
export const GapWarn = () => console.warn("时间间隔不得小于零")


/**
 * reduce时间间隔错误warn
 */
 export const GapReduceWarn = () => console.warn("reduce后的时间间隔不得小于零")

/**
 * 已经开始计时警告
 * @param  {String} name 计时器名称
 */
export const hasStartedWarn = name => console.warn(`${name}: 已经开始计时`)

/**
 * 已经停止计时警告
 * @param  {String} name 计时器名称
 */
 export const hasStopedWarn = name => console.warn(`${name}: 已经开始计时`)
