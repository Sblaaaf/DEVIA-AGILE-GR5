const KEY = 'musicquiz_leaderboard'
const MAX = 10

export function saveScore(score, genre) {
  const board = getLeaderboard()
  const entry = { score, genre, date: new Date().toLocaleDateString('fr-FR') }
  const updated = [...board, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}
