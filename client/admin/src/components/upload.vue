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
        <el-alert title="务必确定资源长时间可用!"  type="warning"></el-alert>
        <br>
        <el-form :inline="true">
          <el-form-item label="手动输入URL">
            <el-input v-model="value" placeholder="输入图片地址http://"></el-input>
          </el-form-item>
          <el-form-item label="别名">
            <el-input v-model="alias" placeholder="输入别名"></el-input>
          </el-form-item>
        </el-form>
        <el-image :src="value" :preview-src-list="[value]" alt=""  style="width:200px;height:100px;border-radius:10px" fit="cover"></el-image>
        <span>示例</span>
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
      alias:"",
      mode: false,
    };
  },
  methods: {
    error(err) {
      this.$message({ type: "error", message: err.message });
    },
    success(response) {
      this.alert_success("上传成功");
      if(this.api == "upload-local"){
        this.$store.commit("upload",response)
      }
      this.$emit("success",response)
      this.$emit("input",response.url);
      this.$emit('update:visible', false)
    },

    async enter() {
      if (this.mode) {
        this.alert_success("上传成功")
        this.$store.commit("upload",{
          size:0,
          fieldname:"null",
          originalname:'undefined',
          mimetype:"null"
        });
        this.$axios.post('images',{
          author:this.$store.getters.userInfo.id,
          url:this.value,
          alias:this.alias
        })
        this.$emit("input", this.value);
        this.$emit("success",{url:this.value});
        this.$emit('update:visible', false)
      }else{
        await this.$refs.upload.submit();
      }
      
    }
  },
  created(){
    this.$emit("input", '');
  }
};
</script>
<style scoped>
</style>