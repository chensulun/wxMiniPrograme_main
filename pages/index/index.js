//index.js
//获取应用实例
import req from '../../utils/request';
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    zhandianlist: [],
    url: "http://localhost:8080/",
    zhandianindex: 0,
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    smModal: false, //显示扫码弹窗
    modal: false, //弹窗遮罩
    address: "未获取位置信息",
    dbsxshcount: 0,
    dbsxbycount: 0,
    dbsxcount: 0,
    tongzhicount: 0,
    allRightList: [],
    rightList: [],
    zd_name: '',
    // 设备url
    peDatabase: '',
    peUrl: '',

    /**
     * 下拉框测试数据
     */
    msId: '',
    multiArray: [],
    multiIndex: 0,
    arrColumn0: [],
    checkValue: 0
    /**
     * 下拉框测试数据结束
     */
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '数智系统'
    })
  },
  onReady: function () {
    var that = this;
    wx.getLocation({ //获取位置信息
      type: 'wgs84',
      success(res) {
        wx.request({ //以经纬度查询地址
          url: "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=DEGBZ-G4CLX-GBV4Y-7LK2H-75A73-SDBUP",
          dataType: "json",
          success: function (address) { //地址获取成功
            app.globalData.address = address.data.result.address;
            if (app.globalData.address.length > 12) {
              // console.log(app.globalData.address);
              app.globalData.address = app.globalData.address.substring(0, 12) + "...";
            }
            that.setData({
              address: app.globalData.address
            });

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
  onShow: function () {
    var that = this;
    var userinfo = wx.getStorageSync("userInfo");
    if (userinfo) {
      var userinfoJson = JSON.parse(userinfo)
      wx.request({ //加载待办事项
        url: app.globalData.url + 'CommonManager/getDbsx',
        data: {
          username: wx.getStorageSync("username")
        },
        dataType: 'json',
        success: function (dbsx_res) {
          app.globalData.dbsxResult = dbsx_res.data.data;

          //console.log(app.globalData.dbsxResult)

          // that.setData({
          //   dbsxcount: app.globalData.dbsxResult.tzCount,
          //   tongzhicount: app.globalData.dbsxResult.tzCount
          // });
        },
        fail: function (dbsx_res) {
          wx.showToast({
            title: '待办事项加载失败',
            icon: 'none',
            duration: 5000
          })
        },

      })
      // app.appPost('qianhe/getDaibanCount', { userName: wx.getStorageSync("username")}, function (res) {
      //     //console.info(res);
      //   that.setData({'dbsxcount':res.data})
      // })
      var userinfo = wx.getStorageSync("userInfo");
      var userinfoJson = JSON.parse(userinfo);
      var prameter = {};
      prameter.maintain_user = wx.getStorageSync("realname");
      prameter.maintain_state = "保养中";
      prameter.zhandian_id = wx.getStorageSync('station_id');
      prameter.pageIndex = 1;
      prameter.pageSize = 9999;
      console.log(prameter);
      app.formPost('taskwechat/getShList', {
        role_id: userinfoJson.role_id,
        zd_id: wx.getStorageSync('station_id')
      }, function (res) {
        console.log("sh:" + res.list.length);
        that.setData({
          dbsxshcount: res.list.length
        })
      });
      app.formPost('shebeirepair/getShebeimaintainList', prameter, function (res) {
        // console.log("by:" + res.list.length);
        that.setData({
          dbsxbycount: res.list.length
        })
      });
      that.bindUserzdList();
      that.getUserRights();
      that.getProductionList();
      // wx.request({
      //   url: app.globalData.url + 'Tongzhi/getAll',
      //   data: { username: wx.getStorageSync("username") },
      //   method: 'GET',
      //   dataType: 'json',
      //   success: function (tz) {
      //     app.globalData.tongzhi = tz.data;
      //     that.setData({
      //       tongzhicount: app.globalData.tongzhi.length
      //     });
      //   }
      // })
    } else {
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 5000
      })
    }
    var zhandian = wx.getStorageSync('station');
    that.setData({
      zd_name: zhandian
    });
  },
  getUserRights() {
    let that = this;
    var userinfoJson = JSON.parse(wx.getStorageSync("userInfo"));
    wx.request({
      method: "POST",
      url: app.globalData.url + 'role/getXCXRoleMenus?roleId=' + userinfoJson.role_id,
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            allRightList: res.data.rows
          });
          that.dealRight();
        }
      }
    });
  },
  dealRight() {
    let id = wx.getStorageSync("station_id");
    this.data.allRightList.map(val => {
      if (val.msId === id) {
        this.setData({
          rightList: val.menuList
        });
      }
    })
  },
  /**
   * 改变站点下拉框2-1
   */
  PickerChange(e) {
    var that = this;
    var value = e.detail.value
    // that.data.checkValue = value
    that.setData({
      multiIndex: value
    })
    console.log(that.data.multiArray[that.data.multiIndex].msName)
    that.data.msId = that.data.multiArray[that.data.multiIndex].msId;
    console.log(that.data.msId);
    that.getProductionList();
    that.dealRight();
  },
  /**
   * 改变站点下拉框2-2
   */
  PickerColumnChange(e) {
    var that = this;
    var value = e.detail.value
    // that.data.checkValue = value
    that.setData({
      checkValue: value
    })
    console.log(that.data.arrColumn0[that.data.checkValue])
    that.dealRight();
  },
  /**
   * 获取站点
   */
  bindUserzdList() {
    var that = this;
    var userinfo = wx.getStorageSync("userInfo");

    if (userinfo) {
      var userinfoJson = JSON.parse(userinfo);
      var token = wx.getStorageSync("token");
      req({
        url: app.globalData.globalUrl + '/manage/mixingStation/listByRole',
        method: 'GET',
        header: {
          'Authorization': "Bearer " + token
        }
      }).then(res => {
        var html = '';
        var zhandianlist1 = [];
        // console.log(!wx.getStorageSync("station"));
        for (var i = 0; i < res.data.rows.length; i++) {
          let arr = {
            msName: res.data.rows[i].msName,
            msId: res.data.rows[i].msId
          }
          that.setData({
            multiArra: [],
          });
          that.data.multiArra = [];
          that.data.multiArray.push(arr);
          console.log(that.data.multiArray);
          that.setData({
            multiArray: that.data.multiArray,
          })
          if (i == 0 && (wx.getStorageSync("station") == null || !wx.getStorageSync("station"))) {
            wx.setStorageSync("station", res.data.rows[i].msName);
            wx.setStorageSync("station_id", res.data.rows[i].msId);
            that.setData({
              zd_name: res.data.rows[i].msName
            })
          }
          var zhandian = new Object();
          zhandian.station = res.data.rows[i].msName;
          zhandian.station_id = res.data.rows[i].msId;
          const accountInfo = wx.getAccountInfoSync()
          if (accountInfo.miniProgram.appId === 'wx2242bdf7b68a52dd') {
            if (res.data.rows[i].msId == 3) {
              zhandian = new Object();
              zhandian.station = res.data.rows[i].msName + "(3000型)";
              zhandian.station_id = res.data.rows[i].msId;
              zhandianlist1.push(zhandian);
              zhandian = new Object();
              zhandian.station = res.data.rows[i].msName + "(5000型)";
              zhandian.station_id = res.data.rows[i].msId;
              zhandianlist1.push(zhandian);

            } else {
              zhandianlist1.push(zhandian);
            }
          } else {
            zhandianlist1.push(zhandian);
          }
        }
        console.log(that.data.multiArray);
        // console.log(wx.getStorageSync("station_id"));
        for (var i = 0; i < zhandianlist1.length; i++) {
          if (zhandianlist1[i].station_id == wx.getStorageSync("station_id")) {
            that.setData({
              zhandianindex: i
            })
          }
        }
        if (wx.getStorageSync("station") === '任丘站(3000型)') {
          that.setData({
            zhandianindex: 0
          })
        }

        that.setData({
          zhandianlist: zhandianlist1,
        })
        if (zhandianlist1.length > 0) {
          that.productionkanban(wx.getStorageSync("station"));
        }
      }).catch(err => {
        console.log(err);
      })
    }
  },
  /**
   * 获取设备
   */
  getProductionList() {
    var that = this;
    var msId = that.data.msId;
    var token = wx.getStorageSync("token");
    req({
      url: app.globalData.globalUrl + '/manage/productionEquipment/list?msId=' + msId,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + token
      }
    }).then(res => {
      // console.log(res);
      that.data.arrColumn0 = [];
      res.data.rows.forEach(e => {
        // console.log(e);
        that.data.peDatabase = e.peDatabase;
        that.data.peUrl = e.peUrl;
        that.data.arrColumn0.push(e.peName)
        that.setData({
          arrColumn0: that.data.arrColumn0
        })
      });
      console.log(that.data.arrColumn0, that.data.peDatabase, that.data.peUrl);
    }).catch(err => {
      console.log(err);
    })
  },
  gotoScjk: function () {
    var that = this;
    // app.globalData.fhl = that.data.prodcut.fhl;
    app.globalData.fhl = that.data.prodcut.fhl;
    console.log(that.data.prodcut);
    wx.switchTab({
      url: "pages/scjk/scjk",
      success: function (e) {
        console.log("跳转成功");
        let page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onShow();
      }
    })
  },
  /**
   * 生产看版
   */
  productionkanban(zd) {
    var that = this;
    // var kanbanurl = app.getServerUrl(zd);
    var kanbanurl = 'renqiu3000'
    // console.log(zd);
    var msId = wx.getStorageSync("station_id");
    console.log(app.globalData.serverUrl);
    console.log(kanbanurl);
    // var kurl1 = app.globalData.serverUrl + kanbanurl + '/api/data/productKanBan';
    var kurl1 = that.data.peUrl + kanbanurl + '/api/data/productKanBan';

    console.log(kurl1);
    wx.request({ //加载生产看板
      url: kurl1,
      dataType: 'json',
      method: "POST",
      success: function (res) {
        console.log(res);
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 5000
          })
          return;
        }
        //console.log(res.data.data)
        //that.cavasdraw(res.data.data.yc_details);
        that.setData({
          prodcut: res.data.data
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '生产看板加载失败',
          icon: 'none',
          duration: 5000
        })
      }
    })
  },
  cavasdraw: function (arrs) {
    // 页面渲染完成
    // 创建上下文
    var context = wx.createContext();
    // 画饼图
    //    数据源
    //var array = [20, 30, 40, 40];
    var array = arrs;
    var array = [arrs.wd, arrs.pb, arrs.ysb];
    var colors = ["#ff0000", "#ffff00", "#0000ff"];
    var total = 0;
    //    计算问题
    for (var index = 0; index < array.length; index++) {
      total += array[index];
    }
    //    定义圆心坐标
    var point = {
      x: 40,
      y: 40
    };
    //    定义半径大小
    var radius = 40;

    /*    循环遍历所有的pie */
    for (var i = 0; i < array.length; i++) {
      context.beginPath();
      //    	起点弧度
      var start = 0;
      if (i > 0) {
        //    		计算开始弧度是前几项的总和，即从之前的基础的上继续作画
        for (var j = 0; j < i; j++) {
          start += array[j] / total * 2 * Math.PI;
        }
      }
      console.log("i:" + i);
      console.log("start:" + start);
      //      1.先做第一个pie
      //   	2.画一条弧，并填充成三角饼pie，前2个参数确定圆心，第3参数为半径，第4参数起始旋转弧度数，第5参数本次扫过的弧度数，第6个参数为时针方向-false为顺时针
      context.arc(point.x, point.y, radius, start, array[i] / total * 2 * Math.PI, false);
      //      3.连线回圆心
      context.lineTo(point.x, point.y);
      //      4.填充样式
      context.setFillStyle(colors[i]);
      //      5.填充动作
      context.fill();
      context.closePath();
    }

    wx.drawCanvas({
      canvasId: 'canvas2',
      actions: context.getActions()
    });
  },
  // getUserInfo: function(e) {//获取用户信息
  //   app.globalData.userInfo = e.detail;
  //   this.setData({
  //     hasUserInfo:true
  //   })
  //   console.log("dianji")
  //   this.login();
  // },
  syscode: function () {
    var that = this;

    // that.setData({
    //   smModal:true
    // })

    wx.scanCode({ // 只允许从相机扫码
      onlyFromCamera: true,
      success(sys_res) {
        // that.setData({
        //   smModal: true,
        //   modal:true
        // })
        console.log(sys_res);
        var resu = JSON.parse(sys_res.result);
        console.log(resu.type == 'xj');
        if (resu.type == 'zc') {
          console.log(resu.key)
          //资产
          // wx.navigateTo({
          //   url:'/pages/zcck/zcck?id='+resu.key,
          //   success:function(){}        //成功后的回调；
          // })
          wx.navigateTo({
            url: '/subpackages/pages/zccknew/zccknew?id=' + resu.key,
            success: function () {} //成功后的回调；
          })
          // wx.request({
          //   url:  app.globalData.url +'shebei/getzichanid',
          //   data:{
          //     bh:resu.key
          //   },
          //   success:function(re){
          //       if(re.data.code==0){
          //         wx.navigateTo({
          //           url:'/pages/zcck/zcck?id='+re.data.data.id,
          //           success:function(){}        //成功后的回调；
          //         })
          //       }
          //       else{
          //         //系统错误
          //       }
          //   }
          // })          
        } else if (resu.type == 'xj') {
          console.log(app.globalData.url);
          wx.request({
            url: app.globalData.url + 'wxaqxj/getModel',
            data: {
              wz: resu.wz,
              code: resu.code
            },
            success: function (res) {

              if (res.data.code == 0) {
                // 回调函数
                app.globalData.xjlaiyuan = 1;
                console.log(app.globalData.xjlaiyuan);
                let action = "/pages/aqxj1/aqxj1?data=" + JSON.stringify(res.data.data);
                wx.navigateTo({
                  url: action
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  // title: res.data.msg,
                  title: 'title',
                  duration: 2000,
                })
              }
            }
          })
        } else if (resu.type == 'yp') {
          console.log(app.globalData.url);
          wx.navigateTo({
            url: '/pages/ybxq/ybxq?id=' + resu.key,
            success: function () {} //成功后的回调；
          })
        }
      }
    })

  },
  login: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: app.globalData.url + 'user/wxlogin',
          data: {
            code: res.code,
            iv: app.globalData.userInfo.iv,
            encrytedData: app.globalData.userInfo.encryptedData
          },
          success: function (reslogin) {
            console.log(reslogin)
          }

        })
      }
    })
  },
  colseSysModal: function () {
    this.setData({
      smModal: false,
      modal: false
    })
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