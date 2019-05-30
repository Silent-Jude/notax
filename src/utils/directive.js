import Vue from 'vue'
import { CalcMy_x } from '@/utils/pjyw'
import Bus from '@/utils/Bus'

Vue.directive('changeStartNumber', {
  bind: function(el, binding) {
    console.log('执行startNumber指令')
    console.log('当前绑定行的值为：', binding.value)
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldValue = ''
    if (+rowData.checkmark === 1) {
      numberLength = rowData.codelength - 1
    } else {
      numberLength = rowData.codelength
    }
    var minStartNumber = +(rowData.startnumber.slice(0, numberLength))
    var maxStartNumber = +(rowData.endnumber.slice(0, numberLength))

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldValue = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      var inputValue = el.firstElementChild.value.toString() // 记录输入的值
      if (isNaN(Number(inputValue))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.startnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }

      var reviseValue = ''
      var reviseNumber = ''
      if (inputValue.length > rowData.codelength) { // 不管有没有校验位，值长度超范围都报错
        Bus.$emit('billNumberOutRange', `该票种有校验位，并且票据号码长度必须为${rowData.codelength}位`)
        el.firstElementChild.value = oldValue
        rowData.startnumber = oldValue
        return
      }

      // 这一团判断起始号应该小于终止号
      if (+rowData.checkmark === 1) {
        if (inputValue.length === rowData.codelength) {
          if (+(inputValue.slice(0, inputValue.length - 1)) > +rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
            Bus.$emit('billNumberOutRange', `起始号码必须小于于终止号码！`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        } else if (inputValue.length < rowData.codelength) {
          if (+inputValue > +rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
            Bus.$emit('billNumberOutRange', `起始号码必须小于终止号码！`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        }
      } else {
        if (+inputValue > +rowData.endnumber) {
          Bus.$emit('billNumberOutRange', `起始号码必须小于终止号码！`)
          el.firstElementChild.value = oldValue
          rowData.startnumber = oldValue
          return
        }
      }

      if (inputValue.length === rowData.codelength) { // 值长度等于规定长度时
        if (+rowData.checkmark === 1) { // 有校验位时
          inputValue = inputValue.slice(0, inputValue.length - 1)
          if (inputValue > maxStartNumber || inputValue < minStartNumber) { // 值超标时
            restZeroLength = numberLength - inputValue.length
            for (let i = 0; i < restZeroLength; i++) {
              reviseValue += '0'
            }
            reviseValue += inputValue
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
            Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${reviseValue}】至【${rowData.endnumber}】的票据，请检查`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        } else { // 无校验位
          if (+inputValue > +maxStartNumber || +inputValue < +minStartNumber) { // 值超标时
            restZeroLength = numberLength - inputValue.length
            for (let i = 0; i < restZeroLength; i++) {
              reviseValue += '0'
            }
            reviseValue += inputValue
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
            Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${reviseValue}】至【${rowData.endnumber}】的票据，请检查`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        }
      } else { // 值长度不够，一定没有输入校验位时
        if (+inputValue > +maxStartNumber || +inputValue < +minStartNumber) { // 值超标时
          restZeroLength = numberLength - inputValue.length
          for (let i = 0; i < restZeroLength; i++) {
            reviseValue += '0'
          }
          reviseValue += inputValue
          if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
          }
          Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${reviseValue}】至【${rowData.endnumber}】的票据，请检查`)
          el.firstElementChild.value = oldValue
          rowData.startnumber = oldValue
          return
        }
      }
      // 这里的数据都是合格数据
      restZeroLength = numberLength - inputValue.length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += inputValue
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      el.firstElementChild.value = reviseValue
      // 这里必须改一下，因为如果不改，那么rowData中的值会自动去掉开始的0，可能是el-input在进行双向绑定赋值时，调用了类似trim去多余的0
      // 或者是将string类型转换成了int类型，导致去了0
      rowData.startnumber = reviseValue
      // 这里改动份数
      if (+rowData.checkmark === 1) {
        rowData.inventory = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.inventory = rowData.endnumber - rowData.startnumber + 1
      }

      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }
      // 这里改本数
      rowData.counts = rowData.inventory / rowData.portions
    }
  }
})
Vue.directive('changeStartNumberNoLimit', {
  bind: function(el, binding) {
    console.log('执行startNumber指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldValue = ''

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldValue = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      if (+rowData.checkmark === 1) {
        numberLength = rowData.codelength - 1
      } else {
        numberLength = rowData.codelength
      }
      console.log('执行了无限制startnumber指令')
      var inputValue = el.firstElementChild.value.toString() // 记录输入的值
      if (isNaN(Number(inputValue))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.startnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      if (+inputValue <= 0) {
        Bus.$emit('billNumberOutRange', `起始号码必须大于0`)
        rowData.startnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      if (inputValue.length > rowData.codelength) { // 不管有没有校验位，值长度超范围都报错
        Bus.$emit('billNumberOutRange', `该票种有校验位，并且票据号码长度必须为${rowData.codelength}位`)
        el.firstElementChild.value = oldValue
        rowData.startnumber = oldValue
        return
      }

      // 这一团判断起始号应该小于终止号
      if (+rowData.checkmark === 1) {
        if (inputValue.length === rowData.codelength) {
          if (+(inputValue.slice(0, inputValue.length - 1)) > +rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
            Bus.$emit('billNumberOutRange', `起始号码必须小于于终止号码！`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        } else if (inputValue.length < rowData.codelength) {
          if (+inputValue > +rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
            Bus.$emit('billNumberOutRange', `起始号码必须小于终止号码！`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        }
      } else {
        if (+inputValue > +rowData.endnumber) {
          Bus.$emit('billNumberOutRange', `起始号码必须小于终止号码！`)
          el.firstElementChild.value = oldValue
          rowData.startnumber = oldValue
          return
        }
      }

      if (inputValue.length === rowData.codelength) { // 值长度等于规定长度时
        if (+rowData.checkmark === 1) { // 有校验位时
          inputValue = inputValue.slice(0, inputValue.length - 1)
        }
      }
      // 这里的数据都是合格数据
      restZeroLength = numberLength - inputValue.length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += inputValue
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      el.firstElementChild.value = reviseValue
      // 这里必须改一下，因为如果不改，那么rowData中的值会自动去掉开始的0，可能是el-input在进行双向绑定赋值时，调用了类似trim去多余的0
      // 或者是将string类型转换成了int类型，导致去了0
      rowData.startnumber = reviseValue
      // 这里改终止号码,只有起始号码大于终止号码才改。
      if (+rowData.checkmark === 1) {
        if (reviseValue.slice(0, reviseValue.length - 1) > rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
          rowData.endnumber = reviseValue
        }
      } else {
        if (+reviseValue > +rowData.endnumber) {
          rowData.endnumber = reviseValue
        }
      }
      // 这里改动份数inventory
      if (+rowData.checkmark === 1) {
        rowData.inventory = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.inventory = rowData.endnumber - rowData.startnumber + 1
      }

      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }
      // 这里改本数
      rowData.counts = rowData.inventory / rowData.portions
    }
  }
})
Vue.directive('changeEndNumber', {
  bind: function(el, binding) {
    console.log('执行EndNumber指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldValue = ''
    if (+rowData.checkmark === 1) {
      numberLength = rowData.codelength - 1
    } else {
      numberLength = rowData.codelength
    }
    var minEndNumber = +(rowData.startnumber.slice(0, numberLength))
    var maxEndNumber = +(rowData.endnumber.slice(0, numberLength))
    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldValue = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      console.log('执行end的change')
      var inputValue = el.firstElementChild.value.toString() // 记录输入的值
      if (isNaN(Number(inputValue))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.endnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      if (inputValue.length > rowData.codelength) { // 不管有没有校验位，值长度超范围都报错
        Bus.$emit('billNumberOutRange', `该票种有校验位，并且票据号码长度必须为${rowData.codelength}位`)
        el.firstElementChild.value = oldValue
        rowData.endnumber = oldValue
        return
      }
      if (inputValue.length === rowData.codelength) { // 值长度等于规定长度时
        if (+rowData.checkmark === 1) { // 有校验位时
          inputValue = inputValue.slice(0, inputValue.length - 1)
          if (inputValue > maxEndNumber || inputValue < minEndNumber) { // 值超标时
            restZeroLength = numberLength - inputValue.length
            for (let i = 0; i < restZeroLength; i++) {
              reviseValue += '0'
            }
            reviseValue += inputValue
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
            Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
            el.firstElementChild.value = oldValue
            rowData.endnumber = oldValue
            return
          }
        } else { // 无校验位
          if (+inputValue > +maxEndNumber || +inputValue < +minEndNumber) { // 值超标时
            restZeroLength = numberLength - inputValue.length
            for (let i = 0; i < restZeroLength; i++) {
              reviseValue += '0'
            }
            reviseValue += inputValue
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
            Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
            el.firstElementChild.value = oldValue
            rowData.endnumber = oldValue
            return
          }
        }
      } else { // 值长度不够，一定没有输入校验位时
        if (+inputValue > +maxEndNumber || +inputValue < +minEndNumber) { // 值超标时
          console.log('此时输入的值为', inputValue)
          console.log(`限制范围是${minEndNumber}——${maxEndNumber}`)
          restZeroLength = numberLength - inputValue.length
          for (let i = 0; i < restZeroLength; i++) {
            reviseValue += '0'
          }
          reviseValue += inputValue
          if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
          }
          console.log(reviseValue)
          console.log(reviseNumber)

          Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
          el.firstElementChild.value = oldValue
          rowData.endnumber = oldValue
          return
        }
      }
      // 这里的数据都是合格数据
      restZeroLength = numberLength - inputValue.length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += inputValue
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      el.firstElementChild.value = reviseValue
      // 这里必须改一下，因为如果不改，那么rowData中的值会自动去掉开始的0，可能是el-input在进行双向绑定赋值时，调用了类似trim去多余的0
      // 或者是将string类型转换成了int类型，导致去了0
      rowData.endnumber = reviseValue
      // 这里改动份数
      if (+rowData.checkmark === 1) {
        rowData.inventory = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.inventory = rowData.endnumber - rowData.startnumber + 1
      }

      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }
      // 这里改本数
      rowData.counts = rowData.inventory / rowData.portions
    }
  }
})
Vue.directive('changeEndNumberNoLimit', {
  bind: function(el, binding) {
    console.log('执行EndNumber指令', binding.value)
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldValue = ''

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldValue = el.firstElementChild.value.toString()
      console.dir(el)
    }
    el.firstElementChild.onchange = function() {
      if (+rowData.checkmark === 1) {
        numberLength = rowData.codelength - 1
      } else {
        numberLength = rowData.codelength
      }
      var inputValue = el.firstElementChild.value.toString() // 记录输入的值
      if (isNaN(Number(inputValue))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.endnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      if (+inputValue <= 0) {
        Bus.$emit('billNumberOutRange', `终止号码必须大于0`)
        rowData.endnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      if (inputValue.length > rowData.codelength) { // 不管有没有校验位，值长度超范围都报错
        Bus.$emit('billNumberOutRange', `该票种有校验位，并且票据号码长度必须为${rowData.codelength}位`)
        el.firstElementChild.value = oldValue
        rowData.endnumber = oldValue
        return
      }
      if (inputValue.length === rowData.codelength) { // 值长度等于规定长度时
        if (+rowData.checkmark === 1) { // 有校验位时
          inputValue = inputValue.slice(0, inputValue.length - 1)
        }
      }
      // 这里的数据都是合格数据

      if (+inputValue < +rowData.startnumber) {
        Bus.$emit('billNumberOutRange', `终止号码必须大于起始号码！！`)
        el.firstElementChild.value = oldValue
        rowData.endnumber = oldValue
        console.dir(el)
        return
      }
      restZeroLength = numberLength - inputValue.length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += inputValue
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      el.firstElementChild.value = reviseValue
      // 这里必须改一下，因为如果不改，那么rowData中的值会自动去掉开始的0，可能是el-input在进行双向绑定赋值时，调用了类似trim去多余的0
      // 或者是将string类型转换成了int类型，导致去了0
      rowData.endnumber = reviseValue
      // 这里改动份数
      if (+rowData.checkmark === 1) {
        rowData.inventory = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.inventory = rowData.endnumber - rowData.startnumber + 1
      }

      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }
      // 这里改本数
      rowData.counts = rowData.inventory / rowData.portions
      console.log('输入的是', inputValue, '比较的是', rowData.startnumber)
    }
  }
})
Vue.directive('changeInventory', {
  bind: function(el, binding) {
    console.log('执行改变份数指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldInventory = ''
    if (+rowData.checkmark === 1) {
      numberLength = rowData.codelength - 1
    } else {
      numberLength = rowData.codelength
    }
    var minEndNumber = +(rowData.startnumber.slice(0, numberLength))
    var maxEndNumber = +(rowData.endnumber.slice(0, numberLength))

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldInventory = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      var inputInventory = el.firstElementChild.value.toString() // 记录输入的份数
      if (isNaN(Number(inputInventory))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.inventory = oldInventory
        el.firstElementChild.value = oldInventory
        return
      }
      if (inputInventory <= 0) {
        Bus.$emit('billNumberOutRange', `份数必须大于0！！`)
        rowData.inventory = oldInventory
        el.firstElementChild.value = oldInventory
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      var computedEndNumber = ''
      if (+rowData.checkmark === 1) { // 根据是否含有校验位，计算好的票据endnumber，此时还未经过任何校验。
        // computedEndNumber = +(rowData.endnumber.slice(0, numberLength)) - inputInventory
        computedEndNumber = +(rowData.startnumber.slice(0, numberLength)) + +inputInventory - 1
      } else {
        computedEndNumber = +rowData.startnumber + +inputInventory - 1
      }
      // 计算出来的computedEndNumber,肯定不会超过codelength
      if (+computedEndNumber > +maxEndNumber || +computedEndNumber < +minEndNumber) { // 超过票据范围
        restZeroLength = numberLength - computedEndNumber.toString().length
        for (let i = 0; i < restZeroLength; i++) {
          reviseValue += '0'
        }
        reviseValue += computedEndNumber
        if (+rowData.checkmark === 1) { // 超限，且有校验位时
          reviseNumber = CalcMy_x(reviseValue)
          reviseValue += reviseNumber
        }
        Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
        el.firstElementChild.value = oldInventory
        rowData.inventory = oldInventory
        return
      }
      // 这里的computedEndNumber,一定没有超过票据范围
      restZeroLength = numberLength - computedEndNumber.toString().length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += computedEndNumber
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      // 这里改endnumber
      rowData.endnumber = reviseValue
      // // 有些页面，传的是num
      rowData.num = rowData.inventory
      // 这里改counts
      rowData.counts = rowData.inventory / rowData.portions
    }
  }
})
Vue.directive('changeInventoryNoLimit', {
  bind: function(el, binding) {
    console.log('执行改变份数指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldInventory = ''
    // var oldEndNumber = ''

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldInventory = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      if (+rowData.checkmark === 1) {
        numberLength = rowData.codelength - 1
      } else {
        numberLength = rowData.codelength
      }
      var inputInventory = el.firstElementChild.value.toString() // 记录输入的份数
      if (isNaN(Number(inputInventory))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.inventory = oldInventory
        el.firstElementChild.value = oldInventory
        return
      }
      if (+inputInventory <= 0) {
        Bus.$emit('billNumberOutRange', `份数必须大于0！！`)
        rowData.inventory = oldInventory
        el.firstElementChild.value = oldInventory
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      var computedEndNumber = ''
      if (+rowData.checkmark === 1) { // 根据是否含有校验位，计算好的票据endnumber，此时还未经过任何校验。
        computedEndNumber = +(rowData.startnumber.slice(0, numberLength)) + +inputInventory - 1
      } else {
        computedEndNumber = +rowData.startnumber + +inputInventory - 1
      }
      // 这里的computedEndNumber,一定没有超过票据范围
      restZeroLength = numberLength - computedEndNumber.toString().length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += computedEndNumber
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      // 这里改endnumber
      rowData.endnumber = reviseValue
      // // 有些页面，传的是num，防止字段名不同导致报错。防坑处理。
      rowData.num = rowData.inventory
      // 这里改counts
      rowData.counts = rowData.inventory / rowData.portions
      console.dir(el)
    }
  }
})
Vue.directive('changeCounts', {
  bind: function(el, binding) {
    console.log('执行改变本数指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldCounts = ''

    if (+rowData.checkmark === 1) {
      numberLength = rowData.codelength - 1
    } else {
      numberLength = rowData.codelength
    }
    var minEndNumber = +(rowData.startnumber.slice(0, numberLength))
    var maxEndNumber = +(rowData.endnumber.slice(0, numberLength))

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldCounts = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      var inputCounts = el.firstElementChild.value.toString() // 记录输入的本数
      if (isNaN(Number(inputCounts))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        el.firstElementChild.value = oldCounts
        rowData.counts = oldCounts
        return
      }
      if (+inputCounts <= 0) {
        Bus.$emit('billNumberOutRange', `份数必须大于0！！`)
        el.firstElementChild.value = oldCounts
        rowData.counts = inputCounts
        return
      }

      var reviseValue = ''
      var reviseNumber = ''
      var computedEndNumber = ''
      if (+rowData.checkmark === 1) { // 根据是否含有校验位，计算好的票据endnumber，此时还未经过任何校验。
        // computedEndNumber = +(rowData.endnumber.slice(0, numberLength)) - inputCounts
        computedEndNumber = +(rowData.startnumber.slice(0, numberLength)) + (+inputCounts * rowData.portions) - 1
      } else {
        computedEndNumber = +rowData.startnumber + (+inputCounts * rowData.portions) - 1
      }
      // 计算出来的computedEndNumber,肯定不会超过codelength
      if (+computedEndNumber > +maxEndNumber || +computedEndNumber < +minEndNumber) { // 超过票据范围
        restZeroLength = numberLength - computedEndNumber.toString().length
        for (let i = 0; i < restZeroLength; i++) {
          reviseValue += '0'
        }
        reviseValue += computedEndNumber
        if (+rowData.checkmark === 1) { // 超限，且有校验位时
          reviseNumber = CalcMy_x(reviseValue)
          reviseValue += reviseNumber
        }
        Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
        el.firstElementChild.value = oldCounts
        rowData.counts = oldCounts
        return
      }
      // 这里的computedEndNumber,一定没有超过票据范围
      restZeroLength = numberLength - computedEndNumber.toString().length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += computedEndNumber
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      // 这里改endnumber
      rowData.endnumber = reviseValue
      // 这里改inventory
      rowData.inventory = rowData.counts * rowData.portions
      // 这里改num
      rowData.num = rowData.counts * rowData.portions
    }
  }
})
Vue.directive('changeCountsNoLimit', {
  bind: function(el, binding) {
    console.log('执行改变本数指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldCounts = ''

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldCounts = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      if (+rowData.checkmark === 1) {
        numberLength = rowData.codelength - 1
      } else {
        numberLength = rowData.codelength
      }
      var inputCounts = el.firstElementChild.value.toString() // 记录输入的本数
      if (isNaN(Number(inputCounts))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！本数只能为数字！`)
        rowData.counts = oldCounts
        el.firstElementChild.value = oldCounts
        return
      }
      if (+inputCounts <= 0) {
        Bus.$emit('billNumberOutRange', `本数必须大于0！！`)
        rowData.counts = inputCounts
        el.firstElementChild.value = oldCounts
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      var computedEndNumber = ''
      if (+rowData.checkmark === 1) { // 根据是否含有校验位，计算好的票据endnumber，此时还未经过任何校验。
        computedEndNumber = +(rowData.startnumber.slice(0, numberLength)) + (+inputCounts * rowData.portions) - 1
      } else {
        computedEndNumber = +rowData.startnumber + (+inputCounts * rowData.portions) - 1
      }
      // 这里的computedEndNumber,一定没有超过票据范围
      restZeroLength = numberLength - computedEndNumber.toString().length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += computedEndNumber
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      // 这里改endnumber
      rowData.endnumber = reviseValue
      // 这里改inventory
      rowData.inventory = rowData.counts * rowData.portions
      // 这里改num
      rowData.num = rowData.counts * rowData.portions
    }
  }
})

// 下面8个是由于份数字段传进来的是 num而导致的。
Vue.directive('changeStartNumberByNum', {
  bind: function(el, binding) {
    console.log('执行并且绑定了startNumber指令', binding.value)
    console.log('当前绑定行的信息为：', binding.value.checkmark, binding.value.codelength)
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldValue = ''
    if (+rowData.checkmark === 1) {
      numberLength = rowData.codelength - 1
    } else {
      numberLength = rowData.codelength
    }
    var minStartNumber = +(rowData.startnumber.slice(0, numberLength))
    var maxStartNumber = +(rowData.endnumber.slice(0, numberLength))

    console.log(minStartNumber, maxStartNumber, numberLength)

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldValue = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      console.log('当前行的checkmark为：', rowData.checkmark, rowData.codelength)
      var inputValue = el.firstElementChild.value.toString() // 记录输入的值
      if (isNaN(Number(inputValue))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.startnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      if (inputValue.length > rowData.codelength) { // 不管有没有校验位，值长度超范围都报错
        Bus.$emit('billNumberOutRange', `该票种有校验位，并且票据号码长度必须为${rowData.codelength}位`)
        el.firstElementChild.value = oldValue
        rowData.startnumber = oldValue
        return
      }

      // 这一团判断起始号应该小于终止号
      if (+rowData.checkmark === 1) {
        console.log('有校验位========')
        if (inputValue.length === rowData.codelength) {
          if (+(inputValue.slice(0, inputValue.length - 1)) > +rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
            Bus.$emit('billNumberOutRange', `起始号码必须小于于终止号码！`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        } else if (inputValue.length < rowData.codelength) {
          console.log('小于codelength========')

          if (+inputValue > +rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
            Bus.$emit('billNumberOutRange', `起始号码必须小于终止号码！`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        }
      } else {
        if (+inputValue > +rowData.endnumber) {
          Bus.$emit('billNumberOutRange', `起始号码必须小于终止号码！`)
          el.firstElementChild.value = oldValue
          rowData.startnumber = oldValue
          return
        }
      }

      if (inputValue.length === rowData.codelength) { // 值长度等于规定长度时
        if (+rowData.checkmark === 1) { // 有校验位时
          inputValue = inputValue.slice(0, inputValue.length - 1)
          if (inputValue > maxStartNumber || inputValue < minStartNumber) { // 值超标时
            restZeroLength = numberLength - inputValue.length
            for (let i = 0; i < restZeroLength; i++) {
              reviseValue += '0'
            }
            reviseValue += inputValue
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
            Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${reviseValue}】至【${rowData.endnumber}】的票据，请检查`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        } else { // 无校验位
          if (+inputValue > +maxStartNumber || +inputValue < +minStartNumber) { // 值超标时
            restZeroLength = numberLength - inputValue.length
            for (let i = 0; i < restZeroLength; i++) {
              reviseValue += '0'
            }
            reviseValue += inputValue
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
            Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${reviseValue}】至【${rowData.endnumber}】的票据，请检查`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        }
      } else { // 值长度不够，一定没有输入校验位时
        if (+inputValue > +maxStartNumber || +inputValue < +minStartNumber) { // 值超标时
          restZeroLength = numberLength - inputValue.length
          for (let i = 0; i < restZeroLength; i++) {
            reviseValue += '0'
          }
          reviseValue += inputValue
          if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
          }
          Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${reviseValue}】至【${rowData.endnumber}】的票据，请检查`)
          el.firstElementChild.value = oldValue
          rowData.startnumber = oldValue
          return
        }
      }
      // 这里的数据都是合格数据
      restZeroLength = numberLength - inputValue.length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += inputValue
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      el.firstElementChild.value = reviseValue
      // 这里必须改一下，因为如果不改，那么rowData中的值会自动去掉开始的0，可能是el-input在进行双向绑定赋值时，调用了类似trim去多余的0
      // 或者是将string类型转换成了int类型，导致去了0
      rowData.startnumber = reviseValue
      console.log('合法值是：', reviseValue)
      console.log('绑定的验证信息为：', binding.value.checkmark, binding.value.codelength)

      // 这里改动份数
      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }

      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }
      // 这里改本数
      rowData.counts = rowData.num / rowData.portions
    }
  }
})
Vue.directive('changeStartNumberNoLimitByNum', {
  bind: function(el, binding) {
    console.log('执行startNumber指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldValue = ''

    // var minStartNumber = +(rowData.startnumber.slice(0, numberLength))
    // var maxStartNumber = +(rowData.endnumber.slice(0, numberLength))
    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldValue = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      if (+rowData.checkmark === 1) {
        numberLength = rowData.codelength - 1
      } else {
        numberLength = rowData.codelength
      }
      console.log('执行了无限制startnumber指令')
      console.log(rowData)
      console.log('当前号码长度为', numberLength)
      var inputValue = el.firstElementChild.value.toString() // 记录输入的值
      if (isNaN(Number(inputValue))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.startnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      if (+inputValue <= 0) {
        Bus.$emit('billNumberOutRange', `起始号码必须大于0`)
        rowData.startnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      if (inputValue.length > rowData.codelength) { // 不管有没有校验位，值长度超范围都报错
        Bus.$emit('billNumberOutRange', `该票种有校验位，并且票据号码长度必须为${rowData.codelength}位`)
        el.firstElementChild.value = oldValue
        rowData.startnumber = oldValue
        return
      }

      // 这一团判断起始号应该小于终止号
      if (+rowData.checkmark === 1) {
        if (inputValue.length === rowData.codelength) {
          if (+(inputValue.slice(0, inputValue.length - 1)) > +rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
            Bus.$emit('billNumberOutRange', `起始号码必须小于于终止号码！`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        } else if (inputValue.length < rowData.codelength) {
          if (+inputValue > +rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
            Bus.$emit('billNumberOutRange', `起始号码必须小于终止号码！`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }
        }
      } else {
        if (+inputValue > +rowData.endnumber) {
          Bus.$emit('billNumberOutRange', `起始号码必须小于终止号码！`)
          el.firstElementChild.value = oldValue
          rowData.startnumber = oldValue
          return
        }
      }

      if (inputValue.length === rowData.codelength) { // 值长度等于规定长度时
        if (+rowData.checkmark === 1) { // 有校验位时
          inputValue = inputValue.slice(0, inputValue.length - 1)
        }
      }
      // 这里的数据都是合格数据
      restZeroLength = numberLength - inputValue.length
      console.log('restZeroLength', restZeroLength)
      console.log('numberLength', numberLength)
      console.log('inputValue.length', inputValue.length)

      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += inputValue
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      el.firstElementChild.value = reviseValue
      // 这里必须改一下，因为如果不改，那么rowData中的值会自动去掉开始的0，可能是el-input在进行双向绑定赋值时，调用了类似trim去多余的0
      // 或者是将string类型转换成了int类型，导致去了0
      rowData.startnumber = reviseValue
      // 这里改终止号码,只有起始号码大于终止号码才改。
      if (+rowData.checkmark === 1) {
        if (reviseValue.slice(0, reviseValue.length - 1) > rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
          rowData.endnumber = reviseValue
        }
      } else {
        if (+reviseValue > +rowData.endnumber) {
          rowData.endnumber = reviseValue
        }
      }
      // 这里改动份数inventory
      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }

      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }
      // 这里改本数
      rowData.counts = rowData.num / rowData.portions
    }
  }
})
Vue.directive('changeEndNumberByNum', {
  bind: function(el, binding) {
    console.log('执行EndNumber指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldValue = ''

    if (+rowData.checkmark === 1) {
      numberLength = rowData.codelength - 1
    } else {
      numberLength = rowData.codelength
    }
    var minEndNumber = +(rowData.startnumber.slice(0, numberLength))
    var maxEndNumber = +(rowData.endnumber.slice(0, numberLength))

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldValue = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      console.log('执行end的change')
      var inputValue = el.firstElementChild.value.toString() // 记录输入的值
      if (isNaN(Number(inputValue))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.endnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      if (inputValue.length > rowData.codelength) { // 不管有没有校验位，值长度超范围都报错
        Bus.$emit('billNumberOutRange', `该票种有校验位，并且票据号码长度必须为${rowData.codelength}位`)
        el.firstElementChild.value = oldValue
        rowData.endnumber = oldValue
        return
      }
      if (inputValue.length === rowData.codelength) { // 值长度等于规定长度时
        if (+rowData.checkmark === 1) { // 有校验位时
          inputValue = inputValue.slice(0, inputValue.length - 1)
          if (inputValue > maxEndNumber || inputValue < minEndNumber) { // 值超标时
            restZeroLength = numberLength - inputValue.length
            for (let i = 0; i < restZeroLength; i++) {
              reviseValue += '0'
            }
            reviseValue += inputValue
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
            Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
            el.firstElementChild.value = oldValue
            rowData.endnumber = oldValue
            return
          }
        } else { // 无校验位
          if (+inputValue > +maxEndNumber || +inputValue < +minEndNumber) { // 值超标时
            restZeroLength = numberLength - inputValue.length
            for (let i = 0; i < restZeroLength; i++) {
              reviseValue += '0'
            }
            reviseValue += inputValue
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
            Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
            el.firstElementChild.value = oldValue
            rowData.endnumber = oldValue
            return
          }
        }
      } else { // 值长度不够，一定没有输入校验位时
        if (+inputValue > +maxEndNumber || +inputValue < +minEndNumber) { // 值超标时
          console.log('此时输入的值为', inputValue)
          console.log(`限制范围是${minEndNumber}——${maxEndNumber}`)
          restZeroLength = numberLength - inputValue.length
          for (let i = 0; i < restZeroLength; i++) {
            reviseValue += '0'
          }
          reviseValue += inputValue
          if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
          }
          console.log(reviseValue)
          console.log(reviseNumber)

          Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
          el.firstElementChild.value = oldValue
          rowData.endnumber = oldValue
          return
        }
      }
      // 这里的数据都是合格数据
      restZeroLength = numberLength - inputValue.length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += inputValue
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      el.firstElementChild.value = reviseValue
      // 这里必须改一下，因为如果不改，那么rowData中的值会自动去掉开始的0，可能是el-input在进行双向绑定赋值时，调用了类似trim去多余的0
      // 或者是将string类型转换成了int类型，导致去了0
      rowData.endnumber = reviseValue
      // 这里改动份数
      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }

      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }
      // 这里改本数
      rowData.counts = rowData.num / rowData.portions
    }
  }
})
Vue.directive('changeEndNumberNoLimitByNum', {
  bind: function(el, binding) {
    console.log('执行EndNumber指令', binding.value)
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldValue = ''

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldValue = el.firstElementChild.value.toString()
      console.dir(el)
    }
    el.firstElementChild.onchange = function() {
      if (+rowData.checkmark === 1) {
        numberLength = rowData.codelength - 1
      } else {
        numberLength = rowData.codelength
      }
      var inputValue = el.firstElementChild.value.toString() // 记录输入的值
      if (isNaN(Number(inputValue))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.endnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      if (+inputValue <= 0) {
        Bus.$emit('billNumberOutRange', `终止号码必须大于0`)
        rowData.endnumber = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      if (inputValue.length > rowData.codelength) { // 不管有没有校验位，值长度超范围都报错
        Bus.$emit('billNumberOutRange', `该票种有校验位，并且票据号码长度必须为${rowData.codelength}位`)
        el.firstElementChild.value = oldValue
        rowData.endnumber = oldValue
        return
      }
      if (inputValue.length === rowData.codelength) { // 值长度等于规定长度时
        if (+rowData.checkmark === 1) { // 有校验位时
          inputValue = inputValue.slice(0, inputValue.length - 1)
        }
      }
      // 这里的数据都是合格数据

      if (+inputValue < +rowData.startnumber) {
        Bus.$emit('billNumberOutRange', `终止号码必须大于起始号码！！`)
        el.firstElementChild.value = oldValue
        rowData.endnumber = oldValue
        console.dir(el)
        return
      }
      restZeroLength = numberLength - inputValue.length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += inputValue
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      el.firstElementChild.value = reviseValue
      // 这里必须改一下，因为如果不改，那么rowData中的值会自动去掉开始的0，可能是el-input在进行双向绑定赋值时，调用了类似trim去多余的0
      // 或者是将string类型转换成了int类型，导致去了0
      rowData.endnumber = reviseValue
      // 这里改动份数
      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }

      if (+rowData.checkmark === 1) {
        rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
      } else {
        rowData.num = rowData.endnumber - rowData.startnumber + 1
      }
      // 这里改本数
      rowData.counts = rowData.num / rowData.portions
      console.log('输入的是', inputValue, '比较的是', rowData.startnumber)
    }
  }
})
Vue.directive('changeInventoryByNum', {
  bind: function(el, binding) {
    console.log('执行改变份数指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldInventory = ''
    if (+rowData.checkmark === 1) {
      numberLength = rowData.codelength - 1
    } else {
      numberLength = rowData.codelength
    }
    var minEndNumber = +(rowData.startnumber.slice(0, numberLength))
    var maxEndNumber = +(rowData.endnumber.slice(0, numberLength))

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldInventory = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      var inputInventory = el.firstElementChild.value.toString() // 记录输入的份数
      if (isNaN(Number(inputInventory))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.num = oldInventory
        el.firstElementChild.value = oldInventory
        return
      }
      if (inputInventory <= 0) {
        Bus.$emit('billNumberOutRange', `份数必须大于0！！`)
        rowData.num = oldInventory
        el.firstElementChild.value = oldInventory
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      var computedEndNumber = ''
      if (+rowData.checkmark === 1) { // 根据是否含有校验位，计算好的票据endnumber，此时还未经过任何校验。
        // computedEndNumber = +(rowData.endnumber.slice(0, numberLength)) - inputInventory
        computedEndNumber = +(rowData.startnumber.slice(0, numberLength)) + +inputInventory - 1
      } else {
        computedEndNumber = +rowData.startnumber + +inputInventory - 1
      }
      // 计算出来的computedEndNumber,肯定不会超过codelength
      if (+computedEndNumber > +maxEndNumber || +computedEndNumber < +minEndNumber) { // 超过票据范围
        restZeroLength = numberLength - computedEndNumber.toString().length
        for (let i = 0; i < restZeroLength; i++) {
          reviseValue += '0'
        }
        reviseValue += computedEndNumber
        if (+rowData.checkmark === 1) { // 超限，且有校验位时
          reviseNumber = CalcMy_x(reviseValue)
          reviseValue += reviseNumber
        }
        Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
        el.firstElementChild.value = oldInventory
        rowData.num = oldInventory
        return
      }
      // 这里的computedEndNumber,一定没有超过票据范围
      restZeroLength = numberLength - computedEndNumber.toString().length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += computedEndNumber
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      // 这里改endnumber
      rowData.endnumber = reviseValue
      // // 有些页面，传的是num
      rowData.num = rowData.num
      // 这里改counts
      rowData.counts = rowData.num / rowData.portions
    }
  }
})
Vue.directive('changeInventoryNoLimitByNum', {
  bind: function(el, binding) {
    console.log('执行改变份数指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldInventory = ''
    // var oldEndNumber = ''

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldInventory = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      if (+rowData.checkmark === 1) {
        numberLength = rowData.codelength - 1
      } else {
        numberLength = rowData.codelength
      }
      var inputInventory = el.firstElementChild.value.toString() // 记录输入的份数
      if (isNaN(Number(inputInventory))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        rowData.num = oldInventory
        el.firstElementChild.value = oldInventory
        return
      }
      if (+inputInventory <= 0) {
        Bus.$emit('billNumberOutRange', `份数必须大于0！！`)
        rowData.num = oldInventory
        el.firstElementChild.value = oldInventory
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      var computedEndNumber = ''
      if (+rowData.checkmark === 1) { // 根据是否含有校验位，计算好的票据endnumber，此时还未经过任何校验。
        computedEndNumber = +(rowData.startnumber.slice(0, numberLength)) + +inputInventory - 1
      } else {
        computedEndNumber = +rowData.startnumber + +inputInventory - 1
      }
      // 这里的computedEndNumber,一定没有超过票据范围
      restZeroLength = numberLength - computedEndNumber.toString().length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += computedEndNumber
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      // 这里改endnumber
      rowData.endnumber = reviseValue
      // // 有些页面，传的是num，防止字段名不同导致报错。防坑处理。
      rowData.num = rowData.num
      // 这里改counts
      rowData.counts = rowData.num / rowData.portions
      console.dir(el)
    }
  }
})
Vue.directive('changeCountsByNum', {
  bind: function(el, binding) {
    console.log('执行改变本数指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldCounts = ''

    if (+rowData.checkmark === 1) {
      numberLength = rowData.codelength - 1
    } else {
      numberLength = rowData.codelength
    }
    var minEndNumber = +(rowData.startnumber.slice(0, numberLength))
    var maxEndNumber = +(rowData.endnumber.slice(0, numberLength))

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldCounts = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      var inputCounts = el.firstElementChild.value.toString() // 记录输入的本数
      if (isNaN(Number(inputCounts))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
        el.firstElementChild.value = oldCounts
        rowData.counts = oldCounts
        return
      }
      if (+inputCounts <= 0) {
        Bus.$emit('billNumberOutRange', `份数必须大于0！！`)
        el.firstElementChild.value = oldCounts
        rowData.counts = inputCounts
        return
      }

      var reviseValue = ''
      var reviseNumber = ''
      var computedEndNumber = ''
      if (+rowData.checkmark === 1) { // 根据是否含有校验位，计算好的票据endnumber，此时还未经过任何校验。
        // computedEndNumber = +(rowData.endnumber.slice(0, numberLength)) - inputCounts
        computedEndNumber = +(rowData.startnumber.slice(0, numberLength)) + (+inputCounts * rowData.portions) - 1
      } else {
        computedEndNumber = +rowData.startnumber + (+inputCounts * rowData.portions) - 1
      }
      // 计算出来的computedEndNumber,肯定不会超过codelength
      if (+computedEndNumber > +maxEndNumber || +computedEndNumber < +minEndNumber) { // 超过票据范围
        restZeroLength = numberLength - computedEndNumber.toString().length
        for (let i = 0; i < restZeroLength; i++) {
          reviseValue += '0'
        }
        reviseValue += computedEndNumber
        if (+rowData.checkmark === 1) { // 超限，且有校验位时
          reviseNumber = CalcMy_x(reviseValue)
          reviseValue += reviseNumber
        }
        Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
        el.firstElementChild.value = oldCounts
        rowData.counts = oldCounts
        return
      }
      // 这里的computedEndNumber,一定没有超过票据范围
      restZeroLength = numberLength - computedEndNumber.toString().length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += computedEndNumber
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      // 这里改endnumber
      rowData.endnumber = reviseValue
      // 这里改inventory
      rowData.num = rowData.counts * rowData.portions
      // 这里改num
      rowData.num = rowData.counts * rowData.portions
    }
  }
})
Vue.directive('changeCountsNoLimitByNum', {
  bind: function(el, binding) {
    console.log('执行改变本数指令')
    var rowData = binding.value
    var numberLength = 0
    var restZeroLength = 0
    var oldCounts = ''

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldCounts = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      if (+rowData.checkmark === 1) {
        numberLength = rowData.codelength - 1
      } else {
        numberLength = rowData.codelength
      }
      var inputCounts = el.firstElementChild.value.toString() // 记录输入的本数
      if (isNaN(Number(inputCounts))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！本数只能为数字！`)
        rowData.counts = oldCounts
        el.firstElementChild.value = oldCounts
        return
      }
      if (+inputCounts <= 0) {
        Bus.$emit('billNumberOutRange', `本数必须大于0！！`)
        rowData.counts = inputCounts
        el.firstElementChild.value = oldCounts
        return
      }
      var reviseValue = ''
      var reviseNumber = ''
      var computedEndNumber = ''
      if (+rowData.checkmark === 1) { // 根据是否含有校验位，计算好的票据endnumber，此时还未经过任何校验。
        computedEndNumber = +(rowData.startnumber.slice(0, numberLength)) + (+inputCounts * rowData.portions) - 1
      } else {
        computedEndNumber = +rowData.startnumber + (+inputCounts * rowData.portions) - 1
      }
      // 这里的computedEndNumber,一定没有超过票据范围
      restZeroLength = numberLength - computedEndNumber.toString().length
      for (let i = 0; i < restZeroLength; i++) {
        reviseValue += '0'
      }
      reviseValue += computedEndNumber
      if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
        reviseNumber = CalcMy_x(reviseValue)
        reviseValue += reviseNumber
      }
      // 这里改endnumber
      rowData.endnumber = reviseValue
      // 这里改inventory
      rowData.num = rowData.counts * rowData.portions
      // 这里改num
      rowData.num = rowData.counts * rowData.portions
    }
  }
})

Vue.directive('changePrice', {
  bind: function(el, binding) {
    var oldPrice = ''
    var rowData = binding.value

    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldPrice = el.firstElementChild.value.toString()
    }
    el.firstElementChild.onchange = function() {
      console.log('触发了')
      var inputPrice = el.firstElementChild.value
      if (isNaN(Number(inputPrice))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！单价只能为数字！`)
        rowData.price = oldPrice
        el.firstElementChild.value = oldPrice
        return
      } else {
        el.firstElementChild.value = inputPrice
        rowData.price = inputPrice
        if (rowData.pricingmet === 'D106_01') { // 本数计价
          rowData.amount = rowData.price * rowData.counts
        } else if (rowData.pricingmet === 'D106_02') { // 份数计价
          if (rowData.inventory === undefined) {
            rowData.amount = rowData.price * rowData.num
          } else {
            rowData.amount = rowData.price * rowData.inventory
          }
        }
      }
    }
  }
})

// 输入验证，非负数，非字符。只能是正数,否则返回原来的值。
Vue.directive('checkInput', {
  bind: el => {
    var oldValue = ''
    // var rowdata = binding.value
    el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
      oldValue = el.firstElementChild.value
    }
    el.firstElementChild.onchange = function() {
      var inputValue = el.firstElementChild.value
      if (isNaN(Number(inputValue))) {
        Bus.$emit('billNumberOutRange', `输入的数字非法！包含其他非数字字符！`)
        // rowData.num = oldValue
        el.firstElementChild.value = oldValue
        return
      }
      if (Number(inputValue) < 0) {
        Bus.$emit('billNumberOutRange', `输入的数字不能为负数！`)
        // rowData.num = oldValue
        el.firstElementChild.value = oldValue
        return
      }
    }
  }
})
