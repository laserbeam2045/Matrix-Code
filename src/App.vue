<template>
  <div
    id="app"
    :style="{ backgroundColor: tweenedCSSColor }"
  >
    <transition name="header" appear>
      <TheHeadArea v-if="authenticated" />
    </transition>
    <transition name="login" mode="out-in">
      <TheLoginWindow v-if="!authenticated" />
      <Contents v-else />
    </transition>
    <TheSoundsData />
  </div>
</template>

<script>
/* eslint-disable */
import { SET_SOUND, SET_APP_MODE } from './store/mutation-types'
import { PREDICTION, COMPARISON } from './store/app-flag-types'
import TheLoadingWindow from './components/TheLoadingWindow'
import TheLoginWindow from './components/TheLoginWindow'
import TheSoundsData from './components/TheSoundsData'
import TheHeadArea from './components/TheHeadArea'
import Contents from './components/Contents'
import * as TWEEN from 'tween.js/src/Tween.js'
import * as Color from 'color-js/color.js'
import { mapState } from 'vuex'

export default {
  name: 'app',
  components: {
    TheLoadingWindow,
    TheLoginWindow,
    TheSoundsData,
    TheHeadArea,
    Contents,
  },

  data () {
    return {
      color: {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 1
      },
      tweenedColor: {},
    }
  },

  computed: {
    ...mapState([
      'appMode',
      'authenticated',
    ]),
    tweenedCSSColor () {
      return new Color({
        red: this.tweenedColor.red,
        green: this.tweenedColor.green,
        blue: this.tweenedColor.blue,
        alpha: this.tweenedColor.alpha,
      }).toCSS()
    },
  },

  created () {
    switch (localStorage['sound']) {
      case 'on' : this.$store.commit(SET_SOUND,  true); break
      case 'off': this.$store.commit(SET_SOUND, false); break
    }
    switch (Number(localStorage['appMode'])) {
      case PREDICTION: this.$store.commit(SET_APP_MODE, PREDICTION); break
      case COMPARISON: this.$store.commit(SET_APP_MODE, COMPARISON); break
    }
    this.tweenedColor = Object.assign({}, this.color)
  },

  watch: {
    authenticated () {
      setTimeout(() => {
        //this.updateColor('#fff')
      }, 1000)
    },
    color () {
      const animate = () => {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      new TWEEN.Tween(this.tweenedColor)
        .to(this.color, 1750)
        .start()

      animate()
    },
  },

  methods: {
    updateColor (value) {
      this.color = new Color(value).toRGB()
    },
    speechRecognition () {
      const SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.lang = 'en'

        recognition.onresult = event => {
          console.log(event)
          this.$data.sentence += event.results[0][0].transcript
        }
        recognition.start()
      }
    },
  },
}
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background: #000;
}

*, *::before, *::after {
  box-sizing: border-box;
}

ul, ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

#app {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c3e50;
  font-family: 'Electrolize',sans-serif;

  .header-enter-active {
    transition: all 1s ease 1s;
  }
  .header-enter {
    opacity: 0;
  }

  .login-enter-active {
    transition: opacity .2s ease 1s,
                transform .3s ease 1s,
  }
  .login-leave-active {
    transition: all 1s;
  }
  .login-enter {
    opacity: 0;
    transform: scaleX(0) scaleY(.5) translateY(200px);
  }
  .login-leave-to {
    opacity: 0;
    transform: translateY(-50px);
  }
}
</style>