// page/component/orders/Details.js
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    formPage: 'orders',
    orders: []
  },

  onReady() {
    this.getTotalPrice();
  },
  onLoad: function (option) {
    var self = this;
    //获取订单详细
    var formPage = option.formPage;
    var orders = [];
    if (formPage == 'cart') {//从购物车进来的
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
    } else if (formPage == 'orders') {
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
    }
    self.setData({
      orders: orders,
      formPage: formPage
    });
  },
  onShow() {
    var self = this;
    //从缓存中获取地址信息
    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    });
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].commodityNum * orders[i].unitPrice;
    }
    this.setData({
      total: total.toFixed(2)
    });
  },
  toPay(e) {//去支付
    var addressId = e.currentTarget.dataset.addressid;
    if (typeof (addressId) == 'undefined' || addressId == '') {
      tipsUtil.showConfirm('请选择收货地址！');
      return;
    }
    var param = this.data.orders;
    //保存订单信息
    var url = URL.SERVER.order_saveOrderForm + "?addressId=" + addressId;
    httpUtil.http_postJson(url, param, function (res) {
      if (!res.data.error || res.data.length > 0) {
        if (res.data.success) {//订单保存成功
          var orderFormId = res.data.data.orderFormId;
          wx.login({//获取用户登录态
            success: function (res) {
              if (res.code) {
                //发起支付
                if (res.code == 'the code is a mock one') {//用于测试
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
                      url = url + "TRADE_FAILURE";
                      httpUtil.http_post(url, null, function (res) {
                        if (!res.data.error || res.data.length > 0) {
                          tipsUtil.showConfirm(res.data.message);
                          wx.redirectTo({
                            url: '../orders/orders?currentTab=all',
                          })
                        }
                      });
                    });
                } else {
                  var url = URL.SERVER.pay_weChatPay + "?id=" + orderFormId + "&jsCode=" + res.code;
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
              } else {
                tipsUtil.showConfirm('获取用户登录态失败！');
              }
            }
          })
        } else {
          tipsUtil.showConfirm(json.message);
        }
        // wx.showModal({
        //   title: '提示',
        //   content: '本系统只做演示，支付系统已屏蔽',
        //   success: function (res) {//接口调用成功的回调函数
        //     if (res.confirm) {
        //       wx.redirectTo({
        //         url: '../orders/orders?currentTab=all',
        //       });
        //       console.log('用户点击确定');
        //     } else if (res.cancel) {
        //       wx.redirectTo({
        //         url: '../orders/orders?currentTab=all',
        //       });
        //       console.log('用户点击取消');
        //     }
        //   }
        // });
      }
    });
  },
  changeAddress() {//更换收货地址
    var addressId = this.data.address.id;
    wx.navigateTo({
      url: '../address/addressView?addressId=' + addressId
    })
  }
})