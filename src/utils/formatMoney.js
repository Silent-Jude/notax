export default {
  // 金额转换大写：
  // 阿拉伯数字转换为大写汉字

// 阿拉伯数字转换为大写汉字
  Arabia_To_Chinese(n) {
    var unit = '仟佰拾亿仟佰拾万仟佰拾元角分', str = ''
    n += '00'
    var a = n.indexOf('-')
    if (a != -1) {
      n = n.substring(1)
      var indexpoint = n.indexOf('.') // 如果是小数，截取小数点前面的位数
      if (indexpoint >= 0) {
        n = n.substring(0, indexpoint) + n.substr(indexpoint + 1, 2) // 若为小数，截取需要使用的unit单位
      }
      unit = unit.substr(unit.length - n.length) // 若为整数，截取需要使用的unit单位
      for (var i = 0; i < n.length; i++) {
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i) // 遍历转化为大写的数字
      }
      return '负数' + str.replace(/零(仟|佰|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万/g, '$1').replace(/^元零?|零分/g, '').replace(/元$/g, '元整').replace(/角$/g, '角整') // 替换掉数字里面的零字符，得到结果
    } else {
      var indexpoint = n.indexOf('.') // 如果是小数，截取小数点前面的位数
      if (indexpoint >= 0) {
        n = n.substring(0, indexpoint) + n.substr(indexpoint + 1, 2) // 若为小数，截取需要使用的unit单位
      }
      unit = unit.substr(unit.length - n.length) // 若为整数，截取需要使用的unit单位
      for (var i = 0; i < n.length; i++) {
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i) // 遍历转化为大写的数字
      }
      return str.replace(/零(仟|佰|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万/g, '$1').replace(/^元零?|零分/g, '').replace(/元$/g, '元整').replace(/角$/g, '角整') // 替换掉数字里面的零字符，得到结果
    }
  },

  // 数字加千分位
  // 加千分符
  getComma(amountInput) {
    if (!amountInput) return
    var b = amountInput.toFixed(2)// 保留两位小数
    var c = b.replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,')// 使用正则替换，每隔三个数加一','
    return c
  }
}

