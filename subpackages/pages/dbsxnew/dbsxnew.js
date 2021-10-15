// pages/dbsxnew/dbsxnew.js
import req from '../../../utils/request';

const app = getApp()

Page({

  /**
   * 页面的初始数据weui-bar__item_on
   */
  data: {
    nav_css1: 'weui-bar__item_on',
    nav_css2: '',
    nav_dbsx: false,
    shenhe: "JipeiSh",
    array: [],
    array2: [],
    bxtz: [],
    wxtz: [],
    assets_id: 0,
    mid: "",
    pbsh: "配比审核"


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that = this;
    if (options.dbsx == "true") {
      this.setData({
        nav_css1: '',
        nav_css2: 'weui-bar__item_on',
        nav_dbsx: true
      })
    } else {
      this.setData({
        nav_css1: 'weui-bar__item_on',
        nav_css2: '',
        nav_dbsx: false
      })
    }
    this.loadData();
  },
  loadData: function (msg) {
    var that = this;
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
      console.log(res);
      that.setData({
        array: res.list
      })
    });
    app.formPost('shebeirepair/getShebeimaintainList', prameter, function (res) {
      console.log(res);
      app.globalData.listByjd = res.list;
      that.setData({
        array2: res.list
      })
    });
    this.setData({
      bytz: app.globalData.dbsxResult.bxtz,
      wxtz: app.globalData.dbsxResult.wxtz,
    })
  },
  toGetDetail: function (e) {
    var data = e.currentTarget.dataset;
    console.log(data);
    var id = data.id;
    var businesskey = data.businesskey;
    var definitionkey = data.definitionkey;
    var instancename = data.instancename;
    // console.log(definitionKey,instanceName);
    var param = '?id=' + id + '&businessKey=' + businesskey + '&definitionkey=' + definitionkey + '&instancename=' + instancename;
    console.log(param);
    wx.navigateTo({
      url: "/subpackages/pages/xmmx/xmmx" + param
    })
  },
  toDetail: function (e) {
    var data = e.currentTarget.dataset;
    var param = "?code=" + data.code + "&taskid=" + data.taskid + "&taskcode=" + data.taskcode;
    var action = "";
    console.log(data.shlx)
    switch (data.shlx) {
      case "GuanliSh":
      case "ShengchanSh":
      case "ZhanzhangSh":
      case "jlscSh":
        action = "/pages/rwdmxnew/rwdmxnew";
        break;
      case "XiaomuSh":
      case "Jlsh":
      case "fczsh":
      case "czsh":
        param = "?code=" + data.code + "&shId=" + data.taskid + "&shlx=" + data.shlx;
        action = "/pages/xmmx/xmmx";
        break;
      case "JipeiSh":
        param = "?shId=" + data.taskid + "&shlx=" + data.shlx;
        action = "/pages/pbmx/pbmx";
        break;
    }
    console.log(action + param)
    wx.navigateTo({
      url: action + param
    })

  },
  toTask: function (e) {
    var data = e.currentTarget.dataset;
    var that = this;
    this.setData({
      assets_id: data.maintainid,
      mid: data.id
    })
    wx.scanCode({
      scanType: 'qrCode', //扫描API
      success: function (res) {
        console.log("输出----------------");
        console.log(res.result); //输出回调信息
        if (res.result != null) {
          //res.result.indexOf("aqxj_id") != -1 &&
          var result = JSON.parse(res.result);
          if (result.type = "zc") {

            // let action = "/pages/sbbynew/sbbynew?maintenanceId=" + JSON.stringify(obj);
            // wx.navigateTo({
            //   url: action
            // })
            wx.request({
              url: app.globalData.url + 'taskwechat/getAssetsById?asstes_id=' + that.data.assets_id,
              success: function (res) {
                if (res.data.assetscode == result.key) {
                  let action = "/pages/sbbynew/sbbynew?maintenanceId=" + that.data.mid;
                  wx.navigateTo({
                    url: action
                  })
                } else {
                  wx.showToast({
                    icon: 'none',
                    // title: res.data.msg,
                    title: 123,
                    duration: 2000,
                  })

                }

              }
            })


          }
        }


      }
    })

  },
  toDetail2: function (e) {
    var data = e.currentTarget.dataset;
    var param = "?shId=" + data.shid + "&shlx=" + data.shlx;
    var action = "/pages/pbmx/pbmx";
    wx.navigateTo({
      url: action + param
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
    this.getList();
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
    this.gotoHomePage();
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
  /**
   * 顶部导航菜单切换
   */
  navchange: function (res) {
    //console.info(res);
    if (res.target.dataset.nav == 'nav1') {
      this.setData({
        nav_css1: 'weui-bar__item_on',
        nav_css2: '',
        nav_dbsx: false
      })
    } else {
      this.setData({
        nav_css1: '',
        nav_css2: 'weui-bar__item_on',
        nav_dbsx: true
      })
    }
    //console.info(this.data);
  },
  syscode: function (e) {
    console.log(e.currentTarget.dataset)
    // wx.navigateTo({
    //   url: "/pages/" + e.currentTarget.dataset.wxby + "/" + e.currentTarget.dataset.wxby + "?equipmentId="+e.currentTarget.dataset.equipmentid
    // })
    wx.scanCode({ // 只允许从相机扫码
      onlyFromCamera: true,
      success(sys_res) {
        wx.request({ //获取科目编码
          url: app.globalData.url + 'shebei/getShebeiBh',
          data: {
            kemu: e.currentTarget.dataset.kemu
          },
          dataType: 'json',
          success: function (bianmare) {
            var codebh = JSON.parse(sys_res.result).key;
            console.log("二维码内容" + codebh)
            // console.log("科目查询编码" +JSON.stringify( bianmare.data));
            console.log("科目查询编码:1" + e.currentTarget.dataset.kemu);
            // if (codebh == bianmare.data) {
            wx.navigateTo({
              url: "/pages/" + e.currentTarget.dataset.wxby + "/" + e.currentTarget.dataset.wxby + "?equipmentId=" + e.currentTarget.dataset.equipmentid
            })
            // } else {
            //   wx.showToast({
            //     title: "请扫描正确的二维码",
            //     icon: 'none',
            //     duration: 2000
            //   })
            // }
          },
          fail: function (dbsx_res) {
            wx.showToast({
              title: '服务故障，稍后重试',
              icon: 'none',
              duration: 5000
            })
          },
        })

      }
    })
  },
  gotoHomePage: function () { //自定义页面跳转方法
    console.log("返回");
    wx.switchTab({
      url: "/pages/index/index",
      success: function (e) {
        let page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  getList: function () { //显示页面,加载列表
    var that = this;
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: app.globalData.globalUrl + '/task/list?pageNum=1&pageSize=99',
      method: 'GET',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      console.log(res);
      that.setData({
        array: res.data.rows
      })
      console.log(that.data.array);
    }).catch(err => {
      console.log(err);
    })
  }
})