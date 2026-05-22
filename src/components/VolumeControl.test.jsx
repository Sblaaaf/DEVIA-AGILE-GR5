import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import VolumeControl from './VolumeControl'

describe('VolumeControl', () => {
  it('toggles the panel and emits volume changes', async () => {
    const user = userEvent.setup()
    const onVolumeChange = vi.fn()

    render(<VolumeControl volume={0.3} onVolumeChange={onVolumeChange} />)

    await user.click(screen.getByRole('button', { name: 'Paramètres son' }))
    expect(screen.getByText('30%')).toBeInTheDocument()

    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '0.7' } })

    expect(onVolumeChange).toHaveBeenCalledWith(0.7)
  })
})

