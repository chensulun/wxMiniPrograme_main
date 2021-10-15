// pages/sbwx/sbwx.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val1: '',
    val2: '',
    address: '地址',
    errno:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var chuandi = JSON.parse(options.data);
    console.log(chuandi);
    that.setData({
      chuandi:chuandi
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
    var that=this;
    that.setData({
      errno:0,
      address: app.globalData.address
    })
    wx.request({
      url: app.globalData.url + 'wxaqxj/getLx',
      data: { aqxj_id: that.data.chuandi.aqxj_id, wz: that.data.chuandi.wz, code: that.data.chuandi.code },
      success: function (res) {
        if (res.data.code == 0) {
          // 回调函数
         that.setData({
           safemodel:res.data.data
         })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
            duration: 2000,
          })
          that.setData({
            errno:1
          })
        }

      }
    })
  },
  /**
   * 完成
   */
  overfun:function(){
    var that = this;
    console.log(that.data.errno);
    if (that.data.errno == 0) {
      wx.request({
        url: app.globalData.url + 'wxaqxj/updateState',
        data: { aqxj_id: that.data.safemodel.aqxj_id, aqxj_lx_id: that.data.safemodel.aqxj_lx_id },
        success: function (res) {
          if (res.data.code == -100) {
            if (that.data.safemodel.xj_type == "dyxj" && app.globalData.xjlaiyuan==1){
              wx.switchTab({
                url: "/pages/index/index",
                success: function (e) {
                  let page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
              })
            }else{
              wx.navigateTo({
                url: "/pages/dbsx/dbsx?dbsx=true"
              })
            }
            
          } else {
            wx.navigateTo({
              url: "/pages/aqxj2/aqxj2?data=" + JSON.stringify(res.data.data)
            })
          }
        }
      });
    }
    
  },
  /**
   * 异常
   */
  yichangfun:function(){
    
    var that=this;
    if (that.data.errno==0){
      wx.request({
        url: app.globalData.url + 'wxaqxj/updateState',
        data: { aqxj_id: that.data.safemodel.aqxj_id, aqxj_lx_id: that.data.safemodel.aqxj_lx_id },
        success: function (res) {
          wx.navigateTo({
            url: "/pages/aqxj/aqxj?data=" + JSON.stringify(that.data.safemodel)
          })
        }
      })
    }
    
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
