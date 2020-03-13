<template>
  <v-container>
    <h1>用户登录</h1>
    <br>
    <v-form ref="form" lazy-validation v-if="!$auth.loggedIn">
      <v-text-field v-model="email" :rules="rules.email" label="邮箱(Email)"></v-text-field>
      <v-text-field
        v-model="password"
        type="password"
        :rules="rules.password"
        label="账户密码(Password)"
      ></v-text-field>
      <v-row justify="end">
        <h4 class="pa-3" right>
          还没有账号？点击
          <nuxt-link to="/register">注册</nuxt-link>
        </h4>
      </v-row>
      <v-btn color="success" @click="resetValidation" block>登录</v-btn>
    </v-form>
    <v-row v-else justify="center" align="center">
        <v-alert type="success" :value="true">
            已登录成功 <nuxt-link to="/">返回首页</nuxt-link>
        </v-alert>
    </v-row>
    <v-snackbar v-model="loginResult.show" top>
      {{ loginResult.text }}
      <v-btn color="indigo" text @click="loginResult.show = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loginResult: {
        show: false,
        text: "登录成功"
      },
      remenber: true,
      email: "",
      password: "",
      rules: {
        email: [
          val => {
            return true;
          }
        ],
        password: []
      }
    };
  },
  methods: {
    async resetValidation() {
      try {
        const res = await this.$auth.loginWith("local", {
          data: { email: this.email, password: this.password }
        });
        this.loginResult.text = "登录成功!";
      } catch (error) {
        this.loginResult.text = "用户名或者密码错误!";
      }
      this.loginResult.show = true;
    }
  },
  mounted() {
    
  }
};
</script>
