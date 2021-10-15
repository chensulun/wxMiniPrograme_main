// pages/xzrwd/xzrwd.js
const app = getApp();
var md5 = require('../../../utils/md5.js');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    time: '请选择日期',
    modalShow: false,
    reson: '1',
    imgUrl: [],
    file_path: '',
    model: '',
    ptIndex: 0,
    ptlist: [],
    sccarNo: '',
    app_key: 'apitest',
    app_secret: 'ab179020b82d2fdcd4cea176796f7156',
    lcurl: 'api2.huoyunren.net:8100',
    lcmethod: 'ips2.api.currentStatus',
    address: [], //定位地址
    projectname: '' //项目名称
  },
  typePickerChange(e) {
    this.setData({
      [`${e.currentTarget.dataset.field}`]: e.detail.value
    })
  },
  resonChange(e) {
    this.setData({
      reson: e.currentTarget.dataset.reson
    })
  },
  modalHide() {
    this.setData({
      modalShow: false
    })
  },
  // 普通输入框
  inputChange(e) {
    this.setData({
      srcarnum: e.detail.value
    })
  },
  // bindDateChange (e) {
  //   this.setData({
  //     [`${e.target.dataset.field}`]: e.detail.value
  //   })
  // },
  /**
   * 提交
   */
  submitForm() {
    var that = this;
    if (that.data.driven_distance == undefined || that.data.driven_distance == null || that.data.factory_temperature == undefined || that.data.factory_temperature == null) {
      wx.showToast({
        icon: 'none',
        title: "数据不完整",
        duration: 2000,
      })
      return;
    }
    var model1 = that.data.model;

    var model2 = that.data.model;
    model1.file_path = that.data.file_path;
    model1.zd_id = wx.getStorageSync("station_id");
    var userinfo = wx.getStorageSync("userInfo");
    if (userinfo) {
      var userinfoJson = JSON.parse(userinfo);
      model1.create_user = userinfoJson.userid;
    }
    model1.driven_distance = that.data.driven_distance;
    model1.factory_temperature = that.data.factory_temperature;
    model1.number_pots = that.data.number_pots;
    model1.abnormal_number_pots = that.data.abnormal_number_pots;
    model1.tpNo = that.data.ptlist[that.data.ptIndex].code;
    that.setData({
      model: model1
    });
    console.log(app.globalData.url + '/electronicDelivery/add');
    wx.request({
      url: app.globalData.url + '/electronicDelivery/add',
      data: JSON.stringify(that.data.model),
      header: {
        'content-type': 'application/json;utf-8'
      },
      dataType: 'json',
      method: "POST",
      success: function (res) {
        if (res.data.code == 0) {
          //保存到另一
          that.saveJoggle(model2);
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
          that.setData({
            modalShow: false,
            reson: '1',
            imgUrl: [],
            file_path: '',
            model: '',
            driven_distance: '',
            factory_temperature: '',
            number_pots: '',
            abnormal_number_pots: ''
          })
          setTimeout(() => {
            that.onLoad();
          }, 1000)
        } else {

        }
      }
    })
  },
  /**
   * 保存到接口数据
   */
  saveJoggle: function (model) {
    var that = this;

    console.log(model.carNo);
    var zdname = wx.getStorageSync("station");
    var zd = app.getServerUrl(zdname);
    // url参数
    var urlSrting = {
      projectname: that.data.projectname,
      end: that.data.address[0],
      jingdu: that.data.address[1].lng,
      weidu: that.data.address[1].lat,
    }
    var productUrl = app.globalData.serverUrl + zd + '/api/data/ajaxDZTime' + '?projectname=' + urlSrting.projectname + '&end=' + urlSrting.end + '&jingdu=' + urlSrting.jingdu + '&weidu=' + urlSrting.weidu;
    var now = util.formatTime(new Date()).replace("/", "-").replace("/", "-");
    wx.request({
      url: productUrl,
      data: {
        carNo: model.carNo,
        qsType: model.status,
        qsTime: now
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        console.log("接口");
        if (res.data.code == 200) {

        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
            duration: 2000,
          })
        }

      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: res.message,
          duration: 2000,
        })
      }
    });
  },
  /**
   * 签收
   */
  qianshou: function () {
    var that = this;
    var model1 = that.data.model;
    if (model1 == "") {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    model1.rejection_reason = "";
    model1.rejection_type = 0;
    model1.status = 0;
    model1.carNo = that.data.sccarNo;
    model1.tpNo = that.data.ptlist[that.data.ptIndex].code;
    model1.address = that.data.address;

    that.setData({
      model: model1
    });
    console.log(that.data.model);
    that.submitForm();
  },
  /**
   * 拒收
   */
  jushou: function () {
    this.setData({
      modalShow: true
    })
  },
  /**
   * 拒收提交
   */
  jushousubmit: function () {
    var that = this;
    var model1 = that.data.model;
    if (model1 == "") {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    model1.status = 1;
    model1.rejection_reason = that.data.rejection_reason;
    model1.rejection_type = that.data.reson;
    model1.tpNo = that.data.ptlist[that.data.ptIndex].code;
    that.setData({
      model: model1
    });
    console.log(model1);
    that.submitForm();
  },
  /**
   * 搜索
   */
  searchImg: function (e) {
    var that = this;
    var num = that.data.srcarnum;
    //debugger;
    that.getByCarNum(num);

    // 获取地址
    wx.getLocation({ //获取位置信息
      type: 'wgs84',
      success(res) {
        wx.request({ //以经纬度查询地址
          url: "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=DEGBZ-G4CLX-GBV4Y-7LK2H-75A73-SDBUP",
          dataType: "json",
          success: function (address) { //地址获取成功
            let end = address.data.result.address;
            let location = address.data.result.location;
            that.data.address = [];
            that.data.address.push(end);
            that.data.address.push(location);
            console.log(that.data.address);
            // // url参数
            // var urlSrting = {
            //   projectname: that.data.projectname,
            //   end: that.data.address[0],
            //   jingdu: that.data.address[1].lng,
            //   weidu: that.data.address[1].lat,
            // }
            // var productUrl = '/api/data/ajaxDZTime' + '?projectname=' + urlSrting.projectname + '&end=' + urlSrting.end + '&jingdu=' + urlSrting.jingdu + '&weidu=' + urlSrting.weidu;
            // console.log(productUrl);
          },
          fail: function () {
            wx.showModal({
              title: '提示',
              content: '定位失败！',
              showCancel: false,
              mask: true
            })
          }
        })
      }
    })
  },
  getQRCode: function (e) {
    var that = this;
    console.log("图片");
    console.log(e);
    wx.scanCode({ //扫描API
      success: function (res) {
        console.log("输出----------------");
        console.log(res); //输出回调信息


      }
    })

  },
  // 选择图片
  chooseImage: function (e) { //选择图片
    var that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          imgUrl: that.data.imgUrl.concat(res.tempFilePaths)
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.uploadOneByOne();

      }
    })
  },

  uploadOneByOne: function () {
    var that = this;
    wx.showLoading({
      icon: 'none',
      title: '正在上传',
    })
    wx.uploadFile({
      url: app.globalData.url + "CommonManager/uploadFileCommon",
      filePath: that.data.imgUrl[0],
      name: "file", //示例，使用顺序给文件命名,
      formData: {
        wj_path: "D:\\web\\前端\\cj_upWenjian"
      },
      success: function (e) {
        console.log("上传成功");
        that.setData({
          file_path: JSON.parse(e.data).data.replace("D:\\web\\前端\\cj_upWenjian", "")
        });
        that.getCarNum(JSON.parse(e.data).data);
      },
      fail: function (e) {
        console.log("上传失败");
        console.log(e);
      },
      complete: function (e) {
        wx.hideLoading()

      }
    })
  },
  /**
   * 解析图片中的车牌号
   */
  getCarNum: function (imgurl) {
    var that = this;
    wx.showLoading({
      icon: 'none',
      title: '正在解析车牌号',
    })
    wx.request({
      url: app.globalData.url + 'electronicDelivery/geiImg',
      data: {
        imgUrl: imgurl
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log("解析图片中的车牌号");
        console.log(res.data);

        if (res.data != null && res.data.data != null) {
          var jxresult = JSON.parse(res.data.data);
          if (jxresult.code == 0) {
            var number = jxresult.result[0].number;
            that.getByCarNum(number);
          } else {
            wx.showToast({
              icon: 'none',
              title: jxresult.msg,
              duration: 2000,
            })
          }

        }

      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: res.msg,
          duration: 2000,
        })
      },
      complete: function (e) {
        wx.hideLoading()

      }
    });
  },
  /**
   * 通过车牌号获取数据
   */
  getByCarNum: function (carnum) {
    var that = this;
    that.getJoggleData(carnum);
    that.getDistance(carnum);
    // wx.request({
    //   url: app.globalData.url + 'electronicDelivery/getModelByCarNum',
    //   data: { idzhandian: wx.getStorageSync("station_id"), carNum: carnum},
    //   method: 'GET',
    //   dataType: 'json',
    //   success: function (res) {
    //     console.log(res);
    //     that.setData({
    //       model: res.data.data
    //     })

    //   },
    //   fail: function (res) {
    //     wx.showToast({
    //       icon: 'none',
    //       title: res.msg,
    //       duration: 2000,
    //     })
    //   }
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 获取里程
   */
  // getDistance:function(carnum){
  //   var that = this;

  //   var now = util.formatTime(new Date()).replace("/","-");
  //   var app_secret = that.data.app_secret;
  //   var app_key = that.data.app_key;
  //   var lcmethod = that.data.lcmethod;
  //   var lcurl = that.data.lcurl;
  //   var ceshi = app_secret + 'app_key' + app_key + 'data{"carnum":"' + carnum + '"}method' + lcmethod+'timestamp' + now+ app_secret;
  //  console.log(ceshi);
  //   var sign=md5.md5(ceshi).toUpperCase();

  //   var lcapi = 'http://' + lcurl + '/interface/index.php?method=' + lcmethod + '&app_key=' + app_key + '&timestamp=' + now + '&sign=' + sign + '&data={"carnum":"' + that.toUnicode(carnum) + '"}';

  //   console.log(lcapi);
  //   wx.request({
  //     url: lcapi ,
  //     data: {  },
  //     method: 'GET',
  //     dataType: 'json',
  //     success: function (res) {
  //       console.log(res);
  //      if(res.code==0){
  //        var totalstance=res.data.result[0].totalstance;
  //        that.setData({
  //          driven_distance: driven_distance
  //        })
  //      }else{
  //        wx.showToast({
  //          icon: 'none',
  //          title: res.message,
  //          duration: 2000,
  //        })
  //      }

  //     },
  //     fail: function (res) {
  //       wx.showToast({
  //         icon: 'none',
  //         title: res.message,
  //         duration: 2000,
  //       })
  //     }
  //   });
  // },
  getDistance: function (carnum) {
    var that = this;
    var lcapi = 'https://cctruck-g7s.huoyunren.com/service.php?method=truck.ccappapi.getTeamMileage&license=' + carnum + '&pageNum=1&pageSize=999999}';
    wx.request({
      url: lcapi,
      data: {},
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        if (res.data.procStatus == 0) {
          if (res.data.vehicles != undefined && res.data.vehicles != null)

            var totalstance = 0;
          for (var i = 0; i < res.data.vehicles.length; i++) {
            totalstance += parseFloat(res.data.vehicles[i].mileage);
          }
          that.setData({
            driven_distance: totalstance
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: res.message,
          duration: 2000,
        })
      }
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
    // that.getDistance('京A09999');
    // that.getJoggleData('京A09999');
    console.log("车牌号");
    console.log(String("\u7ca4RP2085"))
  },
  /**
   * 解析段落的unicode字符，聊天记录的内容中有很多是编码过的
   */
  toUnicode: function (str) {
    return str.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function () {
      return "\\u" + RegExp["$1"].charCodeAt(0).toString(16);
    });
  },
  /**
   * 接口
   */
  getJoggleData: function (carnum) {
    var that = this;
    var zdname = wx.getStorageSync("station");
    var zd = app.getServerUrl(zdname);
    var productUrl = app.globalData.serverUrl + zd + '/api/data/dzjf';

    wx.request({
      url: productUrl,
      data: {
        carNo: carnum
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        console.log("接口");
        if (res.data.code == 200) {
          var joggledata = res.data.data;

          wx.request({
            url: app.globalData.url + '/sgpz/getTpList',
            data: {
              zhanidanid: wx.getStorageSync("station_id"),
              rwNo: joggledata.rwNo
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            method: "GET",
            success: function (res) {
              console.log(res.data.data);
              that.setData({
                ptlist: res.data.data
              })
            }
          })
          that.setData({
            model: res.data.data,
            sccarNo: carnum,
            project_name: joggledata.xmName,
            net_weight: joggledata.jz,
            initial_date: joggledata.scsj,
            driven_distance: joggledata.distance,
            factory_temperature: joggledata.outTemp,
            abnormal_number_pots: joggledata.ycCount,
            number_pots: joggledata.countAll,
            rwNo: joggledata.rwNo
          })
          that.data.projectname = joggledata.xmName;
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
            duration: 2000,
          })
        }

      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: res.message,
          duration: 2000,
        })
      }
    });
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