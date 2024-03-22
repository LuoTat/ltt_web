<template>
  <div id="app">
    <EmpView></EmpView>
  </div>
</template>

<script>
import EmpView from "./views/tlias/EmpView.vue";
export default {
  components: { EmpView },
  data() {
    return {
      message: "Hello World",
    };
  },
};
</script>

<style></style>
