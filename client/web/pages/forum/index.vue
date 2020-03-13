<template>
  <v-container>
    <v-row justify="end">
      <v-btn class="mr-1" color="info" @click="addProblemDialog = true">发布问题</v-btn>
      <v-btn class="mr-3" color="red accent-4">我关注的问题</v-btn>
    </v-row>
    <v-row>
      <v-col :lg="6" :cols="12" v-for="i in forum" :key="i.id">
        <v-card dark>
          <v-card-title class="headline">
            {{i.body}}
            <v-chip color="primary" class="ml-1">
              <v-avatar>
                <img
                  :src="/^(http|https)/.test(i.author.avatar.url) ? i.author.avatar.url : 'http://'+i.author.avatar.url"
                  alt
                />
              </v-avatar>
              {{i.author.nickName}}
            </v-chip>
          </v-card-title>
          <v-card-subtitle>发布于: {{new Date(i.createdAt).toLocaleString()}}
          </v-card-subtitle>
          <v-card-actions>
            <v-btn text color="success">关注问题</v-btn>
            <v-btn text color="info">查看问题详情</v-btn>
            <v-btn text color="red" v-if="i.author.id === $auth.user.id" @click="delProblem(i.id)">删除此问题</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="addProblemDialog" scrollable :overlay="false" max-width="500px">
      <v-card class="mx-auto">
        <v-card-title primary-title>发布问题</v-card-title>
        <v-card-text>
          <form>
            <v-textarea v-model="source.problem" action="mdi-account" label="输入你的问题"></v-textarea>
            <h-select-image multiple v-model="source.ex_img" :visible.sync="imageSelectDialog">
              <v-btn color="success" text slot="active" @click="imageSelectDialog = true">选择图片</v-btn>
            </h-select-image>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="addProblem" color="deep-purple accent-4">Enter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import hSelectImage from "../../components/select_image";
export default {
  components: {
    hSelectImage
  },
  data() {
    return {
      source: {
        problem: "",
        ex_img: []
      },
      imageSelectDialog: false,
      item: 0,
      addProblemDialog: false
    };
  },
  methods: {
    async delProblem(id){
      this.$axios.delete(`problem/${id}`);
      // window.location.reload();
    },
    async addProblem() {
      const ex_img = this.source.ex_img.map(val => val.url).join(";");
      await this.$axios.post("problem", {
        body: this.source.problem,
        ex_img
      });
      this.addProblemDialog = false;
      alert("发布成功");
    }
  },
  async asyncData({ $axios }) {
    return {
      forum: await $axios.$get("problem")
    };
  },
  computed: {}
};
</script>
