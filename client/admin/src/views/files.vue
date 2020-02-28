<template>
  <div>
    <el-row type="flex" style="margin:10px">
      <el-col>
        <el-page-header @back="$router.go(-1)" style="line-height:60px" :content="options.title"></el-page-header>
      </el-col>
      <el-col style="text-align:right;margin-top:10px">
        <el-tooltip class="item" content="刷新" placement="top">
          <el-button type="primary" size="small" icon="el-icon-refresh-right" @click="fetch(1)">刷新</el-button>
        </el-tooltip>
        <el-button size="small" type="success" @click="addUpload = true">
          <i class="el-icon-plus"></i>添加上传
        </el-button>
        <el-button size="small" type="success" @click="addLabelDialog = true">
          <i class="el-icon-plus"></i>添加标签
        </el-button>
        <el-button size="small" type="warning" @click="addUpload = true">
          <i class="el-icon-search"></i>筛选
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <template v-for="item in labels">
          <el-tag :key="item.id" type="danger" closable @close="delLabel(item)">{{item.name}}</el-tag>
        </template>
      </el-col>
      <el-col :span="24">
        <div></div>
      </el-col>
    </el-row>
    <el-pagination
      style="padding:10px;text-align:right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :background="true"
      :page-sizes="[5,10,15,20,25]"
      :page-size="pagination.page_size"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      :total="pagination.total"
    ></el-pagination>
    <el-dialog title="添加文件" :visible.sync="addUpload" width="50%">
      <el-form :model="file" ref="upload" label-width="100px">
        <el-form-item label="上传文件">
          <h-upload v-if="!file.url" api="upload-local" :visible.sync="uploadDialog" v-model="file.url">
            <el-button type="primary" @click="uploadDialog = true" slot="active">上传</el-button>
          </h-upload>
          <el-tag type="success" @close="file.url = ''" closable v-if="file.url">{{file.url}}</el-tag>
        </el-form-item>
        <el-form-item label="选择标签">
          <el-select multiple v-model="file.label" placeholder="选择标签">
            <el-option v-for="item in labels"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="示意截图">   
          <h-image-select v-if="!file.desc_image[0]" :visible.sync="imageSelectDialog" v-model="file.desc_image">
            <el-button type="primary" @click="imageSelectDialog = true" slot="active">选择</el-button>
          </h-image-select> 
          <div v-else>
            <el-tag effect="dark" type="primary" v-for="image in file.desc_image" :key="image" closable>
              {{image}}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="输入文件描述(说明)信息"
            v-model="file.description">
          </el-input>
        </el-form-item>  
        <el-form-item label="下载权限">
          <el-switch v-model="file.share" active-text="公开下载" inactive-text="不公开">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addUpload = false">取 消</el-button>
        <el-button type="primary" @click="add(file)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialog" size="50%">
      <ele-form
        :formData="file"
        :isShowBackBtn="false"
        :formDesc="options.columns"
        :request-fn="edit"
      ></ele-form>
    </el-dialog>
    <el-dialog
      title="添加标签"
      :visible.sync="addLabelDialog"
      width="30%">
      <el-input v-model="label.name" placeholder="输入标签名称"></el-input>
      <span slot="footer">
        <el-button @click="addLabelDialog = false">取 消</el-button>
        <el-button type="primary" @click="addLabel">确 定</el-button>
      </span>
    </el-dialog>
    
    <el-dialog title="选项" :visible.sync="optionsDialog" width="50%">
      <span slot="footer">
        <el-button @click="optionsDialog = false">取 消</el-button>
        <el-button type="primary" @click="optionsDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import hUpload from "../components/upload"
