//记录执行顺序流程
window.i = 0
window.I = () => {
  window.i++
  return window.i + '.'
}

window.RE = (observerData) => {
  return JSON.parse(JSON.stringify(observerData))
}

window.log = function (dataInfo, dataKey, _this) {

  console.log(
    '%c ' + window.I() + dataInfo + '【初始化】', 'color:red;font-size:14px;', '\n',
    `${dataKey}:`, window.RE(_this[dataKey]), '\n',
    `位置：[${_this.$options.name}]`
  )
}
// 触发事件（某个操作之后）执行
window.eLog = function (optionInfo, _this) {
  console.log(`%c ${window.I()}${optionInfo} ↓` + '【操作】', 'color:blue;font-size:14px;', '\n',
    `位置：[${_this.$options.name}]`
  )
}
// 验证
window.vLog = function (validateInfo, condition, _this) {
  var vResult = condition ? true : false
  console.log(`%c ${window.I()}【验证】 ${validateInfo} -> `, 'color:orange;font-size:14px;', vResult, '\n',
    `位置：[${_this.$options.name}]`
  )
}
//watch
window.wLog = function (dataKey, _arguments, _this) {
  var newV = _arguments[0] ? window.RE(_arguments[0]) : ''
  var oldV = _arguments[1] ? window.RE(_arguments[1]) : ''
  console.log(`%c ${window.I()}【watch】 ${dataKey} 【发生变动】`, 'color:green;font-size:14px;', '\n',
    '新值', newV, '\n',
    '旧值', oldV, '\n',
    `位置：[${_this.$options.name}]`
  )
}

// ________ console.log辅助-结束______________________________
