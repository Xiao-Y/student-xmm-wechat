var config = "debug";

var base_server_debug = "http://127.0.0.1:8099/student-web/";
var base_server_prod = "https://www.juxianjia.net/";
var base_server = base_server_debug;
if (config != "debug") {
  base_server = base_server_prod;
}

var SERVER = {
  //登陆
  home_login: base_server + "mb/home/login",

  //获取最新商品
  home_getCommodityNewList: base_server + "mb/home/getCommodityNewList",
  //获取最热商品
  home_getCommodityHotList: base_server + "mb/home/getCommodityHotList",

  //获取商品详细
  details_getCommodityById: base_server + "mb/details/getCommodityById",
  //获取购物车商品数量
  details_shoppingCount: base_server + "mb/details/shoppingCount",
  //添加商品到购物车
  details_addShoppingCart: base_server + "mb/details/addShoppingCart",

  //查看我的购物车
  cart_myShoppingCart: base_server + "mb/cart/myShoppingCart",
  //更新购物车中的商品数量
  cart_updateShoppingCartComNum: base_server + "mb/cart/updateShoppingCartComNum",
  //删除购物车信息
  cart_deleteShoppingCart: base_server + "mb/cart/deleteShoppingCart"
}

module.exports = {
  SERVER: SERVER,
}