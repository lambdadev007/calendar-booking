<template>
  <div class="contact-links" v-if="websiteInfo">
    <div class="navtest">
      <ul class="nav navconfig nav-pills nav-justified">
        <li class="nav-item">
          <a class="nav-link" aria-current="page" href="#">Nos Services</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Nous Trouver</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#"
            ><i class="icon far fa-envelope"></i> Nous Contacter</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link"
            ><i class="icon fas fa-phone"></i> {{ websiteInfo.phone_number }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "ContactLinks",
  props: ["websiteInfo"],
};
</script>
<style lang="scss" scoped>
.contact-links {
  width: 100%;
  background: white;
  .navtest {
    width: 100%;
    .nav {
      padding: 14px 56px;
      list-style: none;
      display: flex;
      justify-content: space-between;
      margin-top: 0;
      .nav-item {
        padding: 0.5rem 1rem;
        .nav-link {
          text-decoration: none;
          text-transform: uppercase;
          font-weight: 700;
          color: black;
          .icon {
            margin-right: 10px;
          }
        }
      }
    }
  }
}
// MEDIA QUERIES//

@media screen and (max-width: 576px) {
  .contact-links {
    .navtest {
      .nav {
        flex-direction: column;
        align-items: center;
      }
      .nav-item {
        margin-top: 24px;
      }
    }
  }
}
</style>