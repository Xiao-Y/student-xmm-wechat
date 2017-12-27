const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");

/**
 * 获取商品详细
 */
var getCommodityById = function (that, param) {
  httpUtil.http_get(URL.SERVER.details_getCommodityById, param, function (res) {
    if (!res.data.error || res.data.length > 0) {
      that.setData({
        goods: res.data,
        hidden: true
      });
    }
  });
}
/**
 * 获取购物车中商品的总数量
 */
var shoppingCount = function (that) {
  httpUtil.http_get(URL.SERVER.details_shoppingCount, null, function (res) {
    if (!res.data.error || res.data.length > 0) {
      that.setData({
        totalNum: res.data,
        hidden: true
      });
    }
  });
}

Page({
  onLoad: function (options) {
    var id = options.id;
    var param = { "id": id };
    getCommodityById(this, param);
    shoppingCount(this);
  },
  onPullDownRefresh: function () {
    let commodityId = this.data.goods.id;
    var param = { "id": commodityId };
    getCommodityById(this, param);
    shoppingCount(this);
  },
  data: {
    num: 1,
    hasCarts: true,
    curIndex: 0,
    show: false,
    scaleCart: false
  },
  addCount() {//计算购物车中商品的数量
    let num = this.data.num;
    num++;
    this.setData({
      num: num
    })
  },
  addToCart() {//添加商品到购物车
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;
    let commodityId = this.data.goods.id;
    //后台传入参数
    var data = { commodityId: commodityId, commodityNum: num };
    httpUtil.http_get(URL.SERVER.details_addShoppingCart, data, function (res) {
      if (!res.data.error || res.data.length > 0) {
        if (res.data.success) {//添加成功
          self.setData({
            show: true
          });
          //购物车动画
          setTimeout(function () {
            self.setData({
              show: false,
              scaleCart: true
            })
            setTimeout(function () {
              self.setData({
                scaleCart: false,
                hasCarts: true,
                totalNum: num + total
              })
            }, 200)
          }, 300);
        } else {
          //添加失败提示
          tipsUtil.showConfirm(res.data.message);
        }
      }
    });
  },
  openCart() {//打开购物车
    // wx.switchTab({
    //   url: "../cart/cart",
    //   complete: function (res) {
    //     console.log(res)
    //   }
    // });
    wx.navigateTo({
      url: '../cart/cart',
    })
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
})