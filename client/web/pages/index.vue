<template>
  <v-container>
    <v-row column>
      <v-col v-for="item in files.files" :key="item.id" >
        <v-card max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">发布：{{item.author.nickName}}</div>
            <v-list-item-title class="headline mb-1">{{item.name}}</v-list-item-title>
            <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
            <v-list-item-subtitle>大小：{{Math.floor(item.size/1024/1024)}} M</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar tile size="80" color="grey">
            <img :src="'http://'+(item.desc_image[0] ? item.desc_image[0].url : '')" alt="">
          </v-list-item-avatar>
        </v-list-item>
        <v-card-actions>
          <v-btn text>收藏</v-btn>
          <v-btn text>下载</v-btn>
        </v-card-actions>
      </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  async asyncData({ $axios }) {
    return {
      files: await $axios.$get("http://localhost:3001/files")
    };
  }
};
</script>
