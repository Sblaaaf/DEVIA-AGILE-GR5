const PROXY = 'https://corsproxy.io/?'
const BASE = 'https://api.deezer.com'

// Deezer genre IDs for chart endpoint
const GENRE_IDS = {
  Pop:       132,
  Rock:      152,
  'Hip-Hop': 116,
  Électro:   113, // Dance
  French:     52, // Chanson française
  Techno:    'search', // Special case for searching specific artists
}

const TECHNO_ARTISTS = ['Vieze Asbak', 'Lil Texas', 'Skone', 'Asbak', 'Dimitri K', 'Spitnoise']

function isGoodTrack(track) {
  return !!track.preview
}

async function fetchTracks(genre, limit = 100) {
  if (genre === 'Techno') {
    // Search for tracks from specific artists requested by user
    const artists = shuffle(TECHNO_ARTISTS).slice(0, 3)
    const query = artists.map(a => `artist:"${a}"`).join(' OR ')
    const endpoint = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}`
    const url = `${PROXY}${encodeURIComponent(endpoint)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Deezer API error: ${res.status}`)
    const data = await res.json()
    return (data.data || []).filter(isGoodTrack)
  }

  const genreId = GENRE_IDS[genre]
  if (!genreId) throw new Error(`Genre inconnu : ${genre}`)

  const endpoint = `${BASE}/chart/${genreId}/tracks?limit=${limit}`
  const url = `${PROXY}${encodeURIComponent(endpoint)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Deezer API error: ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message || 'Deezer error')
  return (data.data || []).filter(isGoodTrack)
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function buildQuizRounds(genre, roundCount = 10) {
  const tracks = await fetchTracks(genre)
  if (tracks.length < 4) throw new Error('Pas assez de pistes disponibles. Réessaie.')

  // One track per artist to avoid duplicate answer options
  const seenArtists = new Set()
  const uniquePool = shuffle(tracks).filter((t) => {
    if (seenArtists.has(t.artist.name)) return false
    seenArtists.add(t.artist.name)
    return true
  })

  const pool = uniquePool.length >= 4 ? uniquePool : shuffle(tracks)
  const selected = pool.slice(0, Math.min(roundCount, pool.length))

  return selected.map((correct) => {
    const wrongPool = pool.filter((t) => t.artist.name !== correct.artist.name)
    const wrong = shuffle(wrongPool).slice(0, 3)
    if (wrong.length < 3) {
      const fallback = shuffle(pool.filter((t) => t.id !== correct.id)).slice(0, 3)
      return { correct, choices: shuffle([correct, ...fallback]) }
    }
    return { correct, choices: shuffle([correct, ...wrong]) }
  })
}
