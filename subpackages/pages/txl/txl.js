// pages/txl/txl.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    siteList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that=this;
    that.bindData();
  },
  bindData:function(r){
    var that=this;
    wx.request({
      url:  app.globalData.url+'/shebei/getuserlist',
      data:{userName:that.data.inputVal},
      success:function(res){
        //console.log(res);
        that.setData({
          siteList:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },//搜索框事件
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    var that=this;
    that.bindData();
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    var that=this;
    that.bindData();
  },
  kindSite(e) {
    const id = e.currentTarget.id
    const list = this.data.siteList
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].site === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }

    /**
     * key和value名称一样时，可以省略
     * 
     * list:list=>list
     */
    this.setData({
      siteList:list
    })
  },
  btlxr: function (e) {
    wx.showModal({
      title: '是否拨打电话?',
      content: e.currentTarget.id,
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.id //仅为示例，并非真实的电话号码
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})