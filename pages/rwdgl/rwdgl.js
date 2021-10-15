// pages/rwdgl/rwdgl.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 1,
    oldlist: [],
    reslist: [],
    totalCount: 0,
    pageSize:10
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
    var that = this;
    that.setData({
      oldlist: []
    });
    that.getdata(1);
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉");
    var that = this;
    var currentIndex = that.data.currentIndex;
    var totalCount = that.data.totalCount;
    var pagesize = that.data.pageSize;
    console.log(currentIndex * pagesize + "-----" + totalCount);
    if ((currentIndex-1) * pagesize >= totalCount) {

    } else {
      that.getdata(currentIndex);
    }
    // wx.pageScrollTo({
    //   scrollTop: 0,
    // })
  },
  getdata: function (currentIndex) {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    var url = app.globalData.url;
    if (currentIndex == 1) {
      that.setData({
        oldlist: []
      })
    }
    // 页数+1
    var pagesize = that.data.pageSize;
    wx.request({
      url: url + 'dispatch/getTaskDispatchList',
      data: { currentIndex: currentIndex, pageSize: pagesize, type: "xcx", idzhandian: wx.getStorageSync("station_id")},
      // method: "POST",
      // // 请求头部
      // header: {
      //   'content-type': 'application/json',
      // },
      success: function (res) {
        console.log(res);
        console.log(res.data.data.dispatchList);
        if (res.data.code == 0) {
          // 回调函数
          const oldData = that.data.oldlist;
          that.setData({
            oldlist: oldData.concat(res.data.data.dispatchList),
            totalCount: res.data.totalCount,
            currentIndex: currentIndex + 1
          })
          // 隐藏加载框
          wx.hideLoading();
        } else {
            
        }

      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})