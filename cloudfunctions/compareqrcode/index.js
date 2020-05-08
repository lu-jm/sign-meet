// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var truth
  var message
  var hascheck = await db.collection("meet_check_info")
    .where({
      check_openid: event.openid,
      meet_id: event.info.id,
      done:true
    })
    .get()
  if (hascheck.data.length != 0) {
    truth = 0 //已经签到过
  } else {
    var info = await db.collection("meet_info")
      .where({
        _id: event.info.id,
        member_id: event.openid
      })
      .get()
    if (info.data.length == 0) {
      truth = -1 //会议不存在或者没有报名
    } else if (info.data[0].password == event.info.password) {
      var d = new Date()
      try {
        await db.collection("meet_check_info")
          .add({
            data: {
              check_openid: event.openid,
              check_time: new Date(d),
              check_address: new db.Geo.Point(0, 0),
              meet_id: event.info.id,
              check_type: "scan",
              done:true
            }
          })
      } catch (e) {
        console.error(e)
      }
      truth = 1 //签到成功
    } else {
      truth = -2 //签到失败
    }
  }
  return truth
}