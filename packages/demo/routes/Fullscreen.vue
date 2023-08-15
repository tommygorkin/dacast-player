<script setup lang="ts">
import { DacastPlayer } from 'dacast-player'
import { onMounted, ref } from 'vue'

const playerRef = ref(null as unknown as HTMLElement)

let player: DacastPlayer

onMounted(async () => {
  player = new DacastPlayer({
    id: 'playa',
    videoJsOptions: {},
    verbose: true,
  })
  player.videojs.ready(() => {
    player.videojs.fill(true)
  })

  await player.init(process.env.DACAST_CONTENT_ID)
})

const play = () => {
  player.videojs.play()
}
</script>

<template>
  <div class="full">
    <video controls id="playa"></video>
  </div>
</template>

<style scoped>
.full {
  height: 100vh;
  width: 100vw;
}
</style>
