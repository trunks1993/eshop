<!--
 * @Date: 2020-09-08 11:06:11
 * @LastEditTime: 2020-09-22 11:25:38
-->
<template>
  <div class="redirect" v-show="!loading">
    <div class="redirect-img">
      <img :src="unPay" />
    </div>
    <div class="redirect-title">支付失败!</div>
    <div class="redirect-content">支付失败遇到问题,请尝试重新支付</div>
  </div>
</template>
<script>
import { getPayStatus } from '@/services/app';
import { PRODUCT_TYPE_1, PRODUCT_TYPE_2, PRODUCT_TYPE_3 } from '@/const';
import unPay from '@/assets/images/unPay.png';
import { getQueryVariable } from '@/utils';
import empty from '@/assets/images/empty.png';

export default {
  name: 'redirect',
  data() {
    return {
      unPay,
      loading: true,
      timer: null,
      PRODUCT_TYPE_1,
      PRODUCT_TYPE_2,
      PRODUCT_TYPE_3,
    };
  },
  created() {
    this.loadingModal();
    this.fetch(getQueryVariable('orderId'));
  },

  methods: {
    async fetch(orderId) {
      try {
        const [err, data, msg] = await getPayStatus({ orderId });
        if (!err) {
          if (data.payStatus == 'success') {
            clearTimeout(this.timer);

            this.$toast.clear();
            this.$toast.success('支付成功');

            if (
              data.productTypeCode === this.PRODUCT_TYPE_1 ||
              data.productTypeCode === this.PRODUCT_TYPE_2 ||
              data.productTypeCode === this.PRODUCT_TYPE_3
            ) {
              window.location.href = `/creditResult.html#/?orderId=${orderId}`; //当支付成功后  兑换码 卡密 短链接跳转到提取页
            } else window.location.href = `/order.html#/`; //当支付成功后  直充跳转到订单页
          } else if (data.payStatus == 'failed') {
            this.loading = false;
            this.$toast.clear();
            clearTimeout(this.timer);
          } else this.timer = setTimeout(() => this.fetch(orderId), 1000); //为查询到支付状态  继续查询
        } else this.$toast.fail(msg);
      } catch (error) {}
    },

    loadingModal() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
      });
    },
  },
};
</script>
