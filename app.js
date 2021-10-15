//app.js
var website;
const accountInfo = wx.getAccountInfoSync();
// accountInfo.miniProgram.appId='wx82d48f7deb6565f1';
if (accountInfo.miniProgram.appId == 'wx2242bdf7b68a52dd') { //沧州
  website = 'test.zgdrkj.cn';
}
App({
  onLaunch: function () {
    // 判断appid
    const accountInfo = wx.getAccountInfoSync()
    if (accountInfo.miniProgram.appId === 'wx2242bdf7b68a52dd') {
      wx.setNavigationBarTitle({
        title: '数智系统'
      })
    }

    wx.authorize({
      scope: "scope.userInfo"
    });
    this.judgeUser()
    var thatapp = this;
    wx.request({ //获取站点
      url: this.globalData.url + 'zhandian/getZhandian?pageSize=999&pageIndex=1',
      dataType: 'json',
      success: function (zd) {
        for (var i = 0; i < zd.data.list.length; i++) {
          thatapp.globalData.zhandian.push(zd.data.list[i].zdname)
        }
      },
      fail: function (dbsx_res) {
        wx.showToast({
          title: '服务故障，稍后重试',
          icon: 'none',
          duration: 5000
        })
      },
    })

    wx.request({ //获取科目
      // url: this.globalData.url + 'shebei/getKemu',
      url: this.globalData.url + 'shebei/getleibieList',
      dataType: 'json',
      data: {
        siteName: ""
      },
      success: function (kemu) {
        for (var i = 0; i < kemu.data.length; i++) {
          thatapp.globalData.kemu.push(kemu.data[i].kemu)
        }
      },
      fail: function (dbsx_res) {
        wx.showToast({
          title: '服务故障，稍后重试',
          icon: 'none',
          duration: 5000
        })
      },
    })

    wx.request({ //获取用户名单
      url: this.globalData.url + 'user/getUserName',
      dataType: 'json',
      success: function (yonghu) {
        for (var i = 0; i < yonghu.data.length; i++) {
          thatapp.globalData.yonghu.push(yonghu.data[i].username)
        }
      },
      fail: function (dbsx_res) {
        wx.showToast({
          title: '服务故障，稍后重试',
          icon: 'none',
          duration: 5000
        })
      },
    })

    wx.request({ //获取位置
      url: this.globalData.url + 'shebei/getAllWeizhi',
      dataType: 'json',
      success: function (weizhi) {
        for (var i = 0; i < weizhi.data.length; i++) {
          thatapp.globalData.weizhi.push(weizhi.data[i].weizhi)
        }
        console.log(weizhi.data)
      },
      fail: function (dbsx_res) {
        wx.showToast({
          title: '服务故障，稍后重试',
          icon: 'none',
          duration: 5000
        })
      },
    })

  },

  globalData: {
    wjPath: "D:\\web\\前端\\upload", //文件上传路径
    //  url:'http://127.0.0.1:8081/',
    url: 'https://' + website + ':9443/CjManager/',
    globalUrl:'https://test.zgdrkj.cn:8686/prod-api',
    // globalUrl:'http://192.168.1.104/dev-api',
    // globalUrl:'http://172.20.10.12/dev-api',
    // globalUrl:'http://154.8.200.158:7400/dev-api',
    socktHost: 'wss://' + website + '/',
    czsocktHost: 'wss://' + website + ':8443/',
    gzserverUrl: 'https://' + website + '/',
    serverUrl: accountInfo.miniProgram.appId === 'wx605b2b76ff42b6b5' ? 'https://' + website + '/' : 'https://' + website + ':8443/',

    //图片显示地址（pc前端地址）
    img_url: 'https://' + website + ':8089/',
    userInfo: {
      username: ""
    }, //用户信息
    address: null, //定位地址
    dbsxResult: null, //待办事项查询结果
    listByjd: null, //保养巡检进度列表
    zhandian: [], //站点列表
    zhandian1: [], //站点列表
    kemu: [], //科目列表
    weizhi: [], //位置列表
    yonghu: [], //用户列表
    token: '',
    carInfo:{},//原料报检车信息
    wxUserInfo:{}//微信用户信息
  },
  appPost: function (action, param, callback) {
    param.userId = JSON.parse(wx.getStorageSync('userInfo')).userid;
    param.zdId = wx.getStorageSync('station_id');
    wx.showLoading({
      title: 'loding...',
      mask: true
    })
    wx.request({
      url: this.globalData.url + action,
      data: param,
      method: 'POST',
      complete: function () {
        wx.hideLoading();
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: "网络异常",
          showCancel: false,
          success(res) {

          }
        })
      },
      success: function (res) {
        if (res.data.code == 0) {
          callback(res.data);
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            // content: 111,
            showCancel: false,
            success(res) {

            }
          })
        }

      }

    })
  },
  // 判断用户信息是否失效
  judgeUser: function () {
    let that = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        let data = JSON.parse(res.data)
        if (res) {
          wx.request({
            url: that.globalData.url + '/user/getIsLogin?username=' + data.username,
            dataType: 'json',
            method: 'POST',
            success: function (res) {
              if (!res.data) {
                wx.removeStorage({
                  key: 'userInfo',
                  success(res) {
                    wx.switchTab({
                      url: '/pages/gr/gr'
                    })
                  }
                })
              }
            }
          })
        }
      },
      fail: function () {
        wx.removeStorage({
          key: 'userInfo',
          success(res) {
            wx.switchTab({
              url: '/pages/gr/gr'
            })
          }
        })
      }
    })
  },
  formPost: function (action, param, callback, option) {
    param.userId = JSON.parse(wx.getStorageSync('userInfo')).userid;
    param.zdId = wx.getStorageSync('station_id');
    if (!option || option.loading) {
      wx.showLoading({
        title: 'loding...',
        mask: true
      })
    }

    wx.request({
      url: this.globalData.url + action,
      data: param,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      complete: function () {
        wx.hideLoading();
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: "网络异常",
          showCancel: false,
          success(res) {

          }
        })
      },
      success: function (res) {
        if (res.data.code == 0) {
          callback(res.data);
        } else {
          wx.showModal({
            title: '提一个示',
            // content: res.data.msg,
            content: 123,
            showCancel: false,
            success(res) {

            }
          })
        }

      }

    })
  },
  appGet: function (action, callback) {
    action += '&zdId=' + wx.getStorageSync('station_id');
    wx.showLoading({
      title: 'loding...',
      mask: true
    })
    wx.request({
      url: this.globalData.url + action,
      method: 'GET',
      complete: function () {
        wx.hideLoading();
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: "网络异常",
          showCancel: false,
          success(res) {

          }
        })
      },
      success: function (res) {
        if (res.data.code == 0) {
          callback(res.data);
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {

            }
          })
        }

      }

    })
  },
  confirm(msg, callback) {
    wx.showModal({
      title: '提示',
      content: msg,
      success(res) {
        if (res.confirm && callback) {
          callback();
        }
      }
    })
  },
  alert(msg, callback) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success(res) {
        if (res.confirm && callback) {
          callback();
        }
      }
    })
  },
  success(title) {
    console.info(title);
    wx.showToast({
      title: title,
      icon: 'succes',
      duration: 2000,
      mask: true
    })
  },
  showMessage: function (res, callback) {
    if (res.data.state == 'success') {
      wx.showToast({
        title: res.data.message,
        icon: 'succes',
        duration: 2000,
        mask: true
      })
    } else {
      wx.showModal({
        title: '提示',
        content: res.data.message,
        success(res) {
          if (res.confirm && callback) {
            callback();
          }
        }
      })
    }
  },
  getServerUrl(zd) {
    var serverUrl = "";
    switch (zd) {
      case "两江站":
        serverUrl = 'liangjiang';
        break;
      case "石柱站":
        serverUrl = 'shizhu';
        break;
      case "璧山站":
        serverUrl = 'jbz';
        break;
      case "双石站":
        serverUrl = 'shuangshi';
        break;
      case "朱沱站":
        serverUrl = 'zhutuo'
        break;
      case "丰都站":
        serverUrl = 'fengdu'
        break;
      case "广州站":
        serverUrl = 'guangzhou'
        break;
      case "宏裕站":
        serverUrl = 'hongyu'
        break;
      case "源峰林站":
        serverUrl = 'yuanfenglin'
        break;
      case "沥青一厂":
        serverUrl = 'lqonechang'
        break;
      case "沥青三厂":
        serverUrl = 'lqthreechang'
        break;
      case "鑫丰站":
        serverUrl = 'xinfeng'
        break;
      case "任丘站(3000型)":
        serverUrl = 'renqiu3000'
        break;
      case "任丘站(5000型)":
        serverUrl = 'renqiu5000'
        break;
      case "新基地":
        serverUrl = 'xjz'
        break;
      case "中山站":
        serverUrl = 'zs'
        break;
      case "江津站":
        serverUrl = 'jiangjin'
        break;
    }
    return serverUrl;
  },
  WebSocketFn: function (url, callback) {
    wx.connectSocket({
      url: url
    })
    wx.onSocketOpen(function (res) {
      console.log("连接已打开...");
    })
    /**
     * 监听发送事件
     */
    wx.onSocketMessage(function (evt) {
      console.log('WebSocket监听发送事件')
      var received_msg = evt.data;
      callback(received_msg);

    })
    // wx.onSocketError(function (res) {
    //   console.log('WebSocket连接打开失败')
    //   this.reconnect()
    // })
    /**
     * 监听连接关闭事件
     */
    wx.onSocketClose(function (res) {

      console.log("连接已关闭...");

    })


  },
  reconnect() {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    clearTimeout(this.timer)
    if (this.data.limit < 12) {
      this.timer = setTimeout(() => {
        this.linkSocket();
        this.lockReconnect = false;
      }, 5000);
      this.setData({
        limit: this.data.limit + 1
      })
    }
  }

})