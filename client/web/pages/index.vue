<template>
  <v-container fluid fill-height class="pa-0 ma-0 background">
    <v-row justify="center">
      <v-col :xl="6" :cols="12">
        <v-card-title primary-title>
          <h2>文件共享平台</h2>
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            :items="searchItems"
            item-text="name"
            v-model="searchText"
            placeholder="输入"
            :search-input.sync="wd"
            label="输入关键字搜索"
          >
            <v-btn color="primary" @click="search" text slot="append">
              <v-icon>mdi-magnify</v-icon>搜索
            </v-btn>
          </v-autocomplete>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      name: "index.js",
      wd: "搜索：",
      searchText: "",
      width: 1000,
      height: 1000
    };
  },
  watch: {
    wd(newVal) {
      this.searchItems[0].name = "搜索：" + newVal;
    },
    searchText(newVal) {
      if (newVal === undefined || newVal === '搜索：') return;
      console.log(newVal)
      this.$router.push(`/search/${newVal.replace(/^搜索：/, "")}`);
    }
  },
  mounted() {
    this.width = window.innerWidth;
    this.height = window.innerHeight - 100;
  },
  methods: {
    search() {
      this.$router.push(`/search/${searchText}`);
    }
  },
  async asyncData({ $axios }) {
    return {
      searchItems: [{ name: "输入" }, { name: "name" }]
    };
  },
  computed: {}
};
</script>
<style scoped>
.background {
  background: url("http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/54a4eaa1336838608839fc8276953345.jpg");
}
</style>