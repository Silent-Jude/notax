// 数据权限页面的api
import request from '@/utils/request'

var urlList = {
  '收费单位对应收费项目': 'ChgAgency2Chgpro',
  '收费文号对应收费项目': 'PolProjectFnoPrj',
  '业务科室对应收费单位': 'Office2ChargeAgency',
  '预算科目对应收费项目': 'BgtSub2ChgPro',
  '执收单位对应下级单位': 'ChgAgency2ChgAgency',
  '主管部门对应收费单位': 'Dept2ChargeAgency',
  '收款方式对应单位项目': 'PayMethod2ChgAgcPro',
  '票据领用证对应可用票据': 'Permit2Bill',
  '票据领用证对应收费单位': 'Permit2Agency',
  '票据对应收费项目': 'Bill2ChgPro',
  '收费大厅对应执收单位': 'HallAgency2ChargeAgency',
  '大厅单位对应收费项目': 'HallAgency2ChgPro',
  '业务科室对应收费项目': 'Office2ChgPro',
  '政策法规文件管理': 'PolProjectFnoPrj'
}
export default {
  getTree(params) {
    // 用户角色分配
    // http://10.2.1.123:88/sys/authority/findGroup2Group
    if (this.$route.path === '/qxgl/jsfp') {
      return request({
        url: '/sys/authority/findGroup2Group',
        method: 'get',
        params
      })
    }
    console.log('获取树节点的参数为：', params)
    var url = `/authority/query/find${urlList[this.$route.meta.title]}`
    return request({
      url,
      method: 'get',
      params
    })
  },
  getTreer(params) {
    // hasChildren: true
    params = {
      uid: params.officeId,
      type: !params.hasChildren ? 2 : 1
    }
    console.log('ppp', params)
    // 用户角色分配
    // http://10.2.1.123:88/sys/authority/findRolesByTypeAndUid?type=2&uid=1
    if (this.$route.path === '/qxgl/jsfp') {
      return request({
        url: '/sys/authority/findRolesByTypeAndUid',
        method: 'get',
        params
      })
    }
    // console.log('获取树节点的参数为：', params)
    // var url = `/authority/query/find${urlList[this.$route.meta.title]}`
    // return request({
    //   url,
    //   method: 'get',
    //   params
    // })
  },
  // 获取详细信息,需要传值为{guid:xxx}
  // getDetail(urlPath, params) {
  //   console.log('发送的参数为：', params)

  //   return request({
  //     url: urlPath,
  //     method: 'get',
  //     params
  //   })
  // },
  saveGrant(params) {
    console.log('发送的保存授权参数为：', JSON.stringify(params))
    // 用户角色分配
    // http://10.2.1.123/sys/authority/updateRole2User
    if (this.$route.path === '/qxgl/jsfp') {
      return request({
        url: '/sys/authority/updateRole2User',
        method: 'post',
        data: {
          userid: [params.officeId[0]],
          roleid: params.agencyId
        }
      })
    }
    var url = `/authority/update/update${urlList[this.$route.meta.title]}`
    return request({
      url,
      method: 'post',
      data: params
    })
  }
}

// 获取所有列表信息，暂时是全部列表。
// desc=desc，就降序，不然升序。
// order:字段名，按该字段名来排序。
// params是一个对象，{pid:guid的值,desc:xxx,order:xxx}
// export function getTableListInfo(urlPath, params) {
//   return request({
//     url: urlPath + '/find',
//     method: 'get',
//     params
//   })
// }
