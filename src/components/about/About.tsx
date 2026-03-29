import styles from './About.module.css'
import Image from 'next/image'

export default function About() {
  return (
    <section id="sobre-mi" className={styles.section}>
      <div className="container">
        <h2>[ Sobre mí ]</h2>

        {/* Bloque 1 — foto izquierda */}
        <div className={styles.block}>
          <div className={styles.imgWrapper}>
            <Image
              src="/images/yo2p.jpg"
              alt="Daiana de pequeña pixelada"
              fill
              className={styles.imgPixel}
            />
            <Image
              src="/images/yo2.jpeg"
              alt="Daiana de pequeña"
              fill
              className={styles.imgReal}
            />
          </div>
          <div className={styles.text}>
            <p>Hola, soy Daiana — desarrolladora Full Stack.</p>
            <br />
            <p>
              Desde pequeña, mi infancia moldeó mi fascinación por la tecnología
              e internet. Todo empezó frente a mi primera computadora, donde
              descubrí que las pantallas podían ser mundos enteros.
            </p>
          </div>
        </div>

        {/* Bloque 2 — foto derecha */}
        <div className={`${styles.block} ${styles.reverse}`}>
          <div className={styles.imgWrapper}>
            <Image
              src="/images/yo3p.jpg"
              alt="Daiana frente a la computadora pixelada"
              fill
              className={styles.imgPixel}
            />
            <Image
              src="/images/yo3.jpeg"
              alt="Daiana sentada feliz"
              fill
              className={styles.imgReal}
            />
          </div>
          <div className={styles.text}>
            <p>Siempre tuve dos maneras de ver el mundo.</p>
            <br />
            <p>Mi lado artístico que me impulsa a explorar el diseño y lo estético.</p>
  
            <p>Mi lado lógico me lleva a buscar el orden en la complejidad.</p>
            <br />
            <p>
              Aquella niña creció y hoy explota su creatividad — creando,
              diseñando y construyendo en internet.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}