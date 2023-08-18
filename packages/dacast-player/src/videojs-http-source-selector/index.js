import videojs from 'video.js'

import SourceMenuButton from './components/SourceMenuButton'
import SourceMenuItem from './components/SourceMenuItem'

// Default options for the plugin.
const defaults = {}

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin
// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-http-source-selector')

  //This plugin only supports level selection for HLS playback
  if (player.techName_ != 'Html5') {
    videojs.log(
      'http-source-selector player.techName_ unsuported:' + player.techName_
    )
    return false
  }

  /**
   *
   * We have to wait for the manifest to load before we can scan renditions for resolutions/bitrates to populate selections
   *
   **/
  player.on(['loadedmetadata'], function (e) {
    // hack for plugin idempodency... prevents duplicate menubuttons from being inserted into the player if multiple player.httpSourceSelector() functions called.
    if (
      player.videojs_http_source_selector_initialized == 'undefined' ||
      player.videojs_http_source_selector_initialized == true
    ) {
      videojs.warn('http-source-selector already initialized')
    } else {
      player.videojs_http_source_selector_initialized = true
      const controlBar = player.controlBar,
        fullscreenToggle = controlBar.getChild('fullscreenToggle').el()
      controlBar
        .el()
        .insertBefore(
          controlBar.addChild('SourceMenuButton').el(),
          fullscreenToggle
        )
    }
  })
}

const Plugin = videojs.getPlugin('plugin')

export class HttpSourceSelector extends Plugin {
  constructor(player, options = {}) {
    super(player)
    player.ready(() => {
      onPlayerReady(player, videojs.obj.merge(defaults, options))
    })
    videojs.registerComponent('SourceMenuButton', SourceMenuButton)
    videojs.registerComponent('SourceMenuItem', SourceMenuItem)
  }
}

videojs.registerPlugin('httpSourceSelector', HttpSourceSelector)
