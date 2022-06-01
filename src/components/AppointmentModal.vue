<template>
  <div class="appointment-modal-wrapper" :show="show" @close="onClose">
    <div class="appointment-modal">
      <div class="loading-spiner" v-show="loading"></div>
      <div class="appoint-modal-inner-wrapper" ref="modal">
        <div class="modal-header">
          <div class="flex items-center">
            <button class="icon-btn" @click="backHandler" v-if="showTimes || !showDetails">
              <arrow-left :width="24" :height="24" />
            </button>
            <h2 class="calendar-heading">{{title}}</h2>
          </div>
          
          <div class="close-button-wrapper">
            <button class="close-button" @click="onClose">
              <i class="fa fa-close"></i>
            </button>
          </div>
        </div>
        <div class="modal-body" ref="modalbody">
          <MeetingDetail
            :nameProp="name"
            :phoneNumberProp="phoneNumber"
            :selectedServiceProp="seletedService"
            :services="services"
            v-if="showDetails"
            @set-values="setValues"
          />
          <MeetingSelector
            @select-date-time="onSelectDateTime"
            @select-date="onSelectDate"
            :showTimesProp="showTimes"
            :availabilities="availabilities"
            :appointments="appointments"
            :services="services"
            :seletedService="seletedService"
            v-if="showCalendar"
          ></MeetingSelector>
          <MeetingSummary
            v-if="showSummary"
            :name="name"
            :phoneNumber="phoneNumber"
            :service="seletedService"
            :services="services"
            :dateTime="dateTime"
          />
        </div>
        <div class="buttons-wrapper">
          <button @click="onClose">Cancel</button>
          <button
            class="btn-primary"
            :class="{
              disabled: !name || !phoneNumber || seletedService === 'Choose a service'
            }"
            :disabled="!name || !phoneNumber || seletedService === 'Choose a service'"
            v-if="showDetails"
            @click="nextHandler"
          >
            Next
          </button>
          <button
            v-else
            class="btn-primary"
            :class="{
              disabled: !name || !phoneNumber || seletedService === 'Choose a service' || !dateTime,
            }"
            :disabled="!name || !phoneNumber || seletedService === 'Choose a service' || !dateTime"
            @click="onSubmit"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MeetingDetail from "./MeetingDetail.vue";
