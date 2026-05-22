import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import QuizCard from './QuizCard'

vi.mock('./Timer', () => ({
  default: ({ onTimeout }) => <button onClick={onTimeout}>Timer</button>,
}))

vi.mock('./AudioPlayer', () => ({
  default: () => <div data-testid="audio" />,
}))

const round = {
  correct: {
    id: 1,
    preview: 'https://preview.mp3',
    title: 'Track 1',
    artist: { name: 'Artist 1' },
    album: { cover_medium: 'https://cover.jpg' },
  },
  choices: [
    { id: 1, title: 'Track 1', artist: { name: 'Artist 1' } },
    { id: 2, title: 'Track 2', artist: { name: 'Artist 2' } },
    { id: 3, title: 'Track 3', artist: { name: 'Artist 3' } },
    { id: 4, title: 'Track 4', artist: { name: 'Artist 4' } },
  ],
}

describe('QuizCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('calls onAnswer with correctness and elapsed time', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onAnswer = vi.fn()

    const nowSpy = vi.spyOn(Date, 'now')
    nowSpy.mockReturnValueOnce(1000)

    render(
      <QuizCard
        round={round}
        roundIndex={0}
        totalRounds={10}
        score={0}
        onAnswer={onAnswer}
        onTimeout={vi.fn()}
        volume={0.5}
        onQuit={vi.fn()}
        isInverted={false}
      />
    )

    act(() => {
      vi.advanceTimersByTime(300)
    })

    nowSpy.mockReturnValueOnce(4000)
    await user.click(screen.getByRole('button', { name: /Artist 1/ }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onAnswer).toHaveBeenCalledWith(true, 3)
  })

  it('calls onTimeout after timer signals timeout', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onTimeout = vi.fn()

    render(
      <QuizCard
        round={round}
        roundIndex={0}
        totalRounds={10}
        score={0}
        onAnswer={vi.fn()}
        onTimeout={onTimeout}
        volume={0.5}
        onQuit={vi.fn()}
        isInverted={false}
      />
    )

    await user.click(screen.getByText('Timer'))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onTimeout).toHaveBeenCalled()
  })
})

