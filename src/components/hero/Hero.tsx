'use client'
import { useState } from 'react'
import styles from './Hero.module.css'
import ScrambleText from '../ScrambleText/ScrambleText'

export default function Hero() {
  const name = "Daiana Del Grecco";
  const [isDone, setIsDone] = useState(false);
  const [hasAnimatedOnce, setHasAnimatedOnce] = useState(false);

  const isFloating = isDone || hasAnimatedOnce;
  const isPointerVisible = isDone || hasAnimatedOnce;
  const isSmallPointerVisible = !isDone && !hasAnimatedOnce;

  const handlePointerClick = () => {
    // Animación fluida de scroll hasta la sección de proyectos y centrado perfecto
    document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Disparar evento para que el carrusel empiece a moverse solo
    setTimeout(() => {
      window.dispatchEvent(new Event('start-carousel-autoplay'));
    }, 500); // Pequeño delay para que empiece cuando ya casi se hizo el scroll
  }

  return (
    <section id="hero" className={styles.section}>
      <div className={styles.layout}>

        <div className={styles.spriteContainer}>
          <div className={`chibi ${styles.chibiScaled}`} />
        </div>

        <div className={styles.text}>
          
          <p className={styles.greeting}>
            <span className={`${styles.smallPointer} ${isSmallPointerVisible ? styles.pointerVisible : ''}`}>▶&nbsp;</span>
            Hola, soy
          </p>
          
          <h1 className={`${styles.nameContainer} ${isFloating ? styles.floating : ''}`}>
            <span 
              className={`${styles.pointer} ${isPointerVisible ? styles.pointerVisible : ''} ${styles.clickablePointer}`}
              role="button"
              onClick={handlePointerClick}
              title="Ver Proyectos Destacados"
              style={{ cursor: 'pointer' }}
            >
              ▶&nbsp;
            </span>
            <ScrambleText 
              text={name} 
              className={styles.nameText} 
              onStart={() => setIsDone(false)}
              onComplete={() => {
                setIsDone(true);
                setHasAnimatedOnce(true);
              }}
            />
          </h1>

          <h2 className={styles.role}>
            Full Stack Developer
          </h2>

          {/* Le quitamos los estilos en línea, ahora todo lo controla la clase .description */}
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