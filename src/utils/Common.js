
// 日期字符串到日期
export function getDate(strDate) {
  var st = strDate
  var a = st.split(' ')
  var b = a[0].split('-')
  var c = a[1].split(':')
  var date = new Date(b[0], b[1], b[2], c[0], c[1], c[2])
  console.log(' change  success', date)
  return date
}

/** 一个非常实用的json数据扁平化函数，将需要抽取的数据作为参数传入即可。data需要为json数组。
 *
 * @param {*} data        传入的树形结构json数据。
 * @param {*} keysArray   传入扁平化之后，需要的键值构成的字符串数组，
 * @param {*} level       树形结构的等级标识。
 */
export function _flatten(data, keysArray, level = 0) {
  // 剥离最外层数组[]，获取每项item，并返回一个新数组[]来保存结果。
  return data.reduce((totalArray, itemArray) => {
    return [
      ...totalArray, // 打散最外层json数组的结构，合并成一个扁平化的数组。
      // 打散传入的所需键得数组，剥离出传入的需要的键。并将需要的键赋值，加上level键值对，合并成一个扁平化的新数组。
      keysArray.reduce((totalObject, key) => {
        // 将传入的键转为对象的属性，并且赋值。
        totalObject[key] = itemArray[key]
        // 返回转换好的对象，即所需键组成的对象。
        return totalObject
      }, {
        level // 传入level的初始值对象
      }),
      // 递归调用flatten函数，并且打散递归返回结果的数组，使其扁平化。
      ..._flatten(itemArray.children || [], keysArray, level + 1)
    ]
  }, [] // 传入初始值为一个空的数组[]
  )
}
// 例子 console.log(_flatten(data, ['id', 'text']))

// 简化形式
// function flatten(data, keys, level = 0) {
//   return data.reduce(
//     (arr, x) => [
//       ...arr,
//       keys.reduce((o, k) => ((o[k] = x[k]), o), {
//         level
//       }),
//       ...flatten(x.children || [], keys, level + 1)
//     ],
//     []
//   )
// }

/**
 * 一个万能的json树数据修改函数，能够根据键名修改对应的键值，若传入searchkey和searchvalue，则可以指定修改而不是修改全部。
 * @param {*} jsonData      json数据源
 * @param {*} updateKey     需要修改的键名
 * @param {*} updateValue   需要修改的键名对应的键值
 * @param {*} searchKey     限制条件，需要修改节点的键名。若不填，则默认修改全部键值。
 * @param {*} searchValue   限制条件，需要查找的键名对应的键值。若不填，则默认修改全部键值。
 * 不只是可以用来修改，还可以置空指定节点的指定值，添加指定节点的指定属性(updateKey为不存在的属性就是增加)。
 */
export function updateJsonValue(jsonDataArray, updateKey, updateValue, searchKey, searchValue) {
  // 遍历jsonData的每一项。
  jsonDataArray.forEach((item) => {
    if (arguments.length === 5) {
      // 如果遍历到的节点，它的键值等于指定查找的键的键值。
      if (item[searchKey] === searchValue) {
        // 那么就修改该节点 需要修改的键名对应的键值。
        item[updateKey] = updateValue
      }
      // 如果没有子节点，item.children.length要放最后判断，否则报错，因为只有[]才有length。
      if (item.children !== undefined && item.children !== null && item.children !== '' && item.children
        .length !== 0) {
        // 有子节点时，递归调用，直到所有的节点遍历修改完毕。
        updateJsonValue(item.children, updateKey, updateValue, searchKey, searchValue)
      }
    } else if (arguments.length === 3) {
      item[updateKey] = updateValue
      if (item.children !== undefined && item.children !== null && item.children !== '' && item.children
        .length !== 0) {
        updateJsonValue(item.children, updateKey, updateValue)
      }
    }
  })
}

/**
 * 一个万能的json树数据删除函数，可以删除json树上，所有节点的指定属性。
 * @param {*} jsonData      待处理的json数据
 * @param {*} deleteKey     待删除的属性名（键值）
 */
export function deleteJsonKey(jsonData, deleteKey) {
  jsonData.forEach((item) => {
    // 删除所遍历到的节点上的指定属性。
    delete item[deleteKey]
    if (item.children !== undefined && item.children !== null && item.children !== '' && item.children.length !== 0) {
      // 递归调用。
      deleteJsonKey(item.children, deleteKey)
    }
  })
}

export function getCurrentMonthFirst() {
  var date = new Date()
  date.setDate(1)
  var month = parseInt(date.getMonth() + 1)
  var day = date.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day
}

export function getCurrentMonthLast() {
  var date = new Date()
  var currentMonth = date.getMonth()
  var nextMonth = ++currentMonth
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  var oneDay = 1000 * 60 * 60 * 24
  var lastTime = new Date(nextMonthFirstDay - oneDay)
  var month = parseInt(lastTime.getMonth() + 1)
  var day = lastTime.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return new Date(date.getFullYear() + '-' + month + '-' + day)
}

export function getCurrentYMD() {
  var date = new Date()
  var month = parseInt(date.getMonth() + 1)
  var day = date.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day
}

export function dateToString(date) {
  // var date = new Date()
  var month = parseInt(date.getMonth() + 1)
  var day = date.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day
}

/**
 *  递归版深克隆
 * @param {*} source
 */
export function deepClone(source) {
  const targetObj = source.constructor === Array ? [] : {} // 判断复制的目标是数组还是对象
  for (const keys in source) { // 遍历目标
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') { // 如果值是对象，就递归一下
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else { // 如果不是，就直接赋值
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

// 目标格式yyyy-MM-dd hh:mm:ss
export function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var seconds = date.getSeconds()
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds
  var targetDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return targetDate
}
