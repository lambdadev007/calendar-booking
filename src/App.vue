<template>
  <div id="app">
    <EnergyPlus />
  </div>
</template>

<script>
import EnergyPlus from "./pages/EnergyPlus.vue";

export default {
  name: "App",
  components: {
    EnergyPlus,
  },
};
</script>

<style lang="scss">
html,
body {
  // font-family: "Lato", sans-serif;
  margin: 0;
  padding: 0;
}

#app {
  padding: 0;
  margin: 0;
  font-family: "Lato", sans-serif;
}
.flex {
  display: flex;
}
.items-start {
  align-items: start;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.loading-spiner {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.loading-spiner::after {
  animation: spinAround .5s linear infinite;
  border-radius: 290486px;
  border-color: transparent transparent #fff #fff;
  border-style: solid;
  border-width: 2px;
  content: "";
  display: block;
  height: 1.5em;
  position: relative;
  width: 1.5em;
}
@keyframes spinAround {
  from {
    transform: rotate(0deg); 
  }
  to { 
    transform: rotate(360deg); 
  }
}
</style>
