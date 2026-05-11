export function useHaptic() {
  const trigger = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    if (!navigator.vibrate) return

    const patterns: Record<string, number | number[]> = {
      light:   10,
      medium:  30,
      heavy:   50,
      success: [10, 50, 10],
      error:   [30, 40, 30],
    }
    navigator.vibrate(patterns[type])
  }

  return { trigger }
}
