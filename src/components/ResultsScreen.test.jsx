import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ResultsScreen from './ResultsScreen'
import { saveScore } from '../services/leaderboard'

vi.mock('../services/leaderboard', () => ({
  saveScore: vi.fn(),
}))

vi.mock('./ScoreBoard', () => ({
  default: () => <div data-testid="scoreboard" />,
}))

describe('ResultsScreen', () => {
  it('shows grade, correct count, and saves score', () => {
    render(
      <ResultsScreen
        score={600}
        answers={[{ correct: true }, { correct: true }, { correct: true }, { correct: false }]}
        genre="Pop"
        totalRounds={4}
        onPlayAgain={vi.fn()}
      />
    )

    expect(screen.getByText('Légendaire !')).toBeInTheDocument()
    expect(screen.getByText('3/4 bonnes réponses')).toBeInTheDocument()
    expect(saveScore).toHaveBeenCalledWith(600, 'Pop')
  })

  it('calls onPlayAgain from the main action', async () => {
    const user = userEvent.setup()
    const onPlayAgain = vi.fn()

    render(
      <ResultsScreen
        score={300}
        answers={[{ correct: true }, { correct: false }]}
        genre="Rock"
        totalRounds={2}
        onPlayAgain={onPlayAgain}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Rejouer' }))
    expect(onPlayAgain).toHaveBeenCalled()
  })
})

