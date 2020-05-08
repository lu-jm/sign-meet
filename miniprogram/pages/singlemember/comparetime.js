var cuerrentTime=new Date() //当前时间

var compareNow=function(starttime,endtime){
  var custom_start=new Date(starttime)  //开始时间
  var custom_end = new Date(endtime)  //结束时间
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

module.exports.compareNow=compareNow
exports.changeTime=changeTime