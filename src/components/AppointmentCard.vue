<template>
  <div class="appointment-card" v-if="websiteInfo && services">
    <div class="title-site">
      <h2 class="website-title" v-if="!websiteInfo.website_logo">
        Energy Plus
      </h2>
      <img
        src="@/assets/logo.png"
        class="logo"
        width="100%"
        alt="site logo"
        v-if="websiteInfo.website_logo"
      />
    </div>
    <div class="buttons-wrapper">
      <button class="btn" @click="onAppointmentModal">Nos Services</button>
      <button class="btn" @click="onAppointmentModal">Prendre RDV</button>
    </div>
    <AppointmentModal
      v-if="show"
      @close="onClose"
      :services="services"
    ></AppointmentModal>
    <div class="schedule">
      <div class="address col-12">
        <p>
          {{ websiteInfo.address }} - <a class="link" href="#">Voir la carte</a>
        </p>
      </div>
      <p class="title">Horaires</p>
      <div class="date-and-time">
        <div class="grid" v-for="(schedule, index) in schedules" :key="index">
          <span class="day">{{ schedule.name }}</span>
          <span class="time" style="margin-left: 20px"
            >{{ schedule.value }}
          </span>
        </div>
      </div>
    </div>
    <div class="appointment-label">
      <p class="label">
        Lequipe Energie Plus vous propose ces services d'installation, de
        maintenance et de depannage de tous vos equipements Climatisation et
        Pompe a chaleur !
      </p>
    </div>
    <div class="services">
      <div class="service" v-for="(service, index) in services" :key="index">
        <i class="icon fa-brands fa-angular"></i>
        <p class="label">{{ service.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import AppointmentModal from "./AppointmentModal.vue";
import db from "@/config/firebase";
export default {
  name: "AppointmentCard",
  props: ["websiteInfo", "services"],
  components: {
    AppointmentModal,
  },
  data() {
    return {
      website_info: [],
      show: false,
      appointments: [],
      schedules: [],
    };
  },
  methods: {
    onClose() {
      this.show = false;
    },
    async init() {
      const querySnapshot = await getDocs(collection(db, "schedules"));
      querySnapshot.forEach((schedule) => {
        this.schedules.push({ ...schedule.data(), id: schedule.id });
      });
    },
    async fetchAppointments() {
      this.appointments = [];
      const querySnapshot = await getDocs(collection(db, "appointments"));
      querySnapshot.forEach((doc) => {
        this.appointments.push({ ...doc.data(), id: doc.id });
      });
    },
    onAppointmentModal() {
      this.show = true;
    },
  },
  created() {
    this.init();
  },
  watch: {
    // show(val) {
    //   if (val) document.body.style.overflowY = 'hidden'
    //   else document.body.style.overflowY = 'auto'
    // }
  }
};
</script>

<style scoped lang="scss">
.appointment-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: max-content;
  width: 43%;
  background-color: white;
  border-radius: 12px;
  margin: 23px auto 15px 80px;
  .title-site {
    display: flex;
    justify-content: center;
    margin-top: 4%;
    .logo {
      margin-top: 20px;
      width: 43%;
    }
    .website-title {
      font-size: 2em;
      margin: 20px;
      font-weight: 700;
      color: #212529;
    }
  }
  .buttons-wrapper {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin: 30px auto 70px auto;
    .btn {
      background: rgb(30, 30, 30);
      border-radius: 999px;
      box-shadow: #3f3f3f 0 10px 5px -10px;
      color: #ffffff;
      cursor: pointer;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      opacity: 1;
      outline: 0 solid transparent;
      padding: 8px 18px;
      width: fit-content;
      word-break: break-word;
      border: 0;
    }
  }
  .schedule {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    background-color: rgba(211, 211, 211, 0.318);
    padding: 3% 0;
    margin-bottom: 7%;
    .address {
      position: absolute;
      left: 16px;
      top: -50px;
      .link {
        color: #007bff;
        text-decoration: none;
        &:hover {
          color: #0056b3;
          text-decoration: underline;
        }
      }
    }
    .title {
      font-weight: 700;
      color: #212529;
      margin-top: 4px;
    }
    .date-and-time {
      width: 100%;
      margin: auto;
      .grid {
        display: flex;
        justify-content: space-between;
      }
    }
    .day,
    .time {
      width: 100%;
      line-height: 1.5;
      color: #212529;
      text-transform: capitalize;

      .label {
        text-transform: capitalize;
      }
    }
    .day {
      text-align: center;
      text-transform: capitalize;
    }
  }
  .appointment-label {
    padding: 12px;
    margin-bottom: 4px;
    text-align: center;
    .label {
      margin: 0;
    }
  }
  .services {
    width: 100%;
    display: flex;
    justify-content: stretch;
    .service {
      width: inherit;
      border: solid 1px black;
      padding: 15px;
      text-align: center;
      font-weight: 700;
      text-transform: uppercase;
      .label {
        word-break: word-break;
        margin: 0;
      }
      .icon {
        font-size: 40px;
      }
      &:last-child {
        border-bottom-right-radius: 12px;
        border-left: 0;
      }
      &:first-child {
        border-bottom-left-radius: 12px;
        border-right: 0;
      }
    }
  }
}
// MEDIA QUERIES//

@media screen and (max-width: 576px) {
  .appointment-card {
    width: 100%;
    margin: 0;
    border-radius: 0;
    .buttons-wrapper {
      .btn {
        height: 40px;
        width: fit-content;
        font-size: 12px;
      }
    }
    .schedule {
      .date-and-time {
        width: 100%;
        font-size: 14px;
      }
    }
    .appointment-label {
      .label {
        font-size: 14px;
      }
    }
    .services {
      .service {
        font-size: 12px;
      }
    }
  }
}

@media (min-width: 576px) and (max-width: 768px) {
  .appointment-card {
    width: 90%;
    margin: 24px auto auto;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .appointment-card {
    width: 60%;
  }
}

@media screen and (min-width: 1440px) {
  .appointment-card {
    width: 35%;
  }
}
</style>
