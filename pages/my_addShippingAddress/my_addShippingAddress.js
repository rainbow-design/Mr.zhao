// pages/my_addShippingAddress/my_addShippingAddress.js
const Storage = require("../../utils/storage.js");
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectAddress: 0,
    name: '',
    phone: '',
    address: '',
    detail_addr: '',
    longitude: '', // 经度
    latitude: '', // 纬度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var y = this;
    wx.yue.sub("addAddress", function (data) {
      Storage.setItem("addAddress", data);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var y = this;
    var addressData = Storage.getItem("addAddress");
    addressData != "" ? y.setData({
      address: addressData.address,
      longitude: addressData.location.lng,
      latitude: addressData.location.lat
    }) : ''
    // Storage.removeItem("addAddress")
  },
  selectAddressType(e) {
    var data = e.currentTarget.dataset;
    this.setData({
      selectAddress: Number(data.num)
    })

  },
  changeInput(e) {
    var name = e.currentTarget.dataset.name;
    var thisData = this.data;
    this.setData({
      [name]: e.detail.value,

    })
  },
  selectYourAddress() {
    var y = this;
    var from = true;
    wx.navigateTo({
      url: `../selectAddress/selectAddress?addAddress=${from}`
    })
  },
  saveNewAddress() {
    var y = this,
      yData = y.data;
    var paramObj = {
      name: yData.name,
      phone: yData.phone,
      longitude: yData.longitude,
      latitude: yData.latitude,
      address: yData.address,
      detail_addr: yData.detail_addr,
      type: yData.selectAddress,
      access_token: app.globalData.access_token
    }
    util.promiseRequest(api.edit_addr, paramObj).then(res => {
      var data = res.response_data.lists;
      if (data == 1) {
        wx.showToast({
          title: '添加地址成功...',
          icon: 'none',
          duration: 1000,
          complete: function () {
            setTimeout(() => {
              app.returnLastPage();
            }, 1000)
          }
        })
      } else {
        wx.showToast({
          title: '添加失败...',
          icon: 'none',
          duration: 1000,
          complete: function () {
            setTimeout(() => {
              app.returnLastPage();
            }, 1000)
          }
        })
      }
    })
  }
})