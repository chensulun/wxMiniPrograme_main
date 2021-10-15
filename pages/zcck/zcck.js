// pages/zcck/zcck.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    name1: '资产名称',
    name2: '制造商',
    name3: '类别',
    name4: '编号',
    name5: '状态',
    name6: '采购时间',
    name7: '位置',
    name8: '入库时间',
    name9: '管理人',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
      var id=options.id
      wx.request({
        url: app.globalData.url+'shebei/getassetsLists',
        data:{key:id},
        success:function(re)
        {
          // console.log(re.data);
          that.setData({
            img_url: app.globalData.img_url,
            list: re.data.list
          });
          console.log(that.data.list);
          // var dt=re.data.data;
          // that.setData({
          //   name1:dt.name,
          //   name2:dt.zzs,
          //   name3:dt.lb,
          //   name4:dt.bh,
          //   name5:dt.status,
          //   name6:dt.cg_date,
          //   name7:dt.wz,
          //   name8:dt.rk_date,
          //   name9:dt.gl_person,
          //   pendlist:dt.img_list,
          //   img_url:app.globalData.img_url
          // })
        }
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