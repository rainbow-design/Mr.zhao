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
        var addAddress_cache = wx.Storage.getItem("addAddress_cache");
        addressData != "" ? y.setData({
            address: addressData.address,
            longitude: addressData.location.lng,
            latitude: addressData.location.lat
        }) : ''

        addAddress_cache != "" ? y.setData({
            selectAddress: addAddress_cache.selectAddress || 0,
            name: addAddress_cache.name || '',
            phone: addAddress_cache.phone || '',
            detail_addr: addAddress_cache.detail_addr || '',
        }) : ''
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
        var y = this,
            yData = y.data,
            from = true;
        // 先缓存用户已填写的原始数据

        var addAddress_cache = {
            selectAddress: yData.selectAddress,
            name: yData.name,
            phone: yData.phone,
            detail_addr: yData.detail_addr,
        }
        wx.Storage.setItem("addAddress_cache", addAddress_cache);

        wx.navigateTo({
            url: `../selectAddress/selectAddress?addAddress=${from}`
        })
    },
    saveNewAddress() {

        var y = this,
            yData = y.data;
        var name = yData.name, phone = yData.phone;
        if (util.checkType(name, 'empty')) {
            util.toast('请输入收货人姓名');
            return;
        } else if (!util.checkType(phone, 'phone')) {
            util.toast('请输入正确的手机号');
            return;
        } else if (util.checkType(name, 'empty')) {
            util.toast('请输入详细楼号门牌');
            return;
        }

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
        util.promiseRequest(api.edit_addr, paramObj).then((res) => {
            var data = res.data.response_data.lists;

            if (data === 1) {
                y.setData({
                    address: ''
                })
                // 更新全局的收货地址条数
                app.getMy_shippingAddressLength();
                wx.showToast({
                    title: '添加地址成功...',
                    icon: 'none',
                    duration: 1000,
                    complete: function () {
                        setTimeout(() => {
                            // 清空数据缓存
                            wx.Storage.removeItem("addAddress");
                            wx.Storage.removeItem("addAddress_cache");
                            wx.navigateTo({
                                url: `../my_shippingAddress/my_shippingAddress`
                            })
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
                            // 清空数据缓存
                            wx.Storage.removeItem("addAddress");
                            wx.Storage.removeItem("addAddress_cache");
                            wx.navigateTo({
                                url: `../index_search/index_search`
                            })
                        }, 1000)
                    }
                })
            }
        })
    },
    /**
    * 生命周期函数--监听页面卸载
    */
    onUnload: function () {
        // 取消多余的事件订阅
        // - 添加时
        wx.yue.remove("addAddress");
        // 清除缓存的用户输入的数据
        wx.Storage.removeItem("addAddress_cache");
        // 清除缓存的位置数据
        wx.Storage.removeItem("addAddress");
        
    },
})