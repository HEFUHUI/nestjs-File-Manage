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
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title>
        计算机网络协会
        <!-- <img height="40px" src="https://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/node/3225a568d6b74f82488573af4ede0e6d" alt=""> -->
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer width="350" v-model="rightDrawer" right temporary fixed>
      <v-list v-if="!this.$store.state.auth.loggedIn">
        <v-btn :to="'/login'" block text>登录\注册</v-btn>
      </v-list>
      <div v-else>
        <v-row align="center" class="pa-4" justify="center">
          <v-avatar size="100" color="red">
            <img :src="/(http|https)/.test($auth.user.avatar.url) ? $auth.user.avatar.url : 'http://'+$auth.user.avatar.url" alt="alt" />
          </v-avatar>
        </v-row>
        <v-row justify="center">
          <div>
            <v-col :cols="12">
              <v-row justify="center">
                <h3>{{$auth.user.nickName}}</h3>
              </v-row>
              <v-row justify="center">
                <h4>{{$auth.user.email}}</h4>
              </v-row>
            </v-col>
          </div>
        </v-row>
        <v-divider></v-divider>
        <v-col>
          <v-row>
            <v-list two-line subheader>
              <v-subheader>账户信息</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>兴趣爱好</v-list-item-title>
                  <v-list-item-subtitle v-text="$auth.user.like"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>座右铭</v-list-item-title>
                  <v-list-item-subtitle v-text="$auth.user.motto"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-row>
        </v-col>
        <v-row justify="center" :cols="12">
            <v-btn text color="warning">编辑</v-btn>
            <v-btn text color="success">个人信息</v-btn>
            <v-btn text color="red" @click="logout">退出登录</v-btn>
        </v-row>
      </div>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/"
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js"
    };
  },
  methods: {
    logout() {
      this.$auth.logout();
    }
  }
};
</script>
