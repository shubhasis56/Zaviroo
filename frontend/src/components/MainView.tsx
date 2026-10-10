import type { Track } from '../types'

interface Props {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  onTrackClick: (track: Track) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  loading: boolean
  error: string | null
}

export default function MainView({
  tracks,
  currentTrack,
  isPlaying,
  onTrackClick,
  searchQuery,
  onSearchChange,
  loading,
  error,
}: Props) {
  return (
    <main className="main-view">
      <div className="main-header">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search songs, artists, albums…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="main-content">
        <h1 className="page-title">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Tracks'}
        </h1>
        {loading && <div className="loading">Loading tracks…</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && tracks.length === 0 && (
          <div className="loading">No tracks found.</div>
        )}
        {!loading && !error && tracks.length > 0 && (
          <div className="track-list">
            <div className="track-list-header">
              <span>#</span>
              <span>Title</span>
              <span>Album</span>
              <span>Genre</span>
            </div>
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`track-row ${currentTrack?.id === track.id ? 'active' : ''}`}
                onClick={() => onTrackClick(track)}
              >
                <span className="track-num">
                  {currentTrack?.id === track.id && isPlaying ? '▶' : index + 1}
                </span>
                <div className="track-info">
                  <div className="track-cover" style={{ background: track.gradient }} />
                  <div className="track-text">
                    <span className="track-name">{track.title}</span>
                    <span className="track-artist">{track.artist}</span>
                  </div>
                </div>
                <span className="track-album">{track.album}</span>
                <span className="track-genre">{track.genre}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
