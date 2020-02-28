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
      <el-row type="flex" style="margin:10px">
        <el-col>
          <el-page-header @back="$router.go(-1)" style="line-height:60px" content="选择图片"></el-page-header>
        </el-col>
        <el-col style="text-align:right">
          <el-tooltip class="item" content="刷新" placement="top">
            <el-button type="primary" size="small" icon="el-icon-refresh-right" @click="fetch(1)">刷新</el-button>
          </el-tooltip>
          <h-upload api="upload-cos" @success="uploadSuccess" :visible.sync="uploadDialog">
            <el-button size="small" @click="uploadDialog = true" slot="active" type="success">
              <i class="el-icon-plus"></i>添加上传
            </el-button>
          </h-upload>
          <el-button size="small" type="warning">
            <i class="el-icon-search"></i>筛选
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="text-align:left">
        <el-col :span="24">
          <el-checkbox-group v-model="selectds">
            <el-checkbox v-for="image in images" :label="image.id" :key="image.id">
              <el-image
                :src="'http://'+image.url"
                class="img-item"
                fit="cover"
                width="100px"
                height="100px"
              ></el-image>
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="24">
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
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="$emit('update:visible',false)">取 消</el-button>
        <el-button type="primary" @click="enter">确 定</el-button>
      </span>
    </el-dialog>
    <slot name="active"></slot>
  </span>
</template>
<script>
import hUpload from "../components/upload";
export default {
  name: "selectImage",
  props: ["api", "value", "visible"],
  data() {
    return {
      uploadDialog: false,
      pagination: {
        currentPage: 1,
        total: 7,
        page_size: 10
      },
      selectds: [],
      images: []
    };
  },
  components: {
    hUpload
  },
  methods: {
    async uploadSuccess(res) {
      await this.$axios.post("images", {
        url: res.url,
        type: res.mimetype,
        alias: res.originalname,
        author: this.$store.getters.userInfo.id
      });
      this.fetch(this.pagination.currentPage);
    },
    error(err) {
      this.$message({ type: "error", message: err.message });
    },
    async enter() {
      if (this.mode) {
        this.$emit("input", this.value);
      }
      this.$emit('input',this.selectds)
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
    async fetch(page = 1) {
      const images = (
        await this.$axios.get(
          `images?limit=${this.pagination.page_size}&page=${page}`
        )
      ).data;
      this.pagination.total = images.total;
      this.images = images.data;
    }
  },
  created() {
    this.$emit("input", "");
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