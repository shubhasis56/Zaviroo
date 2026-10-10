import type { Track } from './types'

export async function fetchTracks(): Promise<Track[]> {
  const res = await fetch('/api/tracks')
  if (!res.ok) throw new Error('Failed to fetch tracks')
  return res.json()
}
