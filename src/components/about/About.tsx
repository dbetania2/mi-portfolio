import styles from './About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className="container">

        <header className={styles.header}>
          <h2 className="title-neon">[ SOBRE MÍ ]</h2>
        </header>

        <article className={styles.aboutCard}>
          <div className={styles.visualCol}>
            <div className={`${styles.sprite} ${styles.bobRoss}`} />
            <p className={styles.quote}>
              “ No cometemos errores, solo pequeños accidentes felices. ”
              <span className={styles.author}>— Bob Ross</span>
            </p>
          </div>

          <div className={styles.textCol}>
            <h3 className={styles.blockTitle}>Diseño</h3>
            <span className={styles.roleLabel}>[ ROLE: UI/UX & PIXEL ARTIST ]</span>
            <p className={styles.description}>
              El diseño es una de mis etapas favoritas del desarrollo.
              Trabajo con paletas de color, iconografía, wireframes y prototipos
              para definir la identidad visual y la estructura de las aplicaciones.
              El pixel art es mi estilo preferido.
            </p>
          </div>
        </article>

        <article className={`${styles.aboutCard} ${styles.reverse}`}>
          <div className={styles.visualCol}>
            <div className={`${styles.sprite} ${styles.pcYo}`} />
            <p className={styles.quote}>*tap* *tap*</p>
          </div>

          <div className={styles.textCol}>
            <h3 className={styles.blockTitle}>Programación</h3>
            <span className={styles.roleLabel}>[ ROLE: FULL STACK DEVELOPER ]</span>
            <p className={styles.description}>
              Desarrollo soluciones full stack trabajando tanto en frontend como backend.
              Integro herramientas modernas y, cuando es necesario, soluciones no-code
              para optimizar tiempos y procesos.
            </p>
          </div>
        </article>

        <article className={styles.aboutCard}>
          <div className={styles.visualCol}>
            <div className={`${styles.sprite} ${styles.yoRobot}`} />
            <p className={styles.quote}>&quot;beep boop beep&quot;</p>
          </div>

          <div className={styles.textCol}>
            <h3 className={styles.blockTitle}>Automatización</h3>
            <span className={styles.roleLabel}>[ ROLE: AI & AUTOMATION ENGINEER ]</span>
            <p className={styles.description}>
              Utilizo inteligencia artificial y automatización de procesos para reducir tareas repetitivas,
              optimizar flujos de trabajo y mejorar la eficiencia en desarrollo y gestión de proyectos.
            </p>
          </div>
        </article>

      </div>
    </section>
  )
}