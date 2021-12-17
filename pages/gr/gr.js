// pages/gr/gr.js
import req from '../../utils/request';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userdata: null, //用户信息, 提交表单用
    touxiang: "/icon/user_avatar.png",
    nickname: "未登录",
    grzx: true,
    appId: '',
    code: '',
    tempId: '7kU49HSXGqcU2uxKtoowrZ-fpIQ_5K0hWepC97JLaWI',
    yzmImg: '',
    yzmUuid: '',
    subscriptionsSetting: '', //授权信息
    flag: true, //弹窗
    flagShouquan: true, //弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '数智系统'
    })
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
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       that.setData({
    //         code: res.code
    //       })
    //       wx.getStorage({
    //         key: 'userInfo',
    //         success: function (res) {
    //           that.setData({
    //             grzx: false,
    //             nickname: wx.getStorageSync('username')
    //           })
    //           console.log(that.data.code, 222)
    //         },
    //         fail: function () {
    //           const accountInfo = wx.getAccountInfoSync()
    //           that.setData({
    //             grzx: true,
    //             nickname: wx.getStorageSync('未登录'),
    //             appId: accountInfo.miniProgram.appId
    //           })
    //           console.log(that.data.appId, 1223)
    //         }
    //       })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
    that.getYzm();
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
  exsit: function () {
    app.globalData.dbsxResult = null;
    wx.clearStorage();
    wx.showToast({
      title: '已退出登录',
      icon: 'success',
      duration: 2000,
      complete: function () {
        console.log("dengchu")
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    });
  },
  formSubmit: function (e) { //登录
    var that = this;
    var data = {
      "code": e.detail.value.yzm,
      "password": e.detail.value.password,
      "username": e.detail.value.username,
      "uuid": that.data.yzmUuid,
    }
    that.data.userdata = data;
    req({
      // url: app.globalData.globalUrl + '/dev-api/login',
      url: app.globalData.globalUrl + '/login',
      method: 'POST',
      data: that.data.userdata
    }).then(res => {
      if (res.data.code == 200) {
        // app.globalData.token = res.data.token;
        wx.setStorageSync('token', res.data.token);
        var token = wx.getStorageSync("token");
        // 
        req({
          // url: app.globalData.globalUrl + '/dev-api/getInfo',
          url: app.globalData.globalUrl + '/getInfo',
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'Authorization': "Bearer " + token
          }
        }).then(res => {
          var userinfo = that.data.userdata;
          userinfo.nickName = res.data.user.nickName;
          console.log(userinfo);
          wx.setStorageSync('userInfo', JSON.stringify(userinfo));
          wx.setStorageSync('username', userinfo.username);
          wx.setStorageSync('realname', userinfo.nickName);
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          });
          that.setData({
            grzx: false,
            flag:false,
            nickname: wx.getStorageSync('username'),
          })
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 2000
        });
        that.getYzm();
      }
    }).catch(err => {
      console.log(err);
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
 


  getYzm() {
    let that = this;
    req({
      // url: app.globalData.globalUrl + '/dev-api/captchaImage',
      url: app.globalData.globalUrl + '/captchaImage',
      method: 'GET',
    }).then(res => {
      that.data.yzmUuid = res.data.uuid;
      that.setData({
        yzmImg: res.data.img
      })
    }).catch(err => {
      console.log(err);
    })
  },
  /**
   * 弹出层函数
   */
  //消失
  hide: function () {
    this.setData({
      flag: true
    })
  },
  hideShouquan: function () {
    this.setData({
      flagShouquan: true
    })
  },

})