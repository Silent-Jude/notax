// 根据guid  过滤票据信息
export function filterBillInfoByGuid(billInFos, guid) {
  if (billInFos.length < 1) return null
  // let billInFo = billInFos.filter(item => item.guid == guid )
  return billInFos.filter(item => item.guid === guid)
}

export function filterBillInfoByCode(billInFos, code) {
  if (billInFos.length < 1) return null
  return billInFos.filter(item => item.billcode === code)
}

// 计算校验位
export function CalcMy_x(aStr) {
  var myx = ''
  var m_table = [1, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2]
  var len
  var aMod, sum, Wi

  sum = 0
  len = aStr.length
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      Wi = parseInt(Math.exp((len - (i + 1) + 1) * Math.log(2)) + 0.5, 10) % 11
      sum += Wi * parseInt(aStr.substr(i, 1), 10)
    }
    aMod = sum % 11
    if (aMod === 2) {
      myx = 'X'
    } else {
      aMod = m_table[aMod]
      myx = aMod + ''
    }
  }
  return myx
}
