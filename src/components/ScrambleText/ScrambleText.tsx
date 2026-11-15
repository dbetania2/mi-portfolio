'use client'
import { useEffect, useState, useCallback, useRef } from 'react'

interface ScrambleTextProps {
  text: string
  className?: string
  onStart?: () => void
  onComplete?: () => void
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export default function ScrambleText({ text, className, onStart, onComplete }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const isAnimating = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const onStartRef = useRef(onStart)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onStartRef.current = onStart
    onCompleteRef.current = onComplete
  }, [onStart, onComplete])

  const stopAnimation = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    isAnimating.current = false
  }, [])

  const triggerAnimation = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true
    onStartRef.current?.()

    let iterations = 0

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return text[index]
            }
            if (char === ' ') return ' '
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )

      if (iterations >= text.length) {
        stopAnimation()
        onCompleteRef.current?.()
      }

      iterations += 1 / 3
    }, 30)
  }, [text, stopAnimation])

  useEffect(() => {
    triggerAnimation()
    return () => {
      stopAnimation()
    }
  }, [triggerAnimation, stopAnimation])

  return (
    <span 
      className={className} 
      onMouseEnter={triggerAnimation}
      style={{ display: 'inline-block' }}
    >
      {displayText}
    </span>
  )
}
