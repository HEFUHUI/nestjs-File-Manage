<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="密码">
        <el-input type="password" v-model="password" placeholder="输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="changePassword">确认更改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    config: {
      id: {
        type: String,
        required: true
      },
      model: {
        type: String,
        required: true
      }
    }
  },
  data() {
    return {
      password: ""
    };
  },
  methods: {
    changePassword() {
      this.$confirm(`确认更改ID为${this.config.id}的密码吗？`, "警告", {
        type: "warning"
      }).then(() => {
        this.$http.put("/api/private/change_password", {
          id: this.config.id,
          password: this.password,
          model: this.config.model
        });
      });
    },
    fetch() {}
  }
};
</script>
<style lang="less">
</style>