'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './ImageLightbox.module.css'

type Props = {
  src: string
  alt: string
}

export default function ImageLightbox({ src, alt }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKey)
    } else {
      document.body.style.overflow = 'unset'
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
          priority
        />
        <span className={styles.imgHint}>[ click para ampliar ]</span>
      </div>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button className={styles.closeBtn} onClick={() => setOpen(false)}>
            [ X ] Cerrar
          </button>
          <div className={styles.lightbox} onClick={(e) => e.stopPropagation()}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="95vw"
              className={styles.lightboxImg}
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}