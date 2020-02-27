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
        <el-button size="small" type="success" @click="accountDialog = true">
          <i class="el-icon-plus"></i>添加
        </el-button>
        <el-button size="small" type="warning" @click="accountDialog = true">
          <i class="el-icon-search"></i>筛选
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="source.data" border stripe>
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column
        prop="createdAt"
        align="center"
        width="250"
        :sortable="true"
        :formatter="(row)=>{return new Date(row.createdAt).toLocaleString()}"
        label="注册时间"
        :filters="['2019','2018','2020']"
        :filter-method="filters"
      ></el-table-column>
      <el-table-column
        v-for="(item,index) in columns"
        :key="`table-column${index}`"
        :prop="index"
        :sort="true"
        :label="options.columns[index].label"
        align="center"
        :width="options.columns[index].width"
      ></el-table-column>
      <el-table-column label="角色?" align="left">
        <template slot-scope="{row}">
          <template v-if="row.info === null">
            <el-tag type="warning">游客</el-tag>
          </template>
          <template v-if="row.info !== null">
            <el-tag type="success">{{ row.info.name }}</el-tag>
            <el-tag type="info">{{ row.info.class }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="250">
        <template slot-scope="{row}">
          <el-popover placement="right" title="详细信息" width="500" trigger="hover">
            <ul>
              <li v-for="(item,index) in options.columns" :key="index">
                <span style="color:#409eff">{{options.columns[index].label}}</span>
                ：{{row[index]}}
                <el-divider content-position="right">{{index}}</el-divider>
              </li>
              <li>
                <span style="color:#409eff">角色：</span>
                <template v-if="row.info === null">
                  <el-tag type="warning">游客</el-tag>
                </template>
                <template v-if="row.info !== null">
                  <el-button type="primary" size="mini">
                    {{ row.info.name }}:
                    {{row.info.class }}
                  </el-button>
                </template>
                <el-divider content-position="right"></el-divider>
              </li>
            </ul>
            <el-button slot="reference" type="info" size="small">详情</el-button>
          </el-popover>
          <el-divider direction="vertical"></el-divider>
          <el-popover placement="bottom-start" :title="row.name" width="300" trigger="hover">
            <el-button type="primary" slot="reference" @click="handleCommand" size="small">选项</el-button>
            <el-button-group>
              <el-button type="warning" icon="el-icon-edit" @click="editDialog=true;user=row"></el-button>
              <el-button :type="row.state === 'disabled' ? 'primary':'info'" @click="row.state !== 'disabled' ? disable(row) : enable(row)">{{row.state === 'disabled' ? "启" : "禁"}}用账户</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="del(row)"></el-button>
            </el-button-group>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog title="添加账户" :visible.sync="accountDialog" width="50%">
      <el-form :model="account" ref="account" label-width="80px">
        <el-form-item label="邮箱">
          <el-input v-model="account.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="account.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="accountDialog = false">取 消</el-button>
        <el-button type="primary" @click="add(account)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialog" size="50%">
      <ele-form
        :formData="user"
        :isShowBackBtn="false"
        :formDesc="options.columns"
        :request-fn="edit"
      ></ele-form>
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
export default {
  data() {
    return {
      pagination: {
        currentPage: 1,
        total: 7,
        page_size: 10
      },
      dateRange: "",
      optionsDialog: false,
      editDialog: false,
      accountDialog: false,
      user: {},
      account: {},
      source: [],
      options: { tieOptions: [], columns: {}, title: "" },
      addUser: false,
      sort: [{ rule: true, fields: "motto" }]
    };
  },
  watch: {
    dateRange(val) {
      this.fetch(1, val);
    }
  },
  components: {},
  methods: {
    async filters(value, row, column) {
      console.log(value, row, column);
    },
    async handleCommand() {
      this.optionsDialog = true;
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetch(page);
    },
    async disable({email,id}){
      this.$confirm(`确定要禁用${email}的登录吗？`).then(()=>{
        this.$axios.put(`account/${id}`,{state:"disabled"}).then(()=>{
          this.$message({type:"success",message:`${email}已被禁用`})
          this.fetch();
        })
      })
    },
    async enable({id}){
      this.$axios.put(`account/${id}`,{state:"enabled"}).then(()=>{
        this.$message("账户已启用");
        this.fetch();
      })
    },
    async add({ email, password }) {
      this.$axios.post(`account`, { email, password }).then(
        () => {
          this.$message({ type: "success", message: "添加成功." });
          this.accountDialog = false;
          this.fetch();
        },
        () => {
          this.$message({ type: "warning", message: "数据格式不合法." });
        }
      );
    },

    async handleSizeChange(size) {
      this.pagination.page_size = size;
      this.fetch(this.pagination.currentPage);
    },

    async del({ email, id }) {
      this.$confirm(`确定删除${email}的信息吗?`).then(async () => {
        await this.$axios.delete(`account/${id}`);
        this.fetch();
      });
    },

    async edit({ nickName, email, like, motto, id, password }) {
      this.$axios
        .put(`account/${id}`, { like, motto, email, nickName, password })
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
      this.options = (await this.$axios.get(`account/options`)).data;
      this.source = (
        await this.$axios.get(
          `account?limit=${this.pagination.page_size}&page=${page}${sortStr}`
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
