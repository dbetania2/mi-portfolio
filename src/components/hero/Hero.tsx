import styles from './Hero.module.css'

export default function Hero() {
  const name = "Daiana Del Grecco";

  return (
    <section id="hero" className={styles.section}>
      <div className={styles.layout}>

        <div className={styles.spriteContainer}>
          <div className={`chibi ${styles.chibiScaled}`} />
        </div>

        <div className={styles.text}>
          
          <p className={styles.greeting}>
            &gt; Hola, soy
          </p>
          
          <h1 className={styles.nameContainer}>
            {name.split("").map((letter, index) => (
              <span key={index} className={styles.letter}>
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
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