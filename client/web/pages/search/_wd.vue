<template>
  <div>{{$route.params.wd}}</div>
</template>
<script>
export default {
  created() {
    
  },
  async asyncData({ $axios,route }) {
    return {
      search:$axios.$get(`search?wd=${route.params.wd}`)
    };
  }
};
</script>