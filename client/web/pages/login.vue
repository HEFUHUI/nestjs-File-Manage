<template>
  <h-login></h-login>
</template>

<script>
import hLogin from "../components/login"
export default {
  components: {
    hLogin
  },
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
    console.log(this.$store);
  }
};
</script>
