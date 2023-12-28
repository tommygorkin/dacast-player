import videojs from 'video.js'
import './videojs-http-source-selector'

import * as DacastApi from './dacast'
import { logger } from './logger'
import Player from 'video.js/dist/types/player'

interface PlayerEvents {
  ready?: () => unknown
  canplay?: () => unknown
  play?: () => unknown
  pause?: () => unknown
  ended?: () => unknown
}

interface PlayerTechEvents {
  retryplaylist?: () => unknown
}

interface DacastPlayerEvents extends PlayerEvents, PlayerTechEvents {
  error?: (err: MediaError) => unknown
}

export interface DacastPlayerOptions {
  id: string | Element
  videoJsOptions?: any
  dacastOptions?: {
    contentId?: string
    live?: boolean
  }
  verbose?: boolean
  on?: DacastPlayerEvents
}

const defaultOptions: Partial<DacastPlayerOptions> = {
  videoJsOptions: {},
  dacastOptions: {},
  verbose: false,
  on: {},
}

export class DacastPlayer {
  player?: Player
  _options: Required<DacastPlayerOptions>
  _metadata?: DacastApi.ContentInfo
  _src?: string
  constructor(options: DacastPlayerOptions) {
    this._options = {
      ...defaultOptions,
      videoJsOptions: {
        ...defaultOptions.videoJsOptions,
        ...(options.videoJsOptions || {}),
      },
      dacastOptions: {
        ...defaultOptions.dacastOptions,
        ...(options.dacastOptions || {}),
      },
      on: {
        ...(options.on || {}),
      },
      id: options.id,
      verbose: options.verbose || false,
    }
    if (options.verbose) {
      logger.verbose(options.verbose)
    } else {
      // https://github.com/videojs/video.js/issues/3803
      videojs.log.level('off')
    }
    videojs.hook('error', (player: Player, err: MediaError) =>
      this._handleError(player, err)
    )
  }

  _handleError(player: Player, err: MediaError) {
    if (this._options.on.error) {
      this._options.on.error(err)
    }
  }

  _handlePlayerEvent(event: keyof PlayerEvents) {
    if (this._options.on && this._options.on[event]) {
      ;(this._options.on[event] as () => unknown)()
    }
  }

  _handlePlayerTechEvent(event: keyof PlayerTechEvents) {
    if (this._options.on && this._options.on[event]) {
      ;(this._options.on[event] as () => unknown)()
    }
  }

  _mountElement(id: string | Element) {
    let element: Element
    if (typeof id === 'string') {
      const retrieved = document.getElementById(id)
      if (!retrieved) {
        throw new Error('Element not found')
      }
      element = retrieved
    } else {
      element = id
    }
    element.classList.add('video-js', 'vjs-big-play-centered')
    const liveContentId =
      this._options.dacastOptions.contentId &&
      this._options.dacastOptions.contentId.indexOf('live') !== -1
    logger.log(`Content id is${liveContentId ? '' : ' not'} a livestream`)
    const options = {
      ...this._options.videoJsOptions,
      liveui:
        this._options.dacastOptions?.live !== undefined
          ? this._options.dacastOptions?.live
          : liveContentId,
      plugins: {
        httpSourceSelector: {},
      },
    }
    logger.log('Mounting with options: ', options)
    const instance = videojs(element, options)
    const events: Array<keyof PlayerEvents> = [
      'ready',
      'canplay',
      'play',
      'pause',
      'ended',
    ]
    const playerTechEvents: Array<keyof PlayerTechEvents> = ['retryplaylist']
    events.forEach((ev) => instance.on(ev, () => this._handlePlayerEvent(ev)))
    playerTechEvents.forEach((ev) =>
      instance.tech().on(ev, () => this._handlePlayerTechEvent(ev))
    )
    return instance
  }

  contentId(contentId: string) {
    this._options.dacastOptions.contentId = contentId
  }

  async getMetadata() {
    if (!this._options.dacastOptions.contentId) {
      return
    }
    this._metadata = undefined
    logger.log('Requesting metadata')
    try {
      const metadata = await DacastApi.getMetadata(
        this._options.dacastOptions.contentId
      )
      logger.log('Received metadata', metadata)
      this._metadata = metadata.contentInfo
      if (!this._options.videoJsOptions.poster) {
        this._options.videoJsOptions.poster = this._metadata.thumbnailUrl
      }
      return metadata
    } catch (err) {
      logger.error('Failed to fetch metadata from Dacast API', err)
    }
  }

  async getStream() {
    if (!this._options.dacastOptions.contentId) {
      return
    }
    this._src = undefined
    logger.log('Requesting stream')
    try {
      const response = await DacastApi.getStream(
        this._options.dacastOptions.contentId
      )
      logger.log('Received stream', response)
      this._src = response.hls
    } catch (err) {
      logger.error('Failed to fetch stream from Dacast API', err)
    }
  }

  async mount() {
    if (this.player) {
      logger.warn('Already mounted, disposing previous player')
      this.player.dispose()
    }
    this.player = this._mountElement(this._options.id)
    await this.getMetadata()
    if (!this._metadata) {
      return
    }
    await this.getStream()
    if (!this._src) {
      return
    }
    logger.log('Setting source: ', this._src)
    this.player.src({
      src: this._src,
      type: 'application/x-mpegURL',
    })
  }

  dispose() {
    if (this.player) {
      this.player.dispose()
    }
  }

  isRebroadcast() {
    return this._src?.indexOf('live-rebroadcast') !== -1
  }
}
