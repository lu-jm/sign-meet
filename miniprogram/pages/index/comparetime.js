var cuerrentTime=new Date() //当前时间

var compareNow=function(starttime,endtime){
  var custom_start=new Date(starttime)
  var custom_end = new Date(endtime)
  if(custom_start>cuerrentTime){
    return 0  //未开始
  }else if(cuerrentTime>custom_start&&cuerrentTime<custom_end){
    return 1  //进行中
  }else{
    return 2  //已结束
  }
}
var changeTime=function(value){
  var d=new Date(value)
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() ;
}
var compareStartEnd=function(start,end){
  var startdate=new Date(start)
  var endDate=new Date(end)
  if(startdate>endDate){
    return 0
  }else{
    return 1
  }
}

module.exports.compareNow = compareNow
exports.changeTime = changeTime
exports.compareStartEnd = compareStartEnd