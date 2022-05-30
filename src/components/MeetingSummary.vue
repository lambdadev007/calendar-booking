<template>
    <div class="meeting-summary">
        <div class="summary-item">
            <div class="summary-label">Name: </div>
            <div class="summary-value">{{ name }}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Phone Number: </div>
            <div class="summary-value">{{ phoneNumber }}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Choosen Service: </div>
            <div class="summary-value">{{ service }}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Date/Time: </div>
            <div class="summary-value">{{ dateTime }}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Duration: </div>
            <div class="summary-value">{{ duration }} minutes</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MeetingSummary',
    props: ['name', 'phoneNumber', 'service', 'services', 'dateTime'],
    computed: {
        duration() {
            return this.services.find(service => service.name === this.service)?.duration;
        }
    }
}
</script>

<style lang="scss" scoped>
.meeting-summary {
    width: 100%;

    .summary-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 5px 15px;
        border-bottom: 1px solid #ccc;

        .summary-label {
            font-weight: 700;
        }
    }
}
</style>