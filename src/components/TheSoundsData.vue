<template>
  <div>
    <audio v-for="(sound, index) in sounds" :key=index :id=sound.id>
      <source :src="require(`../assets/sounds/${sound.name}`)" :type="sound.type">
    </audio>
  </div>
</template>

<script>
import Vue from 'vue'

// 効果音を再生する関数
Vue.prototype.$playSound = function(id) {
  const audio = document.getElementById(id)

  if (!this.$store.state.sound) {
    return
  }
  if (typeof(audio.currentTime) != 'undefined') {
    audio.currentTime = 0
  }
  audio.volume = 0.2
  audio.play()
}

export default {
  name: 'TheSoundsData',
  data () {
    return {
      sounds: [
        {
          id: 'accept',
          name: 'accept.wav',
          type: 'audio/wav',
        },
      ],
    }
  },
}
</script>