// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    var info= await db.collection("meet_check_info").where({
        check_openid: event.openid,
        meet_id: event.meetid
      })
      .update({
        data: {
          done: true
        }
      })
    return 1
  } catch (e) {}
  return 0
}