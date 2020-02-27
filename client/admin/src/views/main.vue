<template>
  <el-container style="height:100vh">
    <el-header class="header heade">
      <div class="left">
        <img :src="options.logo" class="logo" height="60px" />
      </div>
      <div class="center">{{options.title}}</div>
      <div class="right">
        <img src="https://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/avatar"/>
        <div class="user">
          <h4>{{UserInfo.nickName}}</h4>
          <span>{{UserInfo.email}}</span>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu router :default-active="$route.path">
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        主页
      </el-menu-item>
      <el-submenu v-for="(item,index) in menuOptions" :key="`submenu-${index}`" :index="`submenu+${index}`">
        <template slot="title">
          <i :class="item.icon"></i>
          {{item.title}}
        </template>
        <el-menu-item v-for="(it,i) in item.children" :key="`menu-item-${index+i}`" :index="it.link">{{it.title}}</el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view :key="$route.path"></router-view>
      </el-main>
    </el-container>
    
  </el-container>
</template>
<script>
export default {
  data(){
        return {
            menuOptions:[
                {title:"社团管理",icon:"el-icon-user-solid",children:[
                    {title:"成员管理",link:'/users'},
                    {title:"部门管理",link:"/departments"}
                ]},
                {title:"网站运维",icon:"el-icon-user-solid",children:[
                    {title:"图片管理",link:"/images"},
                    {title:"账户管理",link:"/account"},
                    {title:"文件管理",link:"/files"}
                ]},
                {title:"系统设置",icon:"el-icon-user-solid",children:[
                    {title:"管理员设置",link:"/admin"}
                ]}
            ]
        }
    },
    methods:{
      async fetchUserInfo(){
        this.$store.commit("login", {
          userInfo:(await this.$axios.get("auth/user")).data,
          options: (await this.$axios.get("options")).data
        });
      }
    },
    computed:{
      UserInfo(){
        return this.$store.getters.userInfo;
      },
      options(){
        return this.$store.getters.options;
      }
    },
    created(){
      this.fetchUserInfo();
    }
};
</script>
<style scoped>
.heade {
    background: #409eff;
  padding: 0px !important;
  display: flex;
  color: #fff !important;
  justify-content: space-around;
}
.logo{
    filter: saturate(1000%);
}
.heade .center {
  flex: 1;
  text-align: center;
  font-size: 30px;
  line-height: 60px;
}
.heade .left {
  height: 40px;
  display: flex;
}
.heade .right {
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: center;
  line-height: normal;
}
.heade .right img {
  border-radius: 50%;
  width: 50px;
  margin-top: 5px;
  height: 50px;
}
.heade .user {
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.heade .user h4 {
  margin: 0px;
}
.main{
  max-height:100%;
  overflow:auto;
}
</style>