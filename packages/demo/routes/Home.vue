<script setup lang="ts">
import { DacastPlayer } from 'dacast-player'
import { onMounted, ref } from 'vue'

const playerRef = ref(null as unknown as HTMLElement)
const currentTime = ref(0)

let player: DacastPlayer

onMounted(async () => {
  player = new DacastPlayer({
    id: 'playa',
    verbose: true,
  })
  player.init(process.env.DACAST_CONTENT_ID)
})

const play = () => {
  player.videojs.play()
}
const pause = () => {
  player.videojs.pause()
}
const applyCurrentTime = () => {
  player.videojs.currentTime(currentTime.value)
}
</script>

<template>
  <div class="container">
    <h1>dacast-player demo</h1>
    <div class="video">
      <video height="320" width="640" controls id="playa"></video>
    </div>
    <div class="form">
      <h2>Test some methods</h2>
      <div class="form__row">
        <button @click="play">Play</button>&nbsp;
        <button @click="pause">Pause</button>&nbsp;
      </div>
      <div class="form__row">
        <label for="">Go to timestamp:</label>&nbsp;
        <input v-model="currentTime" type="number" min="0" />&nbsp;
        <label for="">seconds</label>&nbsp;
        <button @click="applyCurrentTime">Apply</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.form {
}

.form__row {
  margin-bottom: 10px;
}
</style>
