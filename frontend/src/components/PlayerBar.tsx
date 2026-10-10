import type { Track } from '../types'

interface Props {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isShuffled: boolean
  repeatMode: 'off' | 'all' | 'one'
  onTogglePlay: () => void
  onNext: () => void
  onPrev: () => void
  onSeek: (time: number) => void
  onVolumeChange: (vol: number) => void
  onToggleShuffle: () => void
  onToggleRepeat: () => void
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function PlayerBar({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isShuffled,
  repeatMode,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
}: Props) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <footer className="player-bar">
      <div className="player-track-info">
        {currentTrack ? (
          <>
            <div className="player-cover" style={{ background: currentTrack.gradient }} />
            <div className="player-track-text">
              <span className="player-track-title">{currentTrack.title}</span>
              <span className="player-track-artist">{currentTrack.artist}</span>
            </div>
          </>
        ) : (
          <div className="player-no-track">Select a track to play</div>
        )}
      </div>

      <div className="player-controls-section">
        <div className="player-buttons">
          <button
            className={`control-btn ${isShuffled ? 'active' : ''}`}
            onClick={onToggleShuffle}
            title="Shuffle"
          >
            🔀
          </button>
          <button className="control-btn" onClick={onPrev} title="Previous">
            ⏮
          </button>
          <button className="play-btn" onClick={onTogglePlay} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="control-btn" onClick={onNext} title="Next">
            ⏭
          </button>
          <button
            className={`control-btn ${repeatMode !== 'off' ? 'active' : ''}`}
            onClick={onToggleRepeat}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? '🔂' : '🔁'}
          </button>
        </div>
        <div className="progress-section">
          <span className="time current-time">{formatTime(currentTime)}</span>
          <div
            className="progress-bar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = (e.clientX - rect.left) / rect.width
              onSeek(pct * duration)
            }}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="time duration-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume-section">
        <span className="volume-icon">{volume === 0 ? '🔇' : '🔊'}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </footer>
  )
}
