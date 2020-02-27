<template>
  <div>
    <el-row type="flex" style="margin:10px">
      <el-col>
        <el-page-header @back="$router.go(-1)" style="line-height:60px" :content="`图片`"></el-page-header>
      </el-col>
      <el-col style="text-align:right">
        <el-tooltip class="item" content="刷新" placement="top">
          <el-button type="info" icon="el-icon-refresh-right" @click="fetch">刷新</el-button>
        </el-tooltip>
        <el-button size="lagar" type="success" @click="uploadDialog = true;">
          <i class="el-icon-upload"></i>上传图片
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="2" v-for="(item,index) in images" :key="index" class="img-item" style="margin:10px 5px">
        <el-popover placement="top-start" title="属性" width="300" trigger="hover">
          <el-image class="image" slot="reference" :preview-src-list="srcList" :src="/^[http|https]:\/\//.test(item.url) ? item.url : 'http://'+item.url" fit="contain"></el-image>图片地址:
          <a :href="/^[http|https]:\/\//.test(item.url) ? item.url : 'http://'+item.url" target="_bink">{{item.url}}</a>
          <div style="text-align: left; margin: 0">
            <p>图片别名:{{item.alias||"无"}}</p>
            <p>上传时间:{{item.createdAt|date}}</p>
            <p>上传:{{item.author ? item.author.name :"无"}}</p>
          </div>
          <el-button  size="mini" type="danger" @click="del(item.id)">删除</el-button>
          <el-popover placement="bottom" title="输入别名" width="200" trigger="click">
            <el-button slot="reference" size="mini" type="warning">编辑</el-button>
            <el-input v-model="alias" placeholder="输入别名"></el-input>
            <div style="text-align: left; margin: 0">
                <el-button type="warning" size="mini" @click="edit(item.id)">确定</el-button>
            </div>
          </el-popover>
        </el-popover>
        <span>{{item.alias && item.alias.substring(0,5)+(item.alias.length > 5 ? '...' :'')||"图片"+(index+1)}}</span>
      </el-col>
    </el-row>
    <h-upload :visible.sync="uploadDialog" api="upload-local" @on-success="upload_result" drag >
      <span slot="tip">只能上传图片</span>
    </h-upload>
  </div>
</template>
<script>
import hUpload from "../components/upload"
export default {
  data() {
    return {
      alias: "",
      images: [],
      uploadDialog:false,
      srcList:[]
    };
  },
  components:{
    hUpload
  },
  created() {
    this.fetch();
  },
  methods: {
    upload_result(url){
      this.$axios.post("images",{url}).then(res=>{
        console.log(res);
      })
    },
    async edit(id){
        await this.$axios.put(`images/${id}`,{alias:this.alias});
        this.fetch();
    },
    async del(id){
      this.$confirm("确定删除？").then(async ()=>{
        await this.$axios.delete(`images/${id}`)
        this.fetch();
      },()=>{
        this.$message("已取消");
      })
    },
    async info(id) {
      this.current_img = (await this.$axios.get(`images/${id}`)).data;
    },
    async fetch() {
      this.images = (await this.$axios.get("images")).data;
      this.images.forEach(element => {
        this.srcList.push(/^[http|https]:\/\//.test(element.url) ? element.url : 'http://'+element.url);
      });
    }
  }
};
</script>
<style scoped>
.image {
  width: 100%;
  height: 80px;
  border-radius: 3px;
  border: 5px outset #409eff;
}
.img-item {
  text-align: center;
}
</style>