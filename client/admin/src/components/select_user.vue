<template>
  <el-dialog
    :title="`选择成员-选中${checked.length}`"
    :visible.sync="visible"
    width="60%">
    <el-row>
    <el-col :span="24">
      <el-checkbox-group v-model="checked" @change="$emit('input',checked)">
        <el-checkbox-button v-for="item in users"  :label="item.id" :key="item.id" style="margin:10px">
          <h4>{{ item.name }}</h4>
          <span>{{ item.class || '无班级'}}</span>
          {{item.department ? item.department.name : "无部门"}}
        </el-checkbox-button>
      </el-checkbox-group>
      <el-row>
        <el-col :span="24">
          <div style="margin-top: 10px;text-align: center;">
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
</template>
<script>
export default {
   model:{
        prop: 'checked',
  },
  props: ["visible","checked"],
  data() {
    return {
      pagination: {
        currentPage: 1,
        total: 7,
        page_size: 10
      },
      users: []
    };
  },
  methods: {
    async fetch(page) {
      const result = await this.$axios.get(`users?page=${page}&limit=${this.pagination.page_size}`);
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
    async enter(){
      this.$emit('update:visible', false)
      this.$emit("result",this.user);
    }
  },
  created() {
    this.fetch(1);
  }
};
</script>