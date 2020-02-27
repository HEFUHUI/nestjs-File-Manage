<template>
  <div class="userinfo">
    <h1>{{ info.name}}的个人信息</h1>
    <div class="main">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <div class="main">
          <div class="left">
            <h3>姓 名：</h3>
            <span>{{ info.name}}</span>
            <br />
            <h3>班 级：</h3>
            <span>{{ info.class}}</span>
            <br />
            <h3>系 别：</h3>
            <span>{{ info.tie}}</span>
            <br />
            <h3>性 别：</h3>
            <span>{{ info.gender }}</span>
            <br />
            <h3>宿 舍：</h3>
            <span>{{ info.dormitory}}</span>
            <br />
          </div>
          <div class="right">
            <h3>政治面貌：</h3>
            <span>{{ info.member === '否' ? '群众' : '共青团员' }}</span>
            <br />
            <h3>是否购买意外险：</h3>
            <span>{{ info.insurance}}</span>
            <br />
            <h3>手机号码：</h3>
            <span>{{ info.phone}}</span>
            <br />
            <h3>邮箱：</h3>
            <span>{{ info.email}}</span>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header">
          <span>账户信息</span>
        </div>
        <h3>账号ID：</h3>
        <span>{{ info._id }}</span>
        <br />
        <h3>昵 称：</h3>
        <span>{{ info.nickName}}</span>
        <br />
        <h3>账号创建时间：</h3>
        <span>{{ info.createdAt | Date}}</span>
        <br />
        <h3>最近一次登录：</h3>
        <span>{{ info.login[info.login.length-1].time | Date}}</span>
        <br />
        <h3>
          <p>头像：</p>
          <img width="180px" class="avatar" :src="'http://'+info.avatar[0].uri" />
        </h3>
        <br />
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      info: {}
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`/api/private/rest/users/${this.id}`);
      this.info = res.data;
    }
  },
  created() {
    this.fetch();
  }
};
</script>
<style lang='less' scope>
.userinfo {
  text-align: cenetr;
  .main {
    .avatar{
      border-radius: 50%;
      width: 180px;
      height:180px;
    }
    display: flex;
    justify-content: space-around;
    div {
      flex: 1;
      text-align: left;
    }
    h3 {
      display: inline-block;
    }
  }
}
</style>