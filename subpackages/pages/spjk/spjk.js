// pages/spjk/spjk.js
import req from '../../../utils/request';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "未获取位置信息",
    url1: '',
    url2: '',
    url3: '',
    index: 0,
    array: ['生产监控', '库存监控', '安全监控'],
    videoList: []
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
    this.getVideoUrl(this.data.array[e.detail.value])
  },
  getVideoUrl(e) {
    let that = this;
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: app.globalData.globalUrl + '/manage/monitor/list?monitorType=' + that.data.index + '&msId=' + msId,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      console.log(res);
      that.data.videoList = res.data.rows
      that.setData({
        videoList: that.data.videoList
      })
      console.log(that.data.videoList);
    }).catch(err => {
      console.log(err);
    })
    // wx.request({
    //   url: app.globalData.url + 'Video/geVideoList',
    //   data: {
    //     model_name: e,
    //     pageIndex: 1,
    //     pageSize: 100,
    //     type: 'app',
    //     zhandian: wx.getStorageSync('station')
    //   },
    //   method: "GET",
    //   success: function (res) {
    //     that.setData({
    //       videoList: res.data.list
    //     })
    //     console.log(that.data.videoList)
    //   }
    // })
  },
  statechange(e) {
    console.log(e.detail, 'live-player')
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
    this.setData({
      address: app.globalData.address
    });
    this.getVideoUrl(this.data.array[this.data.index])
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
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  }
})