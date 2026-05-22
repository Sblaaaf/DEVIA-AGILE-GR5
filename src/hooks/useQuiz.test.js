import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuiz } from './useQuiz'
import * as deezer from '../services/deezer'

const makeRounds = (n = 3) =>
  Array.from({ length: n }, (_, i) => ({
    correct: {
      id: i,
      preview: '',
      title: `Track ${i}`,
      artist: { id: i, name: `Artist ${i}` },
      album: { cover_medium: '' },
    },
    choices: [
      { id: i,      artist: { name: `Artist ${i}` },     title: `Track ${i}` },
      { id: i + 10, artist: { name: `Artist ${i + 10}` }, title: `Track ${i + 10}` },
      { id: i + 20, artist: { name: `Artist ${i + 20}` }, title: `Track ${i + 20}` },
      { id: i + 30, artist: { name: `Artist ${i + 30}` }, title: `Track ${i + 30}` },
    ],
  }))

describe('useQuiz', () => {
  beforeEach(() => {
    vi.spyOn(deezer, 'buildQuizRounds').mockResolvedValue(makeRounds())
  })

  it('starts on home screen with zero score', () => {
    const { result } = renderHook(() => useQuiz())
    expect(result.current.screen).toBe('home')
    expect(result.current.score).toBe(0)
    expect(result.current.roundIndex).toBe(0)
  })

  it('exposes totalRounds as 10 before a game starts', () => {
    const { result } = renderHook(() => useQuiz())
    expect(result.current.totalRounds).toBe(10)
  })

  it('transitions to playing after startGame', async () => {
    const { result } = renderHook(() => useQuiz())
    await act(async () => {
      await result.current.startGame('Pop', false)
    })
    expect(result.current.screen).toBe('playing')
    expect(result.current.rounds).toHaveLength(3)
  })

  it('sets isInverted flag from startGame', async () => {
    const { result } = renderHook(() => useQuiz())
    await act(async () => {
      await result.current.startGame('Pop', true)
    })
    expect(result.current.isInverted).toBe(true)
  })

  it('goes to home with error when buildQuizRounds fails', async () => {
    vi.spyOn(deezer, 'buildQuizRounds').mockRejectedValue(new Error('API down'))
    const { result } = renderHook(() => useQuiz())
    await act(async () => {
      await result.current.startGame('Pop', false)
    })
    expect(result.current.screen).toBe('home')
    expect(result.current.error).toBe('API down')
  })

  it('awards base + speed bonus on correct answer', async () => {
    const { result } = renderHook(() => useQuiz())
    await act(async () => {
      await result.current.startGame('Pop', false)
    })
    act(() => result.current.answer(true, 5))
    // 100 base + speedBonus(5) = 100 + round(50 * (1 - 5/20)) = 100 + 38 = 138
    expect(result.current.score).toBe(138)
  })

  it('awards 0 points on wrong answer', async () => {
    const { result } = renderHook(() => useQuiz())
    await act(async () => {
      await result.current.startGame('Pop', false)
    })
    act(() => result.current.answer(false, 5))
    expect(result.current.score).toBe(0)
    expect(result.current.roundIndex).toBe(1)
  })

  it('advances round index on answer', async () => {
    const { result } = renderHook(() => useQuiz())
    await act(async () => {
      await result.current.startGame('Pop', false)
    })
    act(() => result.current.answer(true, 10))
    expect(result.current.roundIndex).toBe(1)
  })

  it('shows results screen after all rounds answered', async () => {
    vi.spyOn(deezer, 'buildQuizRounds').mockResolvedValue(makeRounds(2))
    const { result } = renderHook(() => useQuiz())
    await act(async () => {
      await result.current.startGame('Pop', false)
    })
    act(() => result.current.answer(true, 5))
    act(() => result.current.answer(true, 5))
    expect(result.current.screen).toBe('results')
  })

  it('handles timeout and advances round without scoring', async () => {
    const { result } = renderHook(() => useQuiz())
    await act(async () => {
      await result.current.startGame('Pop', false)
    })
    act(() => result.current.timeout())
    expect(result.current.roundIndex).toBe(1)
    expect(result.current.score).toBe(0)
  })

  it('shows results after timeout on last round', async () => {
    vi.spyOn(deezer, 'buildQuizRounds').mockResolvedValue(makeRounds(1))
    const { result } = renderHook(() => useQuiz())
    await act(async () => {
      await result.current.startGame('Pop', false)
    })
    act(() => result.current.timeout())
    expect(result.current.screen).toBe('results')
  })

  it('resets to home on playAgain', async () => {
    vi.spyOn(deezer, 'buildQuizRounds').mockResolvedValue(makeRounds(1))
    const { result } = renderHook(() => useQuiz())
    await act(async () => {
      await result.current.startGame('Pop', false)
    })
    act(() => result.current.answer(true, 5))
    expect(result.current.screen).toBe('results')

    act(() => result.current.playAgain())
    expect(result.current.screen).toBe('home')
    expect(result.current.score).toBe(0)
    expect(result.current.roundIndex).toBe(0)
  })
})
