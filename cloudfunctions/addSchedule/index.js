// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    var info = await db.collection("schedule_send")
      .where({
        meet_id: event.id,
        openid: wxContext.OPENID,
        done: false
      })
      .get()

    if (info.data.length != 0) {
      return 'info'
    }
    var time1 = new Date(event.date).getTime() - 8 * 3600 * 1000
    var result = await db.collection("schedule_send")
      .add({
        data: {
          meet_id: event.id,
          openid: wxContext.OPENID,
          meet_name: event.name,
          date: time1,
          done: false
        }
      })
    return {
      time1,
      time2
    }
  } catch (e) {
    return 'e'
  }
}