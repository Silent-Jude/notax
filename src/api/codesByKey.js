import request from '@/utils/request'

export function codesByKey(key) {
  // http://10.2.1.123/sys/sysDatadictionary/codesByKey?key=D112
  return request({
    url: `/sys/sysDatadictionary/codesByKey?key=${key}`,
    method: 'get'
  })
}
