<template>
  <div>
    <v-dialog v-model="visible" scrollable :overlay="false" max-width="800px">
      <v-card class="mx-auto">
        <v-card-title primary-title>发布问题</v-card-title>
        <v-card-text>
          <form>
            <v-textarea v-model="source.body" action="mdi-account" label="输入你的问题"></v-textarea>
            <h-select-image
              class="mt-3 mb-6 pa-0"
              multiple
              v-model="source.ex_img"
              :visible.sync="imageSelectDialog"
            >
              <v-btn color="primary" slot="active" @click="imageSelectDialog = true">添加图片(可选)</v-btn>
            </h-select-image>
            <div class="pt-2 pb-4">
              <v-combobox
                v-model="topic"
                :items="items"
                :search-input.sync="search"
                hide-selected
                hint="最大可添加5个话题"
                label="添加话题(必填)"
                multiple
                persistent-hint
                small-chips
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        没有匹配到"
                        <strong>{{ search }}</strong>".请按下
                        <kbd>enter</kbd> 创建话题
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-combobox>
            </div>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="addProblem" color="primary accent-4">确定</v-btn>
          <v-btn text @click="$emit('update:visible',false)">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <slot></slot>
  </div>
</template>
<script>
import hSelectImage from "./select_image";
export default {
  props: {
    value: {
      default: null
    },
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      source: {
        body: "",
        ex_img: []
      },
      topic: [],
      items: ["计算机", "校园", "社团", "班级"],
      search: null,
      imageSelectDialog: false
    };
  },
  watch: {
    topic(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.topic.pop());
      }
    }
  },
  components: {
    hSelectImage
  },
  methods: {
    async addProblem() {
      await this.$axios.post("problem", {
          body:this.source.body,
          ex_img:this.source.ex_img.map(val => val.url).join(";"),//图片为字符串存储,而选择图片组件返回的值是对象数组.
          topic:this.topic.join(";")
      });
      this.addProblemDialog = false;
      alert("发布成功");
    }
  }
};
</script>