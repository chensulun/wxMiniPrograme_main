// pages/rwdcxnew/rwdcxnew.js
import req from '../../../utils/request';
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qd_start_time: 0,
        index1: 0,
        qd_end_time: 0,
        taskstatusindex: 0,
        zzshztindex: 0,
        taskstatusselect: [{
            id: '',
            name: "不限启用"
        }, {
            id: 1,
            name: "正供"
        }, {
            id: 2,
            name: "待供"
        }, {
            id: 3,
            name: "供毕"
        }],
        zzshztselect: [{
            id: '',
            name: "不限审核"
        }, {
            id: 1,
            name: "未审核"
        }, {
            id: 2,
            name: "审核中"
        }, {
            id: 4,
            name: "退回"
        }, {
            id: 3,
            name: "已审核"
        }],
        timeModalShow: false,
        bdate: '',
        edate: '',
        currentIndex: 1,
        oldlist: [],
        totalCount: 0,
        pageSize: 10,
        task_status: "",
        zzshzt: "",
        qd_start_time: '',
        qd_end_time: ''
    },
    clickAll(e) {
        let idx = e.currentTarget.dataset.idx;
        let item = this.data.oldlist[idx];
        item.active = item.active === true ? false : true;

        this.setData({
            oldlist: this.data.oldlist,
        });
    },
    taskstatuspickerChange(e) {
        console.log(e, "**********8");
        var that = this;
        that.setData({
            taskstatusindex: e.detail.value,
            task_status: that.data.taskstatusselect[e.detail.value].id
        })
        that.getsearch(1);
    },
    zzshztpickerChange(e) {
        //console.log(e.target.dataset.id);
        var that = this;
        that.setData({
            zzshztindex: e.detail.value,
            zzshzt: that.data.zzshztselect[e.detail.value].id
        })
        that.getsearch(1);
    },
    openTimeModal() {
        this.setData({
            timeModalShow: true
        })
    },
    DateStartChange(e) {
        this.setData({
            bdate: e.detail.value,
            qd_start_time: e.detail.value
        })
    },
    DateEndChange(e) {
        this.setData({
            edate: e.detail.value,
            qd_end_time: e.detail.value
        })
    },
    cancel() {
        this.setData({
            timeModalShow: false
        })
    },
    comfirm() {
        var that = this;
        that.setData({
            timeModalShow: false
        })
        that.getsearch(1);
    },
    getsearch(currentIndex) {
        var that = this;
        var pagesize = that.data.pageSize;
        var userinfoJson = JSON.parse(wx.getStorageSync("userInfo"));
        // todo 更新列表数据
        var data = {
            currentIndex: that.data.currentIndex,
            pageSize: pagesize,
            role_id: userinfoJson.role,
            create_user: userinfoJson.userid,
            bg_time: that.data.qd_start_time,
            ed_time: that.data.qd_end_time,
            zhandian_id: wx.getStorageSync('station_id')
        };
        console.log(data);
        that.getdata(currentIndex, data);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var pagesize = that.data.pageSize;
        var userinfoJson = JSON.parse(wx.getStorageSync("userInfo"));
        that.setData({
            oldlist: []
        });
        var data = {
            currentIndex: that.data.currentIndex,
            pageSize: pagesize,
            role_id: userinfoJson.role,
            create_user: userinfoJson.userid,
            bg_time: that.data.qd_start_time,
            ed_time: that.data.qd_end_time,
            zhandian_id: wx.getStorageSync('station_id')
        };
        that.getdata(1, data);
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
    change1: function (e) {
        console.log(e.detail.value);
        var that = this;
        var pagesize = that.data.pageSize;
        var userinfoJson = JSON.parse(wx.getStorageSync("userInfo"));
        var data = {
            currentIndex: 1,
            pageSize: pagesize,
            role_id: userinfoJson.role,
            create_user: userinfoJson.userid,
            bg_time: that.data.qd_start_time,
            ed_time: that.data.qd_end_time,
            zhandian_id: wx.getStorageSync('station_id'),
            project_name: e.detail.value
        };
        that.getdata(1, data);
    },
    getdata: function (currentIndex, data) {
        console.log(data);
        var that = this;
        // data = JSON.stringify(data);
        // 显示加载图标
        wx.showLoading({
            title: '玩命加载中',
        })
        var url = app.globalData.url;
        var token = wx.getStorageSync("token");
        var msId = wx.getStorageSync("station_id");
        data.project_name=data.project_name.trim();
        if (data.project_name&&data.project_name.length!=0) {
            req({
                url: app.globalData.globalUrl + '/manage/task/list?projectName=' + data.project_name,
                method: 'GET',
                header: {
                    'Authorization': "Bearer " + token
                },
            }).then(res => {
                console.log(res);
                that.setData({
                    oldlist: res.data.rows
                })
                wx.hideLoading();
            }).catch(err => {
                console.log(err);
            })
        }else{
            let arr=[]
            that.setData({
                oldlist:arr
            })
            wx.hideLoading();
        }
        // 页数+1
        // var pagesize = that.data.pageSize;
        // wx.request({
        //     url: url + 'taskwechat/getTaskWechatList',
        //     data: data,

        //     method: "POST",
        //     // 请求头部
        //     // header: {
        //     //   'content-type': 'application/json',
        //     // },
        //     //
        //     header: {
        //         'content-type': 'application/x-www-form-urlencoded'
        //     },
        //     success: function(res) {
        //         if (currentIndex == 1) {
        //             that.setData({
        //                 oldlist: []
        //             })
        //         }
        //         // console.log(res.data.data.dispatchList);
        //         if (res.data.code == 0) {
        //             // 回调函数
        //             const oldData = that.data.oldlist;
        //             that.setData({
        //                     oldlist: oldData.concat(res.data.list),
        //                     totalCount: res.data.totalCount,
        //                     currentIndex: currentIndex + 1
        //                 })
        //                 // 隐藏加载框
        //             wx.hideLoading();
        //         } else {

        //         }

        //     }
        // })
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
        console.log("上拉");
        var that = this;
        var currentIndex = that.data.currentIndex;
        var totalCount = that.data.totalCount;
        var pagesize = that.data.pageSize;
        var userinfoJson = JSON.parse(wx.getStorageSync("userInfo"));
        console.log(currentIndex * pagesize + "-----" + totalCount);
        if ((currentIndex - 1) * pagesize >= totalCount) {

        } else {
            var data = {
                currentIndex: currentIndex,
                pageSize: pagesize,
                role_id: userinfoJson.role,
                create_user: userinfoJson.userid,
                bg_time: that.data.qd_start_time,
                ed_time: that.data.qd_end_time,
                zhandian_id: wx.getStorageSync('station_id')
            };
            that.getdata(currentIndex, data);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})