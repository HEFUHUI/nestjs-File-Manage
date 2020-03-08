<template>
  <el-row type="flex" style="margin:10px">
    <el-col>
      <el-page-header @back="$router.go(-1)" style="line-height:60px" v-bind="$attrs"></el-page-header>
    </el-col>
    <el-col style="text-align:right;margin-top:10px">
      <el-button v-if="refresh"
        type="primary"
        size="small"
        icon="el-icon-refresh-right"
        @click="$emit('refresh')"
      >刷新</el-button>
      <el-button  v-if="add" size="small" type="success" @click="$emit('add')">
        <i class="el-icon-plus"></i>添加
      </el-button>
      <slot name="btn"></slot>
    </el-col>
  </el-row>
</template>
<script>
export default {
    name:"h-page-header",
    props:{
      add:{
        type:Boolean,
        default:true
      },
      refresh:{
        type:Boolean,
        default:true
      }
    }
};
</script>