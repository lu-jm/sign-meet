// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  var info=await db.collection("user_info")
  .where({
    _id:openid
  })
  .get()
  var ishas
  if(info.data.length==0||info.data[0].tel==''){ishas=false}
  else{ishas=true}
  return {
    event,
    openid,
    info,
    ishas,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}