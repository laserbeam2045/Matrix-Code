<template>
  <div id="header">
    <div id="mode-indicator-container">
      <ul class="indicator">
        <li
          v-for="indicator in modeIndicators"
          :key="indicator.mode"
          :class="{active: appMode === indicator.mode}"
          @click="changeMode(indicator.mode)"
        >
          {{ indicator.display }}
        </li>
      </ul>
    </div>
    <div id="app-info-container">
      <transition name="app-info" appear>
        <div id="app-info" v-if="appInfo">
          <div id="app-info-inner">
            <TheLoadingWindow
              v-if="isWaiting"
              style="top: 1px;"
              :wavetop="false"
            >{{ appInfo }}</TheLoadingWindow>
            <h1 v-else :class="{ warning: isWarning }">{{ appInfo }}</h1>
          </div>
        </div>
      </transition>
    </div>
    <div class="settings-container">
      <ul class="settings">
        <li
          v-for="setting in settings"
          :key="setting.type"
          :class="{ active: setting.isActive }"
          @click="changeSetting(setting.type)"
        >
          <font-awesome-icon :icon="setting.font" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { SET_APP_MODE, SET_SOUND } from '../store/mutation-types'
import { PREDICTION, COMPARISON, WAITING, WARNING } from '../store/app-flag-types'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faVolumeUp, faVolumeOff, faCog } from '@fortawesome/free-solid-svg-icons' 
import { mapState } from 'vuex'
import TheLoadingWindow from './TheLoadingWindow'

library.add(faVolumeUp, faVolumeOff, faCog)

