import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HomeScreen from './HomeScreen'
import { getLeaderboard } from '../services/leaderboard'

vi.mock('../services/leaderboard', () => ({
  getLeaderboard: vi.fn(),
}))

describe('HomeScreen', () => {
  beforeEach(() => {
    getLeaderboard.mockReturnValue([])
  })

  it('shows best score when leaderboard has entries', () => {
    getLeaderboard.mockReturnValue([{ score: 120, genre: 'Pop', date: '01/01/2024' }])
    render(<HomeScreen onStart={vi.fn()} error={null} />)

    expect(screen.getByText('Meilleur score :')).toBeInTheDocument()
    expect(screen.getByText('120 pts')).toBeInTheDocument()
  })

  it('calls onStart with selected genre and inversion flag', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    render(<HomeScreen onStart={onStart} error={null} />)

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Rock' }))

    expect(onStart).toHaveBeenCalledWith('Rock', true)
  })

  it('shows error when provided', () => {
    render(<HomeScreen onStart={vi.fn()} error="Oups" />)
    expect(screen.getByText('Oups')).toBeInTheDocument()
  })
})

