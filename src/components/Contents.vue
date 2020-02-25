<template>
  <div id="contents-root">
    <transition name="fade" mode="out-in" appear>
      <PredictionWindow v-if="isPredictionMode" />
      <ComparisonWindow v-else-if="isComparisonMode" />
    </transition>
  </div>
</template>

<script>
import { PREDICTION, COMPARISON } from '../store/app-flag-types'
import PredictionWindow from './PredictionWindow'
import ComparisonWindow from './ComparisonWindow'
import { mapState } from 'vuex'

export default {
  name: 'Contents',
  components: {
    PredictionWindow,
    ComparisonWindow,
  },

  computed: {
    ...mapState([
      'appMode',
    ]),
    isPredictionMode () {
      return this.appMode === PREDICTION
    },
    isComparisonMode () {
      return this.appMode === COMPARISON
    },
  }
}
</script>

<style lang="scss" scoped>
  #contents-root {
    position: relative;
    width: 100%;
    height: 90%;
    margin: 10% 0 0 0;
    padding: 0 3%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fade-enter-active {
    transition: opacity .4s ease,
                transform .5s ease;
  }
  .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter {
    opacity: .7;
    transform: scaleX(0) scaleY(.5);
  }
  .fade-leave-to {
    opacity: 0;
    transform: scaleX(0) scaleY(.5);
  }
</style>