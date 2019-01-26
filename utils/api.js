var RootUrl = "http://bianlidian.test01.qcw100.com/";

// 登录注册
var login = RootUrl + "rest/2.0/user/user/wx_login", // 登录
    register = RootUrl + "rest/2.0/user/user/register", // 注册
    verificationCode = RootUrl + "rest/2.0/user/user/send_sms", // 短信验证码

    // 首页
    banner = RootUrl + "rest/2.0/home/home/banner_list", // banner
    category_list = RootUrl + "rest/2.0/home/home/category_list", //首页分类
    service_life = RootUrl + "rest/2.0/home/home/service_life", // 生活服务
    add_message = RootUrl + "rest/2.0/home/home/add_message", // 生活服务添加留言
    index_products = RootUrl + "rest/2.0/home/home/lable_list", // 首页产品
    search_list = RootUrl + "rest/2.0/home/home/search_list", // 搜索关键字列表

    //购物车
    cart_list = RootUrl + "rest/2.0/cart/cart/cart_list", // 购物车列表
    cart_add = RootUrl + "rest/2.0/cart/cart/cart_add", // 添加删除数量同步到购物车

    //个人中心
    basicInfo = RootUrl + "rest/2.0/user/user/basic_info", // 用户基本资料
    add_user_info = RootUrl + "rest/2.0/user/user/add_user_info", // 完善用户基本信息
    score_list = RootUrl + "rest/2.0/user/personal/score_list", // 积分信息
    my_friends = RootUrl + "rest/2.0/user/personal/my_friends", // 我的好友信息
    my_coupons = RootUrl + "rest/2.0/user/personal/my_coupons", // 我的优惠券

    addr_list = RootUrl + "rest/2.0/user/personal/addr_list", // 我的收货地址
    edit_addr = RootUrl + "rest/2.0/user/personal/edit_addr", // 添加编辑收货地址
    remove_addr = RootUrl + "rest/2.0/user/personal/remove_addr", // 移除收货地址

    // 商品分类/商品列表
    product_cate = RootUrl + "rest/2.0/category/category/category_list", // 一级、二级分类
    product_list = RootUrl + "rest/2.0/category/category/product_list", // 商品列表
    product_detail = RootUrl + "rest/2.0/category/category/product_detail", // 商品详情
    get_coupons = RootUrl + "rest/2.0/category/category/get_coupons"; // 可领取优惠券


module.exports = {
    RootUrl: 'http://bianlidian.test01.qcw100.com',
    login: login,
    register: register,
    verificationCode: verificationCode,
    // 首页
    banner,
    category_list,
    category_list,
    service_life: service_life,
    add_message: add_message,
    index_products: index_products,
    search_list: search_list,
    // 商品分类
    product_cate,
    product_list,
    product_detail,
    get_coupons,
    // 购物车
    cart_list,
    // 我的
    basicInfo,
    add_user_info,
    score_list,
    my_friends,
    my_coupons,
    addr_list,
    edit_addr,
    remove_addr,
    cart_add
}