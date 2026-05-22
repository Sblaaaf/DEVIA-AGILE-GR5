import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Timer from './Timer'

describe('Timer', () => {
  it('shows the Temps label', () => {
    render(<Timer onTimeout={vi.fn()} running={false} />)
    expect(screen.getByText('Temps')).toBeInTheDocument()
  })

  it('shows 20s when not running', () => {
    render(<Timer onTimeout={vi.fn()} running={false} />)
    expect(screen.getByText('20s')).toBeInTheDocument()
  })

  it('progress bar starts full', () => {
    const { container } = render(<Timer onTimeout={vi.fn()} running={false} />)
    const bar = container.querySelector('[style*="width: 100%"]')
    expect(bar).toBeInTheDocument()
  })

  it('progress bar is violet when time is not urgent', () => {
    const { container } = render(<Timer onTimeout={vi.fn()} running={false} />)
    const bar = container.querySelector('.bg-violet-500')
    expect(bar).toBeInTheDocument()
  })

  it('time display is not in urgent red when not running', () => {
    render(<Timer onTimeout={vi.fn()} running={false} />)
    const timeEl = screen.getByText('20s')
    expect(timeEl).not.toHaveClass('text-red-400')
  })
})
