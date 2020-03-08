<template>
  <div>
    <h-page-header content="所有图片" @refresh="fetch(1)" @add="uploadDialog = true">
      <el-button type="warning" @click="yunDialog = true" icon="el-icon-partly-cloudy" slot="btn" size="mini">COS</el-button>
    </h-page-header>
    <el-row :gutter="20">
      <el-col :span="2" v-for="(item,index) in images.data" :key="index" class="img-item" style="margin:10px 5px">
        <el-popover placement="top-start" title="属性" width="300" trigger="hover">
          <el-image class="image" slot="reference" :preview-src-list="srcList" :src="item.url |url" fit="cover"></el-image>
          <p>图片地址:</p>
          <el-link :underline="false" :href="item.url | url" target="_bink">{{item.url}}</el-link>
          <el-button size="mini" @click="copy(item.url)">copy</el-button>
          <div style="text-align: left; margin: 0">
            <p>图片别名:{{item.alias||"无"}}</p>
            <p>上传时间:{{item.createdAt|date}}</p>
            <p>上传:{{item.author ? item.author.nickName+"-"+item.author.email :"无"}}</p>
          </div>
          <el-button  size="mini" type="danger" @click="del(item.id)">删除</el-button>
          <el-button type="warning" @click="editDialog = true;image = item" size="mini">编辑</el-button>
          
        </el-popover>
        <span>{{item.alias && item.alias.substring(0,5)+(item.alias.length > 5 ? '...' :'')||"图片"+(index+1)}}</span>
      </el-col>
      <input type="text" hidden value="hello" ref="copyText">
    </el-row>
    <el-pagination
      style="padding:10px;text-align:right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :background="true"
      :page-sizes="[10,20,30,40,50,100]"
      :page-size="pagination.page_size"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      :total="pagination.total"
    ></el-pagination>
    <h-upload :visible.sync="uploadDialog" api="uploads-cos" multiple @success="upload_result" drag >
      <span slot="tip">可多文件上传,仅图片上传</span>
    </h-upload>
    <el-dialog
      title="编辑"
      :visible.sync="editDialog"
      width="40%">
      <el-form :model="image" ref="image" label-width="80px">
        <el-form-item label="图片地址">
          <el-input v-model="image.url"></el-input>
        </el-form-item>
        <el-form-item label="图片别名">
          <el-input v-model="image.alias"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit(image)">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="腾讯云中的图片"
      :visible.sync="yunDialog"
      width="40%">
      <img v-for="item in cosImgs" :key="item.key" :src="'https://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com'+item.key" alt="">
      <span slot="footer">
        <el-button @click="yunDialog = false">取 消</el-button>
        <el-button type="primary" @click="yunDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import hPageHeader from "../components/page_header"
import hUpload from "../components/upload"
export default {
  data() {
    return {
      alias: "",
      pagination: {
        currentPage: 1,
        total: 7,
        page_size:50
      },
      yunDialog:false,
      image:{},
      images: [],
      uploadDialog:false,
      editDialog:false,
      srcList:[],
      cosImgs:[],
    };
  },
  components:{
    hUpload,
    hPageHeader
  },
  created() {
    this.fetch(1);
  },
  methods: {
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetch(page);
    },
    async handleSizeChange(size) {
      this.pagination.page_size = size;
      this.fetch(this.pagination.currentPage);
    },
    upload_result(){
      this.fetch(this.pagination.currentPage);
    },
    async edit({id,alias,url}){
        await this.$axios.put(`images/${id}`,{alias,url});
        this.editDialog = false;
        this.alert_success("保存成功")
        this.fetch(this.pagination.currentPage);
    },
    async del(id){
      this.$confirm("确定删除？").then(async ()=>{
        await this.$axios.delete(`images/${id}`)
        this.fetch(this.pagination.currentPage);
      })
    },
    copy(url){
      
      this.$refs.copyText.value = url;
      this.$refs.copyText.select();
      console.log(this.$refs.copyText,url);
      if(document.execCommand("copy")){
        this.alert_success("复制成功")
      }
    },
    async info(id) {
      this.current_img = (await this.$axios.get(`images/${id}`)).data;
    },
    async fetch(page=1) {
      this.images = (await this.$axios.get(`images?limit=${this.pagination.page_size}&page=${page}`)).data;
      this.cosImgs = (await this.$axios.get("images/cos")).data
      this.pagination.total = this.images.total
      this.images.data.forEach(element => {
        this.srcList.push(/^(http|https)/.test(element.url) ? element.url : 'http://'+element.url);
      });
    }
  }
};
</script>
<style scoped>
.image {
  width: 100%;
  height: 80px;
  max-height: 70px;
  border-radius: 3px;
  border: 2px outset #409eff;
}
.img-item {
  text-align: center;
}
</style>