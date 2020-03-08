<template>
  <div>
    <h-page-header :content="options.title" @refresh="fetch(1)" @add="accountDialog = true"></h-page-header>
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
      <el-table-column
        label="头像"
        align="center"
        width="80">
        <template slot-scope="{row}">
          <el-image :src="row.avatar.url | url" style="width:50px;height:50px" fit="cover" alt=""></el-image>
        </template>
      </el-table-column>
      
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
          <el-button type="primary" slot="reference" @click="optionsDialog = true;user = row" size="small">选项</el-button>
          <!-- <el-popover placement="bottom-start" :title="row.email" width="300" trigger="hover">
            <el-button-group>
              <el-button type="warning" icon="el-icon-edit" @click="editDialog=true;user=row"></el-button>
              <el-button
                :type="row.state === 'disabled' ? 'primary':'info'"
                @click="row.state !== 'disabled' ? disable(row) : enable(row)"
              >{{row.state === 'disabled' ? "启" : "禁"}}用账户</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="del(row)"></el-button>
            </el-button-group>
          </el-popover> -->
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
      <el-form :model="user" ref="user" label-width="80px">
        <el-form-item label="账户昵称">
          <el-input v-model="user.nickName"></el-input>
        </el-form-item>
        <el-form-item label="账户密码">
          <el-input v-model="user.passowrd" placeholder></el-input>
        </el-form-item>
        <el-form-item label="爱好">
          <el-input v-model="user.like" placeholder="输入爱好"></el-input>
        </el-form-item>
        <el-form-item label="座右铭">
          <el-input v-model="user.motto" placeholder="输入座右铭"></el-input>
        </el-form-item>
        <el-form-item label="个人信息">
          <h-select-user :visible.sync="selectUser" :multiple="false" v-model="user.info">
            <el-button type="primary" @click="selectUser = true" slot="active">选择</el-button>
          </h-select-user>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <!-- <el-button type="primary" @click="edit(user)">确 定</el-button> -->
      </span>
    </el-dialog>
    <el-dialog title="选项" :visible.sync="optionsDialog" width="50%">
      <el-tabs v-model="option_tab"
        type="card">
        <el-tab-pane label = "更改密码" name="pass">
          <el-form :model="user" ref="user" inline label-width="80px">
            <el-form-item label="密码" >
              <el-input v-model="user.password" placeholder="输入新的用户密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changePassword">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label = "更改头像" name="avatar">
        </el-tab-pane>
        <el-tab-pane label = "编辑基本信息" name="basic_info">
        </el-tab-pane>
        <el-tab-pane label = "禁用账户" name="disabled">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button @click="optionsDialog = false">取 消</el-button>
        <el-button type="primary" @click="optionsDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <h-select-image :visible.sync="selectAvatar" :multiple="false" v-model="user.avatar">
        <el-button type="primary" @click="selectAvatar = true" slot="active">选择</el-button>
    </h-select-image>
  </div>
</template>
<script>
import hPageHeader from "../components/page_header"
import hSelectImage from "../components/select_image";
import hSelectUser from "../components/select_user";
export default {
  data() {
    return {
      pagination: {
        currentPage: 1,
        total: 7,
        page_size: 10
      },
      option_tab:'pass',
      dateRange: "",
      optionsDialog: false,
      editDialog: false,
      accountDialog: false,
      selectUser: false,
      user: {},
      selectAvatar: false,
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
  components: {
    hSelectImage,
    hSelectUser,
    hPageHeader
  },
  methods: {
    async changePassword(){
      await this.$axios.put(`account/${this.user.id}`,{password:this.user.password});
      this.alert_success("保存成功");
    },
    async filters(value, row, column) {
      console.log(value, row, column);
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetch(page);
    },
    async disable({ email, id }) {
      await this.$confirm(`确定要禁用${email}的登录吗？`);
      await this.$axios.put(`account/${id}`, { state: "disabled" });
      this.alert_success(`${email}已被禁用`);
      this.fetch();
    },
    async enable({ id }) {
      await this.$axios.put(`account/${id}`, { state: "enabled" });
      this.alert_success("账户已启用.");
      this.fetch();
    },
    async add({ email, password }) {
      await this.$axios.post(`account`, { email, password });
      this.alert_success("添加成功.");
      this.accountDialog = false;
      this.fetch();
    },

    async handleSizeChange(size) {
      this.pagination.page_size = size;
      this.fetch(this.pagination.currentPage);
    },

    async del({ email, id }) {
      await this.$confirm(`确定删除${email}的信息吗?`);
      await this.$axios.delete(`account/${id}`);
      this.fetch();
    },

    // async edit({ nickName, info, email, like, motto, id, password }) {
      // await this.$axios.put(`account/${id}`, {
      //   like,
      //   motto,
      //   email,
      //   info,
      //   nickName,
      //   password
      // });
      // this.alert_success("保存成功");
      // this.editDialog = false;
    // },

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
