<template>
  <div>
    <v-btn text class="ma-2" @click="$router.go(-1)" v-if="!self">
      <v-icon>mdi-arrow-left-thick</v-icon>返回
    </v-btn>
    <v-row align="center" class="pa-4" justify="center">
      <div>
        <h-select-image v-model="avatar" :visible.sync="imageSelectDialog" v-if="self">
          <v-btn color="success" fab x-large slot="active" @click="imageSelectDialog = true">
            <v-avatar size="100" color="red">
              <img :src="user.avatar && user.avatar.url" />
            </v-avatar>
          </v-btn>
        </h-select-image>
        <v-avatar size="100" color="red" v-else>
          <img :src="user.avatar && user.avatar.url" />
        </v-avatar>
      </div>
    </v-row>
    <v-row justify="center">
      <div>
        <v-col :cols="12">
          <v-row justify="center">
            <h3>{{user.nickName}}</h3>
          </v-row>
          <v-row justify="center">
            <h4>{{user.email}}</h4>
          </v-row>
        </v-col>
      </div>
    </v-row>
    <v-divider></v-divider>
    <v-list two-line subheader>
      <v-subheader>账户信息</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>兴趣爱好</v-list-item-title>
          <v-list-item-subtitle v-text="user.like ? user.like : '无'"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>座右铭</v-list-item-title>
          <v-list-item-subtitle v-text="user.motto ? user.motto : '无'"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{!self ? 'TA' : '我'}}的收藏夹</v-list-item-title>
            <v-expansion-panels accordion>
              <v-expansion-panel>
                <v-expansion-panel-header>点击展开</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col v-for="item in user.collection" :key="item.id">
                      <v-card max-width="400">
                        <v-list-item :to="`/files/${item.id}`">
                          <v-list-item-content>
                            <v-list-item-title class="headline mb-1">{{item.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
                            <v-list-item-subtitle>大小:{{item.size}}</v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-avatar tile size="80">
                            <img :src="item.icon" />
                          </v-list-item-avatar>
                        </v-list-item>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/">
        <v-list-item-content>
          <v-list-item-title>TA的关注</v-list-item-title>
          <v-list-item-subtitle v-text="user.motto ? user.motto : '无'"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
import hSelectImage from "../components/select_image";
export default {
  props: ["id", "self"],
  data() {
    return {
      avatar: {},
      user: {
        cover: {},
        avatar: {}
      },
      imageSelectDialog: false
    };
  },
  watch: {
    async avatar(newVal) {
      await this.$axios.put("changeUser_avatar", newVal);
    }
  },
  methods: {},
  async mounted() {
    if (this.$auth.loggedIn && this.id === this.$auth.user.id) {
      this.user = this.$auth.user;
    } else {
      this.user = await this.$axios.$get(`get_user_info/${this.id}`);
    }
  },
  components: {
    hSelectImage
  },
  created() {}
};
</script>
<style>
</style>