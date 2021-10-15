// subpackages/pages/txxx/txxx.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      name: '',
      phone: '',
      car: '',
      address: []
    }, //用户信息
    address: [], //定位地址
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

  },

  getPosition: function () {
    let that = this;
    // 获取地址
    wx.getLocation({ //获取位置信息
      type: 'wgs84',
      success(res) {
        wx.request({ //以经纬度查询地址
          url: "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=DEGBZ-G4CLX-GBV4Y-7LK2H-75A73-SDBUP",
          dataType: "json",
          success: function (address) { //地址获取成功
            let end = address.data.result.address;
            let location = address.data.result.location;
            that.data.address = [];
            that.data.address.push(end);
            that.data.address.push(location);
            console.log(that.data.address);
            wx.showModal({
              title: '提示',
              content: '定位成功',
              showCancel: false,
              mask: true
            })
          },
          fail: function () {
            wx.showModal({
              title: '提示',
              content: '定位失败！',
              showCancel: false,
              mask: true
            })
          }
        })
      }
    })
  },

  formSubmit: function (e) {
    let that = this;
    var wxUserInfo = getApp().globalData.wxUserInfo;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let {
      name,
      phone,
      car,
    } = e.detail.value;

    that.data.userInfo.name = name;
    that.data.userInfo.phone = phone;
    that.data.userInfo.car = car;
    that.data.userInfo.address = that.data.address;
    let obj = {
      ...wxUserInfo,
      ...that.data.userInfo
    }
    getApp().globalData.wxUserInfo = obj;
    console.log(getApp().globalData.wxUserInfo);
    
    wx.navigateTo({
      url: '/subpackages/pages/dqys/dqys',
    })
  },




})