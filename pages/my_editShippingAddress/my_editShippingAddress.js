// pages/my_addShippingAddress/my_addShippingAddress.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressType: '', // 无初始值，不影响结果
        nowdata: [],
        name: '',
        phone: '',
        address: '', // 收货地址
        detail_addr: '', // 详细
        show_addr: '',
        longitude: '', // 经度
        latitude: '' // 纬度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var y = this;
        wx.yue.sub("addAddress", function(data) {
            wx.Storage.setItem("addAddress", data);
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var y = this;
        wx.yue.sub("editAddress", function(data) {
            var info = data.item;
            y.setData({
                address: info.address,
                show_addr: info.show_addr,
                nowdata: info,
                addressType: Number(info.type),
                longitude: info.longitude, // 经度
                latitude: info.latitude // 纬度
            })
            var newAddressData = wx.Storage.getItem("editAddress_selectAddress");
            if (newAddressData != "") {
                y.setData({
                    address: newAddressData.address,
                    longitude: newAddressData.location.lng, // 经度
                    latitude: newAddressData.location.lat // 纬度
                })
            }
        })
        wx.yue.sub("editAddress_selectAddress", function(data) {
            wx.Storage.setItem("editAddress_selectAddress", data);
        })


        // console.log(this.data.nowdata)
    },
    changeInput(e) {
        var name = e.currentTarget.dataset.name;
        var thisData = this.data;
        this.setData({
            [name]: e.detail.value,

        })
    },
    // 选择地址类型
    selectAddressType(e) {
        var data = e.currentTarget.dataset;
        this.setData({
            addressType: Number(data.num)
        })

    },
    selectYourAddress() {
        var y = this;
        var from = true;
        wx.navigateTo({
            url: `../selectAddress/selectAddress?editAddress=${from}`
        })
    },

    saveAddressToSubmit() {
        var y = this,
            yData = y.data,
            nowdata = y.data.nowdata;

        var type = yData.addressType;

        var paramObj = {
            id: nowdata.id,
            name: yData.name || nowdata.name,
            phone: yData.phone || nowdata.phone,
            address: yData.address || nowdata.address,
            detail_addr: yData.detail_addr || nowdata.detail_addr,
            show_addr: yData.show_addr,
            longitude: yData.longitude,
            latitude: yData.latitude,
            access_token: app.globalData.access_token,
            type: type
        }
        util.promiseRequest(api.edit_addr, paramObj).then(res => {
            // 清除数据缓存
            wx.Storage.removeItem("editAddress_selectAddress")
            var data = res.data.response_data.lists;
            if (data == 1) {
                // 更新相同的 globalAddress 信息
                var globalAddress = wx.Storage.getItem("globalAddress");
                if (nowdata.id == globalAddress.id) {
                    y.updateGlobalAddress(globalAddress, paramObj);
                }
                wx.showToast({
                    title: '重置地址成功...',
                    icon: 'none',
                    duration: 1000,
                    complete: function() {
                        setTimeout(() => {
                            app.returnLastPage();
                        }, 1000)
                    }
                })
            } else {
                wx.showToast({
                    title: '重置信息失败...',
                    icon: 'none',
                    duration: 1000,
                    complete: function() {
                        setTimeout(() => {
                            app.returnLastPage();
                        }, 1000)
                    }
                })
            }
        })

    },
    deleteAddress() {
        var y = this,
            nowdata = y.data.nowdata;
        var id = nowdata.id;
        util.promiseRequest(api.remove_addr, {
            id: id,
            uid: app.globalData.access_token
        }).then((res) => {
            var data = res.data.response_data.lists;
            if (data == 1) {
                // 更新全局的收货地址条数
                app.getMy_shippingAddressLength();
                // 更新相同的 globalAddress 信息
                var globalAddress = wx.Storage.getItem("globalAddress");
                if (nowdata.id == globalAddress.id) {
                    wx.Storage.removeItem("globalAddress")
                }
                wx.showToast({
                    title: '删除地址成功...',
                    icon: 'none',
                    duration: 1000,
                    complete: function() {
                        setTimeout(() => {
                            app.returnLastPage();
                        }, 1000)
                    }
                })
            } else {
                wx.showToast({
                    title: '删除失败...',
                    icon: 'none',
                    duration: 1000,
                    complete: function() {
                        setTimeout(() => {
                            app.returnLastPage();
                        }, 1000)
                    }
                })
            }
        })
    },
    updateGlobalAddress(oldData, newData) {
        var typeObj = {
            '0': '住宅',
            '1': '公司',
            '2': '学校'
        }
        var paramObj = {
            id: oldData.id,
            name: newData.name,
            phone: newData.phone,
            address: newData.address,
            detail_addr: newData.detail_addr,
            longitude: newData.longitude,
            latitude: newData.latitude,
            type: newData.type,
            type_name: typeObj[newData.type]
        }
        wx.Storage.setItem("globalAddress", paramObj)
    },


    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        // 取消多余的事件订阅
        // - 编辑时
        wx.yue.remove("addAddress");
        wx.yue.remove("editAddress_selectAddress");
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})