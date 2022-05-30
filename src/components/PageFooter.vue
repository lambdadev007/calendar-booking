<template>
  <div class="footer">
    © 2022 Copyright:
    <a class="label" href="https://mdbootstrap.com/"
      >Site Web cree par AEB Solutions</a
    >
  </div>
</template>
<script>
export default {
  name: "PageFooter",
};
</script>
<style lang="scss" scoped>
.footer {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  text-align: center;
  color: #6c757d;
  .label {
    font-weight: 700;
    text-decoration: none;
    color: #6c757d;
  }
}
</style>