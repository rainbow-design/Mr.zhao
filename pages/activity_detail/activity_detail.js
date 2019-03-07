const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const WxParse = require('../../component/wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        content:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        wx.setNavigationBarTitle({
            title: '活动详情'
        })
        wx.yue.sub("renderData", function(data){
            that.setData({
                content: WxParse.wxParse('content', 'html', data, that),
            })
        })
    },

    onUnload: function () {
        // 取消多余的事件订阅
        wx.yue.remove("renderData");
    }
   

})