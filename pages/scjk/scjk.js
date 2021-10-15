// pages/scjk/scjk.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 1,
    totalCount: 0,
    pageSize: 10,
    appId: '',
    oldlist: [],
    zd_name: '',
    // zd:'',
    zd: 'renqiu3000',
    firlist: [],
    animation: '', //跑马灯
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const accountInfo = wx.getAccountInfoSync();

    var fhl = options.fhl;
    // console.log("参数==" + fhl)
    this.setData({
      fhl: fhl,
      appId: accountInfo.miniProgram.appId
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
    var zdname = wx.getStorageSync("station");
    // var zd = app.getServerUrl(zdname);
    var zd = 'renqiu3000';
    var zhandianid = 0;
    var shebeiid = 0;
    if (zd === 'renqiu3000') {
      zhandianid = 3;
      shebeiid = 10;
    }
    if (zd === 'renqiu5000') {
      zhandianid = 3;
      shebeiid = 9;
    }
    if (zd === 'xinfeng') {
      zhandianid = 5;
      shebeiid = 2;
    }
    if (zd === 'xjz') {
      zhandianid = 6;
      shebeiid = 9;
    }
    wx.request({
      url: app.globalData.url + 'setting/getSettingDetailsList',
      // data: {sb_id: shebeiid, zd_id: zhandianid,yccd:'一般' },
      data: {
        sb_id: 10,
        zd_id: 3,
        yccd: '一般'
      },
      success: function (res) {
        that.setData({
          firlist: res.data.list
        });
      }
    })
    this.setData({
      oldlist: [],
      zd_name: wx.getStorageSync("station"),
      zd: zd
    });
    that.getprodectdata();
    that.bindAnimation();


  },
  cangzhou: function (data, list) {
    var that = this;
    var lastItemPB = data.lastItemPB;

    var onemax = 0;
    var onemin = 0;
    var hslmax = 0;
    var hslmin = 0;
    var six1max = 0;
    var six1min = 0;
    var sevenmax = 0;
    var sevenmin = 0;
    var ysbmax = 0;
    var ysbmin = 0;
    for (var i = 0; i < that.data.firlist.length; i++) {
      var d = that.data.firlist[i];
      if (data.productName === d.hhl_type) {
        switch (d.setting_name) {
          case "仓1":
            onemax = d.ed_size;
            onemin = d.bg_size;
            break;
          case "回收料":
            hslmax = d.ed_size;
            hslmin = d.bg_size;
            break;
          case "粉料1":
            six1max = d.ed_size;
            six1min = d.bg_size;
            break;
          case "粉料2":
            sevenmax = d.ed_size;
            sevenmin = d.bg_size;
            break;
          case "油石比":
            ysbmax = d.ed_size;
            ysbmin = d.bg_size;
            break;
          default:
            break;
        }
      }
    }
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (d.dateTime != null && d.dateTime.length >= 19) {
        d.dateTime = d.dateTime.substring(10, 19);
      }
      // console.log(data);
      var fir = 0;
      if (that.data.zd == "xinfeng" || that.data.zd == "xjz") {
        fir = lastItemPB.one_S - d.one_S
      }
      if (that.data.zd == "renqiu3000" || that.data.zd == "renqiu5000") {
        fir = lastItemPB.one_S_B - d.one_S_B
      }
      //报警
      if (fir > onemax && onemax > 0) {
        d.one = 'color:blue ;';
        //d.one_S = '<view style="color:blue ;"> ' + d.one_S + ' </view>';
      } else if (fir < onemin && onemin < 0) {
        d.one = 'color:red ;';
        //d.one_S = '<view style="color:red ;"> ' + d.one_S + ' </view>';
      }

      fir = lastItemPB.zsl_S - d.zsl_S;
      if (fir > hslmax && hslmax > 0) {
        d.zsl_Ss = 'color:blue ;';
        //d.six_S = '<view style="color:red ;"> ' + d.six_S + ' </view>';
      } else if (fir < hslmin && hslmin < 0) {
        d.zsl_Ss = 'color:red ;';
        //d.six_S = '<view style="color:blue ;"> ' + d.six_S + ' </view>';
      }

      if (that.data.zd == "xinfeng" || that.data.zd == "xjz") {
        fir = lastItemPB.seven_S - d.seven_S
      }
      if (that.data.zd == "renqiu3000" || that.data.zd == "renqiu5000") {
        fir = lastItemPB.seven_S_B - d.seven_S_B
      }
      if (fir > six1max && six1max > 0) {
        d.six1s = 'color:blue ;';
        //d.six_S = '<view style="color:red ;"> ' + d.six_S + ' </view>';
      } else if (fir < six1min && six1min < 0) {
        d.six1s = 'color:red ;';
        //d.six_S = '<view style="color:blue ;"> ' + d.six_S + ' </view>';
      }
      f
      if (that.data.zd == "xinfeng" || that.data.zd == "xjz") {
        fir = lastItemPB.six_1_S - d.six_1_S
      }
      if (that.data.zd == "renqiu3000" || that.data.zd == "renqiu5000") {
        fir = lastItemPB.six_1_S_B - d.six_1_S_B
      }
      if (fir > sevenmax && sevenmax > 0) {
        d.six_1_Ss = 'color:blue ;';
        //d.seven_S = '<view style="color:red ;"> ' + d.seven_S + ' </view>';
      } else if (fir < sevenmin && sevenmin < 0) {
        d.six_1_Ss = 'color:red ;';
        // d.seven_S = '<view style="color:blue ;"> ' + d.seven_S + ' </view>';
      }

      fir = lastItemPB.ysb - d.ysb;
      if (fir > ysbmax && ysbmax > 0) {
        d.ysbc = 'color:blue ;';
        //d.ysb = '<view style="color:red ;"> ' + d.ysb + ' </view>';
      } else if (fir < ysbmin && ysbmin < 0) {
        d.ysbc = 'color:red ;';
        //d.ysb = '<view style="color:blue ;"> ' + d.ysb + ' </view>';
      }

    }
    // 回调函数
    that.setData({
      oldlist: list
    })
  },
  /**
   * 两江站
   */
  liangjiang: function (data, list) {
    var that = this;
    var lastItemPB = data.lastItemPB;
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (d.dateTime != null && d.dateTime.length >= 19) {
        d.dateTime = d.dateTime.substring(10, 19);
      }
      var fir = lastItemPB.one / d.one;
      //报警
      if (fir > 1.05) {
        d.one = 'color:blue ;';
        //d.one_S = '<view style="color:blue ;"> ' + d.one_S + ' </view>';
      } else if (fir < 0.95) {
        d.one = 'color:red ;';
        //d.one_S = '<view style="color:red ;"> ' + d.one_S + ' </view>';
      }
      fir = lastItemPB.eight / d.eight;
      if ((fir > 1.03)) {
        d.two = 'color:blue ;';
        //d.eight = '<view style="color:red ;"> ' + d.eight + ' </view>';
      } else if ((fir < 0.97)) {
        d.two = 'color:red ;';
        //d.eight = '<view style="color:blue ;"> ' + d.eight + ' </view>';
      }


      fir = lastItemPB.six / d.six;
      if (fir > 1.05) {
        d.four = 'color:blue ;';
        //d.six_S = '<view style="color:red ;"> ' + d.six_S + ' </view>';
      } else if (fir < 0.95) {
        d.four = 'color:red ;';
        //d.six_S = '<view style="color:blue ;"> ' + d.six_S + ' </view>';
      }
      fir = lastItemPB.seven / d.seven;
      if (fir > 1.05) {
        d.five = 'color:blue ;';
        //d.seven_S = '<view style="color:red ;"> ' + d.seven_S + ' </view>';
      } else if (fir < 0.95) {
        d.five = 'color:red ;';
        // d.seven_S = '<view style="color:blue ;"> ' + d.seven_S + ' </view>';
      }

      fir = lastItemPB.ysb / d.ysb;
      if (fir > 1.03) {
        d.three = 'color:blue ;';
        //d.ysb = '<view style="color:red ;"> ' + d.ysb + ' </view>';
      } else if (fir < 0.97) {
        d.three = 'color:red ;';
        //d.ysb = '<view style="color:blue ;"> ' + d.ysb + ' </view>';
      }

    }
    // 回调函数
    that.setData({
      oldlist: list
    })
  },
  /**
   * 璧山站
   */
  bishan: function (data, list) {
    var that = this;
    var lastItemPB = data.lastItemPB;
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (d.dateTime != null && d.dateTime.length >= 19) {
        d.dateTime = d.dateTime.substring(10, 19);
      }
      var fir = lastItemPB.one / d.one;
      //报警
      if (fir > 1.05) {
        d.one = 'color: blue;';
        // d.one_S = '<view style="color:blue ;"> ' + d.one_S + ' </view>';
      } else if (fir < 0.95) {
        d.one = 'color: red;';
        //d.one_S = '<view style="color:red ;"> ' + d.one_S + ' </view>';
      }
      fir = lastItemPB.eight / d.eight;
      if ((fir > 1.03)) {
        d.two = 'color:blue ;';
        //d.eight = '<view style="color:blue ;"> ' + d.eight + ' </view>';
      } else if ((fir < 0.97)) {
        d.two = 'color:red ;';
        //d.eight = '<view style="color:red ;"> ' + d.eight + ' </view>';
      }
      fir = lastItemPB.six / d.six;
      if (fir > 1.05) {
        d.four = 'color:blue ;';
        //d.six_S = '<view style="color:blue ;"> ' + d.six_S + ' </view>';
      } else if (fir < 0.95) {
        d.four = 'color:red ;';
        // d.six_S = '<view style="color:red ;"> ' + d.six_S + ' </view>';
      }
      fir = lastItemPB.seven / d.seven;
      if (fir > 1.05) {
        d.five = 'color:blue ;';
        //d.seven_S = '<view style="color:blue ;"> ' + d.seven_S + ' </view>';
      } else if (fir < 0.95) {
        d.five = 'color:red ;';
        //d.seven_S = '<view style="color:red ;"> ' + d.seven_S + ' </view>';
      }

      fir = lastItemPB.ysb / d.ysb;
      if (fir > 1.03) {
        d.three = 'color:blue ;';
        //d.ysb = '<view style="color:blue;"> ' + d.ysb + ' </view>';
      } else if (fir < 0.97) {
        d.three = 'color:red ;';
        //d.ysb = '<view style="color:red ;"> ' + d.ysb + ' </view>';
      }

    }
    // 回调函数
    that.setData({
      oldlist: list
    })
  },
  /**
   * 双石站
   */
  shuangshi: function (data, list) {
    var that = this;
    var lastItemPB = data.lastItemPB;
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (d.dateTime != null && d.dateTime.length >= 19) {
        d.dateTime = d.dateTime.substring(10, 19);
      }
      var fir = lastItemPB.one / d.one;
      //报警
      if (fir > 1.05) {
        d.one = 'color:blue ;';
        //d.one_S = '<view style="color:blue ;"> ' + d.one_S + ' </view>';
      } else if (fir < 0.95) {
        d.one = 'color:red ;';
        //d.one_S = '<view style="color:red ;"> ' + d.one_S + ' </view>';
      }
      fir = lastItemPB.eight / d.eight;
      if ((fir > 1.03)) {
        d.two = 'color:blue;';
        //d.eight = '<view style="color:red ;"> ' + d.eight + ' </view>';
      } else if ((fir < 0.97)) {
        d.two = 'color: red;';
        //d.eight = '<view style="color:blue ;"> ' + d.eight + ' </view>';
      }

      fir = lastItemPB.six / d.six;
      if (fir > 1.05) {
        d.four = 'color:blue ;';
        //d.six_S = '<view style="color:red ;"> ' + d.six_S + ' </view>';
      } else if (fir < 0.95) {
        d.four = 'color:red ;';
        //d.six_S = '<view style="color:blue ;"> ' + d.six_S + ' </view>';
      }
      fir = lastItemPB.seven / d.seven;
      if (fir > 1.05) {
        d.five = 'color:blue;';
        //d.seven_S = '<view style="color:red ;"> ' + d.seven_S + ' </view>';
      } else if (fir < 0.95) {
        d.five = 'color:red  ;';
        //d.seven_S = '<view style="color:blue ;"> ' + d.seven_S + ' </view>';
      }
      fir = lastItemPB.ysb / d.ysb;
      if (fir > 1.03) {
        d.three = 'color:blue;';
        //d.ysb = '<view style="color:red ;"> ' + d.ysb + ' </view>';
      } else if (fir < 0.97) {
        d.three = 'color: red ;';
        //d.ysb = '<view style="color:blue ;"> ' + d.ysb + ' </view>';
      }

    }
    // 回调函数
    that.setData({
      oldlist: list
    })
  },
  /**
   * 朱沱站
   */
  zhutuo: function (data, list) {
    var that = this;
    var lastItemPB = data.lastItemPB;
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (d.dateTime != null && d.dateTime.length >= 19) {
        d.dateTime = d.dateTime.substring(10, 19);
      }
      var fir = d.one - lastItemPB.one
      //报警
      if (fir >= 50) {
        d.one = 'color:red ;';
        // d.one_S = '<view style="color:red ;"> ' + d.one_S + ' </view>';
      } else if (fir <= -50) {
        d.one = 'color:blue ;';
        //d.one_S = '<view style="color:blue ;"> ' + d.one_S + ' </view>';
      }
      fir = (d.eight - lastItemPB.eight) / lastItemPB.eight;
      if ((fir >= 0.05) || (fir <= -0.05)) {
        d.two = 'color:red ;';
        //d.three = 'color:red ;';
        //d.eight = '<view style="color:red ;"> ' + d.eight + ' </view>';
      }
      // if (d.state == 0) {
      //   lastItemPB = d;
      // } else {
      //   var fir = (d.eight - lastItemPB.eight) / lastItemPB.eight;
      //   if ((fir >= 0.05) || (fir <= -0.05)) {
      //     d.three = 'color:red ;';
      //     //d.eight = '<view style="color:red ;"> ' + d.ysb + ' </view>';
      //   }
      // }
      fir = d.six - lastItemPB.six
      if ((fir >= 10)) {
        d.four = 'color:red ;';
        //d.six_S = '<view style="color:red ;"> ' + d.six_S + ' </view>';
      } else if ((fir <= -10)) {
        d.four = 'color:blue ;';
        //d.six_S = '<view style="color:blue ;"> ' + d.six_S + ' </view>';
      }

      fir = d.seven - lastItemPB.seven;
      if ((fir >= 10)) {
        d.five = 'color:red ;';
        //d.seven_S = '<view style="color:red ;"> ' + d.seven_S + ' </view>';
      } else if ((fir <= -10)) {
        d.five = 'color:blue ;';
        //d.seven_S = '<view style="color:blue ;"> ' + d.seven_S + ' </view>';
      }

      fir = lastItemPB.ysb - d.ysb;
      if ((fir >= 0.2)) {
        d.three = 'color:red ;';
        //d.seven_S = '<view style="color:red ;"> ' + d.seven_S + ' </view>';
      } else if ((fir <= 0.2)) {
        d.three = 'color:blue ;';
        //d.seven_S = '<view style="color:blue ;"> ' + d.seven_S + ' </view>';
      }


    }
    // 回调函数
    that.setData({
      oldlist: list
    })
  },
  /**
   * 广州站
   */
  guangzhou: function (data, list) {
    var that = this;
    var lastItemPB = data.lastItemPB;
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (d.dateTime != null && d.dateTime.length >= 19) {
        d.dateTime = d.dateTime.substring(10, 19);
      }
      var fir = d.one - lastItemPB.one
      //报警
      if (fir >= 50) {
        d.one = 'color:red ;';
        // d.one_S = '<view style="color:red ;"> ' + d.one_S + ' </view>';
      } else if (fir <= -50) {
        d.one = 'color:blue ;';
        //d.one_S = '<view style="color:blue ;"> ' + d.one_S + ' </view>';
      }
      fir = (d.eight - lastItemPB.eight) / lastItemPB.eight;
      if ((fir >= 0.05) || (fir <= -0.05)) {
        d.two = 'color:red ;';
        //d.three = 'color:red ;';
        //d.eight = '<view style="color:red ;"> ' + d.eight + ' </view>';
      }
      fir = d.six - lastItemPB.six
      if ((fir >= 10)) {
        d.four = 'color:red ;';
        //d.six_S = '<view style="color:red ;"> ' + d.six_S + ' </view>';
      } else if ((fir <= -10)) {
        d.four = 'color:blue ;';
        //d.six_S = '<view style="color:blue ;"> ' + d.six_S + ' </view>';
      }

      fir = d.seven - lastItemPB.seven;
      if ((fir >= 50)) {
        d.five = 'color:red ;';
        //d.seven_S = '<view style="color:red ;"> ' + d.seven_S + ' </view>';
      } else if ((fir <= -50)) {
        d.five = 'color:blue ;';
        //d.seven_S = '<view style="color:blue ;"> ' + d.seven_S + ' </view>';
      }

      fir = lastItemPB.ysb - d.ysb;
      if ((fir >= 0.2)) {
        d.three = 'color:red ;';
        //d.seven_S = '<view style="color:red ;"> ' + d.seven_S + ' </view>';
      } else if ((fir <= 0.2)) {
        d.three = 'color:blue ;';
        //d.seven_S = '<view style="color:blue ;"> ' + d.seven_S + ' </view>';
      }


    }
    // 回调函数
    that.setData({
      oldlist: list
    })
  },

  /**
   * 丰都站
   */
  fengdu: function (data, list) {
    var that = this;
    var lastItemPB = data.lastItemPB;
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (d.dateTime != null && d.dateTime.length >= 19) {
        d.dateTime = d.dateTime.substring(10, 19);
      }
      var lv = data.lastItemPB.one_S.split('(')[1].split(')')[0];
      var nv = d.one_S.split('(')[1].split(')')[0];
      var fir = nv - lv;
      //报警
      if (fir > 2) {
        d.one = 'color:red ;';
        // d.one_S = '<view style="color:red ;"> ' + d.one_S + ' </view>';
      } else if (fir < -2) {
        d.one = 'color:blue ;';
        //d.one_S = '<view style="color:blue ;"> ' + d.one_S + ' </view>';
      }
      lv = data.lastItemPB.eight.toFixed(2);
      nv = d.eight.toFixed(2);
      fir = nv - lv;
      if (fir > 2) {
        d.two = 'color:red ;';
        //d.three = 'color:red ;';
        //d.eight = '<view style="color:red ;"> ' + d.eight + ' </view>';
      } else if (fir < -2) {
        d.two = 'color:blue ;';
        //d.one_S = '<view style="color:blue ;"> ' + d.one_S + ' </view>';
      }
      lv = data.lastItemPB.six_S.split('(')[1].split(')')[0];
      nv = d.six_S.split('(')[1].split(')')[0];
      fir = nv - lv;
      if (fir > 2) {
        d.four = 'color:red ;';
        //d.six_S = '<view style="color:red ;"> ' + d.six_S + ' </view>';
      } else if (fir < -2) {
        d.four = 'color:blue ;';
        //d.six_S = '<view style="color:blue ;"> ' + d.six_S + ' </view>';
      }

      fir = data.lastItemPB.seven / d.seven;
      if ((fir > 1.05)) {
        d.five = 'color:red ;';
        //d.seven_S = '<view style="color:red ;"> ' + d.seven_S + ' </view>';
      } else if (fir < 0.95) {
        d.five = 'color:blue ;';
        //d.seven_S = '<view style="color:blue ;"> ' + d.seven_S + ' </view>';
      }

      lv = data.lastItemPB.ysb.toFixed(2);
      nv = d.ysb.toFixed(2);
      fir = nv - lv;
      if (fir > 0.2) {
        d.three = 'color:red ;';
        //d.seven_S = '<view style="color:red ;"> ' + d.seven_S + ' </view>';
      } else if (fir < -0.2) {
        d.three = 'color:blue ;';
        //d.seven_S = '<view style="color:blue ;"> ' + d.seven_S + ' </view>';
      }


    }
    // 回调函数
    that.setData({
      oldlist: list
    })
  },
  /**
   * 获取生产数据
   */
  getprodectdata: function () {
    var that = this;
    var zdname = wx.getStorageSync("station");
    // var zd = app.getServerUrl(zdname);
    var zd = "renqiu3000";
    // var zd = "110";
    var productUrl = app.globalData.socktHost + zd + '/product';
    const accountInfo = wx.getAccountInfoSync();
    if (accountInfo.miniProgram.appId === 'wx2242bdf7b68a52dd') {
      productUrl = app.globalData.czsocktHost + zd + '/product';
    }
    console.log(productUrl);
    app.WebSocketFn(productUrl, function (data) {
      if (data == '{}' || data == '[]') {
        return;
      }
      var data = JSON.parse(data);
      console.log(data);
      var produceType = "--";
      var guliaoTemp = "";
      var chuliaoTemp = "";
      var zsTemp = "";
      var totalNum = "0";

      // 生产类型
      if (data.productName) {
        that.setData({
          produceType: data.productName
        });

      }

      //骨料温度
      if (data.guliaoTemp == undefined) {
        guliaoTemp = "--";
      } else {
        guliaoTemp = data.guliaoTemp + '℃';
      }

      // 出料温度
      if (data.outTemp == undefined) {
        chuliaoTemp = "--";
      } else {
        chuliaoTemp = data.outTemp + '℃';

      }

      // 尾气温度

      if (data.weiqiTemp == undefined) {
        zsTemp = "--";
      } else {
        zsTemp = data.weiqiTemp + '℃';
      }
      // 总产量
      if (data.productTotal) {
        that.setData({
          totalNum: data.curTotal
        });
        console.log(data.curTotal + "生产总量");
        totalNum = data.productTotal + '吨';
      }
      that.setData({
        guliaoTemp: guliaoTemp,
        chuliaoTemp: chuliaoTemp,
        zsTemp: zsTemp,
        //totalNum: totalNum
      });
      console.log(data.productList);
      // 生产看板
      if (data.productList && data.lastItemPB) {
        if (accountInfo.miniProgram.appId === 'wx2242bdf7b68a52dd') {
          that.cangzhou(data, data.productList);
        } else {
          var zd = app.getServerUrl(zdname);
          if (zdname == "两江站") {
            that.liangjiang(data, data.productList);
          } else if (zdname == "璧山站") {
            that.bishan(data, data.productList);
          } else if (zdname == "双石站") {
            that.shuangshi(data, data.productList);
          } else if (zdname == "广州站") {
            that.guangzhou(data, data.productList);
          } else if (zdname == "丰都站") {
            that.fengdu(data, data.productList);
          } else if (zdname == "朱沱站") {
            that.zhutuo(data, data.productList);
          }
        }

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
  onUnload: function () { //如果页面被卸载时被执行
    // console.log("连接已关闭...");
    this.gotoHomePage();
  },
  // 在订单详情 点击小程序的返回 自定其他跳页方法
  gotoHomePage: function () { //自定义页面跳转方法
    /**
     * 监听连接关闭事件
     */
    wx.closeSocket();
    wx.switchTab({
      url: "/pages/index/index",
      success: function (e) {
        let page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
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


})