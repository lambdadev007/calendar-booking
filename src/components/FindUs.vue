<template>
  <div class="find-us">
    <h2 class="title">Nous Trouver</h2>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22492.91610254688!2d5.277209870470906!3d45.19489906230752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478ac7e5a37aec45%3A0x7a4acdf8b72b8f8d!2s38160%20Chevri%C3%A8res!5e0!3m2!1sfr!2sfr!4v1652327375294!5m2!1sfr!2sfr"
      width="100%"
      height="450"
      style="border: 0"
      allowfullscreen=""
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</template>
<script>
export default {
  name: "FindUs",
};
</script>
<style lang="scss" scoped>
.find-us {
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    margin-bottom: 4%;
    font-size: 3em;
    font-weight: 700;
  }
}
</style>