import { useEffect, useRef, useState } from 'react'

export interface MotionState {
  x: number
  y: number
}

export function useDeviceMotion(maxTilt = 12): MotionState {
  const [motion, setMotion] = useState<MotionState>({ x: 0, y: 0 })
  const rafRef = useRef<number>()
  const targetRef = useRef<MotionState>({ x: 0, y: 0 })
  const currentRef = useRef<MotionState>({ x: 0, y: 0 })

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile && typeof DeviceOrientationEvent !== 'undefined') {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        const beta  = e.beta  ?? 0
        const gamma = e.gamma ?? 0
        targetRef.current = {
          x: Math.max(-maxTilt, Math.min(maxTilt, gamma / 4)),
          y: Math.max(-maxTilt, Math.min(maxTilt, (beta - 45) / 6)),
        }
      }

      const requestPerm = async () => {
        const DevOrient = DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>
        }
        if (typeof DevOrient.requestPermission === 'function') {
          const perm = await DevOrient.requestPermission()
          if (perm === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
          }
        } else {
          window.addEventListener('deviceorientation', handleOrientation)
        }
      }
      requestPerm()
      return () => window.removeEventListener('deviceorientation', handleOrientation)
    } else {
      // Mouse parallax on desktop
      const handleMouse = (e: MouseEvent) => {
        const cx = window.innerWidth  / 2
        const cy = window.innerHeight / 2
        targetRef.current = {
          x: ((e.clientX - cx) / cx) * maxTilt,
          y: ((e.clientY - cy) / cy) * maxTilt,
        }
      }
      window.addEventListener('mousemove', handleMouse)
      return () => window.removeEventListener('mousemove', handleMouse)
    }
  }, [maxTilt])

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const animate = () => {
      currentRef.current = {
        x: lerp(currentRef.current.x, targetRef.current.x, 0.08),
        y: lerp(currentRef.current.y, targetRef.current.y, 0.08),
      }
      setMotion({ ...currentRef.current })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return motion
}
