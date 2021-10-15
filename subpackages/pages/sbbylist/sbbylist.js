// pages/sbbylist/sbbylist.js
const app = getApp()
var util = require('../../../utils/util.js');
var pramerter = {};//保养进度查询参数列表 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav1: 'weui-bar__item_on',
    nav_panl1: 'block',
    dateStart: util.formatDate(new Date()),
    dateEnd: util.formatDateAdd(new Date(), 7),
    listByjd:null

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
    pramerter = {};//保养进度查询参数列表 
    this.getbyjd(pramerter)
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

  },
  bindDateChange_start: function (e) {
    console.log('日期发送选择改变，携带值为', e.detail.value)

    this.setData({
      dateStart: e.detail.value
    })
    pramerter.start_time = e.detail.value
    this.getbyjd(pramerter)

  },
  getbyjd:function(prameter){//获取保养进度列表
    var that = this;
    var userinfo = wx.getStorageSync("userInfo");
    prameter.maintain_user = wx.getStorageSync("realname");
    prameter.maintain_state = "保养中";
    prameter.zhandian_id = wx.getStorageSync('station_id');
    prameter.pageIndex = 1;
    prameter.pageSize = 9999;
    console.log(prameter);
    if (userinfo) {
      wx.request({
        url: app.globalData.url + 'shebeirepair/getShebeimaintainList',
        data: prameter,
        dataType: 'json',
        success: function (res) {
          
          console.log(res)
          app.globalData.listByjd = res.data.list;
          var nowdate=new Date().getTime();
          that.setData({
            listByjd: res.data.list
          })
        }
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: "未登录",
        duration: 2000,
      })
    }
  }

})