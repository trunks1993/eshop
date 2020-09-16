<!--
 * @Date: 2020-09-08 11:06:11
 * @LastEditTime: 2020-09-16 11:38:59
-->
<template>
  <div class="order">
    <van-tabs
      v-model="active"
      @change="change"
      sticky
      line-width="22px"
      line-height="4px"
      color="#1a61dc"
      title-active-color="#1a61dc"
      background="#F5F5F7"
      title-inactive-color="#999999"
    >
      <van-tab
        v-for="index in OrderTypes"
        :key="index.value"
        :name="index.value"
        :title="index.title"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="- 没有更多了 -"
          @load="onLoad"
          v-show="list.length"
          class="order__list"
        >
          <van-cell v-for="item in list" :key="item.code" class="order__item">
            <div class="order__item-head">
              <span class="order__item-head-no">
                订单号：{{ item.orderId }}
              </span>
              <span class="order__item-head-status">
                {{
                  typeof TraceStatus[item.status] === 'function'
                    ? TraceStatus[item.status](item.productTypeCode)
                    : TraceStatus[item.status]
                }}
              </span>
            </div>
            <div class="order__item-goods">
              <img
                :class="
                  item.status === TRACE_STATUS_6
                    ? 'order__item-goods-unimg'
                    : 'order__item-goods-img'
                "
                :src="'/file' + item.iconUrl"
              />
              <span class="order__item-goods-name">
                {{ item.goodsName }}
                <b
                  :class="
                    item.status === TRACE_STATUS_6
                      ? 'order__item-goods-name--untype'
                      : 'order__item-goods-name--type'
                  "
                >
                  {{ ProductTypes[item.productTypeCode] }}
                </b>
              </span>
              <span class="order__item-goods-other">
                <span>x{{ item.amount }}</span>
                <span class="price">
                  ￥{{ getFloat(item.price / TRANSTEMP, PRECISION) }}
                </span>
              </span>
            </div>
            <div class="order__item-extra">
              <span class="order__item-extra-item">
                购买时间：{{ item.createTime }}
              </span>
              <span
                v-show="item.productTypeCode === PRODUCT_TYPE_4"
                class="order__item-extra-item"
              >
                充值账号：{{ item.rechargeAccount }}
              </span>
            </div>
            <div class="order__item-bottom">
              <div v-if="item.status === TRACE_STATUS_1">
                <div class="order__item-bottom-text">
                  <span class="order__item-bottom-text--text">待付合计:</span>
                  <span class="order__item-bottom-text--money">
                    &nbsp;￥{{
                      getFloat(
                        (item.amount * item.price) / TRANSTEMP,
                        PRECISION
                      )
                    }}
                  </span>
                </div>
              </div>
              <div v-else-if="item.status === TRACE_STATUS_2">
                <div class="order__item-bottom-text">
                  <span class="order__item-bottom-text--text">合计:</span>
                  <span class="order__item-bottom-text--money">
                    &nbsp;￥{{
                      getFloat(
                        (item.amount * item.price) / TRANSTEMP,
                        PRECISION
                      )
                    }}
                  </span>
                </div>
              </div>
              <div v-else-if="item.status === TRACE_STATUS_4">
                <div class="order__item-bottom-text">
                  <span class="order__item-bottom-text--text">合计:</span>
                  <span class="order__item-bottom-text--money">
                    &nbsp;￥{{
                      getFloat(
                        (item.amount * item.price) / TRANSTEMP,
                        PRECISION
                      )
                    }}
                  </span>
                </div>
              </div>
              <div v-else-if="item.status === TRACE_STATUS_5">
                <div class="order__item-bottom-text">
                  <span class="order__item-bottom-text--text">合计:</span>
                  <span class="order__item-bottom-text--money">
                    &nbsp;￥{{
                      getFloat(
                        (item.amount * item.price) / TRANSTEMP,
                        PRECISION
                      )
                    }}
                  </span>
                </div>
              </div>
              <div v-else-if="item.status === TRACE_STATUS_6">
                <div class="order__item-bottom-text">
                  <span class="order__item-bottom-text--text">合计:</span>
                  <span class="order__item-bottom-text--unmoney">
                    &nbsp;￥{{
                      getFloat(
                        (item.amount * item.price) / TRANSTEMP,
                        PRECISION
                      )
                    }}
                  </span>
                </div>
              </div>

              <div class="order__item-bottom-btn">
                <span class="order__item-bottom--text">
                  <div
                    v-show="item.status === TRACE_STATUS_1"
                    class="order__item-bottom--pay"
                  >
                    等待买家付款
                  </div>
                </span>

                <div v-if="item.status === TRACE_STATUS_1">
                  <div class="order__item-bottom-btn--ghost" @click="kefuModal">
                    联系客服
                  </div>
                  <div
                    class="order__item-bottom-btn--primary"
                    @click="_pay(item.orderId)"
                  >
                    继续支付
                  </div>
                </div>

                <div v-else-if="item.status === TRACE_STATUS_2">
                  <div class="order__item-bottom-btn--ghost" @click="kefuModal">
                    联系客服
                  </div>
                </div>

                <div v-else-if="item.status === TRACE_STATUS_4">
                  <div
                    class="order__item-bottom-btn--primary"
                    v-show="
                      item.productTypeCode === PRODUCT_TYPE_1 ||
                        item.productTypeCode === PRODUCT_TYPE_2 ||
                        item.productTypeCode === PRODUCT_TYPE_3
                    "
                    @click="
                      window.location.href = `/card.html#/?orderId=${item.orderId}`
                    "
                  >
                    查看卡券
                  </div>
                </div>
              </div>
            </div>
          </van-cell>
        </van-list>
        <div v-show="!list.length && !loading" class="empty">
          <img :src="empty" />
          <div class="empty-text">您还没有订单</div>
        </div>
      </van-tab>
    </van-tabs>

    <form :action="payUrl" method="post" v-show="false" ref="formRef">
      <input :value="orderinfo" name="orderInfo" />
    </form>
    
  </div>
