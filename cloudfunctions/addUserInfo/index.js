// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var info = await db.collection("user_info")
    .where({
      _id: event.openid
    })
    .get()
  if (info.data.length == 0) {
    await db.collection("user_info").add({
      data: {
        _id: event.openid,
        name: event.name,
        tel: event.tel,
        age: '',
        wx_name: event.userinfo.nickName,
        avatarUrl: event.userinfo.avatarUrl,
        sex: event.userinfo.gender,
        address: event.userinfo.country + '-' + event.userinfo.province + '-' + event.userinfo.city,
        attend_meet: [],
        change_meet: [],
      },
    })
  } else {
    await db.collection("user_info")
      .doc(event.openid)
      .update({
        data: {
          name: event.name,
          tel: event.tel,
          age: '',
          wx_name: event.userinfo.nickName,
          sex: event.userinfo.gender,
          address: event.userinfo.country + '-' + event.userinfo.province + '-' + event.userinfo.city,
          attend_meet: [],
          change_meet: [],
        }
      })
  }
}