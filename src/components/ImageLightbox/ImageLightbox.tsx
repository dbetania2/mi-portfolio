'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from './ImageLightbox.module.css'

type Props = {
  src: string
  alt: string
  priority?: boolean
}

export default function ImageLightbox({ src, alt, priority = false }: Props) {
  const [open, setOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
    setIsZoomed(false)
  }, [])

  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, handleClose])

  return (
    <>
      <button
        type="button"
        className={styles.imgWrapper}
        onClick={() => setOpen(true)}
        aria-label={`Ampliar imagen: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className={styles.img}
          priority={priority}
        />
        <span className={styles.imgHint} aria-hidden="true">[ click para ampliar ]</span>
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${alt}`}
        >
          <button 
            type="button"
            className={styles.closeBtn} 
            onClick={handleClose}
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
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className={styles.lightboxImg}
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