import hImageSelect from "../components/select_image"
export default {
  data() {
    return {
      pagination: {
        currentPage: 1,
        total: 7,
        page_size: 10
      },
      addLabelDialog:false,
      optionsDialog: false,
      editDialog: false,
      addUpload: false,
      uploadDialog:false,
      label:{
        name:""
      },
      labels:[],
      imageSelectDialog:false,
      file: {
        desc_image:[]
      },
      source: [],
      options: { tieOptions: [], columns: {}, title: "" },
      sort: [{ rule: true, fields: "motto" }]
    };
  },
  watch: {
    dateRange(val) {
      this.fetch(1, val);
    }
  },
  components: {
    hUpload,
    hImageSelect
  },
  methods: {
    async filters(value, row, column) {
      console.log(value, row, column);
    },
    async upload_success(response){
      this.file.url = response.url
      this.uploadDialog = false
    },
    async handleCommand() {
      this.optionsDialog = true;
    },
    async delLabel(label){
      await this.$confirm(`确定删除标签${label.name}?`)
      await this.$axios.delete(`labels/${label.id}`)
      this.fetch();
      this.$message({type:"success",message:"删除成功."})
    },
    addLabel(){
      this.$axios.post("labels",this.label).then(()=>{
        this.$message({type:"success",message:"添加成功"})
      })
      this.addLabelDialog = false;
      this.fetch();
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetch(page);
    },
    async handleSizeChange(size) {
      this.pagination.page_size = size;
      this.fetch(this.pagination.currentPage);
    },
    async disable({email,id}){
      this.$confirm(`确定要禁用${email}的登录吗？`).then(()=>{
        this.$axios.put(`files/${id}`,{state:"disabled"}).then(()=>{
          this.$message({type:"success",message:`${email}已被禁用`})
          this.fetch();
        })
      })
    },
    async enable({id}){
      this.$axios.put(`files/${id}`,{state:"enabled"}).then(()=>{
        this.$message("账户已启用");
        this.fetch();
      })
    },
    async add({url,share,description,desc_image,label}) {
      share = share ? "public" : "private"
      let author = this.$store.getters.userInfo.id;
      let {mimetype:type,originalname:name,size} = this.$store.getters.JustUploadFile
      this.$axios.post(`files`, {
        name,url,share,desc_image,description,label,author,size,type
      }).then(
        () => {
          this.$message({ type: "success", message: "添加成功." });
          this.addUpload = false;
          this.fetch();
        },
        () => {
          this.$message({ type: "warning", message: "数据格式不合法." });
        }
      );
    },

    async del({ email, id }) {
      this.$confirm(`确定删除${email}的信息吗?`).then(async () => {
        await this.$axios.delete(`files/${id}`);
        this.fetch();
      });
    },

    async edit({ nickName, email, like, motto, id, password }) {
      this.$axios
        .put(`files/${id}`, { like, motto, email, nickName, password })
        .then(
          () => {
            this.$message({ type: "success", message: "保存成功" });
          },
          () => {
            this.$message({ type: "warning", message: "数据格式不合法" });
          }
        );
      this.editDialog = false;
    },

    async fetch(page = 1) {
      let sortStr = "";
      this.sort.forEach(element => {
        sortStr += "&" + element.fields + "," + (element.rule ? "DESC" : "ASC");
      });
      console.log(sortStr); 
      this.options = (await this.$axios.get(`files/options`)).data;
      this.labels = (await this.$axios.get("labels")).data
      this.source = (
        await this.$axios.get(
          `files?limit=${this.pagination.page_size}&page=${page}`
        )
      ).data;
      this.pagination.total = this.source.total;
    }
  },
  computed: {
    columns() {
      const obj = { ...this.options.columns };
      for (let i in obj) {
        if (obj[i].listShow === false) {
          delete obj[i];
        }
      }
      return obj;
    }
  },
  created() {
    this.fetch(1);
  }
};
</script>
<style>
.drawer {
  padding: 20px;
}
.addButton {
  margin: 10px;
}
.block {
  margin-top: 10px;
  text-align: right;
}

.el-table .success-row {
  background: #f0f9eb;
  color: #000;
}
</style>
