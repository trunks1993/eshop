<!--
 * @Date: 2020-09-08 11:06:11
 * @LastEditTime: 2020-09-08 16:22:54
-->
<template>
  <div id="app">{{ name }}</div>
</template>
<script>

import { getList } from "./services/app";
export default {
  name: "app",
  components: {
    // RedPacket
  },
  data() {
    return {
      name: "123",
    };
  },
  created() {
    this.init();
  },
  methods: {
    init: async () => {
      try {
        const [err, data, msg] = await getList();
      } catch (error) {}
    },
  },
};
</script>
