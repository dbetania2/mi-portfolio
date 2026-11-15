'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import ProjectCard from '../ProjectCard/ProjectCard'
import type { Project } from '@/app/projects/page'
import styles from './ProjectsCarousel.module.css'

export default function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const length = projects?.length || 0

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const next = useCallback(() => {
    if (length === 0) return
    setCurrentIndex((prev) => (prev + 1) % length)
  }, [length])

  const prev = useCallback(() => {
    if (length === 0) return
    setCurrentIndex((prev) => (prev - 1 + length) % length)
  }, [length])

  // Manejar el auto-play solicitado por el Hero u otras interacciones
  useEffect(() => {
    const handleStartAutoplay = () => setIsAutoPlaying(true)

    window.addEventListener('start-carousel-autoplay', handleStartAutoplay)

    return () => {
      window.removeEventListener('start-carousel-autoplay', handleStartAutoplay)
    }
  }, [])

  // Detener autoplay con interacción directa
  useEffect(() => {
    if (!isAutoPlaying) return

    const handleStopAutoplay = () => setIsAutoPlaying(false)

    window.addEventListener('wheel', handleStopAutoplay, { passive: true })
    window.addEventListener('touchmove', handleStopAutoplay, { passive: true })
    window.addEventListener('keydown', handleStopAutoplay)
    window.addEventListener('mousedown', handleStopAutoplay)

    return () => {
      window.removeEventListener('wheel', handleStopAutoplay)
      window.removeEventListener('touchmove', handleStopAutoplay)
      window.removeEventListener('keydown', handleStopAutoplay)
      window.removeEventListener('mousedown', handleStopAutoplay)
    }
  }, [isAutoPlaying])

  // Temporizador para auto-play
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      next()
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, next])

  // Navegación por teclado (A, D, Flechas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        prev()
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        next()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, prev])

  // Gestos táctiles Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 45

    if (distance > minSwipeDistance) {
      next()
    } else if (distance < -minSwipeDistance) {
      prev()
    }
  }

  if (length === 0) return null

  // Loop visual circular 3D
  const getOffset = (i: number) => {
    if (length < 3) return i - currentIndex

    if (i === currentIndex) return 0
    if (i === (currentIndex + 1) % length) return 1
    if (i === (currentIndex - 1 + length) % length) return -1

    let diff = i - currentIndex
    if (diff > length / 2) diff -= length
    else if (diff < -length / 2) diff += length
    
    return diff
  }

  return (
    <section 
      className={styles.carouselContainer}
      aria-roledescription="carousel"
      aria-label="Carrusel de proyectos destacados"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsAutoPlaying(false)}
    >
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
              role="group"
              aria-roledescription="slide"
              aria-label={`Proyecto ${i + 1} de ${length}: ${p.title}`}
              aria-hidden={offset !== 0}
            >
              <div style={{ pointerEvents: offset === 0 ? 'auto' : 'none' }}>
                <ProjectCard project={p} isFeatured={true} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Controles accesibles: Anterior / Siguiente / Indicadores */}
      <div className={styles.controlsRow}>
        <button
          type="button"
          onClick={prev}
          className={styles.navBtn}
          aria-label="Ver proyecto anterior"
        >
          &lt; ANT
        </button>

        <div className={styles.dots} aria-label="Indicadores de diapositiva">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Ir al proyecto ${i + 1}: ${p.title}`}
            >
              <span className={styles.dotInner} />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className={styles.navBtn}
          aria-label="Ver proyecto siguiente"
        >
          SIG &gt;
        </button>
      </div>

      <p className={styles.controlsHint}>
        [ USA A / D, FLECHAS O DESLIZÁ ]
      </p>
    </section>
  )
}
