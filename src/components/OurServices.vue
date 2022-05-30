<template>
  <div class="our-services" :services="services">
    <h2 class="title">Nos Services</h2>
    <div class="box-container">
      <div class="box" v-for="(service, index) in services" :key="index">
        <h3>{{ service.name }}</h3>
        <a href="#" class="btn">PRENDRE RDV</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "OurServices",
  props: ["services"],
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.our-services {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 5%;
  .title {
    font-size: 3em;
    font-weight: 700;
    color: #212529;
  }
  .box-container {
    display: flex;
    gap: 16px;
    width: 80%;

    .box {
      width: 100%;
      box-shadow: 0 5px 10px rgb(0 0 0 / 20%);
      border-radius: 5px;
      background: #fff;
      text-align: center;
      padding: 30px 20px;
      line-height: 1.5;
      color: #212529;
      &:hover {
        box-shadow: 0 10px 15px rgb(0 0 0 / 30%);
        transform: scale(1.03);
      }
      .btn {
        margin-top: 10px;
        display: inline-block;
        background: #333;
        color: #fff;
        font-size: 17px;
        border-radius: 5px;
        padding: 8px 25px;
        text-decoration: none;
        border: 1px solid transparent;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
          border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        &:hover {
          letter-spacing: 1px;
        }
      }
    }
  }
}

// MEDIA QUERIES//

@media screen and (max-width: 576px) {
  .our-services {
    .box-container {
      flex-wrap: wrap;
    }
  }
}

@media (min-width: 576px) and (max-width: 768px) {
  .our-services {
    .box-container {
      flex-wrap: wrap;
    }
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .our-services {
    .box-container {
      flex-wrap: wrap;
    }
  }
}
</style>