<template>
  <div>
    <el-dialog title="添加用户" :visible.sync="ctrl.addUserDialog" width="30%" @close="(done)=>{}">
      <el-form :model="addUser" ref="addUser">
        <el-form-item
          label="姓名"
          label-width="60px"
          prop="name"
          :rules="[{required:true,message:'此项必填'}]"
        >
          <el-input v-model="addUser.name"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          label-width="60px"
          prop="email"
          :rules="[{required:true,message:'此项必填'}]"
        >
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          label-width="60px"
          prop="password"
          :rules="[{required:true,message:'此项必填'}]"
        >
          <el-input type="password" v-model="addUser.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ctrl.addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="enterAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    ctrl: Object
  },
  data() {
    return {
      addUser: {}
    };
  },
  methods: {
    async enterAdd() {
      this.$refs.addUser.validate(async valid => {
        if (valid) {
          await this.$axios.post("users", this.addUser);
          this.ctrl.addUserDialog = false;
          this.ctrl.fetch();
        }
      });
    }
  }
};
</script>
<style>
</style>