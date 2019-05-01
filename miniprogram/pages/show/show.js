const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    telValue_id:'',
    telValue_name:''
      //  getInput: ''
  },
  

  // 输入框id
  inputChange_id(e) {
    var that=this
    this.setData({
      telValue_id: e.detail.value
    })
  },
  //输入框名称
  inputChange_name(e) {
    var that=this
    this.setData({
      telValue_name: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 弹窗
   */


  showDialogBtn: function () {

    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
    this.onAdd()
    console.log('id',this.data.telValue_id)
    console.log('name',this.data.telValue_name)
    wx.switchTab({
      url: "../index/index"
    })
  },
  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('Department').add({
      data: {
        depart_name:this.data.telValue_name,
        depart_id:this.data.telValue_id
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
         // counterId: res._id,
          //count: 2
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
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

})