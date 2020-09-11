<!--
 * @Date: 2020-09-08 11:06:11
 * @LastEditTime: 2020-09-11 20:09:35
-->
<template>
  <div id="ehb" class="ehb">
    <div class="ehb-bannar">
      <van-swipe class="my-swipe" :autoplay="3000">
        <van-swipe-item v-for="item in bannarList" :key="item.index">
          <img :src="item.imgUrl" @click="toUrl(item.linkUrl)" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="ehb-content">
      <div class="ehb-content--check">
        <van-dropdown-menu>
          <van-dropdown-item title="行业" ref="item">
            <van-divider class="divider" />
            <van-button
              type="default"
              class="ehb-btn--clear"
              @click="clearTrade"
              >重置</van-button
            >
          </van-dropdown-item>
          <van-dropdown-item title="品牌" ref="item">
            <van-divider class="divider" />
            <van-button
              type="default"
              class="ehb-btn--clear"
              @click="clearBrand"
              >重置</van-button
            ></van-dropdown-item
          >
        </van-dropdown-menu>
      </div>

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="- 没有更多了 -"
        @load="onLoad"
      >
        <van-cell
          class="ehb-content--shop"
          v-for="item in list"
          @click="toItem(item.bizType, item.brandCode)"
          :key="item.code"
        >
          <img :src="'/file' + item.iconUrl" />
          <div class="ehb-content--shop-name">{{ item.name }}</div>
          <div>
            <span class="ehb-content--shop-price"
              >￥<b>{{ item.price / TRANSTEMP }}</b></span
            >
            <span class="ehb-content--shop-facePrice"
              >￥{{ item.facePrice / TRANSTEMP }}</span
            >
          </div>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>
<script>
import { getShopList, getBannerList, getShopTags } from '@/services/app';
import { TRANSTEMP } from '@/const';

export default {
  name: 'ehb',
  data() {
    return {
      pageSize: 10,
      currPage: 1,

      list: [],
      bannarList: [],
      tagsList: [],

      loading: false,
      finished: false,

      TRANSTEMP,
    };
  },
  created() {
    this.init();
    this.initTags();
    this.initBannerList();
  },
  methods: {
    init: async function(callBack) {
      try {
        const [err, data, msg] = await getShopList({
          pageSize: this.pageSize,
          currPage: this.currPage,
          categoryCode: this.categoryCode || undefined,
          brandCode: this.brandCode || undefined,
        });
        if (!err) {
          this.loading = false;
          callBack && callBack(data);
          this.list.push(...data.list);
        } else Toast(msg);
      } catch (error) {}
    },

    initBannerList: async function() {
      try {
        const [err, data, msg] = await getBannerList();
        if (!err) this.bannarList = data.list;
        else Toast(msg);
      } catch (error) {}
    },

    initTags: async function() {
      try {
        const [err, data, msg] = await getShopTags();
        if (!err) this.tagsList = data;
        else Toast(msg);
      } catch (error) {}
    },

    //上拉加载
    onLoad: function() {
      this.currPage += 1;
      this.loading = true;
      this.init((data) => {
        if (data.list.length < this.pageSize) this.finished = true;
      });
    },
    //跳转
    toItem: function(bizType, brandCode) {
      window.location.href =
        bizType === 2
          ? `/credit.html#/?brandCode=${brandCode}`
          : `/card.html#/?brandCode=${brandCode}`;
    },
    //banner跳转
    toUrl: function(linkUrl) {
      window.location.href = linkUrl;
    },
  },
};
</script>
