<template>
  <v-card max-width="600px" min-width="500px">
    <v-card-title primary-title>账号注册</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
        <v-text-field name="name" label="验证码" v-model="vCode">
          <v-btn
            color="success"
            text
            slot="append"
            :disabled="disvCodeBtn"
            @click="sendvCode"
          >{{disvCodeBtn ? "等待"+disvCodeBtnNum : "获取验证码"}}</v-btn>
        </v-text-field>
        <v-text-field
          type="password"
          name="password"
          :rules="passwordRules"
          label="密码"
          v-model="password"
        ></v-text-field>
        <v-btn color="primary" block  @click="submit">注册</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    valid: true,
    email: "",
    password: "",
    disvCodeBtn: false,
    disvCodeBtnNum: 60,
    vCode: "",
    emailRules: [
      v => !!v || "邮箱是必填的",
      v => /.+@.+\..+/.test(v) || "邮箱格式错误!"
    ],
    vCodeRules:[v => !!v || "请获取验证码",],
    passwordRules: [v => v.length >= 6 || "密码长度不低于6位"]
  }),

  methods: {
    async sendvCode() {
      await this.$axios.get(`auth/vcode?email=${this.email}`).catch(err=>{
        console.log(err);
      })
      this.disvCodeBtn = true;
      const timeout = setInterval(() => {
        this.disvCodeBtnNum--;
        if (this.disvCodeBtnNum < 1) {
          this.disvCodeBtn = false;
          this.disvCodeBtnNum = 60;
          clearInterval(timeout);
        }
      }, 1000);
      alert("验证码已发出，请查收")
    },
    async submit() {
      if(!this.$refs.form.validate())return 
      try {
        await this.$axios.post("auth/register",{vCode:this.vCode,email:this.email,password:this.password});
        alert(`注册成功，欢迎来到计网${this.email}`)
      } catch (err) {
        alert(err.message)
      }
      
    }
  }
};
</script>