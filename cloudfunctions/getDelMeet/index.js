// 云函数入口文件
const cloud = require('wx-server-sdk')
const tm=require('./comparetime.js')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.isReclycle){
    await db.collection("meet_info")
    .doc(event.id)
    .update({
      data:{
        isHide:false
      }
    })
  }
  var info=await db.collection("meet_info")
  .where({
    change_id:event.openid,
    isHide:true
  })
  .get()


  if (info.data.length !== 0) { //若查询的会议结果不为空,
    for (var j = 0; j < info.data.length; j++) {
      //计算会议时间是否已经结束
      if (tm.compareNow(info.data[j].startdate, info.data[j].enddate) == 2 && info.data[j].done == false) {
        await db.collection("meet_info")
          .doc(info.data[j]._id)
          .update({
            data: {
              done: true
            }
          })
        info.data[j].done = true
      }
      // 修改开始结束时间格式
      info.data[j].startdate = tm.changeTime(info.data[j].startdate)
      info.data[j].enddate = tm.changeTime(info.data[j].enddate)
    }
  }
  return info
}