export default {
  name: 'TheHeadArea',
  components: {
    TheLoadingWindow
  },
  data () {
    return {
      modeIndicators: [
        {
          display: 'GPT-2',
          mode: PREDICTION,
        },
        {
          display: 'CMP',
          mode: COMPARISON,
        }
      ],
    }
  },
  computed: {
    ...mapState([
      'appMode',
      'appInfo',
      'appInfoType',
      'sound',
    ]),
    settings () {
      return [
        {
          font: ['fas', (this.sound ? 'volume-up' : 'volume-off')],
          type: 'sound',
          isActive: this.sound,
        },
        {
          font: ['fas', 'cog'],
          type: 'setting',
          isActive: false,
        },
      ]
    },
    isWaiting () {
      return this.appInfoType === WAITING
    },
    isWarning () {
      return this.appInfoType === WARNING
    }
  },
  methods: {
    changeMode (mode) {
      if (this.appMode !== mode) {
        this.$store.commit(SET_APP_MODE, mode)
        localStorage['appMode'] = mode
      }
    },
    changeSetting (type) {
      switch (type) {
      case 'sound':
        this.$store.commit(SET_SOUND, !this.sound)
        localStorage['sound'] = this.sound ? 'on' : 'off'
        break
      case 'setting':
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: auto;
  display: flex;
  flex-wrap: wrap;
  user-select: none;

  *::before, *::after {
    content: '';
  }

  #mode-indicator-container,
  #app-info-container::before,
  #app-info-container::after,
  .settings-container {
    background-color: rgba(0,0,0,0.9);
    border-bottom: 1px solid #0c67a1;
  }

  #mode-indicator-container > ul > li,
  .settings-container > ul > li {
    position: relative;
    display: inline-block;
    height: 40px;
    padding-top: 20px;
    text-align: center;
    color: #248bcf;
    font-size: 11px;
    cursor: pointer;
  }

  #mode-indicator-container > ul > li::before,
  #mode-indicator-container > ul > li::after,
  .settings-container > ul > li::before,
  .settings-container > ul > li::after {
    position: absolute;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
  }

  #mode-indicator-container > ul > li::after,
  .settings-container > ul > li::before {
    z-index: 2;
    height: 3px;
    opacity: 1;
    background-color: #15669b;
    transition: opacity 150ms ease-out,
                background-color 150ms ease-out;
  }

  #mode-indicator-container > ul > li.active::after,
  .settings-container > ul > li.active::before {
    background-color: #42edf8;
    opacity: 1;
    box-shadow: 4px  4px 10px rgba(0,112,202,0.7),
                -4px -4px 10px rgba(0,112,202,0.7),
                -4px  4px 10px rgba(0,112,202,0.7),
                4px -4px 10px rgba(0,112,202,0.7);
  }

  #mode-indicator-container > ul::after,
  .settings-container > ul::before {
    z-index: 2;
    width: 6px;
    height: 30px;
    background-color: #0c67a1;
  }

  #mode-indicator-container::before,
  .settings-container::after {
    position: absolute;
    top: auto;
    left: 0;
    right: 0;
    bottom: 3px;
    border-bottom: 1px solid #0c67a1;
  }

  #mode-indicator-container::after,
  .settings-container::before {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 40px 40px 0;
    border-color: transparent rgba(0,0,0,0.9) transparent transparent;
  }


  #mode-indicator-container {
    position: relative;
    padding-left: 25px;

    ul {
      li {
        padding-left: 30px;
        padding-right: 10px;
      }
      li.active {
        cursor: default;
      }
      li:not(.active)::after {
        opacity: 0;
      }
      li::before,
      li::after {
        transform: skewX(-45deg);
        transform-origin: bottom right;
      }
      li::before {
        border-left: 1px solid #0c67a1;
        height: 15px;
      }
    }
    ul::after {
      position: absolute;
      top: auto;
      left: auto;
      right: -1px;
      bottom: 0;
      transform: skewX(-45deg);
      transform-origin: bottom right;
    }
  }
  #mode-indicator-container::after {
    position: absolute;
    top: auto;
    left: auto;
    right: -40px;
    bottom: 0;
    transform: scaleX(-1);
  }


  #app-info-container {
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;

    #app-info {
      transition: all .3s;
      pointer-events: auto;
      display: block;
      height: 10px;
      padding: 10px 30px 0;
      position: relative;
      background-color: rgba(0,0,0,0.9);
      font-family: 'Orbitron',sans-serif;
      font-size: 14px;
      text-transform: uppercase;
      text-align: center;
      text-shadow: 4px  4px 10px rgba(0,90,255,0.33),
                  -4px -4px 10px rgba(0,90,255,0.33),
                  -4px  4px 10px rgba(0,90,255,0.33),
                   4px -4px 10px rgba(0,90,255,0.33);

      #app-info-inner {
        display: flex;
        align-items: flex-end;
        height: 40px;
        margin-top: -10px;
        padding: 0;
        letter-spacing: 1px;
        background-color: rgba(0,0,0,0.9);
        border-bottom: 1px solid #0c67a1;

        h1 {
          color: #14e6fa;
          text-shadow:rgba(0,90,255,0.66)  4px  4px 10px,
                      rgba(0,90,255,0.66) -4px  4px 10px,
                      rgba(0,90,255,0.66)  4px -4px 10px,
                      rgba(0,90,255,0.66) -4px -4px 10px;
          margin: 0;
          padding: 8px 30px;
          font-size: inherit;
          font-weight: inherit;
          cursor: default;
        }
        h1.warning {
          color: #fee5a1;
          text-shadow: rgba(255,54,0,0.35)  4px  4px 10px,
                       rgba(255,54,0,0.35) -4px -4px 10px,
                       rgba(255,54,0,0.35) -4px  4px 10px,
                       rgba(255,54,0,0.35)  4px -4px 10px;
          opacity: .8;
        }
      }
      #app-info-inner::before,
      #app-info-inner::after {
        position: absolute;
        top: auto;
        bottom: -30px;
        z-index: 4;
        width: 6px;
        height: 30px;
        background-color: #42edf8;
        box-shadow: 4px  4px 10px rgba(0,112,202,0.7),
                   -4px -4px 10px rgba(0,112,202,0.7),
                   -4px  4px 10px rgba(0,112,202,0.7),
                    4px -4px 10px rgba(0,112,202,0.7);
      }
      #app-info-inner::before {
        left: -1px;
        right: auto;
        transform: skew(45deg);
        transform-origin: top right;
      }
      #app-info-inner::after {
        left: auto;
        right: -1px;
        transform: skew(-45deg);
        transform-origin: top left;
      }
    }
    #app-info::before {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 30px 30px 0;
      border-color: transparent rgba(0,0,0,0.9) transparent transparent;
      position: absolute;
      top: auto;
      left: 0;
      bottom: -30px;
      right: auto;
    }
    #app-info::after {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 30px 30px 0;
      border-color: transparent rgba(0,0,0,0.9) transparent transparent;
      position: absolute;
      top: auto;
      left: auto;
      bottom: -30px;
      right: 0;
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);      
    }
    .app-info-enter-active {
      transition: all .3s,
    }
    .app-info-leave-active {
      transition: all .3s;
    }
    .app-info-enter {
      transform: scaleX(0) scaleY(0) translateY(19px);
    }
    .app-info-leave-to {
      transform: scaleX(0) scaleY(0) translateY(19px);
    }
  }
  #app-info-container::before,
  #app-info-container::after {
    padding-top: 10px;
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    pointer-events: auto;
  }


  .settings-container {
    position: relative;
    padding-right: 25px;

    ul {
      li {
        width: 69px;
        padding-top: 17px;
        padding-left: 17px;
        font-size: 12px;
        text-align: left;
      }
      li::before,
      li::after {
        transform: skewX(45deg);
        transform-origin: bottom left;
      }
      li::after {
        border-right: 1px solid #0c67a1;
        height: 15px;
      }
    }
    ul::before {
      position: absolute;
      top: auto;
      left: -1px;
      right: auto;
      bottom: 0;
      z-index: 3;
      transform: skewX(45deg);
      transform-origin: bottom left;
    }
  }
  .settings-container::before {
    position: absolute;
    top: auto;
    left: -40px;
    right: auto;
    bottom: 0;
  }
}
</style>