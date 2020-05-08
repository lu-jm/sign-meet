// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.isReclycle){
    await db.collection("meet_info")
    .doc(event.id)
    .update({
      data:{
        isHide:false
      }
    })
  }
  var info=await db.collection("meet_info")
  .where({
    change_id:event.openid,
    isHide:true
  })
  .get()

  return info
}