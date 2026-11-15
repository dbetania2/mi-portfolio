'use client'
import { useState } from 'react'
import styles from './Hero.module.css'
import ScrambleText from '../ScrambleText/ScrambleText'

export default function Hero() {
  const name = 'Daiana Del Grecco'
  const [isDone, setIsDone] = useState(false)
  const [hasAnimatedOnce, setHasAnimatedOnce] = useState(false)

  const isFloating = isDone || hasAnimatedOnce
  const isPointerVisible = isDone || hasAnimatedOnce

  const handlePointerClick = () => {
    document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.dispatchEvent(new Event('start-carousel-autoplay'))
  }

  return (
    <section id="hero" className={styles.section} aria-label="Introducción">
      <div className={styles.layout}>

        <div className={styles.spriteContainer} aria-hidden="true">
          <div className={`chibi ${styles.chibiScaled}`} />
        </div>

        <div className={styles.text}>
          
          <p className={styles.greeting}>
            &gt; Hola, soy
          </p>
          
          <h1 className={`${styles.nameContainer} ${isFloating ? styles.floating : ''}`}>
            <button 
              type="button"
              className={`${styles.pointer} ${isPointerVisible ? styles.pointerVisible : ''} ${styles.clickablePointer}`}
              onClick={handlePointerClick}
              title="Ver Proyectos Destacados"
              aria-label="Ver proyectos destacados"
              tabIndex={isPointerVisible ? 0 : -1}
            >
              ▶&nbsp;
            </button>
            <ScrambleText 
              text={name} 
              className={styles.nameText} 
              onStart={() => setIsDone(false)}
              onComplete={() => {
                setIsDone(true)
                setHasAnimatedOnce(true)
              }}
            />
          </h1>

          <h2 className={styles.role}>
            Full Stack Developer
          </h2>

          <p className={styles.description}>
            Desarrollo web, automatización de procesos y diseño de interfaces.
          </p>
          
          <div className={styles.buttons}>
            <a href="#proyectos" className="pixel-btn">Ver proyectos</a>
            <a href="#contacto" className="pixel-btn">Contacto</a>
          </div>
          
        </div>

      </div>
    </section>
  )
}
