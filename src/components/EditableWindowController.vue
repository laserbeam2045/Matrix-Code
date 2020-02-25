<template>
  <div class="editable-controller">
    <slot></slot>
    <div class="editable-buttons">
      <font-awesome-icon
        v-for="button in buttons"
        :key="button.icon[1]"
        :icon="button.icon"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMicrophone, faMicrophoneAlt, faMicrophoneAltSlash, faMicrophoneSlash, faSpellCheck, faEquals, faNotEqual, faBalanceScale, faColumns, faCompressAlt, faExpandAlt, faTimes } from '@fortawesome/free-solid-svg-icons' 
import { faLightbulb } from '@fortawesome/fontawesome-free-regular' 
import { faGoogle } from '@fortawesome/fontawesome-free-brands' 

library.add(faMicrophone, faMicrophoneAltSlash, faMicrophoneAlt, faMicrophoneSlash, faLightbulb, faGoogle, faSpellCheck, faEquals, faNotEqual, faBalanceScale, faColumns, faCompressAlt, faExpandAlt, faTimes)

export default {
  name: 'EditableWindowController',
  props: {
    spellCheck: {
      type: Boolean,
      required: true,
    },
    textPrediction: {
      type: Boolean,
      required: true,
    },
    speechRecognition: {
      type: Boolean,
      required: true,
    },
  },
  data () {
    return {
      isMaxSize: false,
    }
  },
  computed: {
    buttons () {
      return [
        {
          icon: ['fas', this.speechRecognition ? 'microphone' : 'microphone-slash'],
          
        },
        {
          icon: ['fab', 'google'],
        },
        {
          icon: ['fas', 'spell-check'],
        },
        /*
        {
          icon: ['fas', 'equals'],
        },
        {
          icon: ['fas', 'not-equal'],
        },
        {
          icon: ['fas', 'balance-scale'],
        },
        */
        {
          icon: ['fas', this.isMaxSize ? 'compress-alt' : 'expand-alt'],
        },
        {
          icon: ['fas', 'times'],
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.editable-controller {
  position: relative;
  width: 100%;
  height: 100%;

  .editable-buttons {
    position: absolute;
    top: 8px;
    right: 8px;
    width: auto;
    height: auto;
    margin: 0;
    padding: 0;
    pointer-events: none;

    > * {
      margin: 0 8px;
      color: #42cbf8;
      cursor: pointer;
      pointer-events: auto;
    }
  }
}
</style>