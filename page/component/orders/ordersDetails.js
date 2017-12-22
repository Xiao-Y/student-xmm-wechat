// page/component/orders/Details.js
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
          commodityNum: param[i].commodityNum
        });
      }
    } else if (formPage == 'orders'){
      var orderFormDetailDtos = JSON.parse(option.param).orderFormDetailDtos;
      for (var i = 0; i < orderFormDetailDtos.length; i++) {
        var orderFormDetailDto = orderFormDetailDtos[i].orderFormDetailDto;
        orders.push({
          commodityName: orderFormDetailDto.commodityName,
          unitPrice: orderFormDetailDto.unitPrice,
          spec: orderFormDetailDto.spec,
          img: orderFormDetailDto.img,
          commodityNum: orderFormDetailDto.commodityNum
        });
      }
    }
    self.setData({
      orders: orders,
      formPage: formPage
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

  toPay() {
    wx.showModal({
      title: '提示',
      content: '本系统只做演示，支付系统已屏蔽',
      complete() {
        wx.switchTab({
          url: '/page/component/user/user'
        })
      }
    })
  }
})