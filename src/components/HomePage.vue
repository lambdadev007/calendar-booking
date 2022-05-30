<template>
  <div class="home-page" v-if="websiteInfo && services">
    <AppointmentCard
      :websiteInfo="websiteInfo"
      :services="services"
    ></AppointmentCard>
  </div>
</template>

<script>
import AppointmentCard from "./AppointmentCard.vue";
export default {
  name: "HomePage",
  props: ["websiteInfo", "services"],
  components: {
    AppointmentCard,
  },
};
</script>

<style scoped lang="scss">
.home-page {
  background: linear-gradient(rgba(109, 109, 109, 0.482), rgba(0, 0, 0, 0.469)),
    url(../assets/homepage.jpeg);
  height: auto;
  width: 100%;
  display: flex;
}
</style>
