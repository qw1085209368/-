var app = getApp();
Page({
  data:{
 
    //用户个人信息
   
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    

  },
  onLoad: function (options) {
    var that = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        console.log("res.userInfo:",res);
        var avatarUrl = res.userInfo.nickName;
        var nickName = res.userInfo.avatarUrl;
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })
    }

  // setup:function(){
  //   wx.navigateTo({
  //     url: '../setup/setup',
  //   })
  // }

})