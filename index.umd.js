!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).TimeManager=e()}(this,function(){"use strict";function s(t){return Error('"'+t+'"参数类型错误')}function n(){return Error("销毁后，请不要在使用当前计时器的任何方法")}function r(){console.warn("时间间隔不得小于零")}function i(t){return"number"===e(t)}function a(){for(var t=0,e=d(),s=e.key(t),n=[];h(s);)n.push(s),s=e.key(++t);return n.filter(function(t){return 0==t.indexOf(T.OPTION.DEFAULT_PREFIX)})}function o(t){if("domexception"===e(t))return t.message.includes("exceeded")}var _=function(t){return["",void 0,null].includes(t)},u=function(t){return"object"===e(t)},h=function(t){return"string"===e(t)},e=function(t){return Object.prototype.toString.call(t).replace(/\[object|\]|\s/g,"").toLowerCase()},t=864e5,t=Object.freeze({__proto__:null,SECUND:1e3,MIN:6e4,HOUR:36e5,DAY:t,MONTH:2592e6,YEAR:31536e6}),l="INIT",c="RUNNING",g="STOP",p="END",f=Object.freeze({__proto__:null,INIT:l,RUNNING:c,STOP:g,END:p}),m={DEBUG:!1,STEP:1e3,persisted:!0},d=function(){return window[T.OPTION.DEFAULT_METHOD]},T=function t(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{persisted:!0};if(this._opt_=function(s,n){if(u(s)&&u(n))return Object.keys(s).reduce(function(t,e){return t[e]=_(n[e])&&s[e]||n[e],t},{});throw Error("esayCover函数的入参数仅接受plainObj")}(m,e),_(window)&&this._opt_.persisted)throw Error("当persisted为true时，TimeManager仅支持浏览器环境运行");if(this._opt_.DEBUG&&console.log(this._opt_),this._storage_={name:e.name||""+(new Date).getTime(),beginTimestamp:null,targetTimestamp:null,gap:null,stopGap:null,status:l,option:this._opt_},t.names.includes(this._storage_.name))throw Error(this._storage_.name+"已经存在");t.names.push(this._storage_.name),this._opt_.persisted&&this._setProxy()};return T.OPTION={DEFAULT_METHOD:"sessionStorage",DEFAULT_PREFIX:"__TIME_MANAGER__"},T.DATE=t,T.STATUS=f,T._getStorage=d,T.reStarts=function(){var t=a();if(0===t.length)return{};var n={};return t.forEach(function(t){try{var e=JSON.parse(d()[t]),s=(console.log(e),new T(e.option));s._setTimeStorage(e),n[t]=s}catch(t){console.log(t)}}),n},T.names=[],T.prototype={set:function(t){if(i(t))return t<0&&(r(),t=0),this._storage_.gap=t,this;throw s("gap")},add:function(t){if(!i(t))throw s("gap");if(!i(this._storage_.gap))throw Error("请先调用set方法后，再增加时间间隔");if(t<=0)return r(),this;var e=this._storage_.status;return e===c&&(this._storage_.targetTimestamp+=t*this._opt_.STEP,this._storage_.gap+=t),[l,g,p].includes(e)&&(this._storage_.gap+=t),this},reduce:function(t){if(!i(t))throw s("gap");if(!i(this._storage_.gap))throw Error("请先调用set方法后，再减少时间间隔");if(t<=0)return r(),this;var e=this._storage_.status;return e===c&&(this._storage_.targetTimestamp-=t*this._opt_.STEP,this._storage_.gap-=t,this._isEnd())?this.end():([l,g,p].includes(e)&&(this._storage_.gap-=t,this._storage_.gap<0&&(console.warn("reduce后的时间间隔不得小于零"),this._storage_.gap=0)),this)},start:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};if(this._storage_.status===c)return console.warn(this._storage_.name+": 已经开始计时"),this;if(!i(this._storage_.gap))throw Error("请先调用set方法后，再启用倒计时");var e=t.stepCallBack,t=t.endCallBack;return t&&(this._endCallBack=t),this._stepCallBack=e,this._init(),this._run(),t?this:new Promise(function(t,e){0})},stop:function(){return this._storage_.status===g?console.warn(this._storage_.name+": 已经开始计时"):this._isEnd()?this.end():(clearTimeout(this._timer),this._storage_.stopGap=this._getLastGap(),this._storage_.status=g,this._storage_.beginTimestamp=null,this._storage_.targetTimestamp=null),this},end:function(){return this._timer=null,this._storage_.status=p,this._endCallBack&&this._endCallBack(this._storage_),this._endCallBack=null,this._stepCallBack=null,this.reset()},reset:function(){return this._storage_.gap=0,this._storage_.stopGap=null,this._storage_.beginTimestamp=null,this._storage_.targetTimestamp=null,this},destory:function(){var e=this;this._storage_.status===c&&this.end(),T.names=T.names.filter(function(t){return t!==e._storage_.name}),d().removeItem(this._storage_.name),this._storage_=null,this._opt_=null,this._endCallBack=null,this._stepCallBack=null,Object.keys(T.prototype).forEach(function(t){e[t]=function(){throw n}})},reStart:function(){var s=this,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},e=arguments[1],n=this._storage_.status,r=t.stepCallBack,i=t.endCallback;return n===g?(this._init(!0),this._storage_.stopGap=null,setTimeout(function(){s._isEnd()&&s.end(),s._run()}),!e||(this._stepCallBack=r,this.endCallback=i)?this:new Promise(function(t,e){s._endCallBack=t})):(i&&(this._endCallBack=i),this._stepCallBack=r,n===l?this.start(t):n===c?(setTimeout(function(){s._isEnd()&&s.end(),s._run()}),this):new Promise(function(t,e){s._endCallBack=t}))},getStatus:function(){return this._storage_.status},getGap:function(){return this._storage_.gap},_init:function(){var t=this._storage_[0<arguments.length&&void 0!==arguments[0]&&arguments[0]?"stopGap":"gap"]*this._opt_.STEP,e=(new Date).getTime();this._storage_.beginTimestamp=e,this._storage_.targetTimestamp=e+t,this._storage_.status=c},_isEnd:function(){return this._getLastGap()<=0},_run:function(){var t=this;this._storage_.status===c&&(this._timer=setTimeout(function(){t._isEnd()?t.end():(t._stepCallBack&&t._stepCallBack(t._storage_),t._run())},this._opt_.STEP))},_setProxy:function(){var r=this;this._storage_=new Proxy(this._storage_,{set:function(t,e,s,n){n=Reflect.set(t,e,s,n);return r._save2Storage(t),r._opt_.DEBUG&&console.log("proxy:",t.name,e,s),n}})},_setTimeStorage:function(e){var s=this;Object.keys(e).forEach(function(t){s._storage_[t]=e[t]})},_getLastGap:function(){return Math.ceil((this._storage_.targetTimestamp-(new Date).getTime())/this._opt_.STEP)},_isOverStorage:o,_save2Storage:function(e){var s=d();try{s[""+T.OPTION.DEFAULT_PREFIX+e.name]=JSON.stringify(e)}catch(t){if(o(t)){s=a();if(0<s.length){var n=d();s.forEach(function(t){JSON.parse(n[t]).status===p&&n.removeItem(t)});try{n[""+T.OPTION.DEFAULT_PREFIX+e.name]=JSON.stringify(e)}catch(t){console.warn(t)}}}console.warn(t)}}},T});
