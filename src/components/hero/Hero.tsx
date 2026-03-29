import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="hero" className={styles.section}>
      <div className={styles.layout}>

        <div className={styles.spriteContainer}>
          <div className={`chibi ${styles.chibiScaled}`} />
        </div>

        <div className={styles.text}>
          <p style={{ color: 'var(--border)', marginBottom: '0.75rem' }}>
            &gt; Hola, soy
          </p>
          <h1>Daiana Del Grecco</h1>
          <h2>Full Stack Developer</h2>
          <p style={{ maxWidth: '35rem', marginBottom: '2.5rem', lineHeight: '2' }}>
            Construyo productos digitales con código limpio y diseño con personalidad.
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