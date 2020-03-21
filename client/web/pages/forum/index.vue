<template>
  <v-row>
    <v-col :cols="12" :md="12">
      <v-card class="ma-2">
        <v-row justify="end" v-if="$auth.loggedIn">
        <h-add-problem :visible.sync="addProblemDialog">
          <v-btn class="mr-1" color="primary" @click="addProblemDialog = true">发布问题</v-btn>
        </h-add-problem>
        <v-btn class="mr-3" color="warning">我的关注</v-btn>
      </v-row>
        <v-row>
          <v-col :cols="12" v-for="i in forum" :key="i.id" class="pa-6">
            <v-card :to="`/forum/${i.id}`">
              <v-card-title class="headline">
                {{i.body}}
                <v-chip color="primary" class="ml-1">
                  <v-avatar>
                    <img :src="i.author.avatar.url" />
                  </v-avatar>
                  {{i.author.nickName}}
                </v-chip>
              </v-card-title>
              <v-card-text>
                <div
                  v-for="item in i.answer"
                  :key="item.id"
                  v-html="item.content"
                  class="h-content"
                ></div>
              </v-card-text>
              <v-card-subtitle>
                发布于: {{i.createdAt}}
                <template v-if="i.topic">
                  <v-chip v-for="tag in i.topic.split(';')" :key="tag">{{tag}}</v-chip>
                </template>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col :cols="2"></v-col>
  </v-row>
</template>
<script>
import hAddProblem from "../../components/addProblem";
export default {
  data() {
    return {
      item: 0,
      addProblemDialog: false
    };
  },
  methods: {},
  async asyncData({ $axios }) {
    return {
      forum: await $axios.$get("problem")
    };
  },
  mounted() {
    this.$socket.emit("events", "hello");
  },
  sockets: {},
  components: {
    hAddProblem
  },
  computed: {}
};
</script>
