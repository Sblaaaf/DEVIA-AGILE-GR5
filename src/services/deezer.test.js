import { describe, it, expect, vi, afterEach } from 'vitest'
import { buildQuizRounds } from './deezer'

const makeTrack = (i) => ({
  id: i,
  preview: `https://preview${i}.mp3`,
  title: `Track ${i}`,
  artist: { id: i, name: `Artist ${i}` },
  album: { cover_medium: `https://cover${i}.jpg` },
})

const makeTracks = (n) => Array.from({ length: n }, (_, i) => makeTrack(i + 1))

const mockFetchOk = (tracks) => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: tracks }),
    })
  )
}

describe('buildQuizRounds', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('throws when fewer than 4 tracks are available', async () => {
    mockFetchOk(makeTracks(3))
    await expect(buildQuizRounds('Pop', 5)).rejects.toThrow('Pas assez de pistes')
  })

  it('returns the requested number of rounds', async () => {
    mockFetchOk(makeTracks(20))
    const rounds = await buildQuizRounds('Pop', 5)
    expect(rounds).toHaveLength(5)
  })

  it('caps rounds to available unique tracks', async () => {
    mockFetchOk(makeTracks(6))
    const rounds = await buildQuizRounds('Pop', 10)
    expect(rounds.length).toBeLessThanOrEqual(6)
  })

  it('each round has a correct track and 4 choices', async () => {
    mockFetchOk(makeTracks(15))
    const rounds = await buildQuizRounds('Pop', 5)
    for (const round of rounds) {
      expect(round.correct).toBeDefined()
      expect(round.choices).toHaveLength(4)
    }
  })

  it('correct answer is always among choices', async () => {
    mockFetchOk(makeTracks(15))
    const rounds = await buildQuizRounds('Pop', 5)
    for (const round of rounds) {
      const choiceIds = round.choices.map((c) => c.id)
      expect(choiceIds).toContain(round.correct.id)
    }
  })

  it('choices have no duplicate artist names', async () => {
    mockFetchOk(makeTracks(20))
    const rounds = await buildQuizRounds('Pop', 5)
    for (const round of rounds) {
      const artistNames = round.choices.map((c) => c.artist.name)
      const unique = new Set(artistNames)
      expect(unique.size).toBe(4)
    }
  })

  it('throws on HTTP error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 503 })
    )
    await expect(buildQuizRounds('Pop', 5)).rejects.toThrow('Deezer API error: 503')
  })

  it('throws on unknown genre', async () => {
    // No fetch needed — genre lookup fails before the request
    vi.stubGlobal('fetch', vi.fn())
    await expect(buildQuizRounds('Inconnu', 5)).rejects.toThrow('Genre inconnu')
  })
})
