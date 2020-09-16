<!--
 * @Date: 2020-09-08 11:06:11
 * @LastEditTime: 2020-09-16 15:53:23
-->
<template>
  <div class="ehb">
    <van-swipe :autoplay="3000" :stop-propagation="false">
      <van-swipe-item
        v-for="item in bannarList"
        :key="item.index"
        @click="toUrl(item.linkUrl)"
      >
        <img :src="item.imgUrl" />
      </van-swipe-item>
    </van-swipe>
    <div :class="[{ 'ehb__filter--active': visible }, 'ehb__filter']">
      <van-dropdown-menu active-color="#ed7a00">
        <van-dropdown-item
          :title="industrySelection.name || '行业'"
          ref="item1"
          @open="change"
          @close="change"
        >
          <div class="ehb__filter-box">
            <span
              :class="[
                {
                  'ehb__filter-box-item--active':
                    item.id === industrySelection.id,
                },
                'ehb__filter-box-item',
              ]"
              v-for="item in industries"
              :key="item.id"
              @click="selectIndustry(item), $refs.item1.toggle()"
            >
              {{ item.name }}
            </span>
          </div>
          <div class="ehb__filter-footer">
            <van-button
              type="default"
              @click="
                (industrySelection = brandSelection = {}), $refs.item1.toggle()
              "
              >重置</van-button
            >
          </div>
        </van-dropdown-item>
        <van-dropdown-item
          :title="brandSelection.name || '品牌'"
          ref="item2"
          @open="change"
          @close="change"
        >
          <div class="ehb__filter-box">
            <span
              :class="[
                {
                  'ehb__filter-box-item--active': item.id === brandSelection.id,
                },
                'ehb__filter-box-item',
              ]"
              v-for="item in brandList"
              :key="item.id"
              @click="selectBrand(item), $refs.item2.toggle()"
            >
              {{ item.name }}
            </span>
          </div>
          <div class="ehb__filter-footer">
            <van-button
              type="default"
              @click="
                (industrySelection = brandSelection = {}), $refs.item2.toggle()
              "
              >重置</van-button
            >
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="- 没有更多了 -"
      @load="onLoad"
      v-show="list.length"
    >
      <van-cell v-for="item in list" @click="toItem(item)" :key="item.code">
        <div class="img-box">
          <img :src="'/file' + item.iconUrl" />
        </div>
        <div class="name">{{ item.name }}</div>
        <div class="price-box">
          <span class="fit">￥</span>
          <span class="price">{{
            (item.price / TRANSTEMP) | moneyFilter
          }}</span>
          <span class="face-price"
            >￥{{ (item.facePrice / TRANSTEMP) | moneyFilter }}</span
          >
        </div>
      </van-cell>
    </van-list>

    <div class="ehb__empty" v-show="!list.length">
      <img :src="empty" />
      <div class="ehb__empty-text">商品即将上架，敬请期待</div>
    </div>
  </div>
</template>
<script>
import {
  getProductList,
  getAdvList,
  getFilterBrand,
  getFilterIndustry,
} from '@/services/app';
import { TRANSTEMP } from '@/const';
import { getFloat } from '@/utils';

import empty from '@/assets/images/ehb-no-data.png';

export default {
  name: 'ehb',
  data() {
    return {
      loading: false,
      finished: false,
      visible: false,

      pageSize: 10,
      currPage: 1,

      industries: [],
      brandList: [],

      bannarList: [],
      list: [],

      industrySelection: {},
      brandSelection: {},

      TRANSTEMP,

      empty,
    };
  },
  created() {
    this.fetch();
    this.getFilter();
    this.getSwipeList();
  },
  watch: {
    industrySelection() {
      this.currPage = 1;
      this.list = [];
      this.fetch();
    },
    brandSelection() {
      this.currPage = 1;
      this.list = [];
      this.fetch();
    },
  },
  methods: {
    change() {
      this.visible = !this.visible;
    },
    selectIndustry(industry) {
      this.industrySelection = industry;
    },
    selectBrand(brand) {
      this.brandSelection = brand;
    },
    async fetch(callBack) {
      try {
        const [err, data, msg] = await getProductList({
          pageSize: this.pageSize,
          currPage: this.currPage,
          categoryCode: this.industrySelection.code,
          brandCode: this.brandSelection.code,
        });
        if (!err) {
          this.loading = false;
          callBack && callBack(data);
          this.list.push(...data.list);
        }
      } catch (error) {}
    },

    async getSwipeList() {
      try {
        const [err, data, msg] = await getAdvList();
        if (!err) this.bannarList = data;
      } catch (error) {}
    },

    async getFilter() {
      try {
        let [err, data, msg] = await getFilterIndustry();
        if (!err) this.industries = data;
        [err, data, msg] = await getFilterBrand();
        if (!err) this.brandList = data;
      } catch (error) {}
    },

    //上拉加载
    onLoad() {
      this.currPage++;
      this.loading = true;
      this.fetch((data) => {
        if (data.list.length < this.pageSize) this.finished = true;
      });
    },
    //跳转
    toItem({ bizType, brandCode, code }) {
      window.location.href =
        bizType === 2
          ? `/credit.html#/?brandCode=${brandCode}&goodsCode=${code}`
          : `/card.html#/?brandCode=${brandCode}&goodsCode=${code}`;
    },
    //banner跳转
    toUrl(linkUrl) {
      window.location.href = linkUrl;
    },
  },
  filters: {
    moneyFilter(value) {
      return getFloat(value, 2);
    },
  },
};
</script>
