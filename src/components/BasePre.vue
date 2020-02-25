<template>
  <pre
    ref="pre"
    v-if="htmlString"
    v-html="htmlString"
    :spellcheck="spellcheck"
    v-on="listeners"
  />
  <pre
    ref="pre"
    v-else
    :spellcheck="spellcheck"
    v-on="listeners"
  ><slot></slot></pre>
</template>

<script>
/* eslint-disable */

export default {
  name: 'BasePre',
  props: {
    htmlString: {
      type: [String, Boolean],
      required: false,
      default: false,
    },
    scrollTop: {
      type: Number,
      required: false,
      default: 0,
    },
    spellcheck: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
      }
    },
  },
  watch: {
    scrollTop (value) {
      this.$refs['pre'].scrollTop = value
    },
  },
  methods: {
    getTextContent () {
      return this.$refs['pre'].textContent
    },
    getInnerText () {
      return this.$refs['pre'].innerText
    },
    getInnerHTML () {
      return this.$refs['pre'].innerHTML
    },
    getChildNodes () {
      return this.$refs['pre'].childNodes
    },
    getChildNodeAt (index) {
      return this.$refs['pre'].childNodes.item(index)
    },
    getScrollHeight () {
      return this.$refs['pre'].scrollHeight
    },
  },
}
</script>

<style lang="scss" scoped>
pre {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 35px 25px 25px;
  font: inherit;
  cursor: text;
  background: transparent;
  overflow-y: scroll;
  white-space: pre-wrap;
}

pre:not(.hidden) {
  color: inherit;
}

pre.hidden {
  position: absolute;
  top: 0;
  color: transparent;
  pointer-events: none;
}

pre:focus {
  outline: none;
}

// スクロールバーのスタイル
pre::-webkit-scrollbar {
  width: 6px;
  height: 0;
  background: transparent;
}
pre::-webkit-scrollbar-button {
  display: none;
}
pre::-webkit-scrollbar-track {
  border: none;
  box-shadow: none;
  background: transparent;
}
pre:not(.hidden)::-webkit-scrollbar-thumb {
  border-radius: 5px;
  box-shadow: white 0 0 2px inset;
  background: #0188ca;
}
pre.hidden::-webkit-scrollbar-thumb {
  background: transparent;
}
pre::-webkit-scrollbar-track-piece {
  background: transparent;
}
// リサイザーのスタイル
pre::-webkit-resizer {
  display: none;
}
</style>