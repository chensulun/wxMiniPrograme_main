// pages/sbwx/sbwx.js
import req from '../../utils/request';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val1: '',
    val2: '',
    address: '地址',
    errno: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var json = options.data.replace(/^\s*/g, '');
    var chuandi = JSON.parse(json);
    console.log(chuandi);
    that.setData({
      safemodel: chuandi
    });





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
      errno: 0,
      address: app.globalData.address
    })
    // wx.request({
    //   url: app.globalData.url + 'wxaqxj/getLx',
    //   data: { aqxj_id: that.data.chuandi.aqxj_id, wz: that.data.chuandi.wz, code: that.data.chuandi.code },
    //   success: function (res) {
    //     if (res.data.code == 0) {
    //       // 回调函数
    //      that.setData({
    //        safemodel:res.data.data
    //      })
    //     } else {
    //       wx.showToast({
    //         icon: 'none',
    //         title: res.data.msg,
    //         duration: 2000,
    //       })
    //       that.setData({
    //         errno:1
    //       })
    //     }

    //   }
    // })
  },
  /**
   * 完成
   */
  overfun: function () {

    var that = this;
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    var data = {
      sidId: that.data.safemodel.sidId,
      status: 1
    }
    req({
      url: app.globalData.globalUrl + '/manage/securityInspectionDetails',
      method: 'put',
      header: {
        'Authorization': "Bearer " + token
      },
      data: data,
    }).then(res => {
      console.log(res);
      wx.showToast({
          icon: 'none',
          // title: res.data.msg,
          title: '提交成功',
          duration: 2000,

        }),
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500);

    }).catch(err => {
      console.log(err);
    })

  },
  /**
   * 异常
   */
  yichangfun: function () {
    var that = this;
    wx.navigateTo({
      url: "/pages/aqxj/aqxj?data=" + JSON.stringify(that.data.safemodel)
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