<template>
  <div class="energy-plus">
    <HomePage :websiteInfo="websiteInfo" :services="services"></HomePage>
    <ContactLinks :websiteInfo="websiteInfo"></ContactLinks>
    <OurServices :services="services"></OurServices>
    <FindUs></FindUs>
    <SocialNetworks :websiteInfo="websiteInfo"></SocialNetworks>
    <PageFooter></PageFooter>
  </div>
</template>
<script>
import HomePage from "../components/HomePage.vue";
import ContactLinks from "../components/ContactLinks.vue";
import OurServices from "../components/OurServices.vue";
import FindUs from "../components/FindUs.vue";
import SocialNetworks from "../components/SocialNetworks.vue";
import PageFooter from "../components/PageFooter.vue";
import { collection, getDocs } from "firebase/firestore";
import db from "@/config/firebase";
export default {
  name: "EnergyPlus",
  data() {
    return {
      websiteInfo: {},
      services: [],
    };
  },

  components: {
    HomePage,
    ContactLinks,
    OurServices,
    FindUs,
    SocialNetworks,
    PageFooter,
  },
  methods: {
    async init() {
      const querySnapshot = await getDocs(collection(db, "websiteInfo"));
      querySnapshot.forEach((info) => {
        this.websiteInfo = { ...info.data() };
      });
    },
    async initServices() {
      const querySnapshot = await getDocs(collection(db, "services"));
      querySnapshot.forEach((info) => {
        this.services.push({ ...info.data(), id: info.id });
      });
    },
  },
  created() {
    this.init();
    this.initServices();
  },
};
</script>
<style lang="scss" scoped>
.energy-plus {
  position: relative;
  background-color: rgba(211, 211, 211, 0.318);
}
</style>