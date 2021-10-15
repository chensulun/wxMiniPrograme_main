// pages/qbgn/qbgn.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allRightList: [],
    rightList: []
  },
  getUserRights() {
    let that = this;
    var userinfoJson = JSON.parse(wx.getStorageSync("userInfo"));
    wx.request({
      method: "POST",
      url: app.globalData.url + 'role/getXCXRoleMenus?roleId=' + userinfoJson.role_id,
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res.data.list);
          that.setData({
            allRightList: res.data.list
          });
          that.dealRight();
        console.log(that.data.rightList);
      }
      }
    });
  },
  dealRight() {
    let id = wx.getStorageSync("station_id");
    this.data.allRightList.map(val => {
      if (val.idzhandian === id) {
        this.setData({
          rightList: val.menuList
        });
      }
    })
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
        title: 'AIS系统'
      })
    }
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
    this.getUserRights();
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
  wxqz: function () {
    console.log("wxqz")
    wx.showModal({
      title: '是否拨打电话?',
      content: '023-88888888',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '023-88888888' //仅为示例，并非真实的电话号码
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})