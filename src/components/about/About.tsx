import styles from './About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className="container">
        
        {/* CABECERA*/}
        <header className={styles.header}>
          <h2 className={styles.sectionTitle}>[ SOBRE MÍ ]</h2>
          <p className={styles.intro}>
            Hoy en día considero que un desarrollador <strong>full stack</strong> necesita conocimientos que van más allá de escribir código. 
            Comprender cómo se diseñan, se conectan y se construyen los sistemas es fundamental para lograr soluciones 
            completas, eficientes y mantenibles.
            <br /><br />
            Por eso, mi experiencia y mis intereses se desarrollan en <strong>tres áreas principales</strong>:
          </p>
        </header>

        {/* --- BLOQUES --- */}

        <article className={styles.row}>
          <div className={styles.visualCol}>
            <div className={`${styles.sprite} ${styles.bobRoss}`} />
            <p className={styles.quote}>"We don't make mistakes, we just have happy accidents"</p>
          </div>
          <div className={styles.textCol}>
            <h3 className={styles.blockTitle}> Diseño</h3>
            <p>
              El diseño es una etapa donde puedo demostrar mi lado creativo y uno de mis procesos favoritos dentro del desarrollo. 
              Suelo comenzar creando paneles de paletas de colores, iconos, wireframes y prototipos para definir la identidad 
              y la estructura visual de las aplicaciones. Además, el <strong>pixelart</strong> es mi estilo de diseño preferido.
            </p>
          </div>
        </article>

        <article className={`${styles.row} ${styles.reverse}`}>
          <div className={styles.visualCol}>
            <div className={`${styles.sprite} ${styles.pcYo}`} />
            <p className={styles.quote}>*tap* *tap*</p>
          </div>
          <div className={styles.textCol}>
            <h3 className={styles.blockTitle}>Programación</h3>
            <p>
              La programación es una de mis áreas técnicas más fuertes. Cuento con estudios universitarios en programación 
              y trabajo tanto en <strong>frontend como en backend</strong>. También utilizo herramientas no-code cuando permiten 
              resolver problemas de forma más ágil.
            </p>
          </div>
        </article>

        <article className={styles.row}>
          <div className={styles.visualCol}>
            <div className={`${styles.sprite} ${styles.yoRobot}`} />
            <p className={styles.quote}>"beep boop beep"</p>
          </div>
          <div className={styles.textCol}>
            <h3 className={styles.blockTitle}>Automatización</h3>
            <p>
              El uso de <strong>agentes de inteligencia artificial</strong> y la automatización de procesos permite optimizar tareas repetitivas 
              y mejorar la eficiencia en el trabajo diario, tanto al programar como al gestionar proyectos.
            </p>
          </div>
        </article>

      </div>
    </section>
  )
}