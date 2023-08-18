# dacast-player

A lightweight, up to date and npm available Dacast player.

## Why?

Dacast's current SDK doesn't provide many of the tools we're used to when working with modern SDKs, such as:

- TypeScript typings
- npm package
- version pinning

Apart from that, the official sdk is bloated, unzipped (it's +600kB in size), has outdated video player versions (video.js 5) and defaults to theo player (which requires a license to work correctly). The developer experience with their SDK was really bad, and our console was filled with debugging and error logs from them (in production!!!!), so we decided to develop this, a simple and developer-friendly way to implement a Dacast player.

### Installation

**yarn**  
`yarn add dacast-player`

**npm**  
`npm install --save dacast-player`

## Usage

```html
<video controls id="dacastplayer"></video>
```

```typescript
import { DacastPlayer } from 'dacast-player'
import 'video.js/dist/video-js.css'
const player = new DacastPlayer({
  id: 'dacastplayer',
  dacastOptions: {
    contentId: 'your-dacast-content-id',
    live: false,
  },
  videoJsOptions: {},
  verbose: false,
  on: {
    error(err) {
      console.log('error: ', err)
    },
    canplay() {
      console.log('can play')
    },
    play() {
      console.log('playing')
    },
    pause() {
      console.log('paused')
    },
    ended() {
      console.log('ended')
    },
  },
})
await player.mount()
```

## API Docs

```typescript
interface PlayerEvents {
  canplay?: () => unknown // Triggered when the content is loaded and ready to play
  play?: () => unknown // Triggers when playing
  pause?: () => unknown // Triggers when paused
  ended?: () => unknown // Triggers on video end
}

interface DacastPlayerEvents extends PlayerEvents {
  error?: (err: MediaError) => unknown // Triggers on error
}

/**
 * This is the options object you'll pass to the DacastPlayer constructor.
 */
interface DacastPlayerOptions {
  id: string | Element // Element or element id to mount videojs
  videoJsOptions?: any // Video.js options
  dacastOptions?: {
    contentId?: string // Content id to play
    live?: boolean // Whether you want to force the live ui or not
  }
  verbose?: boolean // Activates logging for debugging purposes
  on?: DacastPlayerEvents
}
```

## Methods

| Method                   | Description         |
| ------------------------ | ------------------- |
| `mount(): Promise<void>` | Mounts the player   |
| `dispose(): void`        | Disposes the player |

## Properties

| Property                 | Description                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `player: videojs.Player` | Video.js instance you can use to manipulate the player or listen to native video.js events |
