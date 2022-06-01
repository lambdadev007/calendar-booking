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
        <div class="no-times" v-if="times.length === 0">Sorry, there is no time available on this date.</div>
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
      const dateTime = `${moment(this.date).format('YYYY-MM-DD')} ${this.selectedTime}`
      this.$emit("select-date-time", dateTime);
    },
    getDisabledDates() {
      const disabled = [];

      this.availabilities.forEach(val => {
          if(!val.available || val.slots === 0) {
            const dayNumber = moment().day(val.date).day()
            disabled.push(dayNumber)
          }
      })

      this.disabledDates.days = disabled
    },
    getCurrentDayAppointments(_appointments, _date) {
      const cursorDayAppointments = []

      _appointments.forEach((val) => {
        const service = this.services.find(service => service.name === val.seletedService)
        const appointmentDate = moment(val.date_time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
        const appointmentTime = moment(val.date_time, 'YYYY-MM-DD HH:mm').format('HH:mm')
        if (_date === appointmentDate) {
          cursorDayAppointments.push({
            time: appointmentTime,
            qty: 1,
            duration: parseInt(service.duration) + parseInt(service.buffer) 
          })
        }
      })

      return cursorDayAppointments
    },
    updateIntervals(_intervals, _appointments, _slots, _date, _bufferForSamedayBooking) {
      let newIntervals = []

      for(let i = 0; i < _intervals.length; i++) {
        let startTime = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + _intervals[i].from, 'YYYY-MM-DD HH:mm')
        let endTime = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + _intervals[i].to, 'YYYY-MM-DD HH:mm')
        let flag1 = false
        let flag2 = false

        while(startTime.unix() < endTime.unix()) {
          let newStartTime = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + _intervals[i].from, 'YYYY-MM-DD HH:mm')
          let newEndTime = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + _intervals[i].to, 'YYYY-MM-DD HH:mm')

          let slots = parseInt(_slots)
          _appointments.forEach((val) => {
            const fromObj = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + val.time, 'YYYY-MM-DD HH:mm')
            const fromTimestamp = fromObj.unix()
            const toObj = fromObj.add(val.duration, 'minutes')
            const toTimestamp = toObj.unix()
            
            if (startTime.unix() >= fromTimestamp && startTime.unix() < toTimestamp) {
              slots = slots - parseInt(val.qty)
            }
          })

          if (slots == 0) {
            if (!flag1) {
              newEndTime = startTime
              newIntervals.push({
                id: i,
                from: newStartTime.format('HH:mm'),
                to: newEndTime.format('HH:mm'),
                updated: true
              })
              flag1 = true
            }
            startTime = startTime.add(5, 'minutes')
            flag2 = false
          }
          else {
            if (!flag2) {
              newStartTime = startTime
              let updated = false
              if (flag1) updated = true
              newIntervals.push({
                id: i,
                from: newStartTime.format('HH:mm'),
                to: newEndTime.format('HH:mm'),
                updated: updated
              })
              flag2 = true
            }
            startTime = startTime.add(5, 'minutes')
            flag1 = false
          }
        }
      }

      console.log('[newIntervals - 1]', newIntervals)
      newIntervals = newIntervals.filter(interval => {
        const from = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + interval.from, 'YYYY-MM-DD HH:mm')
        const to = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + interval.to, 'YYYY-MM-DD HH:mm')
        return to.diff(from) > 0
      }).filter(interval => {
        if (!interval.updated) {
          const isSameIdwithTrueExist = newIntervals.find(item => (item.id === interval.id && item.updated))
          if (isSameIdwithTrueExist) return false
        }

        return true
      }).map(interval => {
        if(moment(new Date()).format('YYYY-MM-DD') == _date) {
          const franceTimeAfterBuffer = moment(momentTimezone.tz('Europe/Paris').format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm').add(_bufferForSamedayBooking, 'minutes')
          const from = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + interval.from, 'YYYY-MM-DD HH:mm')
          const to = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + interval.to, 'YYYY-MM-DD HH:mm')
          console.log('[AAA]', franceTimeAfterBuffer.format('HH:mm'), from.format('HH:mm'))

          if (franceTimeAfterBuffer.unix() >= from.unix() && to.unix() > franceTimeAfterBuffer.unix()) {
            return {
              ...interval,
              from: franceTimeAfterBuffer.format('HH:mm'),
              filterable: true
            }
          }
          else if (franceTimeAfterBuffer.unix() < from.unix() && to.unix() > franceTimeAfterBuffer.unix()) {
            return {
              ...interval,
              filterable: true
            }
          }
          else {
            return {
              ...interval,
              filterable: false
            }
          }
        }
        else {
          return {
            ...interval,
            filterable: true
          }
        }
      }).filter(interval => interval.filterable)
      console.log('[newIntervals - 2]', newIntervals)

      return newIntervals
    },
    getTimeSlots(_curDate) {
      try {
        let duration = 20 //minutes
        let bufferAfter = 10 //minutes
        let bufferTimeForSameDayBooking = 60 // minutes
        const availabilities = this.availabilities
        const appointments = this.appointments

        if (this.services.length > 0 && this.seletedService !== '') {
          const service = this.services.find(service => service.name === this.seletedService)
          duration = service.duration
          bufferAfter = service.buffer
          bufferTimeForSameDayBooking = service.bufferTimeForSameDayBooking
        }

        const spots = []
        const date = moment(_curDate).format('YYYY-MM-DD')
        const dow = moment(_curDate).format('dddd').toLowerCase()

        const availability = availabilities.find(item => item.date === dow)

        if (availability.available && availability.slots > 0) {
          const cursorDayAppointments = this.getCurrentDayAppointments(appointments, date)

          const intervals = this.updateIntervals(availability.intervals, cursorDayAppointments, availability.slots, date, bufferTimeForSameDayBooking)
          
          for(let i = 0; i < intervals.length; i++) {
            const startTime = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + intervals[i].from, 'YYYY-MM-DD HH:mm')
            const endTime = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + intervals[i].to, 'YYYY-MM-DD HH:mm')

            const startTimeStr = startTime.format('HH:mm')

            const totalDuration = moment.duration(endTime.diff(startTime)).asMinutes()
            const timeForSpot = duration + bufferAfter
            let numberOfAvailableSpots = parseInt(totalDuration / timeForSpot)
            if (totalDuration % timeForSpot === duration) numberOfAvailableSpots++

            let index = 0
            while(index < numberOfAvailableSpots) {
              const newStartTimeObj = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + startTimeStr, 'YYYY-MM-DD HH:mm').add(timeForSpot * index, 'minutes')
              const newStartTime = newStartTimeObj.format('HH:mm')
              const newStartTimesStamp = newStartTimeObj.unix()
              const newEndTimeObj = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + startTimeStr, 'YYYY-MM-DD HH:mm').add(timeForSpot * index + duration, 'minutes')
              const newEndTime = newEndTimeObj.format('HH:mm')
              const newEndTimesStamp = newEndTimeObj.unix()

              let slots = parseInt(availability.slots)

              cursorDayAppointments.forEach((val) => {
                const fromObj = moment(moment(new Date()).format('YYYY-MM-DD') + ' ' + val.time, 'YYYY-MM-DD HH:mm')
                const fromTimestamp = fromObj.unix()
                const toObj = fromObj.add(val.duration, 'minutes')
                const toTimestamp = toObj.unix()
                
                if((newStartTimesStamp >= fromTimestamp && newStartTimesStamp < toTimestamp) || (newEndTimesStamp >= fromTimestamp && newEndTimesStamp < toTimestamp)) {
                  slots = slots - parseInt(val.qty)
                }
              });
              
              if (slots > 0) {
                spots.push({
                  start_time: newStartTime,
                  end_time: newEndTime,
                  slots: slots
                })
              }

              index++
            }
          }
        }

        this.times = spots
        this.showTimes = true
      }
      catch (err) {
        console.log('[err]', err)
      }
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
      this.$emit("select-date", date);
      this.getTimeSlots(date)
    },
    showTimesProp(val) {
      this.showTimes = val;
    },
    availabilities(availabilities) {
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
.meeting-selector .cell.month.selected, .meeting-selector .cell.year.selected {
  background-color: #1e1e1e;
  color: #fff;
}
.meeting-selector .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {
  border-color: #1e1e1e !important;
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