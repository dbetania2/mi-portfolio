'use client'

import { useState, useEffect, useCallback } from 'react'
import ProjectCard from '../ProjectCard/ProjectCard'
import type { Project } from '@/app/projects/page'
import styles from './ProjectsCarousel.module.css'

export default function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const length = projects?.length || 0

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % length)
  }, [length])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + length) % length)
  }, [length])

  // Manejar el auto-play solicitado por el Hero
  useEffect(() => {
    const handleStartAutoplay = () => setIsAutoPlaying(true)
    const handleStopAutoplay = () => setIsAutoPlaying(false)

    window.addEventListener('start-carousel-autoplay', handleStartAutoplay)
    
    if (isAutoPlaying) {
      window.addEventListener('wheel', handleStopAutoplay, { passive: true })
      window.addEventListener('touchmove', handleStopAutoplay, { passive: true })
      window.addEventListener('keydown', handleStopAutoplay)
      window.addEventListener('mousedown', handleStopAutoplay)
    }

    return () => {
      window.removeEventListener('start-carousel-autoplay', handleStartAutoplay)
      window.removeEventListener('wheel', handleStopAutoplay)
      window.removeEventListener('touchmove', handleStopAutoplay)
      window.removeEventListener('keydown', handleStopAutoplay)
      window.removeEventListener('mousedown', handleStopAutoplay)
    }
  }, [isAutoPlaying])

  // Ejecutar el avance automático
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoPlaying) {
      interval = setInterval(() => {
        next()
      }, 2500) // Cambia de tarjeta cada 2.5s
    }
    return () => clearInterval(interval)
  }, [isAutoPlaying, next])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      if (e.key === 'a' || e.key === 'A') prev()
      else if (e.key === 'd' || e.key === 'D') next()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, prev])

  if (length === 0) return null

  // Función para lograr el loop infinito visual
  const getOffset = (i: number) => {
    if (length < 3) return i - currentIndex // Si hay 2 o menos, no se puede hacer loop visual completo

    if (i === currentIndex) return 0
    if (i === (currentIndex + 1) % length) return 1
    if (i === (currentIndex - 1 + length) % length) return -1

    // Para los elementos restantes, decidir si se ocultan a la izquierda o derecha
    let diff = i - currentIndex
    if (diff > length / 2) diff -= length
    else if (diff < -length / 2) diff += length
    
    return diff
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselTrack}>
        {projects.map((p, i) => {
          const offset = getOffset(i)

          let positionClass = ''
          if (offset === 0) positionClass = styles.active
          else if (offset === -1) positionClass = styles.prev
          else if (offset === 1) positionClass = styles.next
          else if (offset < -1) positionClass = styles.hiddenLeft
          else positionClass = styles.hiddenRight

          return (
            <div 
              key={p.id} 
              className={`${styles.slide} ${positionClass}`}
              onClick={() => setCurrentIndex(i)}
            >
              <div style={{ pointerEvents: offset === 0 ? 'auto' : 'none' }}>
                <ProjectCard project={p} isFeatured={true} />
              </div>
            </div>
          )
        })}
      </div>
      <p className={styles.controlsHint}>[ USA A Y D PARA NAVEGAR ]</p>
    </div>
  )
}
