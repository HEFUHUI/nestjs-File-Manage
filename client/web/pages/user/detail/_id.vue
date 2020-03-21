<template>
    <div>
        <h-account-center :id="$route.params.id"></h-account-center>
    </div>
</template>
<script>
import hAccountCenter from "../../../components/accountCenter"
export default {
    components:{
        hAccountCenter
    }
}
</script>