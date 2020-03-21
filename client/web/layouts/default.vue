<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant" class="d-none d-sm-flex">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped" class="d-none d-sm-flex">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click="$router.push('/')" class="d-none d-sm-flex">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer />
      <v-btn fab @click.stop="rightDrawer = !rightDrawer" v-if="$auth.loggedIn">
        <v-avatar>
          <img :src="$auth.user.avatar.url" />
        </v-avatar>
      </v-btn>
      <v-btn v-else icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <nuxt />
      <FloatingActionButton></FloatingActionButton>
    </v-content>
    <v-navigation-drawer width="350" v-model="rightDrawer" right temporary fixed>
      <v-list v-if="!$auth.loggedIn">
        <h-login></h-login>
      </v-list>
      <div v-else>
        <h-account-center :id="$auth.user.id" :self="true"></h-account-center>
        <v-row justify="center" :cols="12">
          <v-btn text color="warning" @click="editDialog = true">编辑</v-btn>
          <v-btn text color="success" v-if="$auth.user.info">我的社团</v-btn>
          <v-btn color="success" v-else text>加入社团</v-btn>
          <v-btn text color="red" @click="logout">退出登录</v-btn>
        </v-row>
      </div>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <v-dialog
      v-model="editDialog"
      persistent
      :overlay="false"
      max-width="800px"
      transition="slide-y-transition"
    >
      <v-card>
        <v-card-title primary-title>编辑我的账户信息</v-card-title>
        <v-card-subtitle>账号注册时间：{{$auth.loggedIn && $auth.user.createdAt}}</v-card-subtitle>
        <v-card-text>
          <v-form ref="user" lazy-validation>
            <v-text-field v-model="user.nickName" label="昵称"></v-text-field>
            <v-text-field v-model="user.motto" label="座右铭"></v-text-field>
            <v-text-field v-model="user.like" label="爱好"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" @click="editDialog = false" text>关闭</v-btn>
          <v-btn color="warning" @click="commitChange" text>提交更改</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import hAccountCenter from "../components/accountCenter";
import FloatingActionButton from "../components/FloatingActionButton";
import hLogin from "../components/login";
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      editDialog: false,
      items: [
        {
          icon: "mdi-apps",
          title: "首页",
          to: "/"
        },
        {
          icon: "mdi-chart-bubble",
          title: "论坛",
          to: "/forum"
        },
        {
          icon: "mdi-file",
          title: "文件下载",
          to: "/files"
        }
      ],
      miniVariant: false,
      right: true,
      user: {
        nickName: "",
        motto: "",
        like: ""
      },
      rightDrawer: false,
      title: "计算机网络协会",
      valid: true
    };
  },
  watch: {
    editDialog(val) {
      if (val) {
        Object.assign(this.user, this.$auth.user); //拷贝一份用户信息到本组件
      }
    }
  },
  components: {
    FloatingActionButton,
    hLogin,
    hAccountCenter
  },
  sockets: {
    connect() {
      console.log("连接成功");
    }
  },
  mounted() {},
  methods: {
    async commitChange() {
      await this.$axios.put("changeUser", {
        nickName: this.user.nickName,
        motto: this.user.motto,
        like: this.user.like
      });
      this.editDialog = false;
    },
    logout() {
      this.$auth.logout();
    }
  }
};
</script>
