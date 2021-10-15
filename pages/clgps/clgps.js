// pages/clgps/clgps.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      iconPath: "/img/clgps.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/img/clgps.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const accountInfo = wx.getAccountInfoSync()
    if (accountInfo.miniProgram.appId === 'wx605b2b76ff42b6b5') {
      wx.setNavigationBarTitle({
        title: '拌站精灵'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '智慧重交'
      })
    }
    let socketOpen = false
    var SocketTask_liangjiang=wx.connectSocket({
      url: 'ws://183.230.164.56:8025/liangjiang/product'
    })

    var SocketTask_bishan = wx.connectSocket({
      url: 'ws://183.230.164.56:8025/jbz/gps'
    })
    
    SocketTask_liangjiang.onOpen(function (res) {
      SocketTask_liangjiang.onMessage(function (res) {
        console.log('liangjiang收到服务器内容：' + res.data)
      })
    })

    // SocketTask_bishan.onOpen(function (res) {
    //   SocketTask_bishan.onMessage(function (res) {
    //     console.log('bishan' + res.data)
    //   })
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
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})