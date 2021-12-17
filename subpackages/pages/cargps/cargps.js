// pages/cargps/cargps.js
const app = getApp();
var QQMapWX = require('../../../qqmap-wx-jssdk.min.js');
import dt from '../../../dtzh.js';
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleVal: '1',
    scale: 16,
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
    cars: [],
    titleShow: false,
    carinfoShow: false, // 车辆信息显示隐藏
    searchModalShow: false, // 搜索显示隐藏
    station: "",
    xm: "",
    carNo: "",
    searchCar: [],
    location: "",
    project: [],
    compressiveStrength: '',
    transport: '',
    power: ''

  },
  markertap(e) {
    var carNo = e.markerId;
    var cars = this.data.cars;
    for (var i = 0; i < cars.length; i++) {
      if (cars[i].carNo === carNo) {
        this.setData({
          xm: (cars[i].projectName == undefined ? "" : cars[i].projectName),
          carNo: cars[i].carNo,
          location: cars[i].location.location,
          transport: cars[i].transport,
          compressiveStrength: cars[i].CompressiveStrength,
          power: cars[i].power
        })
        console.log('运输类型: ' + this.data.compressiveStrength)
        break;
      }
    }
    this.setData({
      searchModalShow: false,
      carinfoShow: true,
      titleShow: false
    })
  },
  markersd(e) {
    console.log(e);
    var carNo = e.target.dataset.id;
    var cars = this.data.cars;
    for (var i = 0; i < cars.length; i++) {
      if (cars[i].carNo === carNo) {
        this.setData({
          latitude: cars[i].location.lat,
          longitude: cars[i].location.lng,
          searchModalShow: false
        })
        break;
      }
    }
  },
  closeCarInfo() {
    this.setData({
      carinfoShow: false
    })
  },
  switchSearchShow() {
    this.setData({
      searchModalShow: true,
      carinfoShow: false,
      titleShow: false
    })
  },
  switchSearchHide() {
    this.setData({
      searchModalShow: false
    })
  },
  switchTitle(e) {
    this.setData({
      titleVal: e.target.dataset.type
    })
  },
  switchTitleShow(e) {
    this.setData({
      titleShow: e.target.dataset.type
    })
  },
  returnPositon() {
    let mpCtx = wx.createMapContext("myMap");
    mpCtx.moveToLocation();
  },
  scaleAdd() {
    if (this.data.scale < 20) {
      let zoom = this.data.scale + 1
      this.setData({
        scale: zoom
      })
    }
  },
  scaleReduce() {
    if (this.data.scale > 3) {
      let zoom = this.data.scale - 1
      this.setData({
        scale: zoom
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //初始化地图SDK
    qqmapsdk = new QQMapWX({
      key: 'PMNBZ-F2TCU-H3AVV-4NNS2-2NGHS-OWFOZ'
    });
      wx.setNavigationBarTitle({
        title: '数智系统'
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      station: wx.getStorageSync("station")
    })
    this.getList();
    this.getProject();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  getJWD: function() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getList: function() {
    var that = this;
    wx.request({
      url: app.globalData.serverUrl + app.getServerUrl(that.data.station) + "/api/location/ajaxGet",
      success: function(res) {
        console.log(res, '1');
        for (var i = 0; i < res.data.list.length; i++) {
          //   (function(i) {
          //     setTimeout(function(){
          //       if (res.data.list[i].location != null) {
          //         qqmapsdk.reverseGeocoder({
          //           location: {
          //             latitude: res.data.list[i].location.lat,
          //             longitude: res.data.list[i].location.lng
          //           },
          //           coord_type: 1, //baidu经纬度
          //           success: function (resdata) {
          //             res.data.list[i].location.lat = resdata.result.location.lat;
          //             res.data.list[i].location.lng = resdata.result.location.lng;
          //             console.log(i);
          //           }
          //         })
          //       }
          //     },1000);

          //   })(i);
          if (res.data.list[i].location != null) {
            var zb = dt.bd_decrypt(parseFloat(res.data.list[i].location.lat),parseFloat(res.data.list[i].location.lng));
            res.data.list[i].location.lat = zb.lat;
            res.data.list[i].location.lng = zb.lon;
            // res.data.list[i].location.lat = res.data.list[i].location.lat;
            // res.data.list[i].location.lng = res.data.list[i].location.lng;
            console.log(zb);
          }
        }
      console.log(res);
        var carList = [];
        for (var i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].location != null) {
            carList.push(res.data.list[i]);
          }
        }

        var markers = [];
        for (var i = 0; i < carList.length; i++) {
          if (i === 0) {
            that.setData({
              latitude: carList[i].location.lat,
              longitude: carList[i].location.lng
            })
          }
          var marker = {
            id: carList[i].carNo,
            latitude: carList[i].location.lat,
            longitude: carList[i].location.lng,
            zIndex: 999,
            iconPath: '/img/gbcx.png',
            label: {
              content: carList[i].carNo,
              padding: 10,
              fontSize: 16,
              borderRadius: 5,
              x: 20,
              y: -35,
              anchorX: 20,
              anchorY: -35,
              bgColor: '#fff',
              color: '#333333'
            }
          }
          markers.push(marker);
        }
        that.setData({
          cars: carList,
          markers: markers,
          searchCar: carList
        });
      },
      fail: function(dbsx_res) {
        wx.showToast({
          title: '车辆信息加载失败！',
          icon: 'none',
          duration: 5000
        })
      }
    })
  },
  getProject: function() {
    var that = this;
    wx.request({
      url: app.globalData.serverUrl + app.getServerUrl(that.data.station) + "/api/data/ajaxGetProject?last48h=1",
      success: function(res) {
        that.setData({
          project: res.data.list.map(val => {
            return {
              ...val,
              isShow: false,
              carList: []
            }
          })
        })
      }
    })
  },
  expandProject: function(event) {
    let projectIndex = event.currentTarget.dataset.index
    this.getCarList(projectIndex)
  },
  //根据项目ID获取车牌号
  getCarList: function(projectIndex) {
    var that = this;
    if (this.data.project[projectIndex].isShow) {
      let projectList = [...that.data.project]
      projectList[projectIndex].isShow = false
      that.setData({
        project: [...projectList]
      })
    } else {
      let project = this.data.project[projectIndex].projectId
      wx.request({
        url: app.globalData.serverUrl + app.getServerUrl(that.data.station) + "/api/location/ajaxGet?project=" + project + "&last48h=1",
        success: function(res) {
          let list = res.data.list
          let projectList = [...that.data.project]
          projectList[projectIndex].carList = [...list]
          projectList[projectIndex].isShow = true
          that.setData({
            project: [...projectList]
          })
        }
      })
    }
  },
  //获取车辆轨迹
  getCarTrail: function(event) {
    var that = this;
    let carInfo = event.currentTarget.dataset.car;
    let project = event.currentTarget.dataset.projectid;
    this.setData({
      latitude: carInfo.location.lat,
      longitude: carInfo.location.lng,
      searchModalShow: false
    })
    setTimeout(() => {
      that.setData({
        scale: 16
      })
    }, 100)
    // console.log(carInfo, project)
    // wx.request({
    //   url: app.globalData.serverUrl + app.getServerUrl(that.data.station) + "/api/location/history/ajaxGet?carNo="+carInfo.carNum+"&project=" + project + "",
    //   success: function (res) {
    //     console.log(res.data.list);
    //   }
    // })
  },
  searchCar: function(e) {
    var searchVal = e.detail.value;
    var carList = this.data.cars;
    var searchCar = [];
    for (var i = 0; i < carList.length; i++) {
      if (carList[i].xm != null) {
        if (carList[i].carNo.indexOf(searchVal) >= 0 || carList[i].xm.indexOf(searchVal) >= 0) {
          searchCar.push(carList[i]);
        }
      } else {
        if (carList[i].carNo.indexOf(searchVal) >= 0) {
          searchCar.push(carList[i]);
        }
      }
    }
    this.setData({
      searchCar: searchCar
    });
  }
})