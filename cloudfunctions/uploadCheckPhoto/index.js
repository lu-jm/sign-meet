// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var hascheck = await db.collection("meet_check_info")
    .where({
      check_openid: wxContext.OPENID,
      meet_id: event.meetid
    }).get()
  if (hascheck.data.length == 0) {
    var time = new Date()
    try {
      await db.collection("meet_check_info")
        .add({
          data: {
            check_address: new db.Geo.Point(0, 0),
            check_openid: wxContext.OPENID,
            check_time: new Date(time),
            check_type: 'photo',
            meet_id: event.meetid,
            done: false,
            img: event.url
          }
        })
      return 1 // 表示未签到，存储照片信息等待确认
    } catch (e) {
      console.error(e)
    }
  } else {
    return 0
  }
}