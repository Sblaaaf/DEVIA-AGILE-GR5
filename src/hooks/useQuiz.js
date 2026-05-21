import { useReducer, useCallback } from 'react'
import { buildQuizRounds } from '../services/deezer'

const ROUND_TIME = 20
const BASE_POINTS = 100
const SPEED_BONUS_MAX = 50

function speedBonus(elapsed) {
  const ratio = Math.max(0, 1 - elapsed / ROUND_TIME)
  return Math.round(SPEED_BONUS_MAX * ratio)
}

const initialState = {
  screen: 'home', // home | loading | playing | results
  genre: null,
  rounds: [],
  roundIndex: 0,
  score: 0,
  answers: [], // { correct: bool, points: number }
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_LOADING':
      return { 
        ...initialState, 
        screen: 'loading', 
        genre: action.genre 
      }

    case 'ROUNDS_READY':
      return { ...state, screen: 'playing', rounds: action.rounds }

    case 'LOAD_ERROR':
      return { ...state, screen: 'home', error: action.error }

    case 'ANSWER': {
      const { correct, elapsed } = action
      const pts = correct ? BASE_POINTS + speedBonus(elapsed) : 0
      const answers = [...state.answers, { correct, points: pts }]
      const score = state.score + pts
      const nextIndex = state.roundIndex + 1
      if (nextIndex >= state.rounds.length) {
        return { ...state, answers, score, screen: 'results' }
      }
      return { ...state, answers, score, roundIndex: nextIndex }
    }

    case 'TIMEOUT': {
      const answers = [...state.answers, { correct: false, points: 0 }]
      const nextIndex = state.roundIndex + 1
      if (nextIndex >= state.rounds.length) {
        return { ...state, answers, screen: 'results' }
      }
      return { ...state, answers, roundIndex: nextIndex }
    }

    case 'PLAY_AGAIN':
      return { ...initialState }

    default:
      return state
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const startGame = useCallback(async (genre) => {
    dispatch({ type: 'START_LOADING', genre })
    try {
      const rounds = await buildQuizRounds(genre, 10)
      dispatch({ type: 'ROUNDS_READY', rounds })
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', error: e.message })
    }
  }, [])

  const answer = useCallback((correct, elapsed) => {
    dispatch({ type: 'ANSWER', correct, elapsed })
  }, [])

  const timeout = useCallback(() => {
    dispatch({ type: 'TIMEOUT' })
  }, [])

  const playAgain = useCallback(() => {
    dispatch({ type: 'PLAY_AGAIN' })
  }, [])

  return {
    ...state,
    currentRound: state.rounds[state.roundIndex] ?? null,
    totalRounds: state.rounds.length || 10,
    startGame,
    answer,
    timeout,
    playAgain,
  }
}
