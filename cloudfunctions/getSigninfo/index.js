// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    var info = await db.collection("meet_info")
      .aggregate()
      .lookup({
        from: 'user_info',
        localField: 'change_id',
        foreignField: '_id',
        as: 'userinfo'
      })
      .match({
        _id: event.id
      })
      .end()
  } catch (e) {}
  if (info.list.length != 0) {
    var flag = 1
    info.list[0].member_id = ''
    info.list[0].password = ''
    info.list[0].userinfo[0].attend_meet = ''
    info.list[0].userinfo[0].age = ''
    info.list[0].userinfo[0].change_meet = ''
    info.list[0].userinfo[0].address = ''
    info.list[0].userinfo[0].avatarUrl = ''
  } else {
    var flag = 0
  }
  return {
    info,
    flag
  }
}