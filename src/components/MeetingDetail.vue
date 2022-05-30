<template>
    <div class="input-group-wrapper">
        <BaseInputField
            :placeholder="'enter name'"
            type="text"
            v-model="name"
            label="Name"
            :defaultValue="nameProp"
        ></BaseInputField>
        <BaseInputField
            v-model="phoneNumber"
            :placeholder="'Enter phone no'"
            type="phoneNumber"
            label="Phone number"
            :defaultValue="phoneNumberProp"
        ></BaseInputField>
        <div class="dropdown">
            <h1 class="title">Choosen service</h1>

            <div class="aselect">
                <div class="selector" @click="toggle()">
                    <div class="label">
                        <span>{{ seletedService }}</span>
                    </div>
                    <div class="arrow" :class="{ expanded: collapse }"></div>
                    <div :class="{ hidden: !collapse, collapse }">
                        <ul>
                            <li
                                :class="{ current: service.name === seletedService }"
                                v-for="(service, index) in services"
                                :key="index"
                                @click="select(service.name)"
                            >
                                {{ service.name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BaseInputField from "./BaseInputField.vue";

export default {
    props: ["services", "nameProp", "phoneNumberProp", "selectedServiceProp"],
    components: {
        BaseInputField
    },
    data() {
        return {
            name: "",
            phoneNumber: "",
            note: "",
            seletedService: "Choose a service",
            collapse: false
        };
    },
    methods: {
        toggle() {
            this.collapse = !this.collapse;
        },
        select(option) {
            this.seletedService = option;
        }
    },
    mounted() {
        if (this.selectedServiceProp) this.seletedService = this.selectedServiceProp;
    },
    watch: {
        name(val) {
            const payload = {
                type: 'name',
                value: val
            }
            this.$emit('set-values', payload)
        },
        phoneNumber(val) {
            const payload = {
                type: 'phoneNumber',
                value: val
            }
            this.$emit('set-values', payload)
        },
        seletedService(val) {
            console.log('[seletedService]', val)
            const payload = {
                type: 'seletedService',
                value: val
            }
            this.$emit('set-values', payload)
        },
        selectedServiceProp(val) {
            if (val) this.seletedService = this.selectedServiceProp;
        }
    }
}
</script>

<style lang="scss" scoped>
.input-group-wrapper {
    padding: 5px 0;
    .dropdown {
    z-index: 2345;
    .title {
        margin: 5px;
        text-align: left;
        font-size: 14px;
        color: grey;
    }
    .aselect {
        width: 100%;
        max-width: 100%;
        margin-bottom: 20px;
        .selector {
        border: 1px solid gainsboro;
        background: #f8f8f8;
        position: relative;
        z-index: 1;
        border-radius: 41px;
        border-top-right-radius: 0;
        .arrow {
            position: absolute;
            right: 10px;
            top: 40%;
            width: 0;
            height: 0;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 10px solid #888;
            transform: rotateZ(0deg) translateY(0px);
            transition-duration: 0.3s;
            transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
        }
        .expanded {
            transform: rotateZ(180deg) translateY(2px);
        }
        .label {
            display: block;
            padding: 12px;
            font-size: 17px;
            color: #888;
        }
        }
        ul {
        margin-top: 4px;
        border-radius: 8px;
        width: 100%;
        list-style-type: none;
        padding: 0;
        font-size: 16px;
        border: 1px solid gainsboro;
        position: absolute;
        z-index: 1;
        background: #fff;
        }
        li {
        padding: 12px;
        color: #666;
        cursor: pointer;
        &:hover {
            color: white;
            background: grey;
        }
        }
        .current {
        background: #eaeaea;
        }
        .hidden {
        visibility: hidden;
        }
        .visible {
        visibility: visible;
        }
    }
    }
}
</style>