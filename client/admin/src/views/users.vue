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
        <el-button size="small" type="success" @click="addUser = true">
          <i class="el-icon-plus"></i>添加
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="source.data" border stripe>
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column
        v-for="(item,index) in options.columns"
        :key="`table-column${index}`"
        :prop="index"
        :label="options.columns[index].label"
        align="center"
        :width="options.columns[index].width"
      ></el-table-column>
      <el-table-column label="账户" align="center">
        <template slot-scope="{row}">
          <span v-for="(item,index) in row.account" :key="`account-${index}`">
          <el-tag type="success">{{item.email}}</el-tag>
          </span>
          <el-tag type="warning" v-if="!row.account[0]">无账户</el-tag>
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
            </ul>
            <el-button slot="reference" type="info" size="small">详情</el-button>
          </el-popover>
          <el-divider direction="vertical"></el-divider>
          <el-popover placement="bottom-start" :title="row.name" width="300" trigger="hover">
            <el-button type="primary" slot="reference" @click="handleCommand" size="small">选项</el-button>
            <el-button-group>
              <el-button type="warning" icon="el-icon-edit" @click="editDialog=true;user=row"></el-button>
              <el-button type="primary" @click="addAccount(row)">添加账户</el-button>
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
    <el-dialog title="添加成员" :visible.sync="addUser" ref="add" width="35%">
      <el-form :model="user" ref="user" label-width="40px">
        <el-form-item label="姓名">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="user.class"></el-input>
        </el-form-item>
        <el-form-item label="系别">
          <el-select v-model="user.tie" placeholder="信息艺术设计系">
            <el-option v-for="item in options.tieOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addUser = false">取 消</el-button>
        <el-button type="primary" @click="add(user)">确 定</el-button>
      </span>
    </el-dialog>
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
        <el-button type="primary" @click="$axios.post('account',account);accountDialog=false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialog" size="50%">
      <ele-form :formData="user" :formDesc="options.columns" :request-fn="edit"></ele-form>
    </el-dialog>
    <el-dialog
      title="选项"
      :visible.sync="optionsDialog"
      width="50%">
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
      optionsDialog:false,
      editDialog: false,
      accountDialog: false,
      user: {},
      account: {},
      resource:this.$route.params.resource,
      source: [],
      options:{tieOptions:[],columns:{},title:""},
      addUser: false
    };
  },
  components: {},
  methods: {
    async handleCommand() {
      this.optionsDialog = true;
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetch(page);
    },
    async add(user) {
      this.$axios.post(`users`, user).then(() => {},()=>{
        this.$message({type:"warning",message:"数据格式不合法"})
      })
      this.addUser = false;
      this.fetch();
    },
    addAccount(user) {
      this.account.info = user.id;
      this.accountDialog = true;
    },
    async handleSizeChange(size) {
      this.pagination.page_size = size;
      this.fetch(this.pagination.currentPage);
    },
    async del(user) {
      this.$confirm(`确定删除${user.name}的信息吗?`).then(async () => {
        await this.$axios.delete(`users/${user.id}`);
        this.fetch();
      });
    },
    async edit(user) {
      this.$axios.put(`users/${user.id}`, user).then(() => {
        this.$message({ type: "success", message: "保存成功" });
      },()=>{
        this.$message({type:"warning",message:"数据格式不合法"})
      });
      this.editDialog = false;
    },
    async fetch(page = 1) {
      this.options = (await this.$axios.get(`users/options`)).data
      this.source = (
        await this.$axios.get(
          `users?limit=${this.pagination.page_size}&page=${page}`
        )
      ).data;
      this.pagination.total = this.source.total;
    },
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
