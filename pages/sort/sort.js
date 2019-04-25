const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const regeneratorRuntime = require("../../utils/runtime.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        shortAddress: '加载中...',
        address: '',
        showYouhuiQuan: false,
        classA: [], // 一级分类
        fid_showAll: '', // 点选默认选中一级分类的id
        fid_showAll_temp: '',
        chooseClassA: false,
        classB: [], // 二级分类
        productList: [],
        classShowA: '',
        classShowB: '',
        proType: null,
        proId: 1,
        card: [],
        total: 0,
        proBottom: true,
        isArrivedBottom: false,
        firstId: '', // 左侧主导航第一个菜单的id
        isRefresh: false // 在刷新页面
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (this.data.loading) {
            util.openLoading();
        }
        if (wx.Storage.getItem("token") && !this.data.isRefresh) {
            this.get_coupons();
        }
        let that = this;
        if (options != undefined && options.id) {
            let params = {}
            util.promiseRequest(api.product_cate, params).then((res) => {
                that.setData({
                    classA: res.data.response_data,
                });
                if (res.data.response_data[0]) {
                    that.setData({
                        proType: res.data.response_data[0].type,
                    })
                };
                let aindex = '';
                res.data.response_data.forEach((item, index) => {
                    if (options.id == item.id) {
                        aindex = index
                    }
                })
                let e = {
                    currentTarget: {
                        dataset: {
                            id: options.id,
                            index: aindex,
                            pro_id: options.id,
                            pro_type: options.type,
                            type: 1
                        }
                    }
                }
                that.chooseClass(e);
                that.getproduct_list();
            })
        } else {
            this.getProduct_cate();
        }
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
        this.setData({
            shortAddress: wx.Storage.getItem("shortAddress"),
            address: wx.Storage.getItem("address")
        })
        var globalAddress = wx.Storage.getItem("globalAddress");
        if (globalAddress) {
            this.setData({
                globalAddress: globalAddress
            })
        }
    },

    // TODO: IOS 设备 全部分类下拉刷新
    scrollBottom() {
        let isArrivedBottom = this.data.isArrivedBottom;
        if (!isArrivedBottom) {
            this.setData({
                page: this.data.page + 1
            });
            this.getproduct_list(1);
        }

    },
    toSelectAddress(e) {
        var data = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../selectAddress/selectAddress?address=${data.address}`
        })
    },
    // 获取分类
    getProduct_cate(id) {
        let params = {}
        if (id) {
            params.id = id;
        }
        let that = this;
        util.promiseRequest(api.product_cate, params).then((res) => {
            var response = res.data.response_data;
            that.setData({
                [id ? 'classB' : 'classA']: response
            });

            if (response[0]) {
                var index = this.data.classShowB || 0;
                // console.log('二级分类 index------------', index)
                if (that.data.isRefresh && id) {
                    that.setData({
                        proType: response[`${index}`].type,
                        proId: response[`${index}`].id
                    })
                } else {
                    that.setData({
                        [id ? 'proId' : 'proType']: id ? response[0].id : response[0].type
                    })
                }

            }
            that.getproduct_list();
        })
    },
    // 选择分类
    chooseClass(e) {

        let cur = e.currentTarget.dataset;
        // 领取优惠券只在第一个分类里展示
        if (this.data.firstId != cur.id || cur.pro_type != 1) {
            this.setData({
                total: 0
            })
        } else {
            if (wx.Storage.getItem("token")) {
                this.get_coupons();
            }
        }
        if (cur.index == 0 && cur.type == 1) {
            this.get_coupons();
        }

        // 正选择最左侧的一级分类

        if (cur.type == 1) {
            wx.Storage.setItem("sort_chooseClass", e);
            if (this.data.fid_showAll_temp) {
                this.setData({
                    fid_showAll_temp: '',
                    fid_showAll: '',
                    classShowB: 0
                })
            }
        }
        // fid_showAll: cur.id, // 保存一级分类id

        if (cur.type == 1 || cur.showall == 'true') {
            var now_fid_showAll = this.data.fid_showAll_temp;
            this.setData({
                fid_showAll: now_fid_showAll || cur.id,
                [cur.type == 1 ? 'fid_showAll_temp' : 'fid_showAll_noUse']: cur.id
            })
        } else {
            this.setData({
                fid_showAll: ''
            })
        }

        this.setData({
            [cur.type == 1 ? 'classShowA' : 'classShowB']: cur.index,
            proId: cur.pro_id,
            proType: cur.pro_type,
            page: 1,
            proBottom: true
        });
        if (cur.type == 1 && cur.pro_type != 1) {
            this.getProduct_cate(cur.id);
        } else if (cur.pro_type == 1) {
            this.setData({
                classB: [],
            })
            this.getproduct_list();
        } else {
            this.getproduct_list();
        }
    },
    // 商品列表
    getproduct_list(type) {

        if (!this.data.proBottom && type == 1) {
            return;
        }
        let that = this;
        let fid_showAll = that.data.fid_showAll;
        let isRefresh = that.data.isRefresh;
        let params;
        let isArrivedBottom_state;
        // console.log("一级分类id:" + this.data.fid_showAll)

        if (fid_showAll) {
            params = {
                type: this.data.proType,
                fid: fid_showAll,
                id: this.data.proId,
                num: 20,
                page: this.data.page
            };

        } else {
            params = {
                type: this.data.proType,
                id: this.data.proId,
                num: 20,
                page: this.data.page
            };
        }

        util.promiseRequest(api.product_list, params).then((res) => {

            let data = type == 1 ? that.data.productList.concat(res.data.response_data) : res.data.response_data
            if (data != undefined && res.data.response_data.length < 20) {
                that.data.proBottom = false;
                isArrivedBottom_state = true;
                console.log("到底了孩子，不准加载了....")
            }
            // 自定义购物车逻辑属性
            if (data && data.length > 0) {
                util.addKey(data, {
                    showCountControl: false,
                    current_num: 0
                })
            }
            util.closeLoading();
            that.setData({
                productList: data || [],
                loading: false,
                isArrivedBottom: isArrivedBottom_state ? true : false
            })
        })
    },

    // 优惠券
    get_coupons: util.debounce(function (e) {
        let that = this;
        if (wx.Storage.getItem("token")) {
            app.get_coupons(function (data) {
                that.setData({
                    card: data,
                    total: data.length
                })
                if (data.length === 0) {
                    showYouhuiQuan: false
                }
            })
        }
    }, 1000, true),
    // 加入购物车
    addToCart(e) {
        app.isLogin(() => {
            app.addToCart(e);
        })
        return;
        // + - 按钮控制取消，不使用
        var y = this;
        var data = e.currentTarget.dataset;
        app.isLogin(() => {
            this.getShoppingCartDataLength(data.id, function (thisGoodsLength) {
                // 商品数量为0不直接显示+-
                app.addToCart(e);
                y.setData({
                    [`productList[${data.index}].showCountControl`]: true,
                    [`productList[${data.index}].current_num`]: thisGoodsLength + 1
                })
                console.log(thisGoodsLength)
            });
        })
    },
    // 获取购物车此商品的数量
    getShoppingCartDataLength(id, callback) {

        util.promiseRequest(api.cart_list, {}).then(res => {
            var data = res.data.response_data.lists || [];
            var finalData = util.filterObjToArr(data);
            var filterData = finalData.filter((val) => {
                return id == val.goods_id
            });
            let length = filterData.length > 0 ? filterData[0].num : 0;
            callback(length)
        })
    },
    // 加
    numAdd(e) {
        let data = e.currentTarget.dataset;
        let index = data.index;
        let num = data.num;

        this.setData({
            [`productList[${data.index}].current_num`]: num + 1
        })
        this.changeCart(e.currentTarget.dataset.id, Number(num) + 1);
    },
    // 减
    minusNum(e) {
        let data = e.currentTarget.dataset;
        let index = data.index,
            num = data.num;
        if (num > 1) {
            this.setData({
                [`productList[${data.index}].current_num`]: num - 1
            })
            this.changeCart(e.currentTarget.dataset.id, Number(num) - 1);
        } else if (num === 1) {
            util.toast("继续删除请到购物车...")
        }

    },
    // 购物车数量变动提交公共方法
    changeCart(id, num) {
        let params = {
            goods_id: id,
            type: 2,
            num: num
        }
        util.promiseRequest(api.cart_add, params).then((res) => {
            // 更新购物车数量
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
        })
    },
    // 领取优惠券
    receive_coupons(e) {
        let that = this;
        app.receive_coupons(e, function () {
            that.get_coupons();
        });
    },

    toDetail(e) {
        wx.navigateTo({
            url: '../sort_detail/sort_detail?id=' + e.currentTarget.dataset.id
        })
    },
    getCoupon() {
        this.setData({
            showYouhuiQuan: true
        })
    },
    closeCoupon() {
        this.setData({
            showYouhuiQuan: false
        })
    },
    test() {
        app.isLogin(() => {
            wx.navigateTo({
                url: `../index_search/index_search`
            })
        })

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        if (wx.Storage.getItem("token")) {
            app.getShoppingCartNum();
        }
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        async function clearData() {
            util.openLoading();
            await that.setData({
                loading: true,
                isRefresh: true, // 刷新就不要优惠券了啊
                total: 0,
                classA: [],
                classB: [],
                productList: []
            })
        }
        // proType
        async function chooseClass(e) {
            wx.Storage.setItem("sort_chooseClass", e)
            let cur = e && e.currentTarget.dataset;
            // 领取优惠券只在第一个分类里展示
            if (cur && that.data.firstId != cur.id || cur.pro_type != 1) {
                that.setData({
                    total: 0
                })
            } else {
                if (wx.Storage.getItem("token")) {
                    that.get_coupons();
                }
            }

            that.setData({
                [cur.type == 1 ? 'classShowA' : 'classShowB']: cur.index,
                proId: cur.pro_id,
                proType: cur.pro_type,
                page: 1,
                proBottom: true
            });
            if (cur.type == 1 && cur.pro_type != 1) {
                that.getProduct_cate(cur.id);
            } else if (cur.pro_type == 1) {
                that.setData({
                    classB: [],
                })
                that.getproduct_list(2);
            } else {
                that.getproduct_list(2);
            }
        }
        wx.showNavigationBarLoading() //在标题栏中显示加载
        //下拉刷新
        async function refresh() {
            await clearData();
            await that.onLoad();
            await chooseClass(wx.Storage.getItem("sort_chooseClass"));
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }
        refresh();
    }
})