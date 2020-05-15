
var compareNow = function(starttime, endtime) {
  var cuerrentTime = new Date().getTime()+3600*1000*8 //当前时间
  var custom_start = new Date(starttime).getTime() //开始时间
  var custom_end = new Date(endtime).getTime() //结束时间
  // 开始时间大于当前时间
  if (custom_start > cuerrentTime) {
    return 0 //未开始
    // 当前时间大于开始时间，小于结束时间
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