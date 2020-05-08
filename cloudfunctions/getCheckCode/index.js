// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var db = cloud.database()
// 获取验证码函数
exports.main = async(event, context) => {
  var id = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    id += n;
    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
      id += "-";
  }
  await db.collection("check_code").add({
    data: {
      _id: id,
      checkcode: 111111 //验证码
    }
  })
  return id
}