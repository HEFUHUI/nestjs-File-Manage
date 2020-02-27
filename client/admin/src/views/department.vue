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
        <el-button size="small" type="success" @click="addDialog = true">
          <i class="el-icon-plus"></i>添加
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="sources" border stripe>
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column
        v-for="(item,index) in options.columns"
        :key="`table-column${index}`"
        :prop="index"
        :label="options.columns[index].label"
        align="center"
        :width="options.columns[index].width"
      ></el-table-column>
      <el-table-column align="center" label="部门人数">
        <template slot-scope="{row}">{{row.users.length+2}}</template>
      </el-table-column>
      <el-table-column align="center" label="部长">
        <template slot-scope="{row}">{{row.leader ? row.leader.name : "无部长"}}</template>
      </el-table-column>
      <el-table-column align="center" label="副部长">
        <template slot-scope="{row}">{{row.viceLeader ? row.viceLeader.name : "无副部长"}}</template>
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
              <li>
                <span style="color:#409eff">部门人数</span>
                ：{{row.users.length+2}}
                <el-divider content-position="right">count</el-divider>
              </li>
              <li>
                <span style="color:#409eff">部长</span>
                ：
                <template v-if="row.leader">
                  <el-button type="primary" size="mini">{{row.leader.name}}-{{row.leader.class}}</el-button>
                </template>
                <template v-if="!row.leader">无部长</template>
                <el-divider content-position="right">leader</el-divider>
              </li>
              <li>
                <span style="color:#409eff">副部长</span>
                ：
                <template v-if="row.viceLeader">
                  <el-button
                    type="primary"
                    size="mini"
                  >{{row.viceLeader.name}}-{{row.viceLeader.class}}</el-button>
                </template>
                <template v-if="!row.viceLeader">无副部长</template>
                <el-divider content-position="right">viceLeader</el-divider>
              </li>
            </ul>
            <el-button slot="reference" type="info" size="small">详情</el-button>
          </el-popover>
          <el-divider direction="vertical"></el-divider>
          <el-popover placement="bottom-start" :title="row.name" width="300" trigger="hover">
            <el-button type="primary" slot="reference" @click="handleCommand(row)" size="small">选项</el-button>
            <el-button-group>
              <el-button type="warning" icon="el-icon-edit" @click="editDialog=true;source=row"></el-button>
              <el-button type="primary" @click="addUser(row)">添加成员</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="del(row)"></el-button>
            </el-button-group>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加部门" :visible.sync="addDialog" ref="add" width="35%">
      <el-form :model="source" ref="source" label-width="70px">
        <el-form-item label="部门名称">
          <el-input v-model="source.name" placeholder="磨铁部"></el-input>
        </el-form-item>
        <el-form-item label="部长">
          <el-select v-model="source.leader" placeholder="李四-17磨铁高职班">
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.name + '-'+item.class"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="副部长">
          <el-select v-model="source.viceLeader" placeholder="张三-17网络高级2班">
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.name + '-'+item.class"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="add(source)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialog" size="50%">
      <ele-form :formData="source" :formDesc="options.columns" :request-fn="edit"></ele-form>
    </el-dialog>
    <el-dialog title="选项" :visible.sync="optionsDialog" width="50%">
      <el-table :data="source.users" border stripe>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="班级" prop="class"></el-table-column>
        <el-table-column label="系别" prop="tie"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="danger" @click="$axios.put(`users/${row.id}`,{department:null}),fetch()">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="optionsDialog = false">取 消</el-button>
        <el-button type="primary" @click="optionsDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <h-user-select
      :visible.sync="select_user"
      @result="PushUser"
      v-model="select_users"
      @enter="PushUser"
    ></h-user-select>
  </div>
</template>
<script>
import hUserSelect from "../components/select_user";
export default {
  data() {
    return {
      optionsDialog: false,
      editDialog: false,
      source: {},
      select_user: false,
      sources: [],
      select_users: [],
      options: { tieOptions: [], columns: {}, title: "" },
      addDialog: false,
      users: []
    };
  },
  components: {
    hUserSelect
  },
  computed: {},
  methods: {
    async handleCommand(row) {
      this.source = row;
      this.optionsDialog = true;
    },
    async PushUser() {
      this.select_users.forEach(element => {
        this.$axios
          .put(`users/${element}`, { department: this.source.id })
          .catch(() => {
            throw new Error("错误");
          });
      });
    },
    async addUser(source) {
      this.source = source;
      this.select_user = true;
    },
    async add(source) {
      this.$axios.post(`departments`, source).catch(() => {
        this.$message({ type: "warning", message: "数据格式不合法" });
      });
      this.addDialog = false;
      this.fetch();
    },
    async del(source) {
      if (source.leader) {
        this.$axios.put(`users/${source.leader.id}`, { department: null });
      }
      if (source.viceLeader) {
        this.$axios.put(`users/${source.viceLeader.id}`, { department: null });
      }
      this.$confirm(`确定删除${source.name}的信息吗?`).then(async () => {
        this.$axios.delete(`departments/${source.id}`).then(
          () => {
            this.$message({ type: "success", message: "操作成功" });
            this.fetch();
          },
          () => {
            this.$message({ type: "warning", message: "部门有人不能删除" });
          }
        );
      });
    },
    async edit(source) {
      this.$axios.put(`departments/${source.id}`, source).then(
        () => {
          this.$message({ type: "success", message: "保存成功" });
        },
        () => {
          this.$message({ type: "warning", message: "数据格式不合法" });
        }
      );
      this.editDialog = false;
    },
    async fetch() {
      this.users = (await this.$axios.get(`users`)).data;
      this.options = (await this.$axios.get(`departments/options`)).data;
      this.sources = (await this.$axios.get(`departments`)).data;
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
