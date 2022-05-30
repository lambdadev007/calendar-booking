<template>
  <div class="base-input-field">
    <input
      class="form-control"
      :type="type"
      name="input"
      id="input"
      required="required"
      :placeholder="placeholder"
      @input="onInput"
      :value="defaultValue"
    />
    <label>{{ label }}</label>
    <div class="req-mark">!</div>
  </div>
</template>
<script>
export default {
  name: "BaseInputField",
  props: ["placeholder", "type", "label", "defaultValue"],
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.base-input-field {
  border: 1px solid gainsboro;
  background: #f8f8f8;
  width: 100%;
  max-width: 100%;
  height: 44px;
  border-radius: 41px;
  border-top-right-radius: 0;
  box-shadow: 0 17px 40px 0 rgba(75, 128, 182, 0.07);
  margin-bottom: 22px;
  position: relative;
  font-size: 17px;
  color: #888;
  transition: opacity 0.2s ease-in-out, filter 0.2s ease-in-out,
    box-shadow 0.1s ease-in-out;
  &:hover {
    box-shadow: 0 14px 44px 0 rgba(0, 0, 0, 0.077);
  }
  input {
    position: absolute;
    border: 0;
    background-color: rgba(255, 255, 255, 0);
    top: 7px;
    height: 100%;
    width: 100%;
    padding: 0 18px;
    z-index: 1;
    display: block;
    color: rgb(30, 30, 30);
    transition: top 0.1s ease-in-out;
    border-radius: 41px;
    border-top-right-radius: 0;
    &::placeholder {
      color: rgba(0, 0, 0, 0);
    }
    &:focus,
    :not(:placeholder-shown) {
      top: 0px;
      border-top-right-radius: 0;
      outline: none;
      top: 8px;
    }
  }
  label {
    position: absolute;
    border: 0;
    inset: 0;
    display: flex;
    align-items: center;
    padding: 0px 18px;
    box-sizing: border-box;
    transition: all 0.1s ease-in-out;
    cursor: text;
  }
}
.base-input-field input:focus + label,
.base-input-field input:not(:placeholder-shown) + label {
  bottom: 20px;
  font-size: 13px;
  opacity: 0.7;
}
.req-mark {
  position: absolute;
  pointer-events: none;
  top: 0;
  right: 20px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 22px;
  color: #e0e0e0;
}
@media screen and (max-width: 576px) {
  .base-input-field {
    max-width: 100%;
    input {
      top: 0px;
      width: 90%;
    }
  }
}
</style>