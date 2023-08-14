import videojs from 'video.js'
import Player from 'video.js/dist/types/player'
import 'video.js/dist/video-js.css'
import * as DacastApi from './dacast'

export interface DacastPlayerOptions {
  id: string | Element
  videoJsOptions?: any
}

export class DacastPlayer {
  _player: Player
  _contentId?: string
  constructor(options: DacastPlayerOptions) {
    let element: Element
    if (typeof options.id === 'string') {
      const retrieved = document.getElementById(options.id)
      if (!retrieved) {
        throw new Error('Element not found')
      }
      element = retrieved
    } else {
      element = options.id
    }
    element.classList.add('video-js')
    this._player = videojs(element)
  }

  src(contentId: string) {
    this._contentId = contentId
  }

  async getMetadata() {
    if (!this._contentId) {
      return
    }
    return DacastApi.getMetadata(this._contentId)
  }

  async getStream() {
    if (!this._contentId) {
      return
    }
    const response = await DacastApi.getStream(this._contentId)
    this._player.src({
      src: response.hls,
      type: 'application/x-mpegURL',
    })
  }

  async init(contentId: string) {
    this.src(contentId)
    await this.getMetadata()
    await this.getStream()
  }
}
