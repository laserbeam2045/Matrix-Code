<template>
  <textarea
    spellcheck="false"
    ref="BaseTextarea"
    :value="value"
    @input="inputEvent"
    @scroll="$emit('scroll', $event)"
    @keydown="$emit('keydown', $event)"
  />
</template>

<script>
/* eslint-disable */
export default {
  name: 'BaseTextarea',
  props: {
    'value': {
      type: String,
      required: false,
      default: '',
    },
    'scrollTop': {
      type: Number,
      required: false,
      default: 0,
    },
  },
  watch: {
    'scrollTop' (newValue) {
      this.$refs['BaseTextarea'].scrollTop = newValue
    },
  },
  methods: {
    focus () {
      this.$refs['BaseTextarea'].focus()
    },
    getScrollHeight () {
      return this.$refs['BaseTextarea'].scrollHeight
    },
    getSelection () {
      return {
        start: this.$refs['BaseTextarea'].selectionStart,
        end  : this.$refs['BaseTextarea'].selectionEnd,
      }
    },
    setSelection (selection) {
      this.$refs['BaseTextarea'].selectionStart = selection.start
      this.$refs['BaseTextarea'].selectionEnd = selection.end
    },
    inputEvent ($event) {
      this.$emit('input', $event.target.value)
      this.$emit('managed-input', $event)
    },
  },
}
</script>

<style lang="scss" scoped>
textarea {
  display: block;
  min-width: 243px;   // 1.618
  min-height: 150px;
  margin: 0;
  padding: 45px 25px 25px;
  color: inherit;
  font: inherit;
  background: transparent;
  border: none;
}

textarea:focus {
  outline: none;
}

textarea::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #42cbf8;
}
::-webkit-scrollbar {
  width: 5px;
  box-shadow: none;
  background: transparent;
}
::-webkit-scrollbar-track {
  border: none;
  box-shadow: none;
  background: transparent;
}
::-webkit-scrollbar-thumb {
  box-shadow: none;
  background: transparent;
}

::selection {
  color: white;
  background: rgba(0, 112, 202, 0.5);
}
::-moz-selection {
  color: white;
  background: rgba(0, 112, 202, 0.5);
}
</style>