<template>
  <div class="editable-window" :style="windowStyle">
    <EditableWindowController
      v-bind:spellCheck.sync="spellCheck"
      v-bind:textPrediction.sync="textPrediction"
      v-bind:speechRecognition.sync="speechRecognition"
    >
      <Resizable v-bind.sync="windowStyle">
        <Draggable v-bind.sync="windowStyle">
          <BaseFieldset>
            <Editable
              ref="Editable"
              :value="value"
              :scrollTop="scrollTop"
              v-on="listeners"
            />
            <slot></slot>
          </BaseFieldset>
        </Draggable>
      </Resizable>
    </EditableWindowController>
  </div>
</template>

<script>
/* eslint-disable */
import Draggable from './Draggable'
import Resizable from './Resizable'
import EditableWindowController from './EditableWindowController'
import BaseFieldset from './BaseFieldset'
import Editable from './Editable'

export default {
  name: 'EditableWindow',
  components: {
    Draggable,
    Resizable,
    EditableWindowController,
    BaseFieldset,
    Editable,
  },
  props: {
    value: {
      type: String,
      required: false,
      default: '',
    },
    scrollTop: {
      type: Number,
      required: false,
      default: 0,
    },
    windowStyle: {
      type: Object,
      required: false,
      default () {
        return {
          width: '486px',
          height: '300px',
          position: 'absolute',
          top: 0,
          left: 'auto',
        }
      },
    },
  },
  data () {
    return {
      spellCheck: false,
      textPrediction: false,
      speechRecognition: false,
    }
  },
  computed: {
    listeners () {
      return {
        keydown: event => this.$emit('keydown', event),
        keyup: event => this.$emit('keyup', event),
        input: value => this.$emit('input', value),
        scroll: value => this.$emit('update:scrollTop', value),
        'input-e': event => this.$emit('input-e', event),
      }
    },
  },
  methods: {
    moveCaretBy (number) {
      this.$refs['Editable'].moveCaretBy(number)
    }
  },
}
</script>