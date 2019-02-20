// pages/my.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
const mock = require("../../mock/mock.js");
// https://juejin.im/post/5c14b253e51d452f8e603896
const regeneratorRuntime = require("../../utils/runtime.js");
// 实例化API核心类
var mapKey = '2WZBZ-WLTKR-YNCWP-WFPIR-PEKJE-P2BSS'
const qqmapsdk = new QQMapWX({
    key: mapKey // 必填
});
Page({
    data: {
        noCartData: false,
        cartList: [],
        totalPrice: 0,
        cost_temp: 0, // 价格 temp，没有 0 
        isCheckAll: false, // 初始化状态，刚开始就选中所有吗？
        hasCheck: false,
        startX: '', // 初始手指接触位置,
        delBtnWidth: 120,
        selectedOrderParam: [],
        globalAddress: {},
        addr_id: '',
        shoppingCartNum: 0, // 购物车商品数量
        isPlus: false, // 是否是会员
        allData: {},
        whiteBox_H: 182, // 地址栏内部白色方块高度
        shop_lat: '', // 商铺纬度
        shop_lng: '', // 商铺经度
        peiSongFanWei: 2000, // 配送范围 2000m
        addressCanUse: true,
        showRightIcon: false,
        initShowTishi: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        async function intPlusState() {
            await app.isPlus(function (state) {
                y.setData({
                    isPlus: state
                }, function () {
                    y.shopCartInit();
                })
            })
            // 获取购物车订单数
            app.getShoppingCartNum((length) => {
                if (length > 0) {
                    wx.setTabBarBadge({
                        index: 2,
                        text: String(length)
                    })
                } else {
                    wx.removeTabBarBadge({
                        index: 2
                    })
                }
            });

        }
        if (wx.Storage.getItem("token")) {
            intPlusState();
        }

        wx.Storage.getItem("token") == '' ? this.setData({
            noCartData: true
        }) : '';

        // 多个地址显示右箭头
        var myshippingAddressLength = wx.Storage.getItem('myshippingAddressLength');
        this.setData({
            myshippingAddressLength: myshippingAddressLength
        })
        if (myshippingAddressLength >= 1) {
            this.setData({
                showRightIcon: true
            })
        }
    },
    changeCart(id, num) {
        let params = {
            goods_id: id,
            type: 2,
            num: num
        }
        util.promiseRequest(api.cart_add, params).then((res) => { })
    },
    shopCartInit() {
        var y = this;
        // 拿到商铺位置信息再去渲染购物计算当前的address符合不符合规定
        var showCartList = function () {
            // 显示全局的地址信息
            var globalAddress = wx.Storage.getItem("globalAddress");
            if (globalAddress) {
                y.setData({
                    globalAddress: globalAddress,
                    addr_id: globalAddress.id
                })
                y.calculateDistance(qqmapsdk, globalAddress.latitude, globalAddress.longitude);
            } else {
                y.setData({
                    globalAddress: {}
                })
            }
        }
        // await 等待获取商铺位置信息
        async function getShopPosTionMsg() {
            await util.promiseRequest(api.merchant_addr, {}).then(res => {
                var data = res.data.response_data.lists[0];
                y.setData({
                    shop_lat: data.latitude, // 商铺纬度
                    shop_lng: data.longitude, // 商铺经度
                    peiSongFanWei: data.scope, // 配送范围 
                })
            })
        }


        async function initData() {
            y.showCartList();
            await getShopPosTionMsg();
            await showCartList();
        }
        // 开始执行
        initData();

    },
    toProductDetail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../sort_detail/sort_detail?id=${id}`
        })
    },
    toSelectAddress() {
        var address = wx.Storage.getItem('address');
        var myshippingAddressLength = wx.Storage.getItem('myshippingAddressLength');
        if (myshippingAddressLength >= 0) {
            this.setData({
                showRightIcon: true
            })
            // 有收货地址
            wx.navigateTo({
                url: `../selectAddress/selectAddress?address=${address}&length=${myshippingAddressLength}`
            })
        } else {
            // 去新增收货地址
            wx.navigateTo({
                url: `../my_addShippingAddress/my_addShippingAddress?globalAddress=true`
            })
        }

    },
    // 计算当前选择的地址与实际地址是否不足2公里
    calculateDistance(qqmapsdk, lat, lng) {
        var y = this,
            yData = y.data;
        var nowPosition = [{
            latitude: yData.shop_lat,
            longitude: yData.shop_lng
        }]
        util.calculateDistance(qqmapsdk, lat, lng, nowPosition, (res) => {
            console.log('地址距离计算');
            var distance = Number(res[0].distance);
            if (distance > Number(yData.peiSongFanWei)) {
                y.setData({
                    addressCanUse: false,
                    whiteBox_H: 234
                })
            } else {
                y.setData({
                    addressCanUse: true,
                    whiteBox_H: 182
                })
            }
        })
    },


    // 开始滑动事件
    touchS: function (e) {
        if (e.touches.length == 1) {
            this.setData({
                //设置触摸起始点水平方向位置 
                startX: e.touches[0].clientX
            });
            // console.log(e.touches[0].clientX)
        }
    },
    touchM: function (e) {
        console.log("touchM:" + e);
        var that = this
        if (e.touches.length == 1) {
            //记录触摸点位置的X坐标
            var moveX = e.touches[0].clientX;
            //计算手指起始点的X坐标与当前触摸点的X坐标的差值
            var disX = that.data.startX - moveX;
            //delBtnWidth 为右侧按钮区域的宽度
            var delBtnWidth = that.data.delBtnWidth;
            var txtStyle = "";
            if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
                txtStyle = "left:0px";
            } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
                txtStyle = "left:-" + disX + "px";
                if (disX >= delBtnWidth) {
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "left:-" + delBtnWidth + "rpx";
                }
            }
            var index = e.currentTarget.dataset.index;
            var list = that.data.cartList;
            list[index].txtStyle = txtStyle;
            this.setData({
                cartList: list
            });
        }
    },
    touchE: function (e) {
        // console.log("touchE" + e);
        var that = this
        if (e.changedTouches.length == 1) {
            //手指移动结束后触摸点位置的X坐标
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离
            var disX = that.data.startX - endX;
            var delBtnWidth = that.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0px";
            var index = e.currentTarget.dataset.index;
            var list = that.data.cartList;
            list[index].txtStyle = txtStyle;
            that.setData({
                cartList: list
            });
        }
    },
    delItem(e) {
        var id = e.currentTarget.dataset.id;
        var y = this;
        util.promiseRequest(api.delete_cart, {
            product_id: id
        }).then(res => {
            var data = res.data.response_data;
            console.log(data);
            if (data) {
                // 页面购物列表重置
                y.shopCartInit();
                // 获取购物车订单数
                app.getShoppingCartNum((length) => {
                    if (length > 0) {
                        wx.setTabBarBadge({
                            index: 2,
                            text: String(length)
                        })
                    } else {
                        wx.removeTabBarBadge({
                            index: 2
                        })
                    }
                });

            }
        })
    },

    showCartList() {
        var y = this;

        util.promiseRequest(api.cart_list, {
            access_token: app.globalData.access_token
        })
            .then(res => {
                var data = res.data.response_data.lists;
                var shoppingCartNum = res.data.response_data.count;
                if (data === "" || data.length === 0) {
                    y.setData({
                        noCartData: true,
                        allData: res.data.response_data
                    })
                } else {
                    util.addKey(data, {
                        "y_isCheck": false
                    }, function (v) {
                        v.dazhe = Number(v.plus);
                    })
                    //  更新数量的 Badge
                    wx.setTabBarBadge({
                        index: 2,
                        text: String(shoppingCartNum)
                    })
                    // TODO:是否是plus会员
                    // var isPlus = data[0].is_plus === '0' ? false : true;
                    y.setData({
                        // isPlus: isPlus,
                        cartList: data,
                        noCartData: false,
                        allData: res.data.response_data,
                        shoppingCartNum: shoppingCartNum
                    })
                    if (y.data.isCheckAll) {
                        this.checkAll(undefined, true);
                    } else {
                        y.getTotalPrice(data);

                    }
                }
            })
    },
    getTotalPrice(data) {
        var data = data || this.data.cartList;
        var temp = 0,
            cost = 0;
        let isPlus = this.data.isPlus;
        console.log('是否是plus会员:' + this.data.isPlus);
        if (!isPlus) {
            // 非会员
            data.forEach(item => {
                item.y_isCheck ? temp += item.price * item.num : '';
            });
            // 减免配送费计算
            var devery_info = this.data.allData.devery_info[0];
            // 满额
            var limit = Number(devery_info.limit);
            var jian = Number(devery_info.cost);
            cost = util.toFixed(Number(temp), 2);

            this.setData({
                totalPrice: cost,
                cost_temp: temp
            })
        } else {
            // plus 会员 价格
            data.forEach(item => {
                let dazhe = Number(item.plus) / 10;
                item.y_isCheck ? cost += Number(item.price) * dazhe * item.num : '';
            });

            cost = util.toFixed(Number(cost), 2);

            this.setData({
                totalPrice: cost,
                cost_temp: Number(cost)
            })
        }


    },
    checkGoods(e) {
        var data = e.currentTarget.dataset;
        var cartList = this.data.cartList;
        var index = data.index;
        this.setData({
            [`cartList[${index}].y_isCheck`]: !cartList[`${index}`].y_isCheck
        })
        var checkedLength = function (data) {
            var length = 0;
            data.forEach(v => {
                v.y_isCheck === true ? length += 1 : '';
            })
            return length;
        }


        var nowSelectedNum = checkedLength(this.data.cartList);
        console.log("当前选中个数:" + nowSelectedNum)
        console.log("nowSelectedNum" + nowSelectedNum)
        if (nowSelectedNum > 0) {
            this.setData({
                hasCheck: true
            })
        } else if (nowSelectedNum === 0) {
            this.setData({
                hasCheck: false
            })
        }
        if (nowSelectedNum === cartList.length) {
            this.setData({
                isCheckAll: true
            })
        } else {
            this.setData({
                isCheckAll: false
            })
        }
        // 计算总价
        this.getTotalPrice();
    },
    checkAll(e, bool) {
        var y = this;
        var isCheckAll = bool || !y.data.isCheckAll;
        this.setData({
            isCheckAll: isCheckAll,
            hasCheck: isCheckAll ? true : false
        })
        var cartList = this.data.cartList;
        var cartList_temp = util.filterObjToArr(cartList);
        cartList_temp.forEach(v => {
            v.y_isCheck = isCheckAll
        })

        y.setData({
            cartList: cartList_temp
        })
        // 计算总价
        this.getTotalPrice();


    },
    getOrderParam() {
        var result = [];
        var cartList = this.data.cartList;
        cartList.forEach(v => {
            v.y_isCheck ? result.push({
                "goods_id": v.goods_id,
                "num": v.num
            }) : '';
        })
        this.setData({
            selectedOrderParam: result
        })
        console.log("cartlits", cartList)
    },
    // 加
    numAdd(e) {
        let data = e.currentTarget.dataset,
            cartList = this.data.cartList;
        let index = data.index;
        let num = data.num;

        this.setData({
            [`cartList[${index}].num`]: cartList[`${index}`].num + 1,
            [`selectedOrderParam[${index}].num`]: cartList[`${index}`].num + 1
        })
        // 计算总价
        this.getTotalPrice();
        this.changeCart(e.currentTarget.dataset.id, Number(num) + 1);
    },
    // 减
    minusNum(e) {
        let data = e.currentTarget.dataset,
            cartList = this.data.cartList;
        let index = data.index,
            num = data.num;
        let newNum = cartList[`${index}`].num > 1 ? cartList[`${index}`].num - 1 : 1;
        this.setData({
            [`cartList[${index}].num`]: newNum,
            [`selectedOrderParam[${index}].num`]: newNum
        })
        // 计算总价
        this.getTotalPrice();
        this.changeCart(e.currentTarget.dataset.id, newNum);
    },

    toConfirm_Order() {
        var y = this;
        // 同步订单参数
        this.getOrderParam();
        var yData = y.data;
        if (!yData.addressCanUse) {
            wx.showToast({
                title: '位置暂不支持配送...',
                icon: 'none',
                duration: 1000,
            })
            return;
        }
        var checkedLength = function (data) {
            var length = 0;
            data.forEach(v => {
                v.y_isCheck === true ? length += 1 : '';
            })
            return length;
        }

        var nowSelectedNum = checkedLength(yData.cartList);
        if (nowSelectedNum === 0) {
            wx.showToast({
                title: '未选中商品...',
                icon: 'none',
                duration: 1000,
            })
            return;
        }
        if (!yData.globalAddress.address) {
            wx.showToast({
                title: '请您补全收货地址...',
                icon: 'none',
                duration: 1000,
            })
            return;
        }
        var goodsInfo = JSON.stringify(yData.selectedOrderParam);
        var paramObj = {
            goods_info: goodsInfo,
            addr_id: yData.addr_id
        }
        util.promiseRequest(api.confirm_order, paramObj)
            .then(res => {
                var resData = res.data.response_data;
                wx.Storage.setItem("confirmOrderData", resData);
                wx.navigateTo({
                    url: `../shoppingCart_confirm/shoppingCart_confirm`
                })
            })

    },
    selectAnotherAddress() {
        var address = wx.Storage.getItem('address');
        var myshippingAddressLength = wx.Storage.getItem('myshippingAddressLength');
        // 现在选择的地址无法使用
        if (!this.data.addressCanUse && myshippingAddressLength == 1) {
            wx.navigateTo({
                url: `../my_shippingAddress/my_shippingAddress`
            })
        }
        else if (this.data.addressCanUse && myshippingAddressLength == 1) {
            wx.navigateTo({
                url: `../my_shippingAddress/my_shippingAddress`
            })
        }

        if (myshippingAddressLength > 1) {
            // 有收货地址
            wx.navigateTo({
                url: `../selectAddress/selectAddress?address=${address}&length=${myshippingAddressLength}`
            })
        }
    },
    toShop() {
        wx.switchTab({
            url: '../sort/sort'
        })
    },
    onHide: function () {
        this.setData({
            hasCheck: false
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.setData({
            hasCheck: false
        })
    },

    onPullDownRefresh: function () {
        let that = this;
        async function clearData() {
            await that.setData({
                cartList: []
            })
        }
        wx.showNavigationBarLoading() //在标题栏中显示加载
        //下拉刷新
        async function refresh() {
            await clearData();
            await that.onShow();
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }
        refresh();
    }
})