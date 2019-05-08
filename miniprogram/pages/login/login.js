

Page({
  data: {
    loading: false,
    accesstoken: "",
    error: "",
    User:[]
  },

  onLoad: function() {

  },

  bindKeyInput: function(e) {
    this.setData({
      accesstoken: e.detail.value
    })
  },

  // 验证token(登录)
  isLogin: function() {
    var accesstoken = that.data.accesstoken;
    const db = wx.cloud.database();
    // 查询user
    db.collection("User").where({user_id:accesstoken}).get({
      success: res => {
        this.setData({

          User: res.data,
        })
        if(this.data.User.length==1){
          //跳转至详情页  
          wx.switchTab({
            url: '../index/index'
          })        
        }else{
          console.log('查无此人'),
          wx.showToast({
            icon: 'none',
            title: '员工号错误'
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
})
