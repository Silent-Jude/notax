/**
 * Created by jiachenpan on 16/11/18.
 */
import { CalcMy_x } from '@/utils/pjyw'

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function formatNumber(value, checkMark, codeLength) {
  console.log('收到的value是', value, checkMark, codeLength)
  value = String(value)
  var formatNumber = ''
  var inputLength = value.length
  var zeroCount = codeLength - inputLength
  if (+checkMark === 0) {
    for (let i = 0; i < zeroCount; i++) {
      formatNumber += '0'
    }
    formatNumber += value
  } else {
    for (let i = 0; i < zeroCount - 1; i++) {
      formatNumber += '0'
    }
    formatNumber += value
    formatNumber += CalcMy_x(value)
  }
  return formatNumber
}

export function cutoffCheckMark(numberString) {
  numberString = String(numberString)
  var length = numberString.length - 1
  return numberString.slice(0, length)
}

export function getRestNumberArray(ascTableDataArray, startNumber, endNumber, checkMark) {
  var restNumberArray = []
  console.log('收到的排序后的数组为：', ascTableDataArray)
  if (+checkMark === 0) {
  // 无校验位时
  // 开头
    if (+ascTableDataArray[0].startnumber > +startNumber) {
      const newNumberItem = {}
      newNumberItem.startnumber = startNumber
      newNumberItem.endnumber = ascTableDataArray[0].startnumber - 1
      console.log('有一个大于左边界的号段被push进入', newNumberItem)

      restNumberArray.push(newNumberItem)
    }
    // 中间
    for (let i = 0; i < ascTableDataArray.length - 1; i++) {
      if (ascTableDataArray[i + 1].startnumber - 1 === +ascTableDataArray[i].endnumber) {
      // 说明连续。
      } else {
      // 说明中断了,区间数+1
        const newNumberItem = {}
        newNumberItem.startnumber = +ascTableDataArray[i].endnumber + 1
        newNumberItem.endnumber = ascTableDataArray[i + 1].startnumber - 1
        console.log('有一个中间号段被push进入', newNumberItem)
        restNumberArray.push(newNumberItem)
      }
    }
    // 结尾
    if (+ascTableDataArray[ascTableDataArray.length - 1].endnumber < +endNumber) {
      const newNumberItem = {}
      newNumberItem.startnumber = +ascTableDataArray[ascTableDataArray.length - 1].endnumber + 1
      newNumberItem.endnumber = endNumber
      console.log('有一个小于右边界的号段被push进入', newNumberItem)
      restNumberArray.push(newNumberItem)
    }
  } else {
    // 有校验位时
    // 开头
    if (+cutoffCheckMark(ascTableDataArray[0].startnumber) > +cutoffCheckMark(startNumber)) {
      console.log(+cutoffCheckMark(ascTableDataArray[0].startnumber))
      console.log(+cutoffCheckMark(startNumber))
      const newNumberItem = {}
      newNumberItem.startnumber = cutoffCheckMark(startNumber)
      newNumberItem.endnumber = cutoffCheckMark(ascTableDataArray[0].startnumber) - 1
      console.log('有一个大于左边界的号段被push进入', newNumberItem)
      restNumberArray.push(newNumberItem)
    }
    // 中间
    for (let i = 0; i < ascTableDataArray.length - 1; i++) {
      if (cutoffCheckMark(ascTableDataArray[i + 1].startnumber) - 1 === +cutoffCheckMark(ascTableDataArray[i].endnumber)) {
      // 说明连续。
      } else {
      // 说明中断了,区间数+1
        const newNumberItem = {}
        newNumberItem.startnumber = +cutoffCheckMark(ascTableDataArray[i].endnumber) + 1
        newNumberItem.endnumber = cutoffCheckMark(ascTableDataArray[i + 1].startnumber) - 1
        console.log('有一个中间号段被push进入', newNumberItem)
        restNumberArray.push(newNumberItem)
      }
    }
    // 结尾
    if (+cutoffCheckMark(ascTableDataArray[ascTableDataArray.length - 1].endnumber) < +cutoffCheckMark(endNumber)) {
      const newNumberItem = {}
      newNumberItem.startnumber = +cutoffCheckMark(ascTableDataArray[ascTableDataArray.length - 1].endnumber) + 1
      newNumberItem.endnumber = cutoffCheckMark(endNumber)
      console.log('有一个小于右边界的号段被push进入', newNumberItem)
      restNumberArray.push(newNumberItem)
    }
  }
  return restNumberArray
}

