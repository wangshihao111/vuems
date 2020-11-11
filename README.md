Vue项目加载远程资源的解决方案。
---

## 说明
- 当前该方案处于验证阶段。
- webpack打包配置较为简陋，但我们提供了添加配置的入口。
- 后续会继续补充配置，达到真正完善的微服务加载解决方案。
- 当前支持webpack 4.x版本和3.x。低于3.0的版本不会做适配。

## 安装

```bash
yarn add @vuems/vue-cli-plugin-micro
```

### 添加scripts字段
```json
{
  "scripts":{
    "build:micro": "vue-cli-service build:micro"
  }
}
```

## Vue 项目打包成微前端模块

- 在项目中安装 `@vuems/client`, `@vuems/builder`
- 添加环境变量，如果用了 dotenv，则可以在根目录下的.env 文件中添加如下配置:

```bash
MICRO_DIST_DIR='./microDist'
ENTRY_FILE_PATH=./src/index.js
MICRO_APP_PATH=./
```

其含义分别为:
- MICRO_DIST_DIR：微服务打包后的输出路径
- ENTRY_FILE_PATH：微服务入口文件
- MICRO_APP_PATH：微服务 app 路径(包含 package.json 的路径)

- 添加微服务入口文件,其形式如下：
  在环境变量(ENTRY_FILE_PATH)指定的位置创建入口文件. 加入如下格式的内容

```js
import routes from "./routerConfig";
import modules from "./store/modules";
import { exportMicro } from "@vuems/client";

const config = {
  routes,
  modules,
  onInit(Vue, router, store) {
    console.log("I init.", Vue, router, store);
  },
};

exportMicro(require("../package.json").name, config);
```

其中，routes 和 modules 的导出格式如下：

```js
// ./routerConfig.js
// 路由配置和vue-router所需配置一致即可
// 组件建议使用动态导入，有利于按需加载
const = routes = [
  { path: '/example', component: () => import('/path/to/example') }
]


// ./store/modules.js
// 必须是数组，可以导出多个vuex module
const modules = [
  {
    name: 'example',
    module: {
      getters: {},
      mutations: {},
      state: {},
      actions: {}
    }
  }
]
```

- 可选配置(.microConfig.js) -- 微服务打包配置
> 目前可用配置：alias、configureWebpack、vueLoaderPath
```js
module.exports = {
  appName: 'test-app', // 微服务name
  version: '0.0.1', // 微服务版本
  // 配置webpack别名
  alias: {
    '#': path.resolve(__dirname, 'src'),
    // 其它
  },
  // 配置vueLoader路径(用于多版本冲突时)
  // vueLoaderPath: require.resolve('./node_modules/vue-loader'),
  // 可选配置webpack，接收当前webpack配置为参数，返回一个新的完整的配置
  configureWebpack(config) {
    return config;
  }
}
```

- 修改package.json

在scripts字段中加入一项：

```json
{
  "scripts":{
    "build:micro": "vuems"
  }
}
```

- 打包

在项目根目录执行`yarn build:micro`即可打包。
(也可以在项目下执行`npx vuems`)

## 打包时指定微服务app名与version

打包时会依次从以下方式获取appName和version(>号表示优先级)：

环境变量(`MICRO_APP_NAME`,`MICRO_APP_VERSION`) > .microConfig.js(`appName`,`version`) > `package.json`

### 微服务部署

将微服务打包生成的静态文件部署在任意一台可以访问的服务器上即可。


## 主工程配置(加载微服务)

- 指定环境变量MICRO_PUBLIC_URL，格式如下：

```bash
MICRO_PUBLIC_URL=http://localhost:5000/
```
如果需要加载多个微服务地址，只需将其用逗号分隔，例如
```bash
MICRO_PUBLIC_URL=http://localhost:5000/,http://localhost:6000
```

- vue项目配置(vue.config.js)

加入如下配置：
> 也就是将一些特殊的环境变量映射到客户端
```js
const webpack = require('webpack');
const { getClientEnv } = require('@vuems/core')

module.exports = {
  configureWebpack() {
    return {
      plugins: [
        new webpack.DefinePlugin(getClientEnv(['MICRO_PUBLIC_URL']))
      ]
    }
  }
}
```

- 修改vue入口文件

加入如下内容：

```js
import { initMicroConfig } from '@vuems/client';

initMicroConfig();
```

- 修改顶级组件(一般为App.vue)

```js
import { loadMicro } from '@vuems/client'

export default {
  mounted() {
    /* 
      加载微服务.
      内部会调用router.addRoutes方法添加路由。调用store.registerModule注册Vuex module.
      如果微服务定义了onInit，则会在加载后调用。
    */
    loadMicro(this.$router, this.$store).then(() => {
      // do something
    })
  }
}
```

## 高级操作

- 运行时修改微服务地址（`MICRO_PUBLIC_URL`）示例如下：
> 注意：该方法必须在`initMicroConfig`调用之后，`loadMicro`调用之前调用。否则仍然为环境变量指定的微服务地址。


```js

import { resetPublicUrls } from '@vuems/client';

const urls = [
  'http://255.255.233.22:3000',
  'http://locahost:3000',
]

resetPublicUrls(urls)

```

## TODO

- [x] 构建时通过环境变量指定微服务name
- [ ] 公用模块抽离，异步加载
- [ ] css抽离，异步加载