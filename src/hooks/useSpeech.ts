import { useCallback } from 'react'
import { useStore } from '../store/useStore'

export function useSpeech() {
  const setSpeaking = useStore((s) => s.setSpeaking)

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(text)
      utt.rate  = 0.95
      utt.pitch = 1.0
      utt.volume = 1
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(
        (v) => v.lang === 'en-US' && (v.name.includes('Samantha') || v.name.includes('Alex') || v.name.includes('Google')),
      )
      if (preferred) utt.voice = preferred

      utt.onstart = () => setSpeaking(true)
      utt.onend   = () => setSpeaking(false)
      utt.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utt)
    },
    [setSpeaking],
  )

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [setSpeaking])

  return { speak, stop }
}
