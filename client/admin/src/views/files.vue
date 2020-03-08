<template>
  <div>
    <h-page-header :content="options.title" @refresh="fetch(1)" @add="addUpload = true">
      <el-button type="primary" size="mini" @click="addLabelDialog = true" slot="btn">添加标签</el-button>
    </h-page-header>
    <el-row>
      <el-col :span="24">
        <template v-for="item in labels">
          <el-button-group :key="item.id" style="margin:4px">
            <el-button type="primary" size="mini">{{item.name}}({{item.file.length}})</el-button>
            <el-button type="danger" size="mini" @click="delLabel(item)">X</el-button>
          </el-button-group>
        </template>
      </el-col>
      <el-col :span="24">
        <el-table :data="source.data" border stripe>
          <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="文件名"></el-table-column>
          <el-table-column label="上传时间">
            <template slot-scope="{row}">{{row.createdAt|date}}</template>
          </el-table-column>
          <el-table-column label="文件大小" align="center">
            <template slot-scope="{row}">
              {{Math.floor(row.size/1024)}}
              <el-tag type="info">KB</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="文件类型"></el-table-column>
          <el-table-column label="描述信息">
            <template slot-scope="{row}">
              <el-popover :title="row.name" width="300" trigger="hover" :content="row.description">
                <span slot="reference">{{row.description.substring(0,20)}}...</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="权限">
            <template slot-scope="{row}">{{row.share==="public" ? "开放" : "私有"}}</template>
          </el-table-column>
          <el-table-column align="center" label="标签">
            <template slot-scope="{row}">
              <template v-for="item in row.label">
                <el-tag :disable-transitions="true" type="info" :key="item.id">{{item.name}}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="author.nickName" label="上传"></el-table-column>
          <el-table-column label="地址" align="center" width="320">
            <template slot-scope="{row}">
              <div v-if="row.type == 'audio/mp3' || row.type == 'audio/x-m4a'">
                <audio :src="row.url" controls></audio>
              </div>
              <div v-else>
                <el-button type="success" @click="download(row.url)">下载</el-button>
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
                <el-button
                  type="primary"
                  slot="reference"
                  @click="handleCommand(row)"
                  size="small"
                >选项</el-button>
                <el-button-group>
                  <el-button type="warning" icon="el-icon-edit" @click="openEditDialog(row)"></el-button>
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
          <h-upload
            v-if="!file.url"
            api="upload-local"
            :visible.sync="uploadDialog"
            v-model="file.url"
          >
            <el-button type="primary" @click="uploadDialog = true" slot="active">上传</el-button>
          </h-upload>
          <el-tag type="success" @close="file.url = ''" closable v-if="file.url">{{file.url}}</el-tag>
        </el-form-item>
        <el-form-item label="选择标签">
          <el-select multiple v-model="file.label" placeholder="选择标签">
            <el-option v-for="item in labels" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="示意截图">
          <h-image-select :visible.sync="imageSelectDialog" v-model="file.desc_image">
            <el-button type="primary" @click="imageSelectDialog = true" slot="active">选择</el-button>
          </h-image-select>
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input type="textarea" :rows="2" placeholder="输入文件描述(说明)信息" v-model="file.description"></el-input>
        </el-form-item>
        <el-form-item label="下载权限">
          <el-switch v-model="file.share" active-text="所有人可下" inactive-text="社团成员可下"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addUpload = false">取 消</el-button>
        <el-button type="primary" @click="add(file)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialog" size="50%">
      <el-form :model="file" ref="file" label-width="100px">
        <el-form-item label="文件名称">
          <el-input v-model="file.name"></el-input>
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input type="textarea" v-model="file.description"></el-input>
        </el-form-item>
        <el-form-item label="标签(分类)">
          <el-select multiple v-model="file.label" placeholder="文件标签">
            <el-option v-for="item in labels" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="示例图片">
          <h-image-select v-model="file.desc_image" :visible.sync="imageSelectDialog" :multiple="true">
            <el-button
              type="primary"
              size="mini"
              slot="active"
              @click="imageSelectDialog = true"
            >选择图片</el-button>
          </h-image-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button type="primary" @click="edit(file)">立即保存</el-button>
          <el-button @click="editDialog = false">取消</el-button>
        </span>
    </el-dialog>
    <el-dialog title="添加标签" :visible.sync="addLabelDialog" width="30%">
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
import hPageHeader from "../components/page_header"
import hUpload from "../components/upload";
import hImageSelect from "../components/select_image";
export default {
  data() {
    return {
      pagination: {
        currentPage: 1,
        total: 7,
        page_size: 5
      },
      addLabelDialog: false,
      optionsDialog: false,
      editDialog: false,
      addUpload: false,
      uploadDialog: false,
      label: {
        name: ""
      },
      FilterDialog: false,
      labels: [],
      imageSelectDialog: false,
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
    hImageSelect,
    hPageHeader
  },
  methods: {
    openEditDialog({id,name,description,label,desc_image}){
      this.file = {id,name,description,label,desc_image};
      this.editDialog = true;
    },
    async filters(value, row, column) {
      console.log(value, row, column);
    },
    async upload_success(response) {
      this.file.url = response.url;
      this.uploadDialog = false;
    },
    async handleCommand() {
      this.optionsDialog = true;
    },
    async delLabel(label) {
      await this.$confirm(`确定删除标签${label.name}?`);
      await this.$axios.delete(`labels/${label.id}`);
      this.fetch();
      this.$message({ type: "success", message: "删除成功." });
    },
    download(url) {
      window.open(url, "_bink");
    },
    async addLabel() {
      await this.$axios.post("labels", this.label)
      this.alert_success("添加成功");
      this.addLabelDialog = false;
      this.fetch();
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetch(page);
    },

    async handleSizeChange(size) {
      this.pagination.page_size = size;
      this.fetch();
    },

    async add({ url, share, description, desc_image, label }) {
      share = share ? "public" : "private";
      let author = this.$store.getters.userInfo.id;
      let {
        mimetype: type,
        originalname: name,
        size
      } = this.$store.getters.JustUploadFile;
      try {
        await this.$axios.post(`files`, {
          name,
          url,
          share,
          description,
          desc_image,
          label,
          author,
          size,
          type
        });
        this.alert_success("添加成功.")
        this.addUpload = false;
        this.fetch();
      } catch (error) {
        this.alert_error("数据格式不合法.")
      }
    },

    async del({ name, id }) {
      await this.$confirm(`确定删除${name}的信息吗?`)
      await this.$axios.delete(`files/${id}`);
      this.alert_success("删除成功.")
      this.fetch();
    },

    async edit({ name, id, description,label,desc_image }) {
      await this.$axios.put(`files/${id}`, { name,label,desc_image, description });
      this.alert_success("保存成功");
      this.editDialog = false;
    },

    async fetch() {
      this.file = {
        desc_image:[]
      };
      this.options = (await this.$axios.get(`files/options`)).data;
      this.labels = (await this.$axios.get("labels")).data;
      this.source = (
        await this.$axios.get(
          `files?limit=${this.pagination.page_size}&page=${this.pagination.currentPage}`
        )
      ).data;
      this.pagination.total = this.source.total;
    }
  },
  created() {
    this.fetch();
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
