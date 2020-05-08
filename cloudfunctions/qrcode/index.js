// 云函数入口文件
const cloud = require('wx-server-sdk')
const QR = require('./weapp-qrcode.js')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var date = new Date()
  var mydatetime = date.toLocaleDateString() + date.toLocaleTimeString()
  var password = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    password += n;
    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
      password += "-";
  }
  var info = '{"id":"' + event._id + '","time":"' + mydatetime + '","password":"' + password + '"}'
  //    返回输出base64编码imgData
  var imgData = QR.drawImg(info, {
    typeNumber: 4,
    errorCorrectLevel: 'M',
    size: 500
  })
  try {
    await db.collection("meet_info").where({
        _id: event._id
      })
      .update({
        data: {
          password: password
        }
      })
    
  } catch (e) {}
  return imgData
}