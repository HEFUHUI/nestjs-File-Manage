<template>
  <span>
    <el-dialog
      title="选择图片"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="visible"
      width="70%"
    >
      <el-row :gutter="20" style="text-align:left">
        <el-col :span="24">
          <el-tabs tab-position="left" style="height: 200px;">
            <el-tab-pane label="字段排序">

            </el-tab-pane>
            <el-tab-pane label="上传时间">配置管理</el-tab-pane>
            <el-tab-pane label="模糊搜索">角色管理</el-tab-pane>
            <el-tab-pane label="特殊筛选">
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="$emit('update:visible',false)">取 消</el-button>
        <el-button type="primary" @click="enter">确 定</el-button>
      </span>
    </el-dialog>
    <slot></slot>
  </span>
</template>
<script>
export default {
  name: "filterDialog",
  props: ["visible"],
  data() {
    return {
    };
  },
  components: {},
  methods: {
    error(err) {
      this.$message({ type: "error", message: err.message });
    },
    async enter() {
      this.$emit("update:visible", false);
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetch(page);
    },
    async handleSizeChange(size) {
      this.pagination.page_size = size;
      this.fetch(this.pagination.currentPage);
    },
    async fetch() {
    }
  },
  created() {
    this.fetch();
  }
};
</script>
<style scoped>
.img-item {
  width: 100px;
  height: 100px;
  background-size: 100% 100%;
  background-origin: padding-box;
}
</style>