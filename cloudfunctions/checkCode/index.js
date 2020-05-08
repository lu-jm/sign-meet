// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 检查验证码函数
exports.main = async (event, context) => {
  var info=await db.collection("check_code").where({
    _id:event.id
  }).get()
  if(info.data[0].checkcode==event.code){
    return true
  }else{
    return false
  }
}