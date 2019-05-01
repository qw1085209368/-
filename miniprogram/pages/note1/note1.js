//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    items: [],
    motto: 'Hello World',
    userInfo: {},
    document:[],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    document_byid:[], //根据_id找到cloudurl  
    tempFileURL:"" //根据cloudurl找到fileURL
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  addnote: function (event) {
    console.log(event)
    wx.navigateTo({
      url: '../note2/note2'
    })
  },
  onLoad: function () {
    this.onQuery()
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  //！！！！！！  //数据库查询操作
  onQuery: function () {

    const db = wx.cloud.database();

    // 查询usertable
    db.collection('Document').get({
      success: res => {
        this.setData({

          document: res.data,
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        console.log('document: ', this.data.document)

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

  },
  down_file: function () {
    wx.downloadFile({
      url:this.data.tempFileURL,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功', res)
          },
          file: function (err) {
            wx.showToast({
              title: 'err',
            })
          }
        })
      }
    })




  },
  /**
   * 生命周期函数--监听页面显示
   */
  geturl:function(){
    var that=this
    console.log('this.data.document_byid[0].url',this.data.document_byid[0].url)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getTempFileURL',
      // 传给云函数的参数
      data: {
        //fileList:'cloud://kkk-bf28dd.6b6b-kkk-bf28dd/40张福康简历.pdf',
        fileList:this.data.document_byid[0].url
      },
    })
      .then(res => {
        this.setData({
          tempFileURL:res.result[0].tempFileURL
        })
        that.down_file()
        console.log(res.result[0].tempFileURL) // 3
      })
      .catch(console.error)
  },
  onShow: function () {
    this.onQuery()

    },
     //-----------------------长按下载begin---------------------------
  //touch start
  handleTouchStart: function (e) {
    this.startTime = e.timeStamp;
    //console.log(" startTime = " + e.timeStamp);  
  },

  //touch end
  handleTouchEnd: function (e) {
    this.endTime = e.timeStamp;
    //console.log(" endTime = " + e.timeStamp);  
  },

  handleClick: function (e) {
    //console.log("endTime - startTime = " + (this.endTime - this.startTime));    
    if (this.endTime - this.startTime < 360) {
      console.log("点击");
    }
  },

  handleLongPress: function (e) {
    var aaa = e.currentTarget.dataset._id
    app.globalData.documment_id=aaa
    var that = this
    that.setData({
      re_depart_id: aaa
    })

    console.log("长按");
    console.log("_id", aaa);
    this.showDialogBtn()

  },
  //查询cloud
  onQueryby_id: function () {
    console.log('onQueryby_id:app.globalData.documment_id:',app.globalData.documment_id)
    const db = wx.cloud.database();
    var that=this
    // 查询usertable
    db.collection('Document').where({_id:app.globalData.documment_id}).get({
      success: res => {
        this.setData({

          document_byid: res.data,
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        console.log('document: ', this.data.document_byid)
        that.geturl()

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })


  },
  // 输入框id
  inputChange_id(e) {
    var that = this
    this.setData({
      telValue_id: e.detail.value
    })
  },
  //输入框名称
  inputChange_name(e) {
    var that = this
    this.setData({
      telValue_name: e.detail.value
    })
  },


  /**
   * 下载弹窗
   */


  showDialogBtn: function () {

    this.setData({
      showModal: true,
      flag: 1
    })
  },
  /**
   * 删除弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {},
  /**
   * 删除隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 删除对话框取消按钮点击事件
   */
  onCancel: function () {
    this.setData({
      flag: 0
    });
    this.hideModal();
  },

  /**
   * 下载对话框确认按钮点击事件
   */
  onConfirm: function () {

    this.setData({
      flag: 0
    });
    this.onCancel()
    this.onQueryby_id()
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 200,


    })


   // this.onLoad()


  },

  //------------------------长按删除end--------------------------- 
})





