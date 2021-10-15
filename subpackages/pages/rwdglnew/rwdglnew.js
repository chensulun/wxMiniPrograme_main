// pages/rwdglnew/rwdglnew.js
const app = getApp();
var util = require("../../../utils/util.js");
import req from '../../../utils/request';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        currentIndex: 1,
        oldlist: [],
        reslist: [],
        totalCount: 0,
        pageSize: 10,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        that.setData({
            oldlist: [],
        });
        that.getdata(1);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("上拉");
        var that = this;
        var currentIndex = that.data.currentIndex;
        var totalCount = that.data.totalCount;
        var pagesize = that.data.pageSize;
        console.log(currentIndex * pagesize + "-----" + totalCount);
        if ((currentIndex - 1) * pagesize >= totalCount) {} else {
            that.getdata(currentIndex);
        }
        // wx.pageScrollTo({
        //   scrollTop: 0,
        // })
    },
    clickAll: function (e) {
        let idx = e.currentTarget.dataset.idx;
        let item = this.data.oldlist[idx];
        item.active = item.active === true ? false : true;

        this.setData({
            oldlist: this.data.oldlist,
        });
    },
    getdata: function (currentIndex) {
        var that = this;
        // 显示加载图标
        wx.showLoading({
            title: "玩命加载中",
        });
        var url = app.globalData.url;
        if (currentIndex == 1) {
            that.setData({
                oldlist: [],
            });
        }
        // 页数+1
        var pagesize = that.data.pageSize;
        var userinfoJson = JSON.parse(wx.getStorageSync("userInfo"));
        console.log(userinfoJson);
        var time = new Date();
        time.setDate(time.getDate() - 3);
        time = new Date(time);
        var bgtime = util.formatDate(time);
        var token = wx.getStorageSync("token");
        var msId = wx.getStorageSync("station_id");
        req({
            url: app.globalData.globalUrl + '/manage/task/list?msId=' + msId,
            method: 'GET',
            header: {
                'Authorization': "Bearer " + token
            },
        }).then(res => {
            // console.log(res);
            that.setData({
                oldlist: res.data.rows,
            });
            console.log(that.data.oldlist);
            wx.hideLoading();
        }).catch(err => {
            console.log(err);
        })
        //util.formatDate(new Date())
        // wx.request({
        //     url: url + "taskwechat/getTaskWechatList",
        //     data: { currentIndex: currentIndex, pageSize: pagesize, role_id: userinfoJson.role, create_user: userinfoJson.userid, bg_time: bgtime, zhandian_id: wx.getStorageSync("station_id"),project_name:"" },
        //     // method: "POST",
        //     // // 请求头部
        //     // header: {
        //     //   'content-type': 'application/json',
        //     // },
        //     success: function(res) {
        //         console.log(res);
        //         console.log(111);
        //         if (res.data.code == 0) {
        //             // 回调函数
        //             const oldData = that.data.oldlist;

        //             that.setData({
        //                 oldlist: oldData.concat(res.data.list),
        //                 totalCount: res.data.totalCount,
        //                 currentIndex: currentIndex + 1,
        //             });
        //             for (const item of that.data.oldlist) {
        //                 item.active = true;
        //             }
        //             that.setData({
        //                 oldlist: that.data.oldlist,
        //                 totalCount: res.data.totalCount,
        //                 currentIndex: currentIndex + 1,
        //             });
        //             console.log("olddata", that.data.oldlist);
        //             // 隐藏加载框
        //             wx.hideLoading();
        //         } else {}
        //     },
        // });
    },
    // actioncnt: function (e) {
    //     var id = e.currentTarget.dataset.taskid;
    //     var url = app.globalData.url;
    //     wx.request({
    //         url: url + "/plan/getPlanFlowUser",
    //         data: {
    //             zd_id: wx.getStorageSync("station_id"),
    //             task_id: id
    //         },
    //         // method: "POST",
    //         // // 请求头部
    //         // header: {
    //         //   'content-type': 'application/json',
    //         // },
    //         success: function (res) {
    //             var list = [];
    //             console.log(res.data.data);
    //             var lc = "";
    //             for (var i = 0; i < res.data.data.length; ++i) {
    //                 var nf = '';
    //                 nf = res.data.data[i].userName;
    //                 var nfs = '';
    //                 var nfst = 0;
    //                 if (res.data.data[i].flow_status == "YES") {
    //                     nfst = 0;
    //                 } else {
    //                     nfst = 1;
    //                 }
    //                 nf = res.data.data[i].userName;
    //                 var tfiid = res.data.data[i].task_flow_Index_ID;
    //                 for (var j = i + 1; j < res.data.data.length; ++j) {
    //                     var ttfiid = res.data.data[j].task_flow_Index_ID;
    //                     if (tfiid == ttfiid) {
    //                         nf += "、" + res.data.data[j].userName;
    //                         if (res.data.data[j].flow_status == "YES") {
    //                             nfst = 0;
    //                         } else {
    //                             nfst = 1;
    //                         }
    //                         i = j;
    //                     }
    //                 }
    //                 if (nfst == 0) {
    //                     nfs = "已审核";
    //                 } else {
    //                     nfs = "未审核";
    //                 }
    //                 console.log(nf + nfs);
    //                 lc += nf + "(" + nfs + ")";
    //                 if (i + 1 < res.data.data.length) {
    //                     lc += "->";
    //                 }
    //             }
    //             list.push(lc);
    //             console.log(list);
    //             wx.showActionSheet({
    //                 itemList: list,
    //                 success: function (res) {
    //                     console.log(res.tapIndex)
    //                 },
    //                 fail: function (res) {
    //                     console.log(res.errMsg)
    //                 }
    //             })
    //         }
    //     })
    // },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
});