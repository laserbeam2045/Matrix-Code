<template>
  <div class="loading-window" :class="{ wavetop, wavebottom }">
    <label>
      <span>
        <slot></slot>
      </span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'LoadingWindow',
  props: {
    wavetop: {
      type: Boolean,
      required: false,
      default: true,
    },
    wavebottom: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
*::before, *::after {
  content: '';
}

@keyframes loading-scale {
  0% {
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scaleX(.7);
    transform: scaleX(.7);
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleX(1.4);
    transform: scaleX(1.4);
    opacity: 1;
  }
}

div.loading-window {
  min-width: 200px;
  position: relative;
  display: inline-block;
  overflow: hidden;

  label {
    display: block;
    padding: 11px 30px 10px;
    font-family: 'Orbitron',sans-serif;
    font-size: 15px;
    line-height: 1;
    letter-spacing: 1px;
    text-align: center;
    color: #14e6fa;
    text-shadow: rgba(0,90,255,0.66)  4px  4px 10px,
                 rgba(0,90,255,0.66) -4px  4px 10px,
                 rgba(0,90,255,0.66)  4px -4px 10px,
                 rgba(0,90,255,0.66) -4px -4px 10px;

    span::before {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: auto;
    }
    span::after {
      position: absolute;
      top: auto;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
div.loading-window.wavetop > label > span::before,
div.loading-window.wavebottom > label > span::after {
  height: 2px;
  background-color: #032e4a;
  z-index: 2;
  background-image: -webkit-linear-gradient(left, #032e4a, #13dff3, #032e4a);
  background-image: linear-gradient(to right, #032e4a, #13dff3, #032e4a);
  background-repeat: no-repeat;
  -webkit-animation: loading-scale 1s alternate infinite linear;
  animation: loading-scale 1s alternate infinite linear;
}
div.loading-window.wavetop::before {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: auto;
  height: 2px;
  background-color: #032e4a;
}
div.loading-window.wavebottom::after {
  position: absolute;
  top: auto;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: #032e4a;
}
</style>