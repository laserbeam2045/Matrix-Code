<template>
  <div
    class="draggable"
    :class="{ dragging }"
  >
    <slot></slot>
    <div
      class="drag-bar"
      @mousedown="addDragListener"
      @touchstart="addDragListener"
    />
  </div>
</template>

<script>
/* eslint-disable */
import eventHandler, * as EVENTNAME from '../mixins/eventHandler'

export default {
  name: "Draggable",
  mixins: [
    eventHandler,
  ],
  props: {
    top: {
      type: [Number, String],
      required: true,
    },
    left: {
      type: [Number, String],
      required: true,
    },
  },
  data () {
    return {
      dragging: false,
      x: 0,
      y: 0,
    }
  },
  methods: {
    addDragListener () {
      event.preventDefault()
      this.dragging = true
      this.setInitialValue(event)
      document.body.addEventListener(EVENTNAME.TOUCHMOVE, this.drag)
      document.body.addEventListener(EVENTNAME.TOUCHEND,   this.removeDragListener)
      document.body.addEventListener(EVENTNAME.TOUCHLEAVE, this.removeDragListener)
    },
    setInitialValue (e) {
      const element = this.getClosestElement(this.$el, this.isPositionAbsolute)
      this.x = this.getPageX(e) - element.offsetLeft
      this.y = this.getPageY(e) - element.offsetTop
    },
    drag (e) {
      if (this.dragging) {
        this.$emit('update:top',  (this.getPageY(e) - this.y) + 'px')
        this.$emit('update:left', (this.getPageX(e) - this.x) + 'px')
      }
    },
    removeDragListener () {
      this.dragging = false
      document.body.removeEventListener(EVENTNAME.TOUCHMOVE, this.drag)
      document.body.removeEventListener(EVENTNAME.TOUCHEND,   this.removeDragListener)
      document.body.removeEventListener(EVENTNAME.TOUCHLEAVE, this.removeDragListener)
    },
  },
}
</script>

<style lang="scss" scoped>
.draggable {
  position: relative;
  width: 100%;
  height: 100%;

  .drag-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    cursor: move;
  }
}
</style>