import MeetingSelector from "./MeetingSelector.vue";
import MeetingSummary from "./MeetingSummary.vue";
import { collection, addDoc, getDocs } from "firebase/firestore";
import db from "@/config/firebase";
import ArrowLeft from "./icons/ArrowLeft.vue";
export default {
  name: "AppointmentModal",
  props: ["show", "services"],
  components: {
    MeetingSelector,
    MeetingDetail,
    MeetingSummary,
    ArrowLeft
  },
  data() {
    return {
      name: "",
      phoneNumber: "",
      seletedService: "Choose a service",
      collapse: false,
      dateTime: "",
      showDetails: true,
      title: "Enter Details",
      titles: [
        "Enter Details",
        "Select a Date & Time",
        "Select a Time",
        "Summary"
      ],
      showTimes: false,
      showSummary: false,
      showCalendar: false,
      availabilities: [],
      appointments: [],
      loading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const appointmentsDataTemp = await getDocs(collection(db, "appointments"));
      const availabilitiesDataTemp = await getDocs(collection(db, "availabilities"));

      const appointmentsData = [];
      appointmentsDataTemp.forEach((availability) => {
        appointmentsData.push(availability.data());
      })
      this.appointments = appointmentsData;

      const availabilitiesData = [];
      availabilitiesDataTemp.forEach((availability) => {
        availabilitiesData.push(availability.data());
      })
      this.availabilities = availabilitiesData;
    },
    onSelectDate(date) {
      if (date) {
        this.showTimes = true;
      }
      else {
        this.showTimes = false;
      }
    },
    onSelectDateTime(dateTime) {
      this.dateTime = dateTime;
      this.showSummary = true;
      this.showTimes = false;
      this.showCalendar = false;
    },
    toggle() {
      this.collapse = !this.collapse;
    },
    select(option) {
      this.seletedService = option;
    },
    onClose() {
      this.$emit("close");
    },
    nextHandler() {
      this.showDetails = false;
      this.showCalendar = true;
    },
    backHandler() {
      if (this.showTimes) this.showTimes = false;
      else if (this.showDetails) this.showDetails = false;
      else if (this.showCalendar) {
        this.showCalendar = false;
        this.showDetails = true;
      }
      else if (this.showSummary) {
        this.showSummary = false;
        this.showCalendar = true;
      }
    },
    setValues(payload) {
      if (payload?.type === 'name') this.name = payload?.value
      if (payload?.type === 'phoneNumber') this.phoneNumber = payload?.value
      if (payload?.type === 'seletedService') this.seletedService = payload?.value
    },
    async onSubmit() {
      try {
        this.loading = true;
        const docRef = await addDoc(collection(db, "appointments"), {
          seletedService: this.seletedService,
          name: this.name,
          phoneNumber: this.phoneNumber,
          date_time: this.dateTime,
        });
        console.log("Document written with ID: ", docRef.id);
        this.loading = false;
      } catch (e) {
        console.error("Error adding document: ", e);
        this.loading = false;
      }
      this.$emit("close");
    },
  },
  watch: {
    showTimes(val) {
      const bodyWidth = window.innerWidth;
      if (val) {
        this.title = this.titles[2];
        if (bodyWidth > 710) {
          this.$refs.modal.style.width = '650px';
        }
      }
      else {
        this.title = this.showDetails ? this.titles[0] : this.titles[1];
        if (bodyWidth > 710) this.$refs.modal.style.width = '400px';
      }
    },
    showDetails(val) {
      // const bodyWidth = window.innerWidth;
      if (val) {
        this.title = this.titles[0];
        // if (bodyWidth > 710) this.$refs.modal.style.width = '400px';
      }
      else {
        this.title = this.showTimes ? this.titles[2] : this.titles[1];
        // if (bodyWidth > 710) this.$refs.modal.style.width = '400px';
      }
    },
    showSummary(val) {
      if (val) {
        this.title = this.titles[3];
      }
      else {
        this.title = this.showTimes ? this.titles[2] : this.titles[1];
      }
    },
    showCalendar(val) {
      const bodyWidth = window.innerWidth;
      if (val) {
        if (bodyWidth > 710) this.$refs.modalbody.style.height = '410px';
      }
      else {
        if (bodyWidth > 710) this.$refs.modalbody.style.height = 'auto';
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.appointment-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;

  @media screen and (max-width: 710px) {
    position: fixed;
    height: 100%;
    min-height: 100vh;
    align-items: start;
  }

  background-color: rgba(0, 0, 0, 0.5);
  .appointment-modal {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 710px) {
      align-items: start;
    }
    
    .appoint-modal-inner-wrapper {
      width: 400px;
      height: max-content;
      border-radius: 16px;
      color: black;
      background: white;
      padding: 30px;
      position: relative;
      transition: all .3s ease;

      @media screen and (max-width: 710px) {
        width: 100%;
        height: auto;
        min-height: 100vh;
        border-radius: 0;
      }

      @media screen and (max-width: 460px) {
        padding: 20px;
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        .icon-btn {
          margin-right: 10px;
          display: flex;
          border-radius: 9999px;
          outline: none;
          border: 1px solid #ccc;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          &:hover {
            background-color: rgb(194, 194, 194);
          }
        }

        .calendar-heading {
          font-size: 20px;
        }

        .close-button-wrapper {
          .close-button {
            width: 30px;
            height: 30px;
            border: none;
            border-radius: 100px;
            background: white;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
      .modal-body {
        // height: 410px;

        @media screen and (max-width: 710px) {
          height: auto;
        }
      }
    }
    .buttons-wrapper {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      button {
        padding: 10px 20px;
        border: 1px solid #ddd;
        color: #333;
        background-color: #ddd;
        border-radius: 10px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background-color: rgb(194, 194, 194);
        }
        &.btn-primary {
          background-color: #1e1e1e;
          color: #fff;
        }
        &.disabled {
          opacity: .5;
          cursor: not-allowed;
        }
      }
    }
  }
}

// @media screen and (max-width: 1024px) {
//   .appointment-modal-wrapper {
//     .appointment-modal {
//       width: 58%;
//       left: 10%;
//     }
//   }
// }
// @media screen and (max-width: 786px) {
//   .appointment-modal-wrapper {
//     .appointment-modal {
//       width: 70%;
//       left: 10%;
//     }
//   }
// }
// @media screen and (max-width: 576px) {
//   .appointment-modal-wrapper {
//     .appointment-modal {
//       .input-group-wrapper {
//         .dropdown {
//           .aselect {
//             max-width: 100%;
//           }
//         }
//       }
//     }
//   }
// }
</style>