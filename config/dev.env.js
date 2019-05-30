'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/webapi"',//nginx反向代理的地址
  // BASE_API:'"http://lx.lixinn.xyz:18080"' //云端服务器。
  // BASE_API: '"http://10.2.1.123:88"',// 李鑫的服务器接口地址。
  // BASE_API: '"http://lx.lixinn.xyz:18080"',// 李鑫的服务器接口地址。
  // BASE_API: '"http://10.2.1.123:81"',// 李鑫的服务器接口地址。
  // BASE_API: '"http://10.1.1.33:81"',// 李鑫的外面网络服务器接口地址。
  // BASE_API: '"http://127.0.0.1:5050/nontax"',// 我的nodejs服务器本机地址。
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
})
