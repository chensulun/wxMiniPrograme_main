// pages/khcx/khcx.js
var dateTimePicker = require('../../../utils/dateTimePicker.js');
const app = getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    titleVal: 'basic',
    formData: {},
    zzshzt:0,
    nullval:null
  },
  submitForm(e) {
    var that=this;
    var userinfoJson = JSON.parse(wx.getStorageSync("userInfo"));
    console.log("---------------------------------------");
    console.log(e)
    var data = { 
      contact_person: e.detail.value.contact_person,
      contact_phone: e.detail.value.contact_phone,
      custom_id:0,
      custom_name: e.detail.value.custom_name,
      zhandianid: wx.getStorageSync('station_id')
      };
      var json = new Array();
      json[0]=data;
      console.log(JSON.stringify(data))
      
      let page = getCurrentPages().pop();
      let evalue=e;
    wx.request({
      url: app.globalData.url + '/sysProject/addCustom',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 0) {
          //执行刷新
          // 回调函数
          // wx.showToast({
          //   title: '新增成功',
          //   icon: 'success',
          //   duration: 2000//持续的时间
          // })
          // evalue=null;
          // if (page == undefined || page == null) return;
          // page.onLoad();

          // that.setData({
          //   nullval:''
          //   })
          wx.navigateTo({
            url: '../xmgl/xmgl'
          })
          
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          });
        }

      }
    })
    // that.selectComponent('#form').validate((valid, errors) => {
    //   debugger;
    //   console.log(valid, errors)

    // })
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

  }
})