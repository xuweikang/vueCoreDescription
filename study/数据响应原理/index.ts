/* eslint-disable flowtype/no-types-missing-file-annotation */
// eslint-disable-next-line flowtype/no-types-missing-file-annotation





class Observer {
  value: any
  constructor(value: any) {
    this.value = value
    if (Array.isArray(value)) {
      // 数组的响应式原理
    } else {
      this.walk(value)
    }
  }
  walk(data: any) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      this.defineReactive(data, keys[i]) // 给数据增加响应式绑定
    }
  }
  defineReactive(obj: any, key: string) {
    if(typeof key === 'object') {
      new Observer(key)
    }
    let val = obj[key]
    const dep = new Dep() // 实例化一个依赖管理器
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 触发依赖收集
        console.log('触发依赖收集')
        if (Dep.target) {
          dep.depend()
        }
        return val
      },
      set(newVal) {
        // 通知更新
        if (newVal === val || (newVal !== newVal && val !== val)) return
        console.log('数据更新了')
        dep.notify()
        val = newVal
      }
    })
  }
}

// 依赖管理器
class Dep {
  subs: any[]
  static target: any
  constructor() {
    this.subs = []
  }
  addSub (sub: any) {
    this.subs.push(sub)
  }
  // 添加一个依赖
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  // 通知所有依赖进行更新
  notify() {
    const subs = this.subs.slice()
    for (let i = 0; i < subs.length; i ++) {
      subs[i].update()
    }
  }
}
Dep.target = null


// 依赖到底是谁？
// 谁用到了数据，就为谁绑定一个Watcher实例，在之后数据变化时，我们不直接通知
// 依赖更新，而且通知依赖对应的Watch实例，由Watcher去通知真正的视图。
class Watcher {
  value: any
  getter: Function
  constructor(exOrFn: Function) {
    this.getter = exOrFn
    this.value = this.get() // 手动触发get
  }
  get() {
    Dep.target = this // 设置 Dep.target，在触发依赖收集的时候能够分别
    let value = this.getter.call(this) // 执行exOrFn触发get（触发渲染函数）
    Dep.target = null // 重置 Dep.target，为下一个watcher实例做准备
    return value
  }
  addDep(dep: any) {
    dep.addSub(this)
  }
  update() {
    console.log('watcher update', )
  }
}
const glob: any = global
// 模拟渲染render
function render() {
  console.log('开始render', glob.$data.name, glob.$data.age)
  setTimeout(() => {
    console.log('开始render2', glob.$data.name, glob.$data.age)
  },0)
}
const obj = new Observer({
  name: 'xwk',
  age: '30'
});
glob.$data = new Proxy(obj.value, {}) //代理到$data
new Watcher(render) // render里面进行了依赖收集

obj.value.name = 'xwk2' // 改变数据
obj.value.age = '31' // 改变数据
