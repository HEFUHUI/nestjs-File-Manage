<template>
  <v-container>
    <v-row>
      <v-col :cols="6" :offset="3">
        <h1 style="text-align:center">用户登录</h1>
        <v-form ref="form" lazy-validation>
          <v-text-field
            v-model="email"
            :counter="20"
            :rules="rules.email"
            label="邮箱(Email)"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            :rules="rules.password"
            label="账户密码(Password)"
            required
          ></v-text-field>
          <v-checkbox v-model="remenber" label="记住登录"></v-checkbox>
          <v-btn color="success" @click="resetValidation" block>登录</v-btn>
        </v-form>
      </v-col>
      <v-snackbar v-model="loginResult.show" top>
        {{ loginResult.text }}
        <v-btn color="indigo" text @click="loginResult.show = false">Close</v-btn>
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loginResult:{
          show:false,
          text:"登录成功"
      },
      remenber: true,
      email: "",
      password: "",
      rules: {
        email: [val => {return true}],
        password: []
      }
    };
  },
  methods: {
    async resetValidation() {
      try {
        const res = await this.$auth.loginWith("local",{data:{email:this.email,password:this.password}})
        this.loginResult.text = "登录成功!";
      } catch (error) {
        this.loginResult.text = "用户名或者密码错误!";
      }
      this.loginResult.show = true;
    }
  },
  mounted(){
    console.log(this.$store)
  }
};
</script>
