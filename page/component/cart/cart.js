const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");

/**
 * 获取我的购物车列表
 */
var myShoppingCart = function (that, param) {
  httpUtil.http_get(URL.SERVER.cart_myShoppingCart, param, function (res) {
    if (!res.data.error || res.data.length > 0) {
      that.setData({
        carts: res.data,
        hasList: true,
        hidden: true
      });
      getTotalPrice(that);
    } else {
      this.setData({
        hasList: false,
      });
    }
  });
}
/**
 * 更新购物车中的商品数量
 */
var updateShoppingCartComNum = function (that, e, flag) {
  const index = e.currentTarget.dataset.index;
  let carts = that.data.carts;
  let commodityId = carts[index].commodityId;
  let commodityNum = carts[index].commodityNum;
  if (flag === 'addCount') {
    commodityNum = commodityNum + 1;
  } else if (flag === 'minusCount') {
    if (commodityNum <= 1) {
      return false;
    }
    commodityNum = commodityNum - 1;
  }
  var url = URL.SERVER.cart_updateShoppingCartComNum + "/" + commodityId + "/" + commodityNum;
  httpUtil.http_get(url, null, function (res) {
    if (!res.data.error || res.data.length > 0) {
      if (res.data.success) {
        carts[index].commodityNum = commodityNum;
        that.setData({
          carts: carts
        });
        getTotalPrice(that);
      } else {
        //添加失败提示
        tipsUtil.showConfirm(res.data.message);
      }
    }
  });
}
/**
 * 删除购物车中的商品
 */
var deleteShoppingCart = function (that, e) {
  const index = e.currentTarget.dataset.index;
  let carts = that.data.carts;
  let commodityId = carts[index].commodityId;
  var url = URL.SERVER.cart_deleteShoppingCart + "/" + commodityId;
  httpUtil.http_get(url, null, function (res) {
    if (!res.data.error || res.data.length > 0) {
      if (res.data.success) {
        carts.splice(index, 1);
        that.setData({
          carts: carts
        });
        if (!carts.length) {
          that.setData({
            hasList: false
          });
        } else {
          getTotalPrice(that);
        }
      } else {
        //添加失败提示
        tipsUtil.showConfirm(res.data.message);
      }
    }
  });
}
/**
 * 计算总价
 */
var getTotalPrice = function (that) {
  let carts = that.data.carts;                  // 获取购物车列表
  let total = 0;
  for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
    if (carts[i].selected) {                     // 判断选中才会计算价格
      total += carts[i].commodityNum * carts[i].commodityDto.unitPrice;   // 所有价格加起来
    }
  }
  that.setData({                                // 最后赋值到data中渲染到页面
    carts: carts,
    totalPrice: total.toFixed(2)
  });
}

Page({
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true    // 全选状态，默认全选
  },
  onLoad: function (options) {
    myShoppingCart(this);
  },
  onPullDownRefresh: function () {
    myShoppingCart(this);
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    getTotalPrice(this);
  },
  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    deleteShoppingCart(this, e);
  },
  /**
   * 绑定加数量事件
   */
  addCount(e) {
    updateShoppingCartComNum(this, e, "addCount");
  },
  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    updateShoppingCartComNum(this, e, "minusCount");
  },
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    getTotalPrice(this);
  },
  saveOrder(){//提交订单
    var param = this.data.carts.filter(this.selectedFilter);
    console.info(param);
    console.info(JSON.stringify(param));
    wx.navigateTo({
      url: '../orders/ordersDetails?formPage=cart&param=' + JSON.stringify(param),
    })
    //保存订单信息
    // httpUtil.http_postJson(URL.SERVER.cart_saveOrderForm, param, function (res) {
    //   if (!res.data.error || res.data.length > 0) {
    //     var json = res.data;
    //     if(json.success){
    //       //订单号
    //       var orderFormId = json.data.orderFormId;
    //       wx.navigateTo({
    //         url: '../orders/ordersDetails?orderFormId=' + orderFormId,
    //       })
    //     }else{
    //       tipsUtil.showConfirm(json.message);
    //     }
    //   }
    // });
  },
  selectedFilter(element, index, array){//过滤所有选种的商品
    return (element.selected);
  }
})