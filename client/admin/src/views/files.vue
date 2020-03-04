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
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <template v-for="item in labels">
          <el-button-group :key="item.id" style="margin:4px" >
            <el-button type="primary" size="mini">{{item.name}}({{item.file.length}})</el-button>
            <el-button type="danger" size="mini" @click="delLabel(item)">X</el-button>
          </el-button-group>
        </template>
      </el-col>
      <el-col :span="24">
        <el-table :data="source.data" border stripe>
          <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="文件名">
          </el-table-column>
          <el-table-column label="上传时间">
            <template slot-scope="{row}">
              {{row.createdAt|date}}
            </template>
          </el-table-column>
          <el-table-column label="文件大小" align="center">
            <template slot-scope="{row}">
              {{Math.floor(row.size/1024)}}
              <el-tag type="info">KB</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="文件类型">
          </el-table-column>
          <el-table-column label="描述信息">
            <template slot-scope="{row}">
              <el-popover
                :title="row.name"
                width="300"
                trigger="hover"
                :content="row.description">
                <span slot="reference">{{row.description.substring(0,20)}}...</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="公开下载?">
            <template slot-scope="{row}">
              {{row.share==="public" ? "开放" : "私有"}}
            </template>
          </el-table-column>
          <el-table-column prop="author.nickName" label="上传">
          </el-table-column>
          <el-table-column label="地址" align="center" width="320">
            <template slot-scope="{row}">
              <div v-if="row.type == 'audio/mp3' || row.type == 'audio/x-m4a'">
                <audio :src="row.url" controls></audio>
              </div>
              <div v-else-if="row.type == 'application/zip' || row.type == 'application/x-ms-dos-executable'">
                <el-button type="success" @click="download(row.url)">
                  下载
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="250">
        <template slot-scope="{row}">
          <el-popover placement="right" title="详细信息" width="400" trigger="hover">
            <ul>
              <li v-for="(item,index) in options.columns" :key="index">
                <span style="color:#409eff">{{options.columns[index].label}}</span>
                ：{{row[index]}}
                <el-divider content-position="right">{{index}}</el-divider>
              </li>
            </ul>
            <el-button slot="reference" type="info" size="small">详情</el-button>
          </el-popover>
          <el-divider direction="vertical"></el-divider>
          <el-popover placement="bottom-start" :title="row.name" width="300" trigger="hover">
            <el-button type="primary" slot="reference" @click="handleCommand(row)" size="small">选项</el-button>
            <el-button-group>
              <el-button type="warning" icon="el-icon-edit" @click="editDialog=true;file=row"></el-button>
              <el-button type="primary" @click="addUser(row)">添加成员</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="del(row)"></el-button>
            </el-button-group>
          </el-popover>
        </template>
      </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
      style="padding:10px;text-align:right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :background="true"
      :page-sizes="[2,5,7,10,50,100]"
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
          <h-image-select v-if="!file.desc_image" :visible.sync="imageSelectDialog" v-model="file.desc_image">
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
      <el-form :model="file" ref="file" label-width="80px">
        <el-form-item label="文件名称">
          <el-input v-model="file.name"></el-input>
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input type="textarea" v-model="file.description"></el-input>
        </el-form-item>
        <el-form-item label="文件标签(分类)">
          <el-select multiple v-model="file.label" placeholder="文件标签">
            <el-option v-for="item in labels"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="示例图片">
          <h-image-select v-model="file.label" :visible.sync="imageSelectDialog">
            <el-button type="primary" slot="active" @click="imageSelectDialog = true">选择图片</el-button>
          </h-image-select>          
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit(file)">立即保存</el-button>
          <el-button @click="editDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
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
        page_size:5
      },
      addLabelDialog:false,
      optionsDialog: false,
      editDialog: false,
      addUpload: false,
      uploadDialog:false,
      label:{
        name:""
      },
      FilterDialog:false,
      labels:[],
      imageSelectDialog:false,
      file: {},
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
    download(url){
      window.open(url,"_bink")
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
      try {
        await this.$axios.post(`files`, {name,url,share,description,desc_image,label,author,size,type})
        this.$message({ type: "success", message: "添加成功." });
        this.addUpload = false;
        this.fetch();
      } catch (error) {
        this.$message({ type: "warning", message: "数据格式不合法." });
      }
    },

    async del({ name, id }) {
      this.$confirm(`确定删除${name}的信息吗?`).then(async () => {
        await this.$axios.delete(`files/${id}`);
        this.fetch();
      });
    },

    async edit({name,id,description}) {
      this.$axios
        .put(`files/${id}`,{name,description})
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
      this.file = {};
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
