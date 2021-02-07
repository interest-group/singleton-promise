// eslint-disable-next-line no-undef
const Promise = Promise || global.Promise

function Singleton(retry) {
  if (retry && typeof retry !== 'number') {
    throw new Error('retry must be a Number')
  }
  this.retry = retry || 0
  this.queue = []
}

Singleton.prototype = {
  /**
   * 发起请求
   * @param {*} [name]  唯一标识
   * @param {Function} callback 回调函数
   * @returns {Promise} promise
   */
  call (name, callback) {
    const request = callback || name
    if (typeof request !== 'function') {
      throw new Error('callback must be a Function')
    }
    return this.start(name, request)
  },
  /**
   * 释放资源
   * @param {*} [name]  唯一标识
   */
  remove (name) {
    const index = this.findSourceIndex(name)
    this.queue[index] = null
  },
  /**
   * 释放所有资源
   */
  removeAll () {
    this.queue = []
  },
  // 请求资源
  start (key, request) {
    // 资源
    let source = this.queue[this.findSourceIndex(key)]
    if (!source) {
      source = { key, retry: this.retry, request }
      this.queue.push(source)
    }
    // promise
    if (!source.promise) {
      this.setPromise(source)
    }
    return source.promise
  },
  // 创建promise
  setPromise (source) {
    source.promise = Promise.resolve(source.request(source)).catch(error => {
      // 错误，重试计次
      if (source.retry >= 1) {
        source.retry--
        this.setPromise(source)
        return source.promise
      } else {
        // 错误，重试计次
        source.retry = this.retry
        source.promise = null
        return Promise.reject(error)
      }
    })
  },
  findSourceIndex (key) {
    for (let i = 0; i < this.queue.length;i++ ) {
      if (this.queue[i] && this.queue[i].key === key) {
        return i
      }
    }
    return -1
  }
}

export default Singleton
