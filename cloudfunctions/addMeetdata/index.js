// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var startdate = event.list.startdate.join(' ')
  var enddate = event.list.enddate.join(' ')
  var scan = false
  var photo = false
  var gesture = false
  event.list.checkItem.forEach(function(item) {
    if (item == 'scan') {
      scan = true
      return true
    } else if (item == 'photo') {
      photo = true
      return true
    } else {
      gesture = true
    }
  })
  // 创造随机会议id
  var id = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    id += n;
    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
      id += "-";
  }
  if (event.flag == 1) {
    //添加会议记录
    await db.collection("meet_info").add({
      data: {
        _id: id,
        meet_name: event.list.meet_name,
        change_id: wxContext.OPENID,
        done: false,
        isHide: false,
        member_id: [],
        password: '',
        startdate: new Date(new Date(startdate)),
        enddate: new Date(new Date(enddate)),
        meet_address: {
          address: event.list.meet_address.address,
          city: event.list.meet_address.city,
          location: db.Geo.Point(event.list.meet_address.longitude, event.list.meet_address.latitude),
          name: event.list.meet_address.name,
        },
        meet_introduce: event.list.meet_introduce,
        meet_num: event.list.meet_num,
        checkitem: {
          scan: scan,
          photo: photo,
          gesture: gesture
        }
      },
      success: function() {}
    })
    //添加个人管理会议记录
    var b
    await db.collection("user_info").doc(wxContext.OPENID)
      .update({
        data: {
          change_meet: _.push(id)
        },
        success: function() {
          b = 'userinfo添加成功'
        }
      })
     return 1
    //  修改会议
  } else {
    await db.collection("meet_info")
      .doc(event.list._id)
      .update({
        data: {
          meet_name: event.list.meet_name,
          startdate: new Date(new Date(startdate)),
          enddate: new Date(new Date(enddate)),
          meet_address: event.list.meet_address,
          meet_introduce: event.list.meet_introduce,
          meet_num: event.list.meet_num,
          checkitem: {
            scan: scan,
            photo: photo,
            gesture: gesture
          }
        }
      })
      var chengedate=new Date(startdate).getTime()
      await db.collection("schedule_send")
      .where({
        meet_id:event.list._id
      })
      .update({
        data:{
          date: chengedate
        }
      })
      return 2
  }
}