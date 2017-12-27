// page/component/orders/Details.js
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");
const orderCommon = require("orderCommon");
/**
 * 计算总价
 */
var getTotalPrice = function (self) {
  let orders = self.data.orders;
  let total = 0;
  for (let i = 0; i < orders.length; i++) {
    total += orders[i].commodityNum * orders[i].unitPrice;
  }
  self.setData({
    total: total.toFixed(2)
  });
}

/**
 * 从购物车进入到订单详细页面
 */
var fromCartToOrdersDetails = function (self, option) {
  var orders = [];
  var param = JSON.parse(option.param);
  for (var i = 0; i < param.length; i++) {
    var commodityDto = param[i].commodityDto;
    orders.push({
      commodityName: commodityDto.commodityName,
      unitPrice: commodityDto.unitPrice,
      spec: commodityDto.spec,
      img: commodityDto.img,
      commodityNum: param[i].commodityNum,
      commodityId: commodityDto.id
    });
  }
  self.setData({
    orders: orders,
    formPage: option.formPage
  });
}

/**
 * 从订单列表页面进入到订单详细页面
 */
var fromOrdersToOrdersDetails = function (self, option) {
  var orders = [];
  var param = JSON.parse(option.param);
  var orderFormDetailDtos = param.orderFormDetailDtos;
  for (var i = 0; i < orderFormDetailDtos.length; i++) {
    var orderFormDetailDto = orderFormDetailDtos[i];
    orders.push({
      commodityName: orderFormDetailDto.commodityName,
      unitPrice: orderFormDetailDto.unitPrice,
      spec: orderFormDetailDto.spec,
      img: orderFormDetailDto.commodityImg,
      commodityNum: orderFormDetailDto.commodityNum,
      commodityId: orderFormDetailDto.commodityId
    });
  }

  var address = {
    id: '000000',
    consignee: param.consignee,
    consigneePhone: param.consigneePhone,
    consigneeAddress: param.consigneeAddress
  };
  self.setData({
    orderFormId: param.id,//订单号
    address: address,
    hasAddress: true,
    orders: orders,
    orderStatus: param.status,//订单状态
    formPage: option.formPage,
    addressClass: 'orders-address-order'
  });
}

// /**
//  * 调用微信支付开始支付
//  */
// var wxPay = function (orderFormId, jsCode) {
//   var url = URL.SERVER.pay_weChatPay + "?id=" + orderFormId + "&jsCode=" + jsCode;
//   httpUtil.http_post(url, param, function (res) {
//     if (!res.data.error || res.data.length > 0) {
//       httpUtil.wx_pay(res.data,
//         function () {//支付成功
//           tipsUtil.showConfirm('支付成功！', function () {
//             wx.redirectTo({
//               url: '../orders/orders?currentTab=all',
//             })
//           });
//         }, function () {//支付失败
//           tipsUtil.showConfirm('支付失败！', function () {
//             wx.redirectTo({
//               url: '../orders/orders?currentTab=all',
//             })
//           });
//         });
//     }
//   });
// }

// /**
//  * 用于测试：模拟调用微信支付，完成修改订单状态
//  */
// var wxPayTest = function (orderFormId) {
//   var url = URL.SERVER.order_updateOrderForm + "?id=" + orderFormId + "&statusCode=";
//   tipsUtil.showConfirmAndCancelTitle("测试支付", "是否支付成功？",
//     function () {//确定，修改订单状态为支付成功
//       url = url + "TRADE_SUCCESS";
//       httpUtil.http_post(url, null, function (res) {
//         if (!res.data.error || res.data.length > 0) {
//           wx.redirectTo({
//             url: '../orders/orders?currentTab=all',
//           })
//         }
//       });
//     }, function () {//取消，修改订单状态为支付失败
//       url = url + "TRADE_FAILURE";
//       httpUtil.http_post(url, null, function (res) {
//         if (!res.data.error || res.data.length > 0) {
//           tipsUtil.showConfirm(res.data.message);
//           wx.redirectTo({
//             url: '../orders/orders?currentTab=all',
//           })
//         }
//       });
//     });
// }

// /**
//  * 检查登陆，开始调用支付
//  */
// var loginWxPay = function (orderFormId) {
//   wx.login({//获取用户登录态
//     success: function (res) {
//       if (res.code) {
//         //发起支付
//         if (res.code == 'the code is a mock one') {//用于测试
//           wxPayTest(orderFormId);
//         } else {
//           wxPay(orderFormId, res.code);
//         }
//       } else {
//         tipsUtil.showConfirm('获取用户登录态失败！');
//       }
//     }
//   })
// }

/**
 * 1.保存订单信息
 * 2.发起微信支付
 */
var saveOrderForm = function (self) {
  var param = self.data.orders;
  var addressId = self.data.address.id;
  var url = URL.SERVER.order_saveOrderForm + "?addressId=" + addressId;
  httpUtil.http_postJson(url, param, function (res) {
    if (!res.data.error || res.data.length > 0) {
      if (res.data.success) {//订单保存成功
        var orderFormId = res.data.data.orderFormId;
        orderCommon.loginWxPay(orderFormId);
      } else {
        tipsUtil.showConfirm(json.message);
      }
    }
  });
}
// /**
//  * 订单已经存在，直接发起支付
//  */
// var updateOrderForm = function (self) {
//   var orderFormId = res.data.orderFormId;
//   loginWxPay(orderFormId);
// }

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    formPage: 'orders',
    addressClass: 'orders-address',
    orders: [],//订单详细
    orderFormId: '',//订单号
    orderStatus: '0'//订单状态
  },
  onReady() {
    getTotalPrice(this);
  },
  onLoad: function (option) {
    var self = this;
    //获取订单详细
    var formPage = option.formPage;
    if (formPage == 'cart') {//从购物车进来的
      fromCartToOrdersDetails(self, option);
    } else if (formPage == 'orders') {
      fromOrdersToOrdersDetails(self, option);
    }
  },
  onShow(option) {
    var self = this;
    var formPage = self.data.formPage;
    if (formPage == 'cart') {//从购物车进来的
      //从缓存中获取地址信息
      wx.getStorage({
        key: 'address',
        success(res) {
          self.setData({
            address: res.data,
            hasAddress: true
          });
        }
      });
    }
  },
  toPay(e) {//去支付
    var self = this;
    var addressId = e.currentTarget.dataset.addressid;
    if (typeof (addressId) == 'undefined' || addressId == '') {
      tipsUtil.showConfirm('请选择收货地址！');
      return;
    }
    var formPage = self.data.formPage;
    if (formPage == 'cart') {//从购物车进来的,都新订单
      saveOrderForm(self);
    } else if (formPage == 'orders') {//已经存在的订单，直接发起支付
      orderCommon.updateOrderForm(self);
    }
  },
  changeAddress() {//更换收货地址
    var self = this;
    var formPage = self.data.formPage;
    if (formPage == 'cart') {//从购物车进来的,可以更换收货地址
      var addressId = this.data.address.id;
      wx.navigateTo({
        url: '../address/addressView?addressId=' + addressId
      });
    }
  }
})