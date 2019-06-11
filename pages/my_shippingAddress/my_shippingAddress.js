// pages/my_shippingAddress/my_shippingAddress.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../api/index.js");
const regeneratorRuntime = require("../../utils/runtime.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    addressData: false,
    addressList_H: "", // 地址栏高度
    btn_T: "" // 新增按钮距离顶部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (this.data.loading) {
      util.openLoading();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getMy_shippingAddress();
  },
  toEdit(e) {
    var data = e.currentTarget.dataset;
    var action = "edit";
    wx.navigateTo({
      url: `../my_editShippingAddress/my_editShippingAddress?action=${action}`
    });
    wx.yue.pub("editAddress", data);
  },
  getMy_shippingAddress() {
    var y = this;
    util
      .promiseRequest(api.addr_list, {
        access_token: app.globalData.access_token
      })
      .then(res => {
        var data = res.data.response_data.lists;
        y.setData(
          {
            addressData: data
          },
          function() {
            if (data.length > 0) {
              var addressList_H, btn_T;
              setTimeout(() => {
                util.getEle("#addressList", function(res) {
                  addressList_H = res[0].height;
                  y.setData({
                    addressList_H: addressList_H
                  });
                });
                util.getEle("#addBtn", function(res) {
                  btn_T = res[0].top;
                  y.setData({
                    btn_T: btn_T
                  });
                });
              }, 0);
            }

            util.closeLoading();
          }
        );
      });
  },
  toAddShippingAddress() {
    wx.navigateTo({
      url: `../my_addShippingAddress/my_addShippingAddress`
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this;
    async function clearData() {
      await that.setData({
        addressData: []
      });
    }
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    //下拉刷新
    async function refresh() {
      await clearData();
      await that.onShow();
      // complete
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }
    refresh();
  }
});
