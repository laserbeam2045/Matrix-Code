<template>
  <div
    class="resizable"
    :class="{ resizing }"
  >
    <slot></slot>
    <div
      v-for="className in resizerClassList"
      :class="className"
      :key="className"
      @mousedown="addResizeListener"
      @touchstart="addResizeListener"
    />
  </div>
</template>

<script>
/* eslint-disable */
import eventHandler, * as EVENTNAME from '../mixins/eventHandler'

export default {
  name: 'Resizable',
  mixins: [
    eventHandler,
  ],
  props: {
    width: {
      type: [Number, String],
      required: true,
    },
    height: {
      type: [Number, String],
      required: true,
    },
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
      resizing: false,
      clientWidth: 0,
      clientHeight: 0,
      offsetLeft: 0,
      offsetTop: 0,
      pageX: 0,
      pageY: 0,
      resizerClass: null,
      resizerClassList: [
        'resize-top',
        'resize-left',
        'resize-right',
        'resize-bottom',
        'resize-top-left',
        'resize-top-right',
        'resize-bottom-left',
        'resize-bottom-right',
      ],
    }
  },
  computed: {
    resizeListener () {
      switch (this.resizerClass) {
        case 'resize-top': return this.resizeTop
        case 'resize-left': return this.resizeLeft
        case 'resize-right': return this.resizeRight
        case 'resize-bottom': return this.resizeBottom
        case 'resize-top-left': return this.resizeTopLeft
        case 'resize-top-right': return this.resizeTopRight
        case 'resize-bottom-left': return this.resizeBottomLeft
        case 'resize-bottom-right': return this.resizeBottomRight
        default: return null
      }
    },
  },
  methods: {
    addResizeListener () {
      event.preventDefault()
      this.resizerClass = event.target.classList[0]
      if (this.resizeListener) {
        this.resizing = true
        this.setInitialValue(event)
        document.body.addEventListener(EVENTNAME.TOUCHMOVE, this.resizeListener)
        document.body.addEventListener(EVENTNAME.TOUCHEND,   this.removeResizeListener)
        document.body.addEventListener(EVENTNAME.TOUCHLEAVE, this.removeResizeListener)
      }
    },
    setInitialValue (e) {
      const element = this.getClosestElement(this.$el, this.isPositionAbsolute)
      this.clientWidth  = element.clientWidth
      this.clientHeight = element.clientHeight
      this.offsetTop  = element.offsetTop
      this.offsetLeft = element.offsetLeft
      this.pageX = this.getPageX(e)
      this.pageY = this.getPageY(e)
    },
    removeResizeListener () {
      this.resizing = false
      document.body.removeEventListener(EVENTNAME.TOUCHMOVE, this.resizeListener)
      document.body.removeEventListener(EVENTNAME.TOUCHEND,   this.removeResizeListener)
      document.body.removeEventListener(EVENTNAME.TOUCHLEAVE, this.removeResizeListener)
    },
    resizeTop () {
      this.$emit('update:height', this.getNewHeight(event, -1))
      this.$emit('update:top', this.getNewTop(event))
    },
    resizeLeft () {
      this.$emit('update:width', this.getNewWidth(event, -1))
      this.$emit('update:left', this.getNewLeft(event))
    },
    resizeRight () {
      this.$emit('update:width', this.getNewWidth(event))
    },
    resizeBottom () {
      this.$emit('update:height', this.getNewHeight(event))
    },
    resizeTopLeft () {
      this.$emit('update:width', this.getNewWidth(event, -1))
      this.$emit('update:height', this.getNewHeight(event, -1))
      this.$emit('update:top', this.getNewTop(event))
      this.$emit('update:left', this.getNewLeft(event))
    },
    resizeTopRight () {
      this.$emit('update:width', this.getNewWidth(event))
      this.$emit('update:height', this.getNewHeight(event, -1))
      this.$emit('update:top', this.getNewTop(event))
    },
    resizeBottomLeft () {
      this.$emit('update:width', this.getNewWidth(event, -1))
      this.$emit('update:height', this.getNewHeight(event))
      this.$emit('update:left', this.getNewLeft(event))
    },
    resizeBottomRight () {
      this.$emit('update:width', this.getNewWidth(event))
      this.$emit('update:height', this.getNewHeight(event))
    },
    getNewWidth (e, direction=1) {
      return (this.clientWidth + direction * (this.getPageX(e) - this.pageX)) + 'px'
    },
    getNewHeight (e, direction=1) {
      return (this.clientHeight + direction * (this.getPageY(e) - this.pageY)) + 'px'
    },
    getNewTop (e) {
      return (this.getPageY(e) - (this.pageY - this.offsetTop)) + 'px'
    },
    getNewLeft (e) {
      return (this.getPageX(e) - (this.pageX - this.offsetLeft)) + 'px'
    },
  },
}
</script>

<style lang="scss" scoped>
.resizable {
  position: relative;
  width: 100%;
  height: 100%;

  > div {
    position: absolute;
  }
  .resize-top {
    top: -3px;
    width: 100%;
    height: 7px;
    cursor: ns-resize;
  }
  .resize-left {
    left: -3px;
    width: 7px;
    height: 100%;
    cursor: ew-resize;
  }
  .resize-right {
    right: -3px;
    width: 7px;
    height: 100%;
    cursor: ew-resize;
  }
  .resize-bottom {
    bottom: -3px;
    width: 100%;
    height: 7px;
    cursor: ns-resize;
  }
  .resize-top-left {
    top: -4px;
    left: -4px;
    width: 9px;
    height: 9px;
    cursor: nw-resize;
  }
  .resize-top-right {
    top: -4px;
    right: -4px;
    width: 9px;
    height: 9px;
    cursor: ne-resize;
  }
  .resize-bottom-left {
    left: -4px;
    bottom: -4px;
    width: 9px;
    height: 9px;
    cursor: sw-resize;
  }
  .resize-bottom-right {
    right: -4px;
    bottom: -4px;
    width: 9px;
    height: 9px;
    cursor: se-resize;
  }
}

.resizable.resizing {
  user-select: none;

  .resize-top {
    top: -50px;
    height: 100px;
  }
  .resize-left {
    left: -50px;
    width: 100px;
  }
  .resize-right {
    right: -50px;
    width: 100px;
  }
  .resize-bottom {
    bottom: -50px;
    height: 100px;
  }
  .resize-top-left {
    top: -50px;
    left: -50px;
    width: 100px;
    height: 100px;
  }
  .resize-top-right {
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
  }
  .resize-bottom-left {
    left: -50px;
    bottom: -50px;
    width: 100px;
    height: 100px;
  }
  .resize-bottom-right {
    right: -50px;
    bottom: -50px;
    width: 100px;
    height: 100px;
  }
}
</style>