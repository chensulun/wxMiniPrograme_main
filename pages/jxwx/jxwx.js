// pages/sbwx/sbwx.js
const app = getApp();
var util = require('../../utils/util.js');
const recorderManager = wx.getRecorderManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxxg: false,//是否能修改设置项
    wx_bsls: true,//是否显示临时维修
    wxsmCount: 0,
    wxqkCount: 0,
    ycCount: 0,
    lsjv: false,//是否显示历史记录
    address: "",
    allImgSize: 0,//允许图片数
    allVoiceSize: 0,//允许声音数
    allVedioSize: 0,//允许视频数
    equipmentId: null,
    subject: "",
    subjectIndex: 0,
    site: "",
    siteIndex: 0,
    position: "",
    positionIndex: 0,
    explainRepair: "",
    laiyItems: [
      { name: '巡检' },
      { name: '工单', checked: true },
      { name: '现场' }
    ],
    checkboxItems_leibie: [
      { name: '整体更换', checked: true },
      { name: '更换组件' },
      { name: '维修' }
    ],
    checkboxItems_wxzt: [
      { name: '已完成', checked: true },
      { name: '未完成' },
    ],
    wx_wwc: false,
    personRepair_next: ["张三", "李四", "王二"],
    personRepair_nextIndex: 0,
    files: [],
    onrecord: false,
    record_files: [],
    lytip: "点击说话",
    recordingTimeqwe: 0,//录音计时
    sp_files: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.weizhi)

    this.setData({//设置设备选项列表
      site: app.globalData.zhandian,
      subject: app.globalData.kemu,
      position: app.globalData.weizhi,
      personRepair_next: app.globalData.yonghu
    });

    var sbwxInfo=null;
    if (options.informationRepairJson!= null) {//判断是否为临时维修
        sbwxInfo = JSON.parse(options.informationRepairJson);
    } else {
      return
    }

    var subjectIndexTemp = 0;//确定页面维修科目选项
    for (var i = 0; i < this.data.subject.length; i++) {
      if (this.data.subject[i] == sbwxInfo.subjectRepair) {
        subjectIndexTemp = i;
        break;
      }
    };

    var siteTemp = 0;//确定页面维修站点site选项
    for (var i = 0; i < this.data.site.length; i++) {
      if (this.data.site[i] == sbwxInfo.site) {
        siteTemp = i;
        break;
      }
    };

    var positionTemp = 0;//确定页面维修位置positionRepair选项
    for (var i = 0; i < this.data.position.length; i++) {
      if (this.data.position[i] == sbwxInfo.positionRepair) {
        positionTemp = i;
        break;
      }
    };

    var wxlbtem = this.data.checkboxItems_leibie;//确定页面维修类别选项
    for (var i = 0; i < wxlbtem.length; i++) {
      if (wxlbtem[i].name == sbwxInfo.categoryRepair) {
        wxlbtem[i].checked = true;
      } else {
        wxlbtem[i].checked = false
      }
    }

    this.setData({
      wxxg: true,//工单维修设置为不能修改
      equipmentId: sbwxInfo.equipmentId,//设置维修id
      subjectIndex: subjectIndexTemp,//设置科目
      siteIndex: siteTemp,
      positionIndex: positionTemp,
      explainRepair: sbwxInfo.explainRepair,//设置维修说明
      checkboxItems_leibie: wxlbtem,//设置维修类别
      allImgSize: sbwxInfo.numberofimg,//允许图片数
      allVoiceSize: sbwxInfo.numberofvideo,//允许声音数
      allVedioSize: sbwxInfo.numberofvoice,
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
    wx.request({
      url: app.globalData.url + "repair/wxtj",
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res.data);
      }
    })

    this.setData({
      address: app.globalData.address
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

  },
  bindsubjectChange: function (e) {
    console.log('维修科目 发生选择改变，携带值为', e.detail.value);

    var that = this;
    this.setData({
      subjectIndex: e.detail.value
    })
    var tmpWZ = [];
    wx.request({//通过科目获取位置
      url: app.globalData.url + 'shebei/getWeizhi',
      data: {
        kemu: this.data.subject[e.detail.value]
      },
      dataType: 'json',
      success: function (weizhi) {
        for (var i = 0; i < weizhi.data.length; i++) {
          tmpWZ.push(weizhi.data[i].weizhi)
        }

        that.setData({
          position: tmpWZ
        })
      },
      fail: function (dbsx_res) {
        wx.showToast({
          title: '服务故障，稍后重试',
          icon: 'none',
          duration: 5000
        })
        return
      },
    })
  },
  bindSiteChange: function (e) {
    this.setData({
      siteIndex: e.detail.value
    })
  },
  bindPositionChange: function (e) {
    this.setData({
      positionIndex: e.detail.value
    })
  },
  laiyCheckboxChange: function (e) {
    console.log('来源 发生change事件，携带value值为：', e.detail.value);
  },
  wxlbCheckboxChange: function (e) {
    console.log('维修类别 发生change事件，携带value值为：', e.detail.value);
  },
  ztCheckboxChange: function (e) {
    console.log('状态 发生change事件，携带value值为：', e.detail.value);
    if (e.detail.value == "未完成") {
      this.setData({
        wx_wwc: true
      })
    } else {
      this.setData({
        wx_wwc: false
      })
    }
  },
  next_personRepairChoose: function (e) {
    console.log('维修人员 发生选择改变，携带值为', e.detail.value);
    this.setData({
      personRepair_nextIndex: e.detail.value
    })

  },
  cancelImg: function (e) {//删除图片
    for (var i = 0; i < this.data.files.length; i++) {
      if (this.data.files[i] == e.target.dataset.imgurl) {
        this.data.files.splice(i, 1);
        break;
      }
    }
    this.setData({
      files: this.data.files
    });
  },
  cancelYuyin: function (e) {//删除语音
    for (var i = 0; i < this.data.record_files.length; i++) {
      if (this.data.record_files[i] == e.target.dataset.yuyinurl) {
        this.data.record_files.splice(i, 1);
        break;
      }
    }
    this.setData({
      record_files: this.data.record_files
    });
  },
  cancelshiping: function (e) {//删除视频
    for (var i = 0; i < this.data.sp_files.length; i++) {
      if (this.data.sp_files[i] == e.target.dataset.shipurl) {
        this.data.sp_files.splice(i, 1);
        break;
      }
    }
    this.setData({
      sp_files: this.data.sp_files
    });
  },
  chooseImage: function (e) {//选择图片
    var that = this;
    if (that.data.files.length == 10) {
      wx.showToast({
        title: "最多上传" + 10 + "张图片",
        icon: "none",
        duration: 2000
      });
      return;
    }
    wx.chooseImage({
      count: 1,//最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });

        console.log(that.data.files)

      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //选择视频
  chooseVideo: function () {
    var that = this
    if (that.data.sp_files.length == 10) {
      wx.showToast({
        title: "最多上传" + 10 + "个视频",
        icon: "none",
        duration: 2000
      });
      return;
    }
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      camera: 'back',
      maxDuration: 30,
      success: function (res) {
        var sp_pathTemp = [];
        sp_pathTemp[0] = res.tempFilePath
        that.setData({
          sp_files: that.data.sp_files.concat(sp_pathTemp)
        });
      }
    })
  },
  startRecorder: function (e) {//开启录音
    var that = this;

    if (that.data.record_files.length == 10) {
      wx.showToast({
        title: "最多上传" + 10 + "个录音",
        icon: "none",
        duration: 2000
      });
      return;
    }

    if (that.data.onrecord) {
      that.shutRecording();
      return;
    }
    recorderManager.start({
      duration: 30000,
      format: 'mp3'
    })
    recorderManager.onStart(() => {
      console.log('。。。开始录音。。。');
      that.setData({
        onrecord: true,
        lytip: "停止录音"
      })
    });
    //将计时器赋值给setInter
    that.data.recordingTimeqwe = 0;
    this.data.setInter = setInterval(
      function () {
        var time = that.data.recordingTimeqwe + 1;
        that.setData({
          recordingTimeqwe: time
        })
      }
      , 1000);

  },
  shutRecording: function () {//停止录音
    var that = this;

    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('。。停止录音。。', res.tempFilePath);
      clearInterval(that.data.setInter);

      var recorderpathTemp = [];
      recorderpathTemp[0] = res.tempFilePath;
      that.setData({
        record_files: that.data.record_files.concat(recorderpathTemp),
        onrecord: false,
        lytip: "点击说话",
        recordingTimeqwe: 0
      })
    });
  },
  formSubmit: function (e) {
    var that = this;
    if (that.data.files.length < this.data.allImgSize) {
      wx.showToast({
        title: "需要最少上传" + this.data.allImgSize + "张图片",
        icon: "none",
        duration: 2000
      });
      return;
    }

    if (that.data.sp_files.length < this.data.allVedioSize) {
      wx.showToast({
        title: "需要最少上传" + this.data.allVedioSize + "个视频",
        icon: "none",
        duration: 2000
      });
      return;
    }

    if (that.data.record_files.length < this.data.allVoiceSize) {
      wx.showToast({
        title: "需要最少上传" + this.data.allVoiceSize + "个录音",
        icon: "none",
        duration: 2000
      });
      return;
    }


    var userInfo = JSON.parse(wx.getStorageSync('userInfo'));

    var infoRepair = e.detail.value;//提交 需要转换和可能会修改到的参数设置
    infoRepair.personRepair = wx.getStorageSync('realname')//维修人
    infoRepair.subjectRepair = that.data.subject[infoRepair.subjectRepair];//维修科目
    infoRepair.site = that.data.site[infoRepair.site];//站点
    infoRepair.positionRepair = that.data.position[infoRepair.positionRepair];//维修位置

    if (infoRepair.stateRepair == "未完成") {//工单未完成情况
      infoRepair.personRepair = that.data.personRepair_next[infoRepair.nextrepair];//未完成事务，重新指定维修人
    } else if (infoRepair.stateRepair == "已完成") {
      infoRepair.dateFinish = util.formatDate(new Date());
    }
    else {
      if (app.globalData.address.indexOf("九龙坡") >= 0) {
        console.log('在')
      }
    }

    var upfiles = (that.data.files.concat(that.data.sp_files)).concat(that.data.record_files);
    wx.request({
      url: app.globalData.url + 'repair/submitRepair',
      data: { userid: userInfo.userid, token: userInfo.token, informationRepairJson: JSON.stringify(infoRepair) },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res)
        var successUp = 0; //成功
        var failUp = 0; //失败
        var count = 0; //第几张
        var length = upfiles.length; //总数
        if (res.data.cod == "002" && upfiles.length > 0) {
          that.uploadOneByOne(upfiles, successUp, failUp, count, length, res.data.data.equipmentId);
        } else if (res.data.cod == "002" && upfiles.length == 0) {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000,
            complete: function () {
              that.jixuwx();
            }
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
            duration: 2000,
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 5
            })
          }, 2000)
        }

      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '上传失败',
          duration: 2000,
        })
      },
    })


  },// 采用递归的方式上传多张
  uploadOneByOne: function (upfiles, successUp, failUp, count, length, equipmentId) {
    var that = this;
    wx.showLoading({
      icon: 'none',
      title: '正在上传第' + count + '个',
    })
    wx.uploadFile({
      url: app.globalData.url + "CommonManager/uploadFile",
      filePath: upfiles[count],
      name: "file",//示例，使用顺序给文件命名,
      formData: { wj_path: app.globalData.wjPath, equipmentId: equipmentId, wxorby: "wx" },
      success: function (e) {
        console.log("wenjiancd" + length)
        successUp++;//成功+1
      },
      fail: function (e) {
        failUp++;//失败+1
      },
      complete: function (e) {
        count++;//下一张
        if (count == length) {
          //上传完毕，作一下提示
          console.log('上传成功' + successUp + ',' + '失败' + failUp);
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000,
            complete: function () {
              that.jixuwx()
            }
          });
        } else {
          //递归调用，上传下一张
          that.uploadOneByOne(upfiles, successUp, failUp, count, length, equipmentId);
        }
      }
    })
  },
  inputWxsm: function (e) {
    var len = e.detail.value.length;
    this.setData({
      wxsmCount: len
    })
  },
  inputWxqk: function (e) {
    var len = e.detail.value.length;
    this.setData({
      wxqkCount: len
    })
  },
  inputWxyc: function (e) {
    var len = e.detail.value.length;
    this.setData({
      ycCount: len
    })
  },
  showlsjv: function () {

    if (this.data.lsjv) {
      this.setData({
        lsjv: false
      })
    } else {
      this.setData({
        lsjv: true
      })
    }
  },
  jixuwx: function () {//是否继续维修

    wx.request({//获取科目
      url: app.globalData.url + 'CommonManager/getcordBykemu',
      dataType: 'json',
      data: {
        kemu: this.data.subject[this.data.subjectIndex],
        flag: "wx",
        username: wx.getStorageSync('realname')
      },
      success: function (re) {
        console.log(re.data)
        if (re.data.data.length > 0) {//如果有设备可以继续维修
          wx.showModal({
            title: '提示',
            content: '是否继续维修该科目的其他位置?',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/pages/sbwx/sbwx" + "?equipmentId=" + re.data.data[0].equipmentId
                })
              } else if (res.cancel) {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 5
                  })
                }, 2000)
              }
            }
          })
        } else {
          setTimeout(function () {
            wx.navigateBack({
              delta: 5
            })
          }, 2000)
        }
      },
      fail: function (dbsx_res) {
        setTimeout(function () {
          wx.navigateBack({
            delta: 5
          })
        }, 2000)
      },
    })
  }
})
