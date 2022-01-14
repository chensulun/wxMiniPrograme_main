// subpackages/pages/aqjd/aqjd.js
import req from '../../../utils/request';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bdate: '',
    edate: '',
    state: null,
    tempFilePaths: [],
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
  DateStartChange(e) {
    this.setData({
      bdate: e.detail.value,
      qd_start_time: e.detail.value
    })
  },
  DateEndChange(e) {
    this.setData({
      edate: e.detail.value,
      qd_end_time: e.detail.value
    })
  },
  select_zl: function (e) {
    let that = this;
    that.setData({
      state2: e.currentTarget.dataset.id,
    });
  },
  toBack: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  upFiles: function () {
    var that = this
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    wx.chooseMessageFile({
      count: 10,
      type: 'all',
      success(res) {
        console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles
        tempFilePaths.forEach(e => {
          that.data.tempFilePaths.push(e)
        })
        console.log(tempFilePaths);
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.globalUrl + '/common/upload',
            filePath: tempFilePaths[i].path,
            name: "file",
            header: {
              "content-type": "multipart/form-data",
              'Authorization': "Bearer " + token
            },
            success: function (res) {
              console.log(res);
              var code = JSON.parse(res.data).code;
              var data = {}
              data.fileName = JSON.parse(res.data).fileName;
              data.url = JSON.parse(res.data).url;
              console.log(data);
              console.log(code);
              if (code == 200) {
                wx.showToast({
                  title: "上传成功",
                  icon: "success",
                  duration: 1500
                })
              }
            },
            fail: function (err) {
              console.log(err);
              wx.showToast({
                title: "上传失败",
                icon: "error",
                duration: 2000
              })
            },
          })
        }
      },
      fail(err) {
        console.log(err);
      }
    })
  }
})