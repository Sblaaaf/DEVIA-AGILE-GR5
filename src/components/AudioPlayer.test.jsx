import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import AudioPlayer from './AudioPlayer'

const makeAudioBuffer = () => ({
  numberOfChannels: 1,
  length: 2,
  sampleRate: 44100,
  getChannelData: () => new Float32Array(2),
})

describe('AudioPlayer', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('shows loading text and then hides it after loading', async () => {
    const audioCtx = {
      createGain: () => ({ gain: { value: 1 }, connect: vi.fn() }),
      destination: {},
      decodeAudioData: vi.fn(async () => makeAudioBuffer()),
      createBuffer: vi.fn((channels, length, sampleRate) => ({
        numberOfChannels: channels,
        length,
        sampleRate,
        getChannelData: () => new Float32Array(length),
      })),
      createBufferSource: () => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        loop: false,
        buffer: null,
      }),
      state: 'running',
      resume: vi.fn(),
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      arrayBuffer: async () => new ArrayBuffer(8),
    }))
    vi.stubGlobal('AudioContext', vi.fn(() => audioCtx))

    render(<AudioPlayer src="https://example.com/preview.mp3" playing={false} />)

    expect(screen.getByText('Chargement…')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Chargement…')).not.toBeInTheDocument()
    })
  })

  it('renders equalizer bars when playing after load', async () => {
    const audioCtx = {
      createGain: () => ({ gain: { value: 1 }, connect: vi.fn() }),
      destination: {},
      decodeAudioData: vi.fn(async () => makeAudioBuffer()),
      createBuffer: vi.fn((channels, length, sampleRate) => ({
        numberOfChannels: channels,
        length,
        sampleRate,
        getChannelData: () => new Float32Array(length),
      })),
      createBufferSource: () => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        loop: false,
        buffer: null,
      }),
      state: 'running',
      resume: vi.fn(),
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      arrayBuffer: async () => new ArrayBuffer(8),
    }))
    vi.stubGlobal('AudioContext', vi.fn(() => audioCtx))

    const { container } = render(
      <AudioPlayer src="https://example.com/preview.mp3" playing={true} />
    )

    await waitFor(() => {
      const bars = container.querySelectorAll('.bg-violet-400')
      expect(bars.length).toBe(4)
    })
  })

  it('shows inversion text when inverted', () => {
    const audioCtx = {
      createGain: () => ({ gain: { value: 1 }, connect: vi.fn() }),
      destination: {},
      decodeAudioData: vi.fn(async () => makeAudioBuffer()),
      createBuffer: vi.fn((channels, length, sampleRate) => ({
        numberOfChannels: channels,
        length,
        sampleRate,
        getChannelData: () => new Float32Array(length),
      })),
      createBufferSource: () => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        loop: false,
        buffer: null,
      }),
      state: 'running',
      resume: vi.fn(),
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      arrayBuffer: async () => new ArrayBuffer(8),
    }))
    vi.stubGlobal('AudioContext', vi.fn(() => audioCtx))

    render(
      <AudioPlayer
        src="https://example.com/preview.mp3"
        playing={false}
        isInverted={true}
      />
    )

    expect(screen.getByText('Inversion…')).toBeInTheDocument()
  })
})

