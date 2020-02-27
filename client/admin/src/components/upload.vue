<template>
  <el-dialog title="文件上传" :visible.sync="visible" width="40%">
    <el-switch v-model="value1" active-text="输入URL" inactive-text="上传"></el-switch>
    <el-row :gutter="20" v-if="!value1" style="text-align:center">
      <el-col :span="24">
        <el-upload
          style="margin:20px"
          class="upload-demo"
          ref="upload"
          :on-success="success"
          :on-error="error"
          :auto-upload="false"
          :action="$axios.defaults.baseURL+'/'+api"
          v-bind="$attrs"
          :limit="1"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            <slot name="tip"></slot>
          </div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row v-if="value1">
      <el-col :span="24" style="padding:10px;padding-top:20px">
        <el-form :inline="true">
          <el-form-item label="手动输入URL">
            <el-input v-model="url">
              <template slot="prepend">Http://</template>
            </el-input>
          </el-form-item>
          <el-button type="primary">确定</el-button>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button @click="$emit('update:visible', false);">取 消</el-button>
      <el-button type="primary" @click="enter">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ["visible", "api"],
  data() {
    return {
      url: "",
      value1: false
    };
  },
  methods: {
    error(err) {
      this.$message({ type: "error", message: err.message });
    },
    success(response) {
      this.$emit("on-success", response.url);
    },
    async enter() {
      if (this.url !== "") {
        this.$emit("on-success", this.url);
      }
     await this.$refs.upload.submit();
      this.$emit('update:visible', false)
    }
  }
};
</script>
<style scoped>
</style>