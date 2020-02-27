<template>
    <div>
        <canvas width="100" height="100" ref="canvas"></canvas>
    </div>
</template>
<script>
export default {
    data(){
        return {
            ctx:"",
            canvas:""
        }
    },
    mounted(){
        this.canvas = this.$refs.canvas;
        this.ctx = this.$refs.canvas.getContext("2d");
    }
}
</script>
<style lang="sass" scoped>

</style>