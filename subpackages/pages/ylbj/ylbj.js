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
    req({
      url: app.globalData.globalUrl + '/manage/detectionRecord/list?' + 'drStatus=' + that.data.num,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      // console.log(res);
      that.data.list = res.data.rows;
      that.setData({
        list: that.data.list
      })
      console.log(that.data.list);
    }).catch(err => {
      console.log(err);
    })
  }
})