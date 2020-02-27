<template>
    <div class="quickAddToGroup">
        <el-select v-model="selectd" placeholder="请选择组">
            <el-option v-for="item in groups"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
          &nbsp;
          <el-button type="warning" @click="clearGroup">清除小组</el-button>
    </div>
</template>

<script>
export default {
    props:["id"],
    data(){
        return {
            selectd:'',
            groups:[]
        }
    },
    methods:{
       async clearGroup(){
           await this.$http.put(`/api/private/rest/users/${this.id}`,{groupId:null});
       },
       async fetch(){
           this.groups = (await this.$http.get("/api/private/group_list")).data;
           console.log(this.groups)
        }
    },
    watch:{
        async selectd(){
            await this.$http.put(`/api/private/rest/users/${this.id}`,{groupId:this.selectd});
        }
    },
    created(){
        this.fetch();
    }
}
</script>

<style>

</style>