<template>
  <div>
    <v-btn text class="ma-2" @click="$router.go(-1)">
      <v-icon>mdi-arrow-left-thick</v-icon>返回
    </v-btn>
    <v-row justify="center">
      <v-col :cols="12" :md="12">
        <v-card>
          <v-card-title primary-title>{{problem.body}}</v-card-title>
          <v-card-subtitle>
            提问:
            <nuxt-link
              :to="`/user/detail/${problem.author.id}`"
            >{{problem.author.nickName}}{{`《${problem.author.email}》`}}</nuxt-link>
            时间:{{problem.createdAt}} 话题：
            <v-chip>{{problem.topic}}</v-chip>
          </v-card-subtitle>
          <v-card-text>
            <v-expansion-panels v-if="problem.ex_img">
              <v-expansion-panel>
                <v-expansion-panel-header>查看图片</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col
                      v-for="item in problem.ex_img.split(';')"
                      :key="item"
                      class="d-flex child-flex"
                      cols="4"
                    >
                      <v-card flat tile class="d-flex">
                        <v-img :src="item" aspect-ratio="1" class="grey lighten-2">
                          <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-row justify="start">
              <v-col class="mt-2 mb-2">
                <v-btn color="primary" @click="replyDialog = true">写回复</v-btn>
                <v-btn color="info">关注问题</v-btn>
                <v-btn
                  color="error"
                  @click="deleteProblem(problem.id)"
                  v-if="$auth.loggedIn && $auth.user.id == problem.author.id"
                >
                  <v-icon>mdi-delete</v-icon>删除问题
                </v-btn>
              </v-col>
            </v-row>
            <v-divider class="mt-0 mb-3"></v-divider>
            <!-- 所有的回答 -->
            <h4 class="pa-1">回复-共{{problem.answer.length}}条</h4>
            <v-card v-for="item in problem.answer" :key="item.id">
              <v-card-title primary-title class="primary--text">
                <nuxt-link :to="`/user/detail/${item.author.id}`" tag="button">
                  <v-avatar size="35" color="primary">
                    <img :src="item.author.avatar.url" alt="alt" />
                  </v-avatar>
                  {{item.author.nickName}}
                </nuxt-link>
              </v-card-title>
              <v-card-subtitle>时间：{{item.createdAt}}</v-card-subtitle>
              <v-card-text>
                <div v-html="item.content" class="h-content"></div>
              </v-card-text>
              <v-card-actions>
                <v-btn color="red" text @click="support(item.id)">
                  <v-icon>mdi-heart</v-icon>100
                </v-btn>
                <v-btn color="info" text @click="comment_dialog = true;source = item">
                  <v-icon right>mdi-message</v-icon>评论
                </v-btn>
              </v-card-actions>
              <v-list-item two-line v-for="comment in item.comment" :key="comment.id">
                <v-list-item-content>
                  <v-list-item-title>
                    <nuxt-link :to="`/user/detail/${item.author.id}`" tag="button">
                      <v-avatar size="28" color="primary">
                        <img :src="comment.author.avatar.url" alt="alt" />
                      </v-avatar>
                      {{comment.author.nickName}}
                    </nuxt-link>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{comment.createdAt}}
                  </v-list-item-subtitle>
                  <v-list-tile-content>
                    {{comment.body}}
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn color="primary" x-small text>查看回复</v-btn>
                    <v-btn color="info" x-small text>回复TA</v-btn>
                  </v-list-tile-action>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-card-text>
          <v-card-actions>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="replyDialog"
      scrollable
      :fullscreen="dialogF"
      persistent
      :overlay="false"
      max-width="700px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          回复:
          <blockquote class="primary--text">{{problem.body}}</blockquote>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <quill-editor
              v-model="content"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" text @click="replyDialog = false">取消</v-btn>
          <v-btn color="primary" text @click="reply">确定回复</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="comment_dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>
          评论
          <span class="primary--text">{{source.author.nickName}}</span>
          的“回复”
        </v-card-title>
        <v-card-text>
          <v-text-field label="输入评论内容" v-model="comment"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" text @click="comment_dialog = false">取消</v-btn>
          <v-btn color="primary" text @click="reply_mode === 'comment' ? c_comment() : reply_comment()">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="success">
      操作成功
      <v-btn flat color="success" @click.native="success = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="faild">
      发生错误
      <v-btn flat color="error" @click.native="faild = false">Close</v-btn>
    </v-snackbar>
    <h-select-image v-model="img" @enter="handleEnter" :visible.sync="imageSelectDialog"></h-select-image>
  </div>
</template>
<script>
import hSelectImage from "../../components/select_image";
let self = this;
export default {
  data() {
    return {
      comment: "",//评论的内容
      comment_dialog: false,//评论弹窗
      content: "",//回复的内容
      imageSelectDialog: false,//图片选择器触发
      img: "",//当前选中的图片
      
      reply_id:'',//回复评论的ID
      reply_mode:'comment',

      success: false,//成功弹框
      faild: false,//失败弹框

      replyDialog: false,//回复的对话框
      dialogF: false,//回复对话框是否全屏
      source: {
        author: {}
      },//当前选中的资源
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "image"], // toggled buttons
              [{ header: 1 }, { header: 2 }],
              [{ color: ["red", "#409eff"] }]
            ],
            handlers: {
              image: function(value) {
                console.log(value);
                if (value) {
                  self.$data.imageSelectDialog = true;
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      }//富文本编辑器的配置
    };
  },
  components: {
    hSelectImage
  },
  watch: {
    imageSelectDialog(val) {
      this.img = "";
    }
  },
  mounted() {
    this.$socket.emit("connection", "hello");
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  methods: {
    async c_comment() {
      this.comment_answer({
        body:this.comment,
        reply:null
      })
    },
    async reply_comment(){
      this.comment_answer({
        body:this.comment,
        reply:this.reply_id
      })
    },
    async comment_answer(body) {
      await this.$axios.put(`problem/comment/${this.source.id}`, body);
      this.comment_dialog = false;
      this.success = true;
    },
    async support(id) {
      await this.$axios.put(`problem/support/${id}`);
    },
    reply() {
      this.$axios.post(`problem/${this.$route.params.id}/`, {
        content: this.content
      });
    },
    handleEnter(res) {
      let length = 0;
      try {
        length = this.editor.getSelection().index;
      } catch (error) {
        length = 1;
      }
      this.editor.insertEmbed(length, "image", res.url);
      this.editor.setSelection(length + 1);
    },

    onEditorReady(editor) {},
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件

    async deleteProblem(id) {
      await this.$axios.delete(`problem/${id}`);
      this.$router.push("/forum");
    }
  },
  created() {
    self = this;
    if (!this.problem) {
      this.$router.push("/");
    }
  },
  async asyncData({ $axios, route }) {
    return {
      problem: await $axios.$get(`problem/${route.params.id}`)
    };
  }
};
</script>
<style>
.h-content img {
  width: 500px;
}
</style>