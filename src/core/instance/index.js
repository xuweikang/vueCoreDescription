import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 执行 原型上的_init方法 （此方法在initMixin中添加）
  this._init(options)
}

// 原型添加_init 方法
initMixin(Vue)

// 添加 $命名的内部代理属性方法， 比如：$data，$props，$watch、$set、$delete
stateMixin(Vue)

// 实现events的$on $off $once $emit方法
eventsMixin(Vue)

// 实现 vm._update、vm.$forceUpdate、vm.$destroy 方法
lifecycleMixin(Vue)

// vm._render vm.$nextTick
renderMixin(Vue)

export default Vue
