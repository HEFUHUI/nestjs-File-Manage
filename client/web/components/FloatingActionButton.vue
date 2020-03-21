<template>
  <div>
    <v-speed-dial
      v-model="messageDialog"
      bottom
      right
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="messageDialog" color="blue darken-2" dark fab>
          <v-icon>mdi-message</v-icon>
        </v-btn>
      </template>
    </v-speed-dial>
    <v-dialog
      v-model="messageDialog"
      scrollable
      :overlay="false"
      max-width="900px"
      transition="dialog-transition"
    >
      <v-card min-width="500">
        <v-card-title primary-title>所有消息</v-card-title>
        <v-card-text>
          <v-tabs v-model="tabs">
            <v-tab>系统消息</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-card flat>
                <v-card-text>系统消息</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messageDialog: false,
      tabs: null,
    };
  },
  mounted(){
    this.$store.commit("add")
  }
};
</script>
<style scoped>
.v-speed-dial {
  position: absolute;
}
.v-btn--floating {
  position: relative;
}
</style>