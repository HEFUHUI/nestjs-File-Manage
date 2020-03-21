<template>
    <v-row :xl="1" :md="2" no-gutters>
      <v-col class="d-lg-none d-md-flex">
        <v-chip class="ma-2" color="orange" label outlined v-for="(item, i) in labels" :key="i">{{item.name}}({{item.file.length}})</v-chip>
      </v-col>
      <v-col class="d-none d-lg-flex">
        <v-list  nav dense min-width="100" max-width="120">
          <v-list-item-group v-model="item" color="primary">
            <v-list-item v-if="$auth.loggedIn">
              <v-list-item-content>
                <v-list-item-title>收藏</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- {{labels}} -->
            <v-list-item v-for="(item, i) in labels" :key="i">
              <v-list-item-content>
                <v-list-item-title v-text="item.name+`(${item.file.length})`"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col :xl="11" md="10" :cols="12" :sm="12">
        <v-row justify="center">
          <v-col v-for="item in files" :key="item.id">
            <v-card max-width="300" outlined>
              <v-list-item :to="`/files/${item.id}`">
                <v-list-item-content>
                  <v-list-item-title class="headline mb-1">{{item.name}}</v-list-item-title>
                  <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
                  <v-list-item-subtitle>大小:{{item.size}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="80">
                  <img :src="item.icon"/>
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions>
                <v-btn text link :href="item.url" target="_blink">下载</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      item: 0,
    };
  },
  methods: {
    collection({ id }) {
      this.$axios
        .put(`files/collection/${id}`)
        .then(() => {
          alert("收藏成功");
        })
        .catch(err => {
          if (/401/.test(err.message)) {
            alert("请先登录");
          } else {
            alert(err.message);
          }
        });
    }
  },
  async asyncData({ $axios }) {
    return await $axios.$get("files");
  },
  computed: {}
};
</script>
