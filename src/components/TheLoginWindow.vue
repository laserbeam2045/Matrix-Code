<template>
  <div id="login-window-root">
    <div id="login-window" :class="{ authenticated }">
      <span class="background-wrapper">
        <span class="background"></span>
      </span>
      <span class="left-light"></span>
      <span class="right-light"></span>
      <span class="caption on">Matrix Code</span>
    </div>
    <BaseInputText
      type="password"
      placeholder="Access code"
      style="margin-top: 100px; width: 300px;"
      @keydown.enter="login"
    />
  </div>
</template>

<script>
/* eslint-disable */
import { SET_AUTHENTICATED } from '../store/mutation-types'
import BaseInputText from './BaseInputText'

export default {
  name: 'TheLoginWindow',
  components: {
    BaseInputText,
  },
  data () {
    return {
      accessCode: '123',
      authenticated: false,
    }
  },
  methods: {
    login (event) {
      if (event.target.value === this.accessCode) {
        this.authenticated = true
        this.$playSound('accept')
        setTimeout(() => {
          this.$store.commit(SET_AUTHENTICATED, true)
        }, 700)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
* {
  text-transform: uppercase;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

*::before, *::after {
  content: '';
}

#login-window-root {
  position: relative;
  top: -15%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#login-window {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 330px;
  height: 35px;
  margin: 0;
  padding: 15px 0 0;
  color: #42cbf8;
  font: bold 13px/35px 'Orbitron',sans-serif;

  .background-wrapper {
    display: block;
    position: absolute;
    left: 0;
    top: 8px;
    width: 330px;
    height: 35px;
    color: #42cbf8;
    perspective: 145px;
    -webkit-perspective: 145px;
    text-transform: uppercase;
    text-align: center;
    z-index: 0;

    .background {
      opacity: 0;
      display: block;
      width: 330px;
      height: 35px;
      border: solid #29648a;
      border-width: 1px 0;
      -webkit-transform: rotateX(-30deg) scaleY(1.4);
      transform: rotateX(-30deg) scaleY(1.4);
    }
    .background::before,
    .background::after {
      opacity: 0;
      display: block;
      position: absolute;
      height: 35px;
      background: #29648a;
      top: -1px;
      width: 8px;
    }
    .background::before { left: -1px; }
    .background::after { right: -1px; }
  }

  .left-light,
  .right-light {
    display: block;
    position: absolute;
    z-index: 0;
    top: -30px;
    width: 95px;
    height: 125px;
  }
  .left-light { left: -50px; }
  .right-light { right: -50px; }

  .left-light::before,
  .right-light::before {
    display: block;
    position: absolute;
    top: 32px;
    width: 8px;
    height: 43px;
  }
  .left-light::before {
    left: 47px;
    transform: skew(33deg);
  }
  .right-light::before {
    right: 47px;
    transform: skew(-33deg);
  }

  .caption.on {
    color: #42cbf8;
    letter-spacing: 2px;
    text-shadow: rgba(0,112,202,0.5)  4px  3px 3px,
                 rgba(0,112,202,0.5) -4px  3px 3px,
                 rgba(0,112,202,0.5)  4px -1px 3px,
                 rgba(0,112,202,0.5) -4px -1px 3px;
  }
}

#login-window.authenticated {

  .background {
    opacity: 1;
  }

  .background::before,
  .background::after {
    transition: all .5s;
    opacity: 1;
    background: #42cbf8;
  }

  .left-light::before,
  .right-light::before {
    transition: all .5s;
    box-shadow: 0px 0 25px 10px rgba(0,112,202,0.8);
  }
}
</style>