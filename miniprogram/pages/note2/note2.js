// note.js
// var index = require('../index/index.js')

var utils = require('../../utils/util.js')
var prom = require('../../utils/prom.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    title:'',
    content: '',
    aaa:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
  
    app.getUserInfo(function (userInfo) {
      page.setData({ userInfo: userInfo });
    });
      // this.setData({
      //   title: options.title,
      //  // content:options.content
      // })
     


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },



  bindTitle: function (e) {
    // console.log(e);
    this.setData({
      title: e.detail.value
    })
   // app.globalData.cloudPath=this.data.title
  },


//微信小程序获取时间begin-------------------------
formatNumber:function (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
},
formatTime:function (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
},

add_document:function (){  //需要获取设备数组长度 
 
  const db = wx.cloud.database();
  var TIME = utils.formatTime(new Date());
    console.log('TIME',TIME)

  var that=this
       db.collection('Document').add({
        data: {
         // _openid:'onqDm5fnuuaOOccmm3cp9KjmfaRg', //固定
          uid:that.data.userInfo.nickName,//用户名
         title:that.data.title,//文件名
         time:TIME,//上传时间
         url:"cloud://kkk-bf28dd.6b6b-kkk-bf28dd/"+app.globalData.cloudPath

        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
  
          console.log('[Devc_status] [新增记录] 成功，记录 _id: ', res._id)
         // this.doUpload()
        //  console.log('status:',i) ,console.log('devc_id:',devc_id)
        wx.switchTab({
          url: '../note1/note1',
        })
        // wx.navigateTo({
        //   url: '../note1/note1'
        // })

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
       })



},


 // 上传文件
 doUpload: function () {
  // 选择文件
 // console.log('this.data.telValue_name', this.data.telValue_name)
 var filename=''
 var that=this
 filename = this.data.title
 if(filename==''){
  wx.showToast({
    icon:'none',
    title: '请输入文件名',
  })
  //this.onLoad()
 }else{
      wx.chooseImage({
        
        count: 1,
        success: function (res) {

            // wx.showToast({
            //   icon: 'none',
            //   title: '上传中,自动返回',
            // })
          wx.showLoading({
            title: '上传中',
          })

            const filePath = res.tempFilePaths[0]

          // 上传图片
            var cloudPath = filename + filePath.match(/\.[^.]+?$/)[0]  //上传后的文件名+后缀
            app.globalData.cloudPath = cloudPath
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log('[上传文件] 成功：', res)
                that.add_document()
              },
          
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },

          })
        },
        fail: e => {
          console.error(e)
        }


             })
          }
}




})