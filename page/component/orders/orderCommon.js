const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");

/**
 * 订单已经存在，直接发起支付
 */
var updateOrderForm = function (self) {
  var orderFormId = self.data.orderFormId;
  loginWxPay(orderFormId);
}

/**
 * 检查登陆，开始调用支付
 */
var loginWxPay = function (orderFormId) {
  wx.login({//获取用户登录态
    success: function (res) {
      if (res.code) {
        //发起支付
        if (res.code == 'the code is a mock one') {//用于测试
          wxPayTest(orderFormId);
        } else {
          wxPay(orderFormId, res.code);
        }
      } else {
        tipsUtil.showConfirm('获取用户登录态失败！');
      }
    }
  })
}

/**
 * 调用微信支付开始支付
 */
var wxPay = function (orderFormId, jsCode) {
  var url = URL.SERVER.pay_weChatPay + "?id=" + orderFormId + "&jsCode=" + jsCode;
  httpUtil.http_post(url, param, function (res) {
    if (!res.data.error || res.data.length > 0) {
      httpUtil.wx_pay(res.data,
        function () {//支付成功
          tipsUtil.showConfirm('支付成功！', function () {
            wx.redirectTo({
              url: '../orders/orders?currentTab=all',
            })
          });
        }, function () {//支付失败
          tipsUtil.showConfirm('支付失败！', function () {
            wx.redirectTo({
              url: '../orders/orders?currentTab=all',
            })
          });
        });
    }
  });
}

/**
 * 用于测试：模拟调用微信支付，完成修改订单状态
 */
var wxPayTest = function (orderFormId) {
  var url = URL.SERVER.order_updateOrderForm + "?id=" + orderFormId + "&statusCode=";
  tipsUtil.showConfirmAndCancelTitle("测试支付", "是否支付成功？",
    function () {//确定，修改订单状态为支付成功
      url = url + "TRADE_SUCCESS";
      httpUtil.http_post(url, null, function (res) {
        if (!res.data.error || res.data.length > 0) {
          wx.redirectTo({
            url: '../orders/orders?currentTab=all',
          })
        }
      });
    }, function () {//取消，修改订单状态为支付失败
      url = url + "UNPAID";
      httpUtil.http_post(url, null, function (res) {
        if (!res.data.error || res.data.length > 0) {
          tipsUtil.showConfirm(res.data.message);
          wx.redirectTo({
            url: '../orders/orders?currentTab=all',
          })
        }
      });
    });
}

module.exports = {
  updateOrderForm: updateOrderForm,
  loginWxPay: loginWxPay
}