'use client'
import { useEffect, useState, useCallback, useRef } from 'react'

interface ScrambleTextProps {
  text: string
  className?: string
  onStart?: () => void
  onComplete?: () => void
}

export default function ScrambleText({ text, className, onStart, onComplete }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const isAnimating = useRef(false)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  // Guardamos las referencias actualizadas de las funciones callback para evitar re-crear triggerAnimation
  const onStartRef = useRef(onStart)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onStartRef.current = onStart
    onCompleteRef.current = onComplete
  }, [onStart, onComplete])

  const triggerAnimation = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true
    if (onStartRef.current) onStartRef.current()

    let iterations = 0
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return text[index]
            }
            if (char === ' ') return ' '
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )

      if (iterations >= text.length) {
        clearInterval(interval)
        isAnimating.current = false
        if (onCompleteRef.current) onCompleteRef.current()
      }

      iterations += 1 / 3
    }, 30)
  }, [text])

  useEffect(() => {
    triggerAnimation()
  }, [triggerAnimation])

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
