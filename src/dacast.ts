interface ContentInfoAd {}

export interface ContentInfo {
  contentId: string
  title: string
  description: string
  splashscreenUrl: string
  thumbnailUrl: string
  duration: string | null
  width: number | null
  height: number | null
  features: {
    useDRM: boolean
    autoplay: boolean
    loop: boolean
    viewerCounter: boolean
    countdownTimestampUTC: string | null
    ads: {
      disableControls: boolean | null
      preRoll: ContentInfoAd[]
      midRoll: ContentInfoAd[]
      postRoll: ContentInfoAd[]
    }
    paywall: {
      enabled: boolean
    }
    hasPassword: boolean
    isVr360: boolean
  }
}

export interface AccessResponse {
  hls: string
}

const DACAST_INFO_URL = 'https://playback.dacast.com/content/info'
const DACAST_PLAYBACK_URL = 'https://playback.dacast.com/content/access'

export const getMetadata = async (contentId: string) => {
  const url = new URL(DACAST_INFO_URL)
  url.searchParams.set('contentId', contentId)
  url.searchParams.set('provider', 'universe')
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    method: 'GET',
  })
  return response.json() as Promise<ContentInfo>
}

export const getStream = async (contentId: string) => {
  const url = new URL(DACAST_PLAYBACK_URL)
  url.searchParams.set('contentId', contentId)
  url.searchParams.set('provider', 'universe')
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    method: 'GET',
  })
  return response.json() as Promise<AccessResponse>
}
