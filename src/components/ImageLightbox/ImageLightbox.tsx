'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './ImageLightbox.module.css'

type Props = {
  src: string
  alt: string
  priority?: boolean
}

export default function ImageLightbox({ src, alt, priority = false }: Props) {
  const [open, setOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false) // Nuevo estado para el zoom interno

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setIsZoomed(false)
      }
    }
    if (open) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKey)
    } else {
      document.body.style.overflow = 'unset'
      setIsZoomed(false)
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <>
      <div
        className={styles.imgWrapper}
        onClick={() => setOpen(true)}
        role="button"
        aria-label="Ver imagen completa"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className={styles.img}
          priority={priority}
        />
        <span className={styles.imgHint}>[ click para ampliar ]</span>
      </div>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => {
            setOpen(false)
            setIsZoomed(false)
          }}
          role="dialog"
          aria-modal="true"
        >
          <button className={styles.closeBtn} onClick={() => setOpen(false)}>
            [ X ] Cerrar
          </button>
          
          <div 
            className={`${styles.lightbox} ${isZoomed ? styles.zoomed : ''}`} 
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomed(!isZoomed) // Cambia entre zoom y vista normal
            }}
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