<template>
  <div class="meeting-selector">
    <div class="calendar-wrapper" :class="{ 'mobile-hidden': showTimes }">
      <div class="loading-spiner" v-show="loading"></div>
      <Datepicker
        class="date-picker"
        v-model="date"
        placeholder="Choose a date"
        lang="en"
        :inline="true"
        :monday-first="true"
        :disabled-dates="disabledDates"
      />
    </div>
    <div class="times" v-if="showTimes">
      <div class="times-wrapper">
        <div
          v-for="(time, index) in times"
          :key="index"
          class="time-wrapper"
        >
          <button
            class="time"
            :class="{ selected: time.start_time == selectedTime }"
            @click="onSelectTime(time)"
          >
            {{ time.start_time }}
          </button>
          <button
            class="time-confirm-btn"
            @click="onTimeConfirm"
            :class="{ active: time.start_time == selectedTime }"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import moment from 'moment';
import momentTimezone from 'moment-timezone';

export default {
  name: "MeetingSelector",
  props: ['showTimesProp', 'availabilities', 'appointments', 'services', 'seletedService'],
  components: {
    Datepicker
  },
  data() {
    return {
      date: null,
      times: [],
      selectedTime: "",
      showTimes: false,
      disabledDates: {
        to: new Date(new Date().getTime() - 24*60*60*1000), // Yesterday's date
        days: [0],
        dates: []
      },
      loading: false
    };
  },
  methods: {
    onSelectTime(time) {
      this.selectedTime = time.start_time;
    },
    onTimeConfirm() {
      const dateTime = `${this.date.toISOString().split("T")[0]} ${
        this.selectedTime
      }`;
      this.$emit("select-date-time", dateTime);
    },
    getDisabledDates() {
      const disabled = [];

      this.availabilities.forEach(val => {
          if(!val.available || val.slots === 0) {
            const dayNumber = moment().day(val.date).day();
            disabled.push(dayNumber);
          }
      });

      this.disabledDates.days = disabled;
    },
    getTimeSlots(curDate) {
      let duration = 20; //minutes
      let bufferAfter = 10; //minutes
      const availabilities = this.availabilities;
      const appointments = this.appointments;

      if (this.services.length > 0 && this.seletedService !== '') {
        const service = this.services.find(service => service.name === this.seletedService);
        console.log('[service]', service)
        duration = service.duration;
        bufferAfter = service.buffer;
      }

      const spots = [];
      const date = moment(curDate).format('YYYY-MM-DD');
      const dow = moment(curDate).format('dddd').toLowerCase();
      console.log('[dow]', dow)

      const availability = availabilities.find(item => item.date === dow)
      console.log('[availability]', availability)

      if (availability.available && availability.slots > 0) {
        for(let i = 0; i < availability.intervals.length; i++) {
          const startTime = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + availability.intervals[i].from);
          const endTime = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + availability.intervals[i].to);
          const totalDuration = moment.duration(endTime.diff(startTime)).asMinutes();
          const timeForSpot = duration + bufferAfter;
          const numberOfAvailableSpots = parseInt(totalDuration / timeForSpot);
          const cursorDayAppointments = [];

          appointments.forEach((val) => {
              const appointmentDate = moment(val.date_time, 'YYYY-MM-DD hh:mmA').format('YYYY-MM-DD');
              const appointmentTime = moment(val.date_time, 'YYYY-MM-DD hh:mmA').format('hh:mmA');
              if(date === appointmentDate) {
                cursorDayAppointments.push({ time: appointmentTime, qty: 1 });
              }
          });

          let index = 0;
          while(index < numberOfAvailableSpots) {
              const newStartTimeObj = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + availability.intervals[i].from)
                                  .add( timeForSpot * index, 'minutes' );
              const newStartTime = newStartTimeObj.format('hh:mmA');
              const newEndTime = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + availability.intervals[i].from)
                                  .add( (timeForSpot * index + duration), 'minutes' ).format('hh:mmA')
              let slots = parseInt(availability.slots);

              cursorDayAppointments.forEach((val) => {
                if(val.time === newStartTime) {
                  console.log('[dddff]')
                  slots = slots - parseInt(val.qty);
                }
              });

              if(moment(new Date()).format('YYYY-MM-DD') == date) {
                  const ukNow = moment(momentTimezone.tz('Europe/Paris').format('YYYY-MM-DD hh:mmA'), 'YYYY-MM-DD hh:mmA');
                  const diff = moment.duration(newStartTimeObj.diff(ukNow));

                  console.log('[diff]', diff.asHours(), newStartTimeObj.format('hh:mmA'), ukNow.format('hh:mmA'));

                  if (diff.asHours() < 1) {
                      index++;
                      continue;
                  }
              }
              
              if (slots > 0) {
                spots.push({
                  start_time: newStartTime,
                  end_time: newEndTime,
                  slots: slots
                });
              }

              index++;
          }
        }
      }

      this.times = spots;

      console.log('[times]', spots)
      this.showTimes = true;
    }
  },
  mounted() {
    const elems = document.querySelectorAll('.vdp-datepicker__calendar span.cell.day');
    elems.forEach(elem => {
      elem.setAttribute('tabindex', 0)
    })

    this.loading = true;
    if (this.availabilities.length > 0) {
      this.getDisabledDates()
      this.loading = false
    }
  },
  watch: {
    date(date) {
      console.log(date)
      this.$emit("select-date", date);
      this.getTimeSlots(date)
    },
    showTimesProp(val) {
      this.showTimes = val;
    },
    availabilities(availabilities) {
      console.log('[availabilitiestttt]', availabilities)
      if (availabilities.length > 0) {
        this.getDisabledDates()
        this.loading = false
      }
    }
  }
};
</script>
<style>
.meeting-selector .vdp-datepicker__calendar {
  border: none;
  width: 100%;
}
.meeting-selector .cell.day-header {
  text-transform: uppercase;
  font-size: 11px !important;
}
.meeting-selector .vdp-datepicker__calendar .cell.day {
  height: 57px;
  line-height: 53px;
  border-radius: 9999px;
  position: relative;
  border: 3px solid #fff;
}
@media screen and (max-width: 460px) {
.meeting-selector .vdp-datepicker__calendar .cell.day {
  height: 50px;
  line-height: 46px;
}
}
.meeting-selector .cell.day:not(.disabled):not(.blank) {
  color: #1e1e1e;
  font-weight: 700;
  background-color: #e6e6e6;
}
.meeting-selector .cell.day:not(.disabled):not(.blank):hover {
  background-color: #bfbfbf;
  border: 3px solid #fff !important;
}
.meeting-selector .cell.day:not(.disabled):not(.blank)::selection {
  outline: 2px solid #1e1e1e;
  outline-offset: 1px;
}
.meeting-selector .cell.day:not(.disabled):not(.blank):focus {
  outline: 2px solid #1e1e1e;
  outline-offset: 1px;
}
.meeting-selector .vdp-datepicker__calendar .cell.day.selected {
  background-color: #1e1e1e;
  color: #fff;
}
.meeting-selector .vdp-datepicker__calendar .cell.day.selected:hover {
  background-color: #1e1e1e;
  color: #fff;
}
</style>
<style lang="scss" scoped>
.meeting-selector {
  display: flex;
  height: 100%;
  width: 100%;

  @media screen and (max-width: 710px) {
    display: block;
  }

  .calendar-wrapper {
    display: block;
    position: relative;

    &.mobile-hidden {
      display: block;
      @media screen and (max-width: 710px) {
        display: none;
      }
    }
  }

  .times {
    margin-top: 5px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    width: 250px;
    overflow-y: auto;
    flex-shrink: 0;

    @media screen and (max-width: 710px) {
      width: 100%;
    }

    .times-wrapper {
      margin: 0;
      padding: 0 10px;
      width: 100%;
    }
    .time-wrapper {
      display: flex;
      overflow: hidden;
    }
    .time {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #1e1e1e;
      background: #fff;
      border-radius: 4px;
      width: 100%;
      color: #1e1e1e;
      font-size: 16px;
      cursor: pointer;
      margin: 5px 0;
      height: 52px;
      font-weight: 700;
      transition: width .3s ease;

      &:hover {
        border: 2px solid #1e1e1e;
      }
      &.selected {
        background: #888;
        color: white;
        border: 1px solid #888;
        width: 50%;
      }
    }
    .time-confirm-btn {
      background-color: #1e1e1e;
      width: 0;
      color: #fff;
      font-size: 16px;
      height: 52px;
      border-radius: 4px;
      border: 1px solid #1e1e1e;
      cursor: pointer;
      font-weight: 600;
      margin: 0;
      padding: 0;
      transition: all .3s ease;
      transform: translateX(100%);
      visibility: hidden;
      margin: 5px 0;

      &.active {
        width: 50%;
        transform: translateX(0);
        visibility: visible;
        margin: 5px 0 5px 5px;
      }
    }
  }
}
</style>