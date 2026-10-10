const express = require('express')
const cors = require('cors')
const tracks = require('./data/tracks.json')

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/api/tracks', (req, res) => {
  res.json(tracks)
})

app.get('/api/tracks/:id', (req, res) => {
  const track = tracks.find((t) => t.id === parseInt(req.params.id, 10))
  if (!track) return res.status(404).json({ error: 'Track not found' })
  res.json(track)
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', tracks: tracks.length })
})

app.listen(PORT, () => {
  console.log(`Zaviroo API running on port ${PORT}`)
})
