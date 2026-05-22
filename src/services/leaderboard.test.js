import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getLeaderboard, saveScore } from './leaderboard'

describe('leaderboard service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-02T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns an empty list when storage is empty', () => {
    expect(getLeaderboard()).toEqual([])
  })

  it('saves scores sorted by highest score', () => {
    saveScore(120, 'Pop')
    saveScore(220, 'Rock')

    const board = getLeaderboard()
    expect(board).toHaveLength(2)
    expect(board[0].score).toBe(220)
    expect(board[0].genre).toBe('Rock')
    expect(board[0].date).toBeTruthy()
  })

  it('keeps only the top 10 scores', () => {
    for (let i = 1; i <= 12; i++) {
      saveScore(i * 10, 'Pop')
    }

    const board = getLeaderboard()
    expect(board).toHaveLength(10)
    expect(board[0].score).toBe(120)
    expect(board[9].score).toBe(30)
  })
})

