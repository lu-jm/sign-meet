// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var flag
  var info = await db.collection("user_info")
    .where({
      _id: wxContext.OPENID,
      attend_meet: event.meet
    })
    .get()
  var meetinfo = await db.collection("meet_info").doc(event.meet)
    .get()
  if(meetinfo.data.member_id.length===meetinfo.data
  .meet_num){
    flag=11
    return flag
  }
  // 判断是否已经报名
  if (info.data.length == 0) {
    try {
      await db.collection("user_info")
        .doc(wxContext.OPENID)
        .update({
          data: {
            attend_meet: _.push(event.meet)
          }
        })

      await db.collection("meet_info")
        .doc(event.meet)
        .update({
          data: {
            member_id: _.push(wxContext.OPENID)
          }
        })
      flag = 1
    } catch (e) {
      flag = -1
    }
  } else {
    flag = 0
  }
  return flag
}