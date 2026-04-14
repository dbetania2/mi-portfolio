import styles from './About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className="container">

        {/* CABECERA */}
        <header className={styles.header}>
          <h2 className={styles.sectionTitle}>[ SOBRE MÍ ]</h2>

          <p className={styles.intro}>
            Hoy en día considero que un desarrollador <strong>full stack</strong> necesita ir más allá de escribir código.
            Entender cómo se diseñan, conectan y construyen los sistemas es clave para crear soluciones completas,
            eficientes y mantenibles.
            <br /><br />
            Por eso, mis intereses y experiencia se enfocan en <strong>tres áreas principales</strong>:
          </p>
        </header>

        {/* DISEÑO */}
        <article className={styles.row}>
          <div className={styles.visualCol}>
            <div className={`${styles.sprite} ${styles.bobRoss}`} />
            <p className={styles.quote}>
              “ No cometemos errores, solo pequeños accidentes felices. ” — Bob Ross
            </p>
          </div>

          <div className={styles.textCol}>
            <h3 className={styles.blockTitle}>Diseño</h3>
            <p>
              El diseño es una de mis etapas favoritas del desarrollo.
              Trabajo con paletas de color, iconografía, wireframes y prototipos
              para definir la identidad visual y la estructura de las aplicaciones.
              El pixel art es mi estilo preferido.
            </p>
          </div>
        </article>

        {/* PROGRAMACIÓN */}
        <article className={`${styles.row} ${styles.reverse}`}>
          <div className={styles.visualCol}>
            <div className={`${styles.sprite} ${styles.pcYo}`} />
            <p className={styles.quote}>*tap* *tap*</p>
          </div>

          <div className={styles.textCol}>
            <h3 className={styles.blockTitle}>Programación</h3>
            <p>
              Desarrollo soluciones full stack trabajando tanto en frontend como backend.
              Integro herramientas modernas y, cuando es necesario, soluciones no-code
              para optimizar tiempos y procesos.
            </p>
          </div>
        </article>

        {/* AUTOMATIZACIÓN */}
        <article className={styles.row}>
          <div className={styles.visualCol}>
            <div className={`${styles.sprite} ${styles.yoRobot}`} />
            <p className={styles.quote}>"beep boop beep"</p>
          </div>

          <div className={styles.textCol}>
            <h3 className={styles.blockTitle}>Automatización</h3>
            <p>
              Utilizo inteligencia artificial y automatización de procesos para reducir tareas repetitivas,
              optimizar flujos de trabajo y mejorar la eficiencia en desarrollo y gestión de proyectos.
            </p>
          </div>
        </article>

      </div>
    </section>
  )
}