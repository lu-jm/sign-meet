// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    var data = await db.collection("meet_info")
      .aggregate()
      .lookup({
        from: 'user_info',
        localField: 'member_id',
        foreignField: '_id',
        as: 'userinfo'
      })
      .match({
        _id:event.id
      })
      .end()
  } catch (e) {}
  
  
  if (data.list[0].userinfo.length!=0){
    var info = data.list[0].userinfo
    for (var i = 0; i < data.list[0].userinfo.length; i++) {
      delete info[i].age
      delete info[i].address
      delete info[i].attend_meet
      delete info[i].change_meet
      delete info[i]._id
      delete info[i].sex
    }
  }else{
    var info=[]
  }
  
  return info
}