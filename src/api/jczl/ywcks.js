// 业务处科室的特有api
import request from '@/utils/request'

/**
 * 获取【所属种类】下拉框中的候选列表
 */
export function getCategoryOptions() {
  return request({
    url: '/sys/sysDatadictionary/codesByKey',
    method: 'get',
    params: {
      key: 'D102'
    }
  })
}