</template>
<script>
import {
  getOrderByOrderId,
  pay,
  searchUserSubscribeOrderList,
  shiluPay,
} from '@/services/app';
import {
  ProductTypes,
  TraceStatus,
  TRACE_STATUS_0,
  TRACE_STATUS_1,
  TRACE_STATUS_2,
  TRACE_STATUS_3,
  TRACE_STATUS_4,
  TRACE_STATUS_5,
  TRACE_STATUS_6,
  PRODUCT_TYPE_1,
  PRODUCT_TYPE_2,
  PRODUCT_TYPE_3,
  PRODUCT_TYPE_4,
  TRANSTEMP,
  PRECISION,
  OrderTypes,
} from '@/const';
import { getQueryVariable, getFloat, getChannel } from '@/utils';
import empty from '@/assets/images/empty.png';

export default {
  name: 'order',
  data() {
    return {
      payUrl: '',
      orderinfo: 'asddssadsadsadsadsad',

      timer: null,

      active: '',
      OrderTypes,
      empty,

      currPage: 1,
      pageSize: 10,

      list: [],

      loading: false,
      finished: false,
      visible: false,

      ProductTypes,
      TraceStatus,
      TRACE_STATUS_0,
      TRACE_STATUS_1,
      TRACE_STATUS_2,
      TRACE_STATUS_3,
      TRACE_STATUS_4,
      TRACE_STATUS_5,
      TRACE_STATUS_6,
      PRODUCT_TYPE_1,
      PRODUCT_TYPE_2,
      PRODUCT_TYPE_3,
      PRODUCT_TYPE_4,
      TRANSTEMP,
      PRECISION,
    };
  },
  created() {
    this.tabIndex();
    this.fetch();
  },

  methods: {
    getFloat,

    change(name, title) {
      this.currPage = 1;
      this.list = [];
      this.loading = true;
      this.fetch();
    },

    //上拉加载
    onLoad() {
      if (this.pageSize * this.currPage > this.list.length) {
        this.finished = true;
      } else {
        this.currPage++;
        this.fetch((data) => {
          if (data.list.length < this.pageSize) this.finished = true;
        });
        this.loading = true;
      }
    },

    async fetch(callBack) {
      try {
        const [err, data, msg] = await searchUserSubscribeOrderList({
          pageSize: this.pageSize,
          currPage: this.currPage,
          statusArray: this.active,
        });
        if (!err) {
          this.loading = false;
          callBack && callBack(data);
          this.list.push(...data.list);
        }
      } catch (error) {}
    },

    tabIndex() {
      const tabIndex = parseInt(getQueryVariable('index')) || '';
      this.active = tabIndex;
    },

    kefuModal() {
      this.$dialog.alert({
        title: '咨询商品问题,请添加客服QQ(2045879978)',
        confirmButtonColor: '#1a61dc',
      });
    },

    async _pay(orderId) {
      try {
        if (getChannel() == 'WECHAT' || getChannel() == 'PLAT3_WECHAT') {
          //wx公众号支付
          const [err, data, msg] = await pay({ orderId });
          if (!err) {
            this.getList(orderId);
            this.wxpay(data);
          } else this.$toast.fail(msg);
        } else if (getChannel() == 'PLAT3') {
          //H5支付
          this.shilu(orderId);
        }
      } catch (error) {}
    },

    //wx-h5--支付
    async shilu(orderId) {
      try {
        const [err, data, msg] = await shiluPay({ orderId });
        if (!err) {
          debugger;
          //这里唤起了H5支付 通过form的action
          this.payUrl = data.payUrl;
          this.orderinfo = data.orderInfo;
          this.$toast.loading();
          this.$refs.formRef;
        } else this.$toast.fail(msg);
      } catch (error) {}
    },

    wxpay({ appId, timestamp, nonceStr, signType, paySign, orderdetail }) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId, //公众号名称，由商户传入
          timeStamp: timestamp, //时间戳，自1970年以来的秒数
          nonceStr, //随机串
          package: orderdetail,
          signType, //微信签名方式：
          paySign, //微信签名
        },
        (res) => {
          if (res.err_msg == 'get_brand_wcpay_request:cancel') {
            clearTimeout(this.timer);
          }
        }
      );
    },

    async getList(orderId) {
      try {
        const [err, data, msg] = await getOrderByOrderId({ orderId });
        if (!err) {
          if (data.payStatus === 1) {
            clearTimeout(this.timer);
            this.currPage = 1;
            this.list = [];
            this.fetch();
            this.$toast.success('支付成功');
            if (
              data.productTypeCode === this.PRODUCT_TYPE_1 ||
              data.productTypeCode === this.PRODUCT_TYPE_2 ||
              data.productTypeCode === this.PRODUCT_TYPE_3
            ) {
              window.location.href = `/creditResult.html#/?orderId=${orderId}`;
            }
          } else this.timer = setTimeout(() => this.getList(orderId), 1000);
        } else this.$toast.fail(msg);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
