# singleton-promise

promise单例化

一般场景为：用户请求相同资源时，仅发起首次请求，以达到优化请求目的。

相比缓存资源数据，该方案可在Pending状态时，阻止请求。

## 安装

```
npm i singleton-promise -save
```


## 使用

- 调用 `call` 方法时，传入的 `callback` 参数，必须是同一函数引用，用于判断相同请求。

```
import Singleton from 'singleton-promise'

const singleton = new Singleton()

const loadEcharts = () => loadScript('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.1/echarts.min.js')

singleton.call(loadEcharts).then(() => {
  console.log('source loaded')
})

```


## 参数


- 创建实例时，可传 `retry` 参数，表示请求资源失败时，自动重试次数

- 调用 `call` 方法时，可传 `name` 参数，显性标识相同请求。此时 `callback` 参数可使用任意函数。

```
import Singleton from 'singleton-promise'

// retry = 3。 表示请求资源失败时，自动重试3次
const singleton = new Singleton(3)

const src = 'https://cdn.bootcdn.net/ajax/libs/echarts/5.0.1/echarts.min.js'

// name = src。 显性标识相同请求
singleton.call(src, () => loadScript(src)).then(() => {
  console.log('source loaded')
})
```

## API

### new Singleton(retry)

|名称|类型|默认值|描述|
|-|-|-|-|
|retry|Number|0|自动重试次数|

## 实例方法

### singleton.call([name], callback)

请求资源，返回`Promise`

|名称|类型|默认值|描述|
|-|-|-|-|
|name|*|callback|可选参数，显性标识相同请求|
|callback|Function|-|必填参数，请求方法|

### singleton.remove(name)

从实例中移除指定请求

### singleton.removeAll(name)

从实例中移除所有请求


## 注意

- 忽略 `name` 参数时，传入的 `callback` 参数，必须是同一函数引用，用于判断相同请求。

- 内部不包含 Promise 的 polyfill。如在浏览器环境使用，需要自行polyfill。
