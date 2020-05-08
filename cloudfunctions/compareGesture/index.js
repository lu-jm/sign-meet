// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  // 查找是否已经签到
  var hascheck=await db.collection("meet_check_info")
  .where({
    check_openid:event.openid,
    meet_id:event.meet_id,
    done:true
  }).get()
  // 若没有签到
  if(hascheck.data.length==0){
    var info = await db.collection("meet_info")
      .where({
        _id: event.meet_id
      })
      .get()
    if (info.data[0].password == event.password) {
      var time = new Date()
      try {
        await db.collection("meet_check_info")
          .add({
            data: {
              check_address: new db.Geo.Point(0, 0),
              check_openid: event.openid,
              check_time: new Date(time),
              check_type: 'gesture',
              meet_id: event.meet_id,
              done:true
            }
          })
      } catch (e) {
        console.error(e)
      }
      return 1
    } else {
      return 0
    }
  }else{
    return 2
  }
}