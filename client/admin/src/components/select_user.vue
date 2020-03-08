<template>
  <div class="select_user">
    <el-dialog
      :visible.sync="visible"
      :destroy-on-close="true"
      width="60%"
      :append-to-body="true"
    >
    <h-page-header :content="`选择成员${multiple ? '-选中'+checked.length : ''}`" @refresh="fetch(1)" @add="()=>{
      console.log('add')
      }"></h-page-header>
      <el-row>
        <el-col :span="24">
          <el-checkbox-group v-if="multiple" v-model="checked" @change="$emit('input',checked)">
            <el-checkbox
              v-for="item in users"
              :disabled="disabled && (item.department || item.leader || item.viceLeader)"
              :label="item"
              :key="item.id"
              style="margin:10px;overflow: auto;width:190px;border:0.5px solid black;padding:0 2px 2px 2px"
            >
              <p>
                {{ item.name }}
                <el-tag
                  v-if="item.department || item.leader || item.viceLeader"
                  type="success"
                  size="mini"
                >{{item.department ? item.department.name : (item.leader ? (item.leader.name+' 部长 ') : (item.viceLeader.name+' 副部长 '))}}</el-tag>
                <el-tag type="danger" size="mini" v-else>无部门</el-tag>
              </p>
              <span>{{ item.class || '无班级'}}</span>
            </el-checkbox>
          </el-checkbox-group>
          <template v-else>
            <el-radio
              @change="$emit('input',checked)"
              v-model="checked"
              v-for="item in users"
              :disabled="Boolean(disabled && (item.department || item.leader || item.viceLeader))"
              :label="item"
              :key="item.id"
              style="margin:10px;overflow: auto;width:190px;padding:4px 0px 10px 9px; border:0.5px solid black"
            >
              <p>
                {{ item.name }}
                <el-tag
                  v-if="item.department || item.leader || item.viceLeader"
                  type="success"
                  size="mini"
                >{{item.department ? item.department.name : (item.leader ? (item.leader.name+' 部长 ') : (item.viceLeader.name+' 副部长 '))}}</el-tag>
                <el-tag type="danger" size="mini" v-else>无部门</el-tag>
              </p>
              <span>{{ item.class || '无班级'}}</span>
            </el-radio>
          </template>
          <el-row>
            <el-col :span="24">
              <div style="margin-top: 10px;text-align: center;">
                <el-pagination
                  style="padding:10px;text-align:right"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pagination.currentPage"
                  :background="true"
                  :page-sizes="[10,15,20,25,35]"
                  :page-size="pagination.page_size"
                  layout="sizes, prev, pager, next, jumper, ->, total, slot"
                  :total="pagination.total"
                ></el-pagination>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button type="primary" @click="enter">确 定</el-button>
      </span>
    </el-dialog>
    <template v-if="!not_result">
      <slot v-if="!checked" name="active"></slot>
      <el-row :gutter="10" v-else>
        <el-col :span="5" v-if="multiple">
          <el-tag type="success" v-for="user in checked" :key="user.id">{{user.name}}-{{user.class}}</el-tag>
        </el-col>
        <el-col :span="5" v-else>
          <el-tag type="success" closable @close="checked = null">{{checked.name}}-{{checked.class}}</el-tag>
        </el-col>
      </el-row>
    </template>
  </div>
</template>
<script>
import hPageHeader from "../components/page_header"
export default {
  model: {
    prop: "checked"
  },
  props: ["visible", "checked", "disabled", "multiple", "not_result"],
  data() {
    return {
      pagination: {
        currentPage: 1,
        total: 7,
        page_size: 15
      },
      users: []
    };
  },
  components:{
    hPageHeader
  },
  methods: {
    async fetch(page) {
      const result = await this.$axios.get(
        `users?page=${page}&limit=${this.pagination.page_size}`
      );
      this.users = result.data.data;
      this.pagination.total = result.data.total;
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetch(page);
    },
    async handleSizeChange(size) {
      this.pagination.page_size = size;
      this.fetch(this.pagination.currentPage);
    },
    async enter() {
      this.$emit("update:visible", false);
      this.$emit("result", this.user);
    }
  },
  created() {
    this.fetch(1);
  }
};
</script>