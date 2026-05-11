import { useCallback } from 'react'
import { useStore } from '../store/useStore'

const PREFERRED_VOICE_PATTERNS = ['Samantha', 'Alex', 'Google US English', 'Karen', 'Moira']

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(
      (v) => v.lang.startsWith('en') && PREFERRED_VOICE_PATTERNS.some((p) => v.name.includes(p)),
    ) ?? voices.find((v) => v.lang.startsWith('en-US')) ?? voices.find((v) => v.lang.startsWith('en'))
  )
}

export function useSpeech() {
  const setSpeaking = useStore((s) => s.setSpeaking)

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()

      const doSpeak = () => {
        const utt = new SpeechSynthesisUtterance(text)
        utt.rate   = 0.95
        utt.pitch  = 1.0
        utt.volume = 1
        const voice = pickVoice()
        if (voice) utt.voice = voice
        utt.onstart = () => setSpeaking(true)
        utt.onend   = () => setSpeaking(false)
        utt.onerror = () => setSpeaking(false)
        window.speechSynthesis.speak(utt)
      }

      // Chrome loads voices asynchronously — getVoices() returns [] on first call
      if (window.speechSynthesis.getVoices().length > 0) {
        doSpeak()
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
        // Fallback: if voiceschanged never fires, speak anyway after 500ms
        setTimeout(() => {
          if (!window.speechSynthesis.speaking) doSpeak()
        }, 500)
      }
    },
    [setSpeaking],
  )

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [setSpeaking])

  return { speak, stop }
}
