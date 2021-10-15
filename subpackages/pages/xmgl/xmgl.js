// pages/rwdgl/rwdgl.js
import req from '../../../utils/request';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 1,
    oldlist: [],
    reslist: [],
    totalCount: 0,
    pageSize: 10,
    projectSignData: []
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
    this.getList(1);
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    console.log("上拉");
    console.log("currentIndex" + that.data.currentIndex);
    console.log("totalCount" + that.data.totalCount);
    console.log("pageSize" + that.data.pageSize);

    var currentIndex = that.data.currentIndex;
    var totalCount = that.data.totalCount;
    var pagesize = that.data.pageSize;
    console.log(currentIndex * pagesize + "-----" + totalCount);
    if ((currentIndex - 1) * pagesize >= totalCount) {

    } else {
      console.log(2);
      that.getList(currentIndex);
    }
    wx.pageScrollTo({
      //scrollTop: 0,
    })
  },
  getList: function (currentIndex) {
    var that = this;
    if (currentIndex === 1) {
      that.setData({
        currentIndex: 1,
        oldlist: [],
        reslist: [],
        totalCount: 0,
        pageSize: 10
      })
    }
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    var pagesize = that.data.pageSize;
    var msId = wx.getStorageSync("station_id")
    var token = wx.getStorageSync("token");
    // 
    req({
      url: app.globalData.globalUrl + '/manage/project/listByMsId?msId=' + msId,
      method: "GET",
      header: {
        'Authorization': "Bearer " + token
      }
    }).then(res => {
      if (res.data.code == 200) {
        // console.log(res.data);
        // 回调函数
        const oldData = that.data.oldlist;
        res.data.rows.forEach(e => {
          var type = []
          var arr = JSON.parse(e.projectSignData);
          console.log(arr);
          for (const i in arr) {
            type.push(arr[i].type)
          }
          e.projectSignData = type;
          oldData.push(e)
        });
        that.setData({
          oldlist: oldData,
          totalCount: res.data.total,
          currentIndex: currentIndex + 1,
        })
        console.log(that.data.oldlist);
        // 隐藏加载框
        wx.hideLoading();
      }
    }).catch(err => {
      console.log(err);
    })
  }
})