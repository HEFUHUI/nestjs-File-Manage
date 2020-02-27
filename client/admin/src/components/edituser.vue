<template>
  <div>
    <el-form>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item label="名字">
            <el-input v-model="editData.currentRow.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="班级">
            <el-input v-model="editData.currentRow.class"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="昵称">
            <el-input v-model="editData.currentRow.nickName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="邮箱">
            <el-input v-model="editData.currentRow.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="宿舍号">
            <el-input v-model="editData.currentRow.dormitory"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号">
            <el-input v-model="editData.currentRow.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item label="性别">
            <el-select v-model="editData.currentRow.gender">
              <el-option value="男" lebel="男"></el-option>
              <el-option value="女" lebel="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否购买意外险">
            <el-select v-model="editData.currentRow.insurance">
              <el-option value="是" lebel="是"></el-option>
              <el-option value="否" lebel="否"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否共青团员">
            <el-select v-model="editData.currentRow.member">
              <el-option value="是" lebel="是"></el-option>
              <el-option value="否" lebel="否"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="系别">
            <el-select v-model="editData.currentRow.tie" placeholder>
              <el-option
                v-for="(item,index) in tieOptions"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="出生年月">
            <div class="block">
              <el-date-picker
                editable
                v-model="editData.currentRow.birthday"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="primary" @click="edit">保存</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    editData: Object
  },
  data() {
    return {
      tieOptions: [
        "信息艺术设计系",
        "机电装备产业系",
        "物流商贸产业系",
        "智能制造产业系",
        "智能控制产业系"
      ]
    };
  },
  methods: {
    async edit() {
      await this.$http.put(
        `/api/private/rest/users/${this.editData.currentRow._id}`,
        {
          complete: this.editData.currentRow.complete,
          gender: this.editData.currentRow.gender,
          tie:this.editData.currentRow.tie,
          insurance:this.editData.currentRow.insurance,
          member:this.editData.currentRow.member,
          nickName:this.editData.currentRow.nickName,
          email:this.editData.currentRow.email,
          name:this.editData.currentRow.name,
          class:this.editData.currentRow.class,
          birthday:this.editData.currentRow.birthday,
          dormitory:this.editData.currentRow.dormitory,
          phone:this.editData.currentRow.phone
        }
        // {this.editData.currentRow}
      );
      this.editData.close();
    }
  }
};
</script>