// pages/selectAddress/selectAddress.js
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const Storage = require("../../utils/storage.js");
// 实例化API核心类
var mapKey = 'GRBBZ-C6A35-IJLI7-QKHAT-NXZ7S-IQBG6'
const qqmapsdk = new QQMapWX({
  key: mapKey // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initAddress: '',
    loading: false,
    addressData: [],
    keyword: '',
    showSearchData: false,
    showMyShoppingAddress: true,
    formAddAddress: false,
    formEditAddress: false,
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.addAddress === "true") {
      console.log("获取地址传回去")
      this.setData({
        formAddAddress: true,
        showMyShoppingAddress: false
      })
    }
    if (options.editAddress === "true") {
      console.log("获取地址传回去")
      this.setData({
        formEditAddress: true,
        showMyShoppingAddress: false
      })
    }

    if (options.address) {
      // 有默认地址直接设置
      this.setData({
        initAddress: options.address
      })
    } else {
      this.reGetLocation();
    }

    this.getMy_shippingAddress();
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
  getMy_shippingAddress() {
    var y = this;
    util.promiseRequest(api.addr_list, {
      access_token: app.globalData.access_token
    })
      .then(res => {
        var data = res.data.response_data.lists;
        console.log(data);
        y.setData({
          addressData: data
        })
      })
  },
  searchInp(e) {
    var val = e.detail.value;
    console.log(val);
    this.setData({
      keyword: val,
      showSearchData: true
    })
    var lat = Storage.getItem("lat"),
      lng = Storage.getItem("lng");
    let isChinese = util.checkType(val, "hasChinese");
    if (isChinese) {
      this.searchArea(lat, lng, val);
    }
  },
  reGetLocation() {
    var y = this;
    this.setData({
      initAddress: '',
      loading: true
    })
    util.getLocation((lat, lng) => {
      console.log(lat + ',' + lng)
      // 更新经纬度
      Storage.setItem("lat", lat)
      Storage.setItem("lng", lng)
      // 位置信息
      util.getCityInfo(lat, lng, mapKey, function (cityInfo) {
        console.log(cityInfo);
        setTimeout(() => {
          y.setData({
            loading: false,
            reAddress: cityInfo.address,
            reShortAddress: cityInfo.address_component.street_number
          })
        }, 1000)
      })
    })
  },

  searchArea: function (lat, lng, keyWord) {
    var _this = this;
    var location = lat + "," + lng;
    qqmapsdk.search({
      keyword: keyWord, //搜索关键词
      location: location,
      success: function (res) { //搜索成功后的回调
        if (res.data && res.data.length) {
          _this.setData({
            result: res.data
          })
          console.log(res.data);
        } else {
          util.toast("未查询到位置...")
        }

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  selectGlobalAddress(e) {
    var data = e.currentTarget.dataset;
    wx.Storage.setItem("globalAddress", data.info);
    app.returnLastPage();
  },
  toJump(e) {
    var data = e.currentTarget.dataset;
    var yData = this.data;
    if (yData.formAddAddress) {
      wx.yue.pub("addAddress", data.info);
      wx.navigateTo({
        url: `../my_addShippingAddress/my_addShippingAddress`
      })
    } else if (yData.formEditAddress) {
      wx.yue.pub("editAddress_selectAddress", data.info);
      wx.navigateTo({
        url: `../my_editShippingAddress/my_editShippingAddress`
      })
    }

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

  }
})