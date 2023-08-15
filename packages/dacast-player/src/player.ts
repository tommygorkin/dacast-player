import videojs from 'video.js'
//tslint-ignore
import 'videojs-contrib-quality-levels'
// https://github.com/chrisboustead/videojs-hls-quality-selector/issues/107
import hlsQualitySelector from '@mycujoo/videojs-hls-quality-selector'
import * as DacastApi from './dacast'
import { logger } from './logger'

// videojs.registerPlugin('hlsQualitySelector', hlsQualitySelector)

export interface DacastPlayerOptions {
  id: string | Element
  videoJsOptions?: any
  verbose: boolean
}

// videojs.registerPlugin('qualityLevels', qualityLevels)

export class DacastPlayer {
  videojs: videojs.Player
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
    element.classList.add('video-js', 'vjs-big-play-centered')
    this.videojs = videojs(element)
    // https://github.com/chrisboustead/videojs-hls-quality-selector/issues/10
    this.videojs.hlsQualitySelector = hlsQualitySelector
    if (options.verbose) {
      logger.verbose(options.verbose)
    } else {
      // https://github.com/videojs/video.js/issues/3803
      videojs.log.level('off')
    }
  }

  src(contentId: string) {
    this._contentId = contentId
  }

  async getMetadata() {
    if (!this._contentId) {
      return
    }
    logger.log('Requesting metadata')
    const metadata = await DacastApi.getMetadata(this._contentId)
    logger.log('Received metadata', metadata)
    this.videojs.poster(metadata.contentInfo.thumbnailUrl)
    return metadata
  }

  async getStream() {
    if (!this._contentId) {
      return
    }
    logger.log('Requesting stream')
    const response = await DacastApi.getStream(this._contentId)
    logger.log('Received stream', response)
    this.videojs.src({
      src: response.hls,
      type: 'application/x-mpegURL',
    })
  }

  async init(contentId: string) {
    this.src(contentId)
    await this.getMetadata()
    await this.getStream()
    // https://github.com/chrisboustead/videojs-hls-quality-selector/issues/78
    this.videojs.hlsQualitySelector()
    // https://github.com/chrisboustead/videojs-hls-quality-selector/issues/8
    const qualityLevels = this.videojs.qualityLevels()
    qualityLevels.on('addqualitylevel', function (event) {
      let qualityLevel = event.qualityLevel
      if (qualityLevel.height) {
        qualityLevel.enabled = true
      } else {
        logger.warn('Found a quality level without height', qualityLevel)
        qualityLevels.removeQualityLevel(qualityLevel)
        qualityLevel.enabled = false
      }
    })
    // videojs.log.level('warn')
  }

  dispose() {
    this.videojs.dispose()
  }
}
