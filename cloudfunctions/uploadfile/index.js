// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  wx.chooseImage({
    success: function (res) {
      var tempfile = res.tempFilePaths
      console.log(res)
      wx.cloud.uploadFile({
        cloudPath: 'meetingsystem/meetingfile/tem.png',
        filePath: tempfile[0],
        success: res => {
          console.log(res.fileID)
        },
        fail: console.error
      })
    }
  })
}