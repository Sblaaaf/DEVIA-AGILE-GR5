import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ScoreBoard from './ScoreBoard'
import { getLeaderboard } from '../services/leaderboard'

vi.mock('../services/leaderboard', () => ({
  getLeaderboard: vi.fn(),
}))

describe('ScoreBoard', () => {
  beforeEach(() => {
    getLeaderboard.mockReturnValue([])
  })

  it('renders nothing when leaderboard is empty', () => {
    const { container } = render(<ScoreBoard highlightScore={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('highlights the matching score', () => {
    getLeaderboard.mockReturnValue([
      { score: 200, genre: 'Pop', date: '01/01/2024' },
      { score: 150, genre: 'Rock', date: '02/01/2024' },
    ])

    render(<ScoreBoard highlightScore={200} />)

    const scoreEl = screen.getByText('200')
    expect(scoreEl).toHaveClass('text-violet-300')
  })
})

