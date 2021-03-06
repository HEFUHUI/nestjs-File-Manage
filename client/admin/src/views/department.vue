<template>
  <div>
    <h-page-header :content="options.title" @refresh="fetch(1)" @add="addDialog = true;source = {}"></h-page-header>
    <el-table :data="sources" border stripe>
      <el-table-column type="selection" align="center" width="55"></el-table-column>
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
        <template
          slot-scope="{row}"
        >{{row.users.length+(row.leader ? 1 : 0)+(row.viceLeader ? 1 : 0)}}</template>
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
                ：{{row.users.length+(row.leader ? 1 : 0)+(row.viceLeader ? 1 : 0)}}
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
            <el-button type="primary" slot="reference" @click="openOptions(row)" size="small">选项</el-button>
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
          <h-user-select
            :disabled="true"
            :multiple="false"
            :visible.sync="select_leader"
            v-model="source.leader"
          >
            <el-button type="primary" @click="select_leader = true" slot="active" size="mini">选择</el-button>
          </h-user-select>
        </el-form-item>
        <el-form-item label="副部长">
          <h-user-select
            :disabled="true"
            :multiple="false"
            :visible.sync="select_viceLeader"
            v-model="source.viceLeader"
          >
            <el-button type="primary" @click="select_viceLeader = true" slot="active" size="mini">选择</el-button>
          </h-user-select>
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
      <el-table :data="source.users" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="班级" prop="class"></el-table-column>
        <el-table-column label="系别" prop="tie"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button
              type="danger"
              @click="$axios.put(`users/${row.id}`,{department:null}),fetch()"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="optionsDialog = false">取 消</el-button>
        <el-button type="primary" @click="optionsDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- disabled属性用于禁用已有部门的人 -->
    <h-user-select
      :disabled="true"
      :multiple="true"
      :not_result="true"
      :visible.sync="select_user"
      @result="PushUser"
      v-model="select_users"
      @enter="PushUser"
    ></h-user-select>
  </div>
</template>
<script>
import hPageHeader from "../components/page_header";
import hUserSelect from "../components/select_user";
export default {
  data() {
    return {
      select_leader: false,
      optionsDialog: false,
      editDialog: false,
      source: {},
      select_user: false,
      select_viceLeader: false,
      sources: [],
      select_users: [],
      options: { columns: {}, title: "管理" },
      addDialog: false
    };
  },
  components: {
    hUserSelect,
    hPageHeader
  },
  computed: {},
  methods: {
    handleSelectionChange(val){
      console.log(val);
    },
    async openOptions(row) {
      this.source = row;
      this.optionsDialog = true;
    },
    async PushUser() {
      await this.select_users.forEach(async element => {
        await this.$axios.put(`users/${element.id}`, {
          department: this.source.id
        });
        this.select_users = [];
        this.alert_success(`已添加${element.name}到${this.source.name}`);
      });
      this.fetch();
    },
    async addUser(source) {
      this.source = source;
      this.select_users = [];
      this.select_user = true;
    },
    async add(source) {
      await this.$axios.post(`departments`, source);
      this.addDialog = false;
      this.fetch();
    },
    async del(source) {
      if (source.leader) {
        await this.$axios.put(`users/${source.leader.id}`, {
          department: null
        });
      }
      if (source.viceLeader) {
        await this.$axios.put(`users/${source.viceLeader.id}`, {
          department: null
        });
      }
      await this.$confirm(`确定删除${source.name}的信息吗?`);
      try {
        await this.$axios.delete(`departments/${source.id}`);
        this.alert_success("删除成功.");
      } catch (error) {
        this.alert_error("部门有人不能删除.");
      }
      this.fetch();
    },
    async edit(source) {
      await this.$axios.put(`departments/${source.id}`, source);
      this.alert_success("保存成功.");
      this.editDialog = false;
    },
    async fetch() {
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
