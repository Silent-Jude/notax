import request from '@/utils/request'
var urllist = {
  '/pjgl/pjyw/pjyztzs': 'bilAdviceNote',
  '/pjgl/pjyw/pjrk': 'bilStorage',
  '/pjgl/pjyw/pjyk': 'bilMoveRecord',
  '/pjgl/pjyw/pjlysq': 'bilAgencyPurchase',
  '/pjgl/pjyw/pjly': 'bilApply',
  '/pjgl/pjyw/pjrz': 'bilCert',
  '/pjgl/pjyw/pjth': 'bilBack',
  '/pjgl/pjyw/zypjhxgl': 'bilVerification',
  '/pjgl/pjyw/yxdspjzfgl': 'bilInvalid',
  '/pjgl/pjyw/pjfz': 'bilRepeal',
  '/pjgl/pjyw/pjxh': 'bilDestory',
  '/pjgl/pjyw/dwypjh': 'bilUseplan'
  // 定义凭证规则: '',
  // 票据收支业务制证: '',
  // 票据领用证年检: '',
  // 财政退库: 'synBilRefund'
}
export function getPrintTemplateData(params) {
  return request({
    url: '/print/webPrinttemplate/userTemplateList?templatecode=' + params,
    method: 'get'
  })
}

export function savePrintTemplateData(templateData) {
  console.log('保存的模板数据是：')
  console.log(templateData)
  return request({
    url: '/print/webPrinttemplate/update',
    method: 'post',
    data: {
      guid: templateData.guid,
      isdefault: templateData.isdefault,
      isstandardtemplage: templateData.isstandardtemplage,
      templatecode: templateData.templatecode,
      templatecontent: typeof (templateData.templatecontent) === 'string' ? templateData.templatecontent : JSON.stringify(templateData.templatecontent),
      templatename: templateData.templatename,
      userid: templateData.userid
    }
  })
}

// /print/webPrinttemplate/remove

export function removePrintTemplateData(guid) {
  console.log('删除的guid是：')
  console.log(guid)
  return request({
    url: '/print/webPrinttemplate/remove?guid=' + guid,
    method: 'post'
  })
}

// 获取票据业务中的非分页打印数据。
export function getListPrintData(params) {
  var url = '/bill/' + urllist[this.$route.meta.title] + '/list'
  console.log('查看一下url', url)
  return request({
    url,
    method: 'get',
    params
  })
}
