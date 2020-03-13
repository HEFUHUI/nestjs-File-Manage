<template>
  <div class="Main">
    <el-row>
      <el-col
        :lg="{span:8,offset:8}"
        :xl="{span:6,offset:9}"
        :md="{span:12,offset:6}"
        :sm="{span:16,offset:4}"
      >
        <el-form ref="login" :model="logiForm" label-width="80px">
          <el-form-item>
            <h1>
              <i class="el-icon-user-solid"></i>
              管理员登录
            </h1>
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="email"
            :rules="[
          {required:true,message:'用户名必须填写'},
          {type:'email',message:'注意邮箱的格式'},
            ]"
          >
            <el-input v-model="logiForm.email" placeholder="输入管理员邮箱"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            :rules="[{
            required:true,message:'密码必须填写',
          }]"
          >
            <el-input v-model="logiForm.password" type="password" placeholder="输入管理员密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" type="primary" @click="login">
              <i class="el-icon-s-promotion"></i>登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      logiForm: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    loginSuccess(){
      this.$router.push("/");
      this.$message({ type: "success", message: "登录成功" });
    },
    login() {
      this.$refs.login.validate(async vaild => {
        if (vaild) {
          this.$axios
            .post("auth/login", this.logiForm)
            .then(res => {
              sessionStorage.token = res.data.token;
              this.$store.commit("token", res.data.token);
              this.loginSuccess();
            })
            .catch(err => {
              if(!/401/.test(err.message)){
                this.$message({type:'error',message:"服务器错误.请重试!"})
              }
            });
        }
      });
    }
  },
  created() {
    this.$axios.get("auth/user").then(()=>{
      this.loginSuccess();
    })
  }
};
</script>

<style>
.Main {
  color: #fff;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  /* background: radial-gradient(1300px, #fff, #409eff); */
  background: url("http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/c6e753549c2d92a561349d0ea9f68608.jpg");
  background-size: 100%;
}
.Main .el-row {
  margin-top: 170px;
}
.Main h1 {
  margin-bottom: 3.125rem;
  color: #409eff;
}
/* .el-form-item__label{
  color: #409eff !important;
} */
/* .main button {
    background: #409eff;
    width: 100%;
  } */
</style>
