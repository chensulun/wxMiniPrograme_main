// subpackages/pages/jysc/jysc.js
import req from '../../../utils/request';
var app = getApp();
Page({
  data: {
    carInfo: '',
    state:1, //按钮状态
    state2: 'A', //按钮状态
    inputValue: '0', //输入框的值
    tempFilePaths: [], //img标签的src属性显示图片
    drData: [], //图片路径
    formData: ['吨', '比例'], //下拉列表
    index:1, //下拉下标
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var carInfo = getApp().globalData.carInfo;
    this.data.carInfo = carInfo;
    this.setData({
      carInfo: this.data.carInfo
    })
    console.log(this.data.carInfo);
  },
  toBack: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  select_jg: function (e) {
    let that = this;
    that.setData({
      state: e.currentTarget.dataset.id,
    });
    console.log(that.data.state);
  },
  select_zl: function (e) {
    let that = this;
    that.setData({
      state2: e.currentTarget.dataset.id,
    });
    console.log(that.data.state2);
  },
  inputValue: function (e) {
    let that = this;
    that.data.inputValue = e.detail.value;
    that.setData({
      inputValue: that.data.inputValue
    })
    console.log(that.data.inputValue);
  },
  //选择图片
  ChooseImg: function () {
    var that = this;
    var globalUrl = app.globalData.globalUrl;
    wx.chooseImage({
      count: 9, // 默认最多9张图片，可自行更改
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths;
        console.log(res);
        tempFilePath.forEach(e => {
          console.log(e);
          that.data.tempFilePaths.push(e)
        })
        that.setData({
          tempFilePaths: that.data.tempFilePaths
        })
        console.log(that.data.tempFilePaths);
        //上传图片
        var token = wx.getStorageSync("token");
        var msId = wx.getStorageSync("station_id");
        for (var i = 0; i < tempFilePath.length; i++) {
          wx.uploadFile({
            url: globalUrl + '/common/upload',
            filePath: tempFilePath[i],
            name: "file",
            header: {
              "content-type": "multipart/form-data",
              'Authorization': "Bearer " + token
            },
            success: function (res) {
              console.log(res);
              var code = JSON.parse(res.data).code;
              var data = {}
              data.fileName = JSON.parse(res.data).fileName;
              data.url = JSON.parse(res.data).url;
              console.log(data);
              console.log(code);
              if (code == 200) {
                that.data.drData.push(data)
                that.setData({
                  drData: that.data.drData
                })
                wx.showToast({
                  title: "上传成功",
                  icon: "success",
                  duration: 1500
                })
                // that.data.imgs.push(JSON.parse(res.data).data)
                // that.setData({
                //   imgs: that.data.imgs
                // })
              }
            },
            fail: function (err) {
              console.log(err);
              wx.showToast({
                title: "上传失败",
                icon: "error",
                duration: 2000
              })
            },
          })
        }
      },
      fail: function (err) {
        console.log(err);
        wx.showToast({
          title: "错误",
          icon: "error",
          duration: 2000
        })
      },
    })
  },
  //预览图片
  PreviewImg: function (e) {
    let index = e.target.dataset.index;
    let that = this;
    wx.previewImage({
      current: that.data.tempFilePaths[index],
      urls: that.data.tempFilePaths[index],
    })
  },
  //长按删除图片
  DeleteImg: function (e) {
    var that = this;
    var tempFilePaths = that.data.tempFilePaths;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          //console.log('点击确定了');
          tempFilePaths.splice(index, 1);
        } else if (res.cancel) {
          //console.log('点击取消了');
          return false;
        }
        that.setData({
          tempFilePaths
        });
      }
    })
  },

  //提交表单
  submit: function () {
    var that = this;
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    var data = that.data.carInfo;
    data.drStatus = that.data.state;
    data.drRemark = that.data.state2;
    if(that.data.index==0){
      data.drDeduction = that.data.inputValue;
    }else if(that.data.index==1){
      data.drDeductionProportion = that.data.inputValue;
    }
    data.drData = JSON.stringify(that.data.drData);
    console.log(data);
    req({
      url: app.globalData.globalUrl + '/manage/detectionRecord',
      method: 'PUT',
      header: {
        'Authorization': "Bearer " + token
      },
      data: JSON.stringify(data),
      dataType: 'json',
    }).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        wx.showToast({
          title: "操作成功",
          icon: "success",
          duration: 2000,
          success() {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        })
      } else {
        wx.showToast({
          title: "操作失败",
          icon: "error",
          duration: 2000
        })
      }
    }).catch(err => {
      console.log(err);
    })

  },
  pickerChange(e) {
    let index = e.detail.value
    this.setData({
      index: index
    })
  },

})