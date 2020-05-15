// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var info = await db.collection("user_info")
    .where({
      _id: wxContext.OPENID
    })
    .get()
  // 如果用户数据库没有信息，则进行添加
  if (info.data.length == 0) {
    await db.collection("user_info").add({
      data: {
        _id: wxContext.OPENID,
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
    // 如果有则进行信息更新
  } else {
    await db.collection("user_info")
      .doc(wxContext.OPENID)
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
  return wxContext.OPENID
}