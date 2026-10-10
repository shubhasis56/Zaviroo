import { useState, useEffect, useRef, useCallback } from 'react'
import type { Track } from './types'
import { fetchTracks } from './api'
import Sidebar from './components/Sidebar'
import MainView from './components/MainView'
import PlayerBar from './components/PlayerBar'

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    fetchTracks()
      .then((data) => {
        setTracks(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const currentIndex = currentTrack
    ? tracks.findIndex((t) => t.id === currentTrack.id)
    : -1

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }, [])

  const togglePlay = useCallback(() => {
    if (!currentTrack) return
    setIsPlaying((prev) => !prev)
  }, [currentTrack])

  const playNext = useCallback(() => {
    if (tracks.length === 0) return
    if (isShuffled) {
      let randomIndex = Math.floor(Math.random() * tracks.length)
      if (randomIndex === currentIndex) randomIndex = (randomIndex + 1) % tracks.length
      setCurrentTrack(tracks[randomIndex])
    } else {
      const nextIndex = currentIndex + 1 >= tracks.length ? 0 : currentIndex + 1
      setCurrentTrack(tracks[nextIndex])
    }
    setIsPlaying(true)
  }, [tracks, currentIndex, isShuffled])

  const playPrev = useCallback(() => {
    if (tracks.length === 0) return
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0
      return
    }
    const prevIndex = currentIndex - 1 < 0 ? tracks.length - 1 : currentIndex - 1
    setCurrentTrack(tracks[prevIndex])
    setIsPlaying(true)
  }, [tracks, currentIndex, currentTime])

  // Load new track when currentTrack changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    audio.src = currentTrack.audioUrl
    audio.volume = volume
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack])

  // Play/pause toggle
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack])

  // Volume changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio) setCurrentTime(audio.currentTime)
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current
    if (audio) setDuration(audio.duration)
  }

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else if (repeatMode === 'all' || currentIndex < tracks.length - 1) {
      playNext()
    } else {
      setIsPlaying(false)
    }
  }

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const filteredTracks = searchQuery
    ? tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.album.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tracks

  return (
    <div className="app">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <div className="app-body">
        <Sidebar />
        <MainView
          tracks={filteredTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTrackClick={playTrack}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          loading={loading}
          error={error}
        />
      </div>
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isShuffled={isShuffled}
        repeatMode={repeatMode}
        onTogglePlay={togglePlay}
        onNext={playNext}
        onPrev={playPrev}
        onSeek={seek}
        onVolumeChange={setVolume}
        onToggleShuffle={() => setIsShuffled((s) => !s)}
        onToggleRepeat={() =>
          setRepeatMode((m) => (m === 'off' ? 'all' : m === 'all' ? 'one' : 'off'))
        }
      />
    </div>
  )
}
