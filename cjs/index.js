"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));

function Singleton(retry) {
  if (retry && typeof retry !== 'number') {
    throw new Error('retry must be a Number');
  }

  this.retry = retry || 0;
  this.queue = [];
}

Singleton.prototype = {
  /**
   * 发起请求
   * @param [name] * 唯一标识
   * @param callback 回调函数
   * @returns promise
   */
  call: function call(name, callback) {
    var request = callback || name;

    if (typeof request !== 'function') {
      throw new Error('callback must be a Function');
    }

    return this.start(name, request);
  },
  // 释放资源
  remove: function remove(name) {
    var index = this.queue.findIndex(function (source) {
      return source.key === name;
    });

    if (index >= 0) {
      this.queue.splice(index, 1);
    }
  },
  // 释放所有
  removeAll: function removeAll() {
    this.queue = [];
  },
  // 请求资源
  start: function start(key, request) {
    // 资源
    var source = this.queue.find(function (source) {
      return source.key === key;
    });

    if (!source) {
      source = {
        key: key,
        retry: this.retry,
        request: request
      };
      this.queue.push(source);
    } // promise


    if (!source.promise) {
      this.setPromise(source);
    }

    return source.promise;
  },
  // 创建promise
  setPromise: function setPromise(source) {
    var _this = this;

    source.promise = _promise.default.resolve(source.request(source)).catch(function (error) {
      // 错误，重试计次
      if (source.retry >= 1) {
        source.retry--;

        _this.setPromise(source);

        return source.promise;
      } else {
        // 错误，重试计次
        source.retry = _this.retry;
        source.promise = null;
        return _promise.default.reject(error);
      }
    });
  }
};
var _default = Singleton;
exports.default = _default;