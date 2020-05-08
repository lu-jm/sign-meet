// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  var flag
  var info = await db.collection("user_info")
    .where({
      _id: event.openid,
      attend_meet: event.meet
    })
    .get()
  if (info.data.length == 0) {
    try {
      await db.collection("user_info")
        .doc(event.openid)
        .update({
          data: {
            attend_meet: _.push(event.meet)
          }
        })

      await db.collection("meet_info")
        .doc(event.meet)
        .update({
          data: {
            member_id: _.push(event.openid)
          }
        })
      flag=1
    } catch (e) {
      console.error(e)
    }
  } else {
    flag=0
  }
  return flag
}