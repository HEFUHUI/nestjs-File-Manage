<template>
  <v-container>
    <v-dialog persistent transition="scale-transition" max-width="1000px" v-model="visible">
      <v-card>
        <v-card-title primary-title>选择图片</v-card-title>
        <v-card-text>
          <v-row justify="end">
            <v-file-input show-size v-model="file" :loading="uploadFileLoading" accept="image/*" ref="file" label="图片上传">
              <v-btn color="success" slot="append" @click="upload">上传</v-btn>
            </v-file-input>
          </v-row>
          <v-row v-if="multiple" justify="space-around">
            <v-col :cols="2" v-for="image in images" :key="image.id">
              <v-checkbox multiple v-model="selectds" :value="image">
                <v-img :src="image.url" slot="label" aspect-ratio="1.7"></v-img>
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col v-for="image in images" :key="image.id">
              <v-radio-group v-model="selectds" :mandatory="false">
                <v-radio :value="image">
                  <v-img :src="image.url" class="img-item" slot="label"></v-img>
                </v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-pagination
            v-model="pagination.currentPage"
            :length="Math.floor((pagination.total/pagination.page_size)+1)"
            circle
          ></v-pagination>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="$emit('update:visible',false)">取 消</v-btn>
          <v-btn color="primary" @click="enter">确 定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <slot name="active" v-if="!value[0]"></slot>
    <v-row :gutter="20" v-else>
      <template v-if="multiple">
        <v-col :cols="12">
          <div
            style="max-width:200px"
            class="d-inline-block pa-2"
            v-for="item in value"
            :key="item.id"
          >
            <v-img :src="item.url"></v-img>
          </div>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="$emit('update:visible',true)">
            <v-icon>mdi-plus</v-icon>添加图片
          </v-btn>
        </v-col>
      </template>
      <template v-else>
        <v-col>
          <v-img :src="value.url" fit="cover"></v-img>
        </v-col>
        <v-btn color="primary" @click="$emit('update:visible',true)">更改</v-btn>
      </template>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "selectImage",
  props: {
    value: null,
    visible: {
      type: Boolean
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      file:{},
      uploadFileLoading:false,
      pagination: {
        currentPage: 1,
        total: 0,
        page_size: 12
      },
      selectds: this.multiple ? [] : "",
      images: []
    };
  },
  components: {
  },
  methods: {
    async upload(){
      const formData = new FormData()
      formData.append("file",this.file)
      this.uploadFileLoading = true;
      await this.$axios.post("upload-cos",formData);
      this.fetch()
      this.uploadFileLoading = false;
    },
    async uploadSuccess() {
      this.fetch(this.pagination.currentPage);
    },
    error(err) {
      //   this.$message({ type: "error", message: err.message });
    },
    async enter() {
      if (this.mode) {
        this.$emit("input", this.value);
      }
      this.$emit("input", this.selectds);
      this.$emit("enter", this.selectds);
      this.$emit("update:visible", false);
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetch();
    },
    async handleSizeChange(size) {
      this.pagination.page_size = size;
      this.fetch();
    },
    async fetch() {
      const images = (
        await this.$axios.get(
          `images?limit=${this.pagination.page_size}&page=${this.pagination.currentPage}`
        )
      ).data;
      this.pagination.total = images.total;
      this.images = images.data;
    }
  },
  mounted() {
    this.$watch("pagination.currentPage", val => {
      this.fetch();
    });
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