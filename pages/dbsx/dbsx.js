// pages/ggdb/ggdb.js

const app = getApp()

Page({

  /**
   * 页面的初始数据weui-bar__item_on
   */
  data: {
    nav_css1:'weui-bar__item_on',
    nav_css2:'',
    nav_dbsx:false,
    array: [],
    array2:[],
    bxtz:[],
    wxtz:[]

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that=this;
    if (options.dbsx=="true"){
      this.setData({
        nav_css1:'',
        nav_css2:'weui-bar__item_on',
        nav_dbsx:true
      })
    }else{
      this.setData({
        nav_css1: 'weui-bar__item_on',
        nav_css2: '',
        nav_dbsx: false
      })
    }
    this.loadData();
  },loadData:function(msg){
    var that=this;
    app.formPost('qianhe/getShList', {}, function (res) {
      //console.log(res);
      that.setData({
        array: res.list
      })
    });
    app.formPost('qianhe/getXjList', {}, function (res) {
      console.log(res);
      that.setData({
        array2: res.list
      })
    });
    this.setData({
      bytz: app.globalData.dbsxResult.bxtz,
      wxtz: app.globalData.dbsxResult.wxtz,
      })
  },
  toDetail:function(e){
    var data=e.currentTarget.dataset;
    var param="?shId="+data.shid+"&shlx="+data.shlx;
    var action="";
    switch(data.shlx){
      case "GuanliSh":
      case "ShengchanSh":
      case "ZhanzhangSh":
      case "jlscSh":
        action ="/pages/rwdmx/rwdmx";
        break;
      case "XiaomuSh":
      case "Jlsh":
      case "fczsh":
      case "czsh":
        action = "/pages/xmmx/xmmx"; 
        break;
      case "JipeiSh":
        action = "/pages/pbmx/pbmx";
        break; 
    }
    wx.navigateTo({
      url: action+param
    })
   
  },
  toTask: function (e) {
    var data = e.currentTarget.dataset;
    wx.scanCode({   
      scanType: 'qrCode',     //扫描API
      success: function (res) {
        console.log("输出----------------");
        console.log(res.result);    //输出回调信息
        if(res.result!=null){
          //res.result.indexOf("aqxj_id") != -1 &&
          var result=JSON.parse(res.result);
          if (result.type="xj"){
            var obj = { aqxj_id: data.shid, wz: result.wz, code: result.code }
            wx.request({
              url: app.globalData.url + 'wxaqxj/getLx',
              data: { aqxj_id: data.shid,wz: obj.wz, code: obj.code },
              success: function (res) {
                if (res.data.code == 0) {
                  // 回调函数
                  app.globalData.xjlaiyuan = 2;
                  let action = "/pages/aqxj1/aqxj1?data=" + JSON.stringify(obj);
                  wx.navigateTo({
                    url: action
                  })
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: res.data.msg,
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
  navchange:function(res){
    //console.info(res);
    if (res.target.dataset.nav=='nav1'){
      this.setData({
        nav_css1: 'weui-bar__item_on',
        nav_css2: '',
        nav_dbsx: false
      })
    }else{
      this.setData({
        nav_css1: '',
        nav_css2: 'weui-bar__item_on',
        nav_dbsx: true
      })
    }
    //console.info(this.data);
  }, syscode: function (e) {
    console.log(e.currentTarget.dataset)
    // wx.navigateTo({
    //   url: "/pages/" + e.currentTarget.dataset.wxby + "/" + e.currentTarget.dataset.wxby + "?equipmentId="+e.currentTarget.dataset.equipmentid
    // })
    wx.scanCode({// 只允许从相机扫码
      onlyFromCamera: true,
      success(sys_res) {
        wx.request({//获取科目编码
          url: app.globalData.url + 'shebei/getShebeiBh',
          data: {
            kemu: e.currentTarget.dataset.kemu
          },
          dataType: 'json',
          success: function (bianmare) {
            var codebh = JSON.parse(sys_res.result).key;
             console.log("二维码内容" + codebh)
            // console.log("科目查询编码" +JSON.stringify( bianmare.data));
            console.log("科目查询编码:1" +  e.currentTarget.dataset.kemu);
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
  gotoHomePage: function () {//自定义页面跳转方法
console.log("返回");
    wx.switchTab({
      url: "/pages/index/index",
      success: function (e) {
        let page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  }
})