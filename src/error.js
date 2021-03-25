/**
 * @author tangyufeng
 * @email tangyufeng@szltech.com
 * @create date 2021-03-24 17:26:57
 * @modify date 2021-03-24 17:26:57
 * @desc 错误类型基本封装
 */

/**
 * 参数错误函数
 * @param  {String} 参数名称
 */
export const TypeError = param => new Error(`"${param}"参数类型错误`)
/**
 * 环境错误函数
 */
export const ENVError = () => new Error(`当persisted为true时，TimeManager仅支持浏览器环境运行`)
/**
 * 开始条件错误
 */
export const StartAfterSet = () => new Error(`请先调用set方法后，再启用倒计时`)
/**
 * 添加条件错误
 */
 export const AddAfterSet = () => new Error(`请先调用set方法后，再增加时间间隔`)
 /**
 * 减少条件错误
 */
export const ReduceAfterSet = () => new Error(`请先调用set方法后，再减少时间间隔`)
 /**
 * 销毁后错误
 */
export const runAnyAfterDestory = () => new Error(`销毁后，请不要在使用当前计时器的任何方法`)