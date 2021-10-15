// pages/sbwx/sbwx.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val1: '',
    val2: '',
    address: '地址'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var chuandi = JSON.parse(options.data);
    console.log(chuandi);
    that.setData({
      chuandi:chuandi
    })
  },
  getQRCode:function(e){
    var that=this;
    wx.scanCode({        //扫描API
      success: function (res) {
        console.log("输出----------------");
        console.log(res);    //输出回调信息
        var result = JSON.parse(res.result);
        if (result.type = "xj") {
          if (result.wz != that.data.chuandi.wz || result.code != that.data.chuandi.code) {
            wx.showToast({
              title: "请扫描正确位置二维码",
              icon: "none",
              duration: 2000
            });
          } else {
            let action = "/pages/aqxj1/aqxj1?data=" + JSON.stringify(that.data.chuandi);
            wx.navigateTo({
              url: action
            })
          }
        }else{
          wx.showToast({
            icon: 'none',
            title: "请扫描正确二维码",
            duration: 2000,
          })
        }
      }
  })        
           
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
    this.setData({
      address: app.globalData.address
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

  }
})
