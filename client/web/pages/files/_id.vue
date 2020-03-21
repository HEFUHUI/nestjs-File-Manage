<template>
  <v-container>
    <v-btn text class="ma-2" @click="$router.go(-1)">
      <v-icon>mdi-arrow-left-thick</v-icon>返回
    </v-btn>
    <v-card>
      <div class="d-flex justify-start">
        <div class="ma-1">
          <v-img  :src="file.icon" max-width="90" ></v-img>
        </div>
        <v-card-title class="flex-grow-1">
          <h2>{{file.name}}</h2>
        </v-card-title>
        <div class="pt-6 mr-1 ">
          <v-btn color="primary" class="ma-1" right @click="download(file.url)">
            <v-icon>mdi-download</v-icon>下载
          </v-btn>
          <v-btn color="primary" right class="ma-1" @click="download(file.url)">
            <v-icon>mdi-file-plus</v-icon>收藏
          </v-btn>
        </div>
      </div>
      <v-card-subtitle>发布时间：{{file.createdAt}} 大小：{{file.size}}</v-card-subtitle>
      <v-card-text>
        <v-carousel cycle height="400" hide-delimiter-background show-arrows-on-hover>
          <v-carousel-item v-for="slide in file.desc_image" :key="slide.id">
            <v-img :src="slide.url" aspect-ratio="2" contain></v-img>
          </v-carousel-item>
        </v-carousel>
        <v-card>
          <v-card-title>文件简介：</v-card-title>
          <v-card-text>{{file.description}}</v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  async asyncData({ $axios, route }) {
    return {
      file: await $axios.$get(`files/get_item/${route.params.id}`)
    };
  },
  methods: {
    download(url) {
      window.open(url);
    }
  }
};
</script>