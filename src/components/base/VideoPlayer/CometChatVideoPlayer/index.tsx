import React, { useRef } from 'react'
import './index.scss'

/**
 * CometChat Video Player — a native HTML5 video player with consistent styling.
 * No antd dependency — uses native <video> element for maximum compatibility.
 *
 * @example
 * <CometChatVideoPlayer src="https://example.com/video.mp4" />
 * <CometChatVideoPlayer src="/path/to/video.mp4" poster="/thumb.jpg" />
 */
interface CometChatVideoPlayerProps {
  /** Video source URL */
  src: string
  /** Poster image URL (shown before play) */
  poster?: string
  /** Whether to show native controls */
  controls?: boolean
  /** Whether to autoplay */
  autoPlay?: boolean
  /** Whether to loop */
  loop?: boolean
  /** Whether to mute */
  muted?: boolean
  /** Width of the player */
  width?: string | number
  /** Height of the player */
  height?: string | number
  /** Callback when video ends */
  onEnded?: () => void
  /** Callback when video starts playing */
  onPlay?: () => void
  /** Callback when video is paused */
  onPause?: () => void
  /** Callback on error */
  onError?: () => void
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * CometChat VideoPlayer — native HTML5 video with consistent styling.
 */
const CometChatVideoPlayer: React.FC<CometChatVideoPlayerProps> = ({
  src,
  poster,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  width = '100%',
  height = 'auto',
  onEnded,
  onPlay,
  onPause,
  onError,
  className = '',
  style,
  ...rest
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div className={`cc-video-player ${className}`} style={style}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        width={width}
        height={height}
        onEnded={onEnded}
        onPlay={onPlay}
        onPause={onPause}
        onError={onError}
        {...rest}
      >
        <track kind="captions" />
      </video>
    </div>
  )
}

CometChatVideoPlayer.displayName = 'CometChatVideoPlayer'

export default CometChatVideoPlayer
