// var RootUrl = "https://bianlidian.test01.qcw100.com/" ; // dev
var RootUrl = "https://zxssxcs.cn/"; // prod

// 登录注册
var login = RootUrl + "rest/2.0/user/user/wx_login", // 登录
  register = RootUrl + "rest/2.0/user/user/register", // 注册
  verificationCode = RootUrl + "rest/2.0/user/user/send_sms", // 短信验证码
  upload_image = RootUrl + "rest/2.0/neutral/neutral/upload_image", // 上传图片
  // 首页
  banner = RootUrl + "rest/2.0/home/home/banner_list", // banner
  category_list = RootUrl + "rest/2.0/home/home/category_list", //首页分类
  service_life = RootUrl + "rest/2.0/home/home/service_life", // 生活服务
  add_message = RootUrl + "rest/2.0/home/home/add_message", // 生活服务添加留言
  index_products = RootUrl + "rest/2.0/home/home/lable_list", // 首页产品
  search_list = RootUrl + "rest/2.0/home/home/search_list", // 搜索关键字列表
  add_search_history = RootUrl + "rest/2.0/home/home/add_search_history", // 搜索关键字
  sign_in = RootUrl + "rest/2.0/home/home/sign_in", // 签到
  plus_list = RootUrl + "rest/2.0/home/home/plus_list", // plus 列表
  pay_plus = RootUrl + "rest/2.0/home/home/plus_pay", // 会员支付
  clear_history = RootUrl + "rest/2.0/home/home/del_search_history", // 清除历史记录
  //购物车
  cart_list = RootUrl + "rest/2.0/cart/cart/cart_list", // 购物车列表
  cart_add = RootUrl + "rest/2.0/cart/cart/cart_add", // 添加删除数量同步到购物车
  confirm_order = RootUrl + "rest/2.0/category/order/confirm_order", // 确认订单
  add_order = RootUrl + "rest/2.0/category/order/add_order", // 下单
  cancel_order = RootUrl + "rest/2.0/category/order/cancel_order", // 取消订单
  order_list = RootUrl + "rest/2.0/category/order/order_list", // 订单列表
  order_detail = RootUrl + "rest/2.0/category/order/order_detail", // 订单详情
  order_goods = RootUrl + "rest/2.0/category/order/order_goods", // 订单商品详情
  can_use_coupons = RootUrl + "rest/2.0/category/order/can_use_coupons", // 可使用的优惠券列表
  comment = RootUrl + "rest/2.0/category/order/comment", // 可使用的优惠券列表
  confirm_goods = RootUrl + "rest/2.0/category/order/confirm_goods", // 可使用的优惠券列表
  once_again_order = RootUrl + "rest/2.0/category/order/once_again_order", // 可使用的优惠券列表
  pay_order = RootUrl + "rest/2.0/category/order/order_pay", // 支付订单
  confirm_order_detail =
    RootUrl + "rest/2.0/category/order/confirm_order_detail", // 确认订单商品详情
  delete_cart = RootUrl + "rest/2.0/cart/cart/cart_del", // 删除购物车商品
  merchant_addr = RootUrl + "rest/2.0/cart/cart/merchant_addr", // 获取商户地址信息
  orderNum = RootUrl + "rest/2.0/category/order/order_num", // 订单数量
  //个人中心
  basicInfo = RootUrl + "rest/2.0/user/user/basic_info", // 用户基本资料
  add_user_info = RootUrl + "rest/2.0/user/user/add_user_info", // 完善用户基本信息
  score_list = RootUrl + "rest/2.0/user/personal/score_list", // 积分信息
  my_friends = RootUrl + "rest/2.0/user/personal/my_friends", // 我的好友信息
  my_coupons = RootUrl + "rest/2.0/user/personal/my_coupons", // 我的优惠券
  addr_list = RootUrl + "rest/2.0/user/personal/addr_list", // 我的收货地址
  edit_addr = RootUrl + "rest/2.0/user/personal/edit_addr", // 添加编辑收货地址
  remove_addr = RootUrl + "rest/2.0/user/personal/remove_addr", // 移除收货地址
  kf_telephone = RootUrl + "rest/2.0/user/personal/kf_telephone", // 客服电话
  // 商品分类/商品列表
  product_cate = RootUrl + "rest/2.0/category/category/category_list", // 一级、二级分类
  product_list = RootUrl + "rest/2.0/category/category/product_list", // 商品列表
  product_detail = RootUrl + "rest/2.0/category/category/product_detail", // 商品详情
  get_coupons = RootUrl + "rest/2.0/category/category/get_coupons", // 可领取优惠券
  receive_coupons = RootUrl + "rest/2.0/category/category/receive_coupons"; // 可领取优惠券

module.exports = {
  RootUrl: "http://admin.bianlidian.test01.qcw100.cn",
  login,
  register,
  verificationCode,
  upload_image,
  // 首页
  banner,
  category_list,
  category_list,
  service_life,
  add_message,
  index_products,
  search_list,
  add_search_history,
  sign_in,
  plus_list,
  pay_plus,
  clear_history,
  // 商品分类
  product_cate,
  product_list,
  product_detail,
  get_coupons,
  receive_coupons,
  // 购物车
  cart_list,
  cart_add,
  confirm_order,
  pay_order,
  add_order,
  cancel_order,
  order_list,
  order_detail,
  order_goods,
  can_use_coupons,
  comment,
  confirm_goods,
  once_again_order,
  confirm_order_detail,
  delete_cart,
  merchant_addr,
  orderNum,
  // 我的
  basicInfo,
  add_user_info,
  score_list,
  my_friends,
  my_coupons,
  addr_list,
  edit_addr,
  remove_addr,
  kf_telephone
};
