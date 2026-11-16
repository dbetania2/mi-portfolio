'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './ProjectGallery.module.css'

interface ProjectGalleryProps {
  images: string[]
  title: string
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const validImages = images.filter(Boolean)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  const hasMultipleImages = validImages.length > 1

  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
        setIsZoomed(false)
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen])

  if (validImages.length === 0) return null

  const currentImage = validImages[activeIndex] || validImages[0]

  return (
    <div className={styles.galleryContainer}>
      {/* ── IMAGEN PRINCIPAL (MARCO DOBLE CIAN / MAGENTA + GLOW) ── */}
      <button
        type="button"
        className={styles.mainFrame}
        onClick={() => setIsLightboxOpen(true)}
        aria-label={`Ampliar imagen principal de ${title}`}
      >
        <Image
          src={currentImage}
          alt={`${title} - Captura ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 650px"
          className={styles.mainImage}
          priority
        />
        <div className={styles.scanlinesOverlay} />
        <span className={styles.expandBadge} aria-hidden="true">
          [ click para ampliar ]
        </span>
      </button>

      {/* ── TIRA DE MINIATURAS: SOLO SI HAY MÁS DE 1 IMAGEN ── */}
      {hasMultipleImages && (
        <div 
          className={styles.thumbnailsGrid}
          style={{ gridTemplateColumns: `repeat(${Math.min(validImages.length, 4)}, 1fr)` }}
          role="tablist"
          aria-label="Capturas del proyecto"
        >
          {validImages.slice(0, 4).map((img, idx) => (
            <button
              key={`thumb-${idx}-${img.slice(0, 15)}`}
              type="button"
              className={`${styles.thumbBtn} ${idx === activeIndex ? styles.thumbActive : ''}`}
              onClick={() => setActiveIndex(idx)}
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Ver captura ${idx + 1} de ${title}`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="(max-width: 768px) 25vw, 150px"
                className={styles.thumbImg}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── LIGHTBOX MODAL FULLSCREEN ── */}
      {isLightboxOpen && (
        <div
          className={styles.overlay}
          onClick={() => {
            setIsLightboxOpen(false)
            setIsZoomed(false)
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${title}`}
        >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => {
              setIsLightboxOpen(false)
              setIsZoomed(false)
            }}
            aria-label="Cerrar vista ampliada"
          >
            [ X ] Cerrar
          </button>

          <div
            className={`${styles.lightbox} ${isZoomed ? styles.zoomed : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomed((prev) => !prev)
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                setIsZoomed((prev) => !prev)
              }
            }}
            aria-label={isZoomed ? 'Reducir zoom' : 'Aumentar zoom'}
          >
            <Image
              src={currentImage}
              alt={`${title} - Vista ampliada`}
              fill
              sizes="100vw"
              className={styles.lightboxImg}
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
