// pages/xzrwd/xzrwd.js
import req from '../../../utils/request';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    titleVal: 'basic',
    list: [],
    num: 0,
    currentIndex: 1,
    totalCount: 0,
    pageSize: 10,
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉");
    var that = this;
    that.data.currentIndex++;
    if (that.data.oldlist.length >= that.data.totalCount) {
      return;
    } else {
      that.getList();
    }
    console.log(that.data.currentIndex);
  },
  onShow: function () {
    this.getList();
  },
  toJy(e) {
    var carInfo = e.currentTarget.dataset.carinfo
    getApp().globalData.carInfo = carInfo;
    console.log(getApp().globalData.carInfo);
    wx.navigateTo({
      url: '/subpackages/pages/jysc/jysc'
    })
  },
  toBh() {
    console.log(2);
  },
  switchTitle(d) {
    var that = this;
    console.log(d.target.dataset.type)
    if (d.target.dataset.type == 'basic') {
      that.data.num = 0
      that.data.list = []
      that.setData({
        num: that.data.num,
        list: that.data.list
      })
      that.getList();
    } else if (d.target.dataset.type == 'project') {
      that.data.num = 1
      that.data.list = []
      that.setData({
        num: that.data.num,
        list: that.data.list
      })
      that.getList();
    }
    that.setData({
      titleVal: d.target.dataset.type
    })
  },
  getList() {
    var that = this;
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    var currentIndex = that.data.currentIndex;
    if (currentIndex == 1) {
      that.setData({
        oldlist: [],
      });
    }
    // 页数+1
    var pagesize = that.data.pageSize;
    req({
      url: app.globalData.globalUrl + '/manage/detectionRecord/list?' + 'drStatus=' + that.data.num + '&pageNum=' + currentIndex + '&pageSize=' + pagesize,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      console.log(res.data.rows);
      if (that.data.list.length !== 0) {
        that.data.list = that.data.list.concat(res.data.rows)
      } else {
        that.data.list = res.data.rows
      }
      that.setData({
        list: that.data.list,
        totalCount: res.data.total,
      });
      console.log(that.data.list);
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
    })
  }
})