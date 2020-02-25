<template>
  <p
    ref="BaseP"
    v-html="htmlString"
    @input="$emit('input', $event)"
    @scroll="$emit('scroll', $event)"
    @keydown="$emit('keydown', $event)"
  >
    <slot></slot>
  </p>
</template>

<script>
/* eslint-disable */
export default {
  name: 'BaseP',
  props: {
    'htmlString': {
      type: String,
      required: true,
    },
    'scrollTop': {
      type: Number,
      required: false,
      default: 0,
    },
  },
  watch: {
    'scrollTop' (newValue) {
      this.$refs['BaseP'].scrollTop = newValue
    },
  },
  methods: {
    getScrollHeight () {
      return this.$refs['BaseP'].scrollHeight
    },
  },
}
</script>

<style lang="scss" scoped>
p {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 55px 25px 25px;
  color: inherit;
  background: transparent;
  overflow-y: scroll;
  font: inherit;
  cursor: text;
  //pointer-events: none;
}

p::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #42cbf8;
}
p::-webkit-scrollbar {
  width: 5px;
  box-shadow: none;
  background: transparent;
}
p::-webkit-scrollbar-track {
  border: none;
  box-shadow: none;
  background: transparent;
}
p::-webkit-scrollbar-thumb {
  box-shadow: none;
  background: transparent;
}
</style>