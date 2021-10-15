// pages/xzrwd/xzrwd.js
const app = getApp();

// 引入SDK核心类
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'SA6BZ-YY7EW-2ZMRE-OR5DP-56V4O-IQBLR' // 必填
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    project_id: 0,
    titleVal: 'basic',
    formData: {},
    rules: [],
    suggestion: [],
    selectedId: 0,
    nearList: [],
    backfill: '',
    latitude: '23.099994',
    longitude: '113.324520',
    showview: false,
    markers: [],
    date: '2016-09-01',
    projectTypeList: [
      {
        id: 'zsht',
        name: '正式合同'
      },
      {
        id: 'xjht',
        name: '临时合同'
      },
      {
        id: 'lssx',
        name: '紧急任务'
      }
    ],
    customList: [

    ],
    listVal: '',
    custumindex: 0,
    projectTypeIndex: 0,
    customid: 0,
    projectTypeid: "zsht",
    projectstate: 0,
    project_state: 1,
    lng: '',
    lat: '',
    val1: '',
    val2: '',
    tableList: []
  },
  custumpickerChange(e) {
    this.setData({
      custumindex: e.detail.value,
      customid: e.target.dataset.id
    })
  },
  projectTypepickerChange(e) {
    this.setData({
      projectTypeIndex: e.detail.value,
      projectTypeid: e.target.dataset.id
    })
  },
  radioChange(e) {
    this.setData({
      projectstate: e.detail.value
    });
    //console.log(e)
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
      [`formData.date`]: e.detail.value
    })
  },
  switchTitle(d) {
    console.log(d)
    this.setData({
      titleVal: d.target.dataset.type
    })
  },
  readMapData() {
    this.setData({
      lng: this.data.markers[0].longitude,
      lat: this.data.markers[0].latitude
    })
  },
  mapTap(e) {
    this.setData({
      markers: [{
        id: 1,
        latitude: e.detail.latitude,
        longitude: e.detail.longitude,
        zIndex: 999
      }]
    })
  },
  addItem() {
    let arr = [...this.data.tableList]
    console.log(arr)
    if (this.data.val1 && this.data.val2) {
      arr.push({ qlx: this.data.val1, qdl: this.data.val2 })
      this.setData({
        val1: '',
        val2: '',
        tableList: [...arr]
      })
      console.log(arr)
    }
  },
  delItem(e) {
    let index = e.currentTarget.dataset.index
    let arr = [...this.data.tableList]
    arr.splice(index, 1)
    this.setData({
      tableList: [...arr]
    })
  },
  formInputChange1(e) {
    this.setData({
      val1: e.detail.value
    })
  },
  formInputChange2(e) {
    this.setData({
      val2: e.detail.value
    })
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    console.log(field)
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  formSubmit: function (e) {
    //debugger;
    var that = this;
    console.log(e);
    var data = {
      project_id: that.data.project_id,
      project_type: that.data.projectTypeList[that.data.projectTypeIndex].id,
      project_state: that.data.projectstate,
      htzl: e.detail.value.htzl,
      custom_id: that.data.customList[that.data.custumindex].custom_id,
      project_name: e.detail.value.project_name,
      gdjd: that.data.lng,
      gdwd: that.data.lat,
      zqdl: e.detail.value.zqdl,
      zlkz: e.detail.value.zlkz,
      remark: e.detail.value.remark,
      addUser: 0,
      projectFxParams: that.data.tableList,
      zhandianid: wx.getStorageSync("station_id")
    };
    wx.request({
      url: app.globalData.url + '/qianhe/addProject2',
      data: JSON.stringify(data),
      header: {
        'content-type': 'application/json;utf-8'
      },
      dataType: 'json',
      method: "POST",
      success: function (res) {
        //debugger;
        console.log(res);
        if (res.data.code == 0) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {

        }
      }
    })
    console.log(data);
  },

  //触发关键词输入提示事件
  getsuggest: function (e) {
    var _this = this;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      page_size: 8,
      success: function (res) {//搜索成功后的回调
        console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({
          showview: false
        })
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug

        });
      },
      fail: function (error) {
        console.error(error + "失败");
        _this.setData({
          showview: true
        })
      },
      complete: function (res) {
        console.log(res);

      }
    });
  },
  //方法回填
  backfill: function (e) {
    console.log("点击");
    this.setData({
      showview: true
    })
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        this.setData({
          backfill: this.data.suggestion[i].title,
          latitude: this.data.suggestion[i].latitude,
          longitude: this.data.suggestion[i].longitude
        });
        // this.nearby_search();
        return;
      }
    }
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
    wx.request({
      url: app.globalData.url + '/sysProject/getCustoms',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: "GET",
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          that.setData({
            customList: res.data.list
          })
        } else {

        }
      }
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