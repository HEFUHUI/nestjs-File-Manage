<template>
    <span>
    <el-dialog title="文件上传" :destroy-on-close="true" :show-close="false" :close-on-click-modal="false" :append-to-body="true"	:visible.sync="visible" width="40%">
    <el-switch v-model="mode" active-text="输入URL" inactive-text="上传"></el-switch>
    <el-row :gutter="20" v-if="!mode" style="text-align:center">
      <el-col :span="24">
        <el-upload
          style="margin:20px"
          class="upload-demo"
          ref="upload"
          drag
          :headers="{'Authorization':$store.getters.token}"
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
    <el-row v-if="mode">
      <el-col :span="24" style="padding:10px;padding-top:20px">
        <el-form :inline="true">
          <el-form-item label="手动输入URL">
            <el-input v-model="value">
              <template slot="prepend">Http://</template>
            </el-input>
          </el-form-item>
          <el-button type="primary">确定</el-button>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button @click="$emit('update:visible',false)">取 消</el-button>
      <el-button type="primary" @click="enter">确 定</el-button>
    </span>
  </el-dialog>
  <slot name="active"></slot>
  </span>
</template>
<script>
export default {
  props: ["api","value","visible"],
  data() {
    return {
      mode: false,
    };
  },
  methods: {
    error(err) {
      this.$message({ type: "error", message: err.message });
    },
    success(response) {
      this.$message({type:'success',message:"上传成功"})
      if(this.api == "upload-local"){
        this.$store.commit("upload",response)
      }
      this.$emit("success",response)
      this.$emit("input",response.url);
    },
    async enter() {
      if (this.mode) {
        this.$message({type:'success',message:"上传成功"})
        let url = this.value.split("\\")
        this.$store.commit("upload",{
          size:0,
          fieldname:"null",
          originalname:url[url.length-1],
          mimetype:"null"
        })
        this.$emit("input", this.value);
        this.$emit("success",{url:this.value});
      }else{
        await this.$refs.upload.submit();
      }
      this.$emit('update:visible', false)
    }
  },
  created(){
    console.log(this.value);
    this.$emit("input", '');
  }
};
</script>
<style scoped>
</style>