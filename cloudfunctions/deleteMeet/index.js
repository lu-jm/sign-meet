// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  if (event.flag == "all_del") {
    try {
      await db.collection("meet_info")
        .where({
          change_id: event.openid,
          isHide: true
        })
        .remove()
    } catch (e) {
      console.error(e)
    }
    for (var i = 0; i < event.info.length; i++) {
      try {
        await db.collection("user_info")
          .doc(event.openid)
          .update({
            data: {
              change_meet: _.pull(event.info[i]._id)
            }
          })
      } catch (e) {}
    }

  } else {
    try {
      await db.collection("meet_info")
        .doc(event.id)
        .remove()
    } catch (e) {}
    try {
      await db.collection("user_info")
        .doc(event.openid)
        .update({
          data: {
            change_meet: _.pull(event.id)
          }
        })
    } catch (e) {}
  }
}