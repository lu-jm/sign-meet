var cuerrentTime = new Date() //当前时间

var compareNow = function(starttime, endtime) {
  var custom_start = new Date(starttime) //开始时间
  var custom_end = new Date(endtime) //结束时间
  if (custom_start > cuerrentTime) {
    return 0 //未开始
  } else if (cuerrentTime > custom_start && cuerrentTime < custom_end) {
    return 1 //进行中
  } else {
    return 2 //已结束
  }
}
var changeTime = function(value) {
  var dt = new Date(value)
  const y = dt.getFullYear()
  // 总长度2位不足用0填充
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}`
}

module.exports.compareNow = compareNow
exports.changeTime = changeTime