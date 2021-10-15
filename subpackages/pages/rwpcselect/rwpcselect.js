// pages/rwpcselect/rwpcselect.js
import req from '../../../utils/request';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    list_data: [],
    selectilall: false,
    taskId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
    that.bindData();
  },
  //绑定未排程列表
  bindData: function () {
    var that = this;
    that.setData({
      list_data: [],
    })
    let prevPage = getCurrentPages()[getCurrentPages().length - 2] //获取上一个页面栈
    let list = prevPage.data.list_data;
    var searchText = "";
    for (var i = 0; i < list.length; i++) {
      if (i > 0) {
        searchText += ',';
      }
      searchText += list[i].taskId;
    }
    console.log(searchText);
    var msId = wx.getStorageSync("station_id");
    var token = wx.getStorageSync("token");
    if (list.length > 0) {
      var url = app.globalData.globalUrl + '/manage/task/list?msId=' + msId + '&taskStatus=' + 0 + '&params%5BunContain%5D=' + searchText
    } else {
      var url = app.globalData.globalUrl + '/manage/task/list?msId=' + msId + '&taskStatus=' + 0 
    }

    req({
      url: url,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      console.log(res);
      that.setData({
        list_data: res.data.rows
      })
    }).catch(err => {
      console.log(err);
    })
    // wx.request({
    //   url: app.globalData.url+'task/getTaskList',
    //   data:{
    //     currentIndex: 1,
    //     pageSize: 9999,
    //     role_id: 'administrator',
    //     where: " and status='WPC'"+where,
    //     project_name: "",
    //     zhandian_id:0,
    //   },
    //   dataType: 'json',
    //   method:"get",
    //   success:function(res){
    //     console.log(res.data);
    //       that.setData({
    //         list_data:res.data.list
    //       })
    //   }
    // })
  },
  //单选
  select: function (e) {
    let selectValue = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index;
    let list = this.data.list_data
    let newli = 'list_data[' + index + '].checked';
    this.setData({
      [newli]: !this.data.list_data[index].checked
    })
    let num = 0;
    for (var i = 0; i < this.data.list_data.length; i++) {
      if (this.data.list_data[i].checked) {
        num++;
      }
    }
    if (num == this.data.list_data.length) {
      this.setData({
        selectilall: true
      })
    } else {
      this.setData({
        selectilall: false
      })
    }
  },
  //全选，取消全选
  selectAll: function (e) {
    let list = this.data.list_data;
    let selectilall = this.data.selectilall;
    if (selectilall == false) {
      for (let i = 0; i < list.length; i++) {
        let newli = 'list_data[' + i + '].checked';
        this.setData({
          [newli]: true,
          selectilall: true
        })
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        let newli = 'list_data[' + i + '].checked';
        this.setData({
          [newli]: false,
          selectilall: false
        })
      }
    }
  },
  selectplan: function (e) {
    var that = this;
    let list = that.data.list_data;
    var selectval = 0;
    let prevPage = getCurrentPages()[getCurrentPages().length - 2] //获取上一个页面栈
    let oldlist = prevPage.data.list_data;
    for (var i = 0; i < list.length; i++) {
      if (list[i].checked) {
        oldlist.push(list[i]);
        selectval++
      }
    }
    prevPage.setData({
      list_data: oldlist,
    })
    if (selectval > 0) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.showToast({
        title: '请先选择任务！',
        icon: 'none',
        duration: 1500
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