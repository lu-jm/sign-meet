// 云函数入口文件
const cloud = require('wx-server-sdk')
const tm = require('./comparetime.js')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    var change_meeting = await db.collection("meet_info")
      .where({
        change_id: wxContext.OPENID,
        isHide: false
      })
      .get()
  } catch (e){}

  if (change_meeting.data.length != 0) { //若查询的会议结果不为空,
    for (var j = 0; j < change_meeting.data.length; j++) {
      //计算会议时间是否已经结束
      if (tm.compareNow(change_meeting.data[j].startdate, change_meeting.data[j].enddate) == 2 && change_meeting.data[j].done == false) {
        await db.collection("meet_info")
          .doc(change_meeting.data[j]._id)
          .update({
            data: {
              done: true
            }
          })
        change_meeting.data[j].done = true
      }
      // 修改开始结束时间格式
      change_meeting.data[j].startdate = tm.changeTime(change_meeting.data[j].startdate)
      change_meeting.data[j].enddate = tm.changeTime(change_meeting.data[j].enddate)
    }
  }

// 获取参加的会议列表
  var attendmet_id = await db.collection("user_info")
    .where({
      _id: wxContext.OPENID
    })
    .get()
  var id = attendmet_id.data[0].attend_meet
  var attend_meeting = [];
  if (id.length != 0) {
    for (var i = 0; i < id.length; i++) {
      var info = await db.collection("meet_info").where({
          _id: id[i]
        })
        .get()
      if (tm.compareNow(info.data[0].startdate, info.data[0].enddate) == 2) {
        info.data[0].done == false
      }
      info.data[0].startdate = tm.changeTime(info.data[0].startdate)
      info.data[0].enddate = tm.changeTime(info.data[0].enddate)

      attend_meeting[i] = info.data[0]
    }
    //attend_meeting=id
  } else {
    //attend_meeting='0'
  }

  return {
    // attendmet_id,
    attend_meeting,
    change_meeting
  }
}