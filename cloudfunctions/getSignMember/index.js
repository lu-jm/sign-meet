// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var info=await db.collection("meet_check_info").aggregate()

    .lookup({
      from: 'user_info',
      localField: 'check_openid',
      foreignField: '_id',
      as: 'userinfo'
    })
    .match({
      meet_id: event.id
    })
    .end()

    // .then(res => console.log(res))
    // .catch(err => console.log(err))
  return info
}