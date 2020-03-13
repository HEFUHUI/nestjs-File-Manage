<template>
  <div>
    <h-page-header :content="options.title" @refresh="fetch()" @add="accountDialog = true"></h-page-header>
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
      <el-table-column label="头像" align="center" width="80">
        <template slot-scope="{row}">
          <el-image :src="row.avatar ? row.avatar.url : '' | url" style="width:50px;height:50px" fit="cover" alt></el-image>
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
          <el-button type="primary" slot="reference" @click="openOptionDialog(row)" size="small">选项</el-button>
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
      <span slot="footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <!-- <el-button type="primary" @click="edit(user)">确 定</el-button> -->
      </span>
    </el-dialog>
    <el-dialog title="选项" :visible.sync="optionsDialog" width="50%">
      <el-tabs tab-position="left" v-model="option_tab" type="card">
        <el-tab-pane label="信息编辑" name="pass">
          <el-form :model="user" ref="user" label-width="80px">
            <el-form-item label="账户昵称">
              <el-input v-model="user.nickName"></el-input>
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
            <el-form-item label="头像">
              <h-select-image :visible.sync="selectAvatar" :multiple="false" v-model="user.avatar">
                <el-button type="primary" @click="selectAvatar = true" slot="active">选择</el-button>
              </h-select-image>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="权限设置" name="avatar">
          <el-form :model="user" ref="user" label-width="50px">
            <el-form-item label="密码">
              <el-input v-model="user.password" placeholder="输入新的用户密码"></el-input>
              <el-button type="primary" size="mini" @click="change(user.password,'','password')">保存</el-button>
            </el-form-item>
            <el-form-item label="登录">
              <el-switch
                v-model="user.state"
                active-value="disabled"
                inactive-value="enabled"
                active-text="禁用"
                inactive-text="启用"
              ></el-switch>
            </el-form-item>
            <el-form-item label="权限">
              <el-slider v-model="user.Grade" :step="2" show-stops :show-tops="true" :min="0" :max="10" :format-tooltip="formatTooltip"></el-slider>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="发送消息" name="basic_info"></el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button type="primary" @click="optionsDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import hPageHeader from "../components/page_header";
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
      option_tab: "pass",
      dateRange: "",
      optionsDialog: false,
      editDialog: false,
      accountDialog: false,
      selectUser: false,
      user: {}, //当前选中的账号
      selectAvatar: false,
      account: {},
      source: [],
      options: { tieOptions: [], columns: {}, title: "" },
      addUser: false,
      unwatch: [],
      sort: [{ rule: true, fields: "motto" }],
      
    };
  },
  watch: {
    dateRange(val) {
      this.fetch(1, val);
    },
    optionsDialog(val) {
      //监听选项卡的打开,然后为每一个字段添加监听;
      if (val) {
        if (this.source.data && this.source.data[0]) {
          Object.keys(this.source.data[0]).forEach(field => {
            this.unwatch.push(
              this.$watch(`user.${field}`, (newVal, oldVal) => {
                this.change(newVal, oldVal, field);
              })
            );
          });
        }
      } else {
        this.ClearUnwatch(); //如果关闭，则清空监听
        this.fetch(1);
      }
    }
  },
  components: {
    hSelectImage,
    hSelectUser,
    hPageHeader
  },
  methods: {
    formatTooltip(val){
      return this.options.stops[val];
    },
    openOptionDialog(row) {
      this.user = row;
      this.optionsDialog = true;
    },
    async filters(value, row, column) {
      console.log(value, row, column);
    },
    ClearUnwatch() {
      let len = this.unwatch.length;
      for (let i = 0; i < len; i++) {
        this.unwatch.pop()();
      }
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetch(page);
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

    async fetch() {
      this.options = (await this.$axios.get(`account/options`)).data;
      this.source = (
        await this.$axios.get(
          `account?limit=${this.pagination.page_size}&page=${this.pagination.currentPage}`
        )
      ).data;
      this.pagination.total = this.source.total;
      this.ClearUnwatch();
    },
    async change(newVal, oldVal, field) {
      if (
        newVal === undefined ||
        newVal === oldVal ||
        oldVal === undefined ||
        newVal == ""
      )
        return;
      await this.$axios.put(`account/${this.user.id}`, { [field]: newVal });
      this.alert_success("保存成功.")
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
