import styles from './About.module.css'
import Image from 'next/image'

function PhotoCard({ pixelSrc, realSrc, alt }: {
  pixelSrc: string
  realSrc: string
  alt: string
}) {
  return (
    <div className={styles.imgWrapper}>
      <Image 
        src={pixelSrc} 
        alt={alt} 
        fill 
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={styles.imgPixel} 
      />
      <Image 
        src={realSrc} 
        alt={alt} 
        fill 
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={styles.imgReal} 
      />
      <div className={styles.sprite} />
      <p className={styles.hoverText}></p> 
    </div>
  )
}

export default function About() {
  return (
    <section id="sobre-mi" className={styles.section}>
      <div className="container">
        <h2 style={{ marginBottom: '3rem' }}>[ Sobre mí ]</h2>

        <div className={styles.block}>
          <PhotoCard
            pixelSrc="/images/yo2p.jpg"
            realSrc="/images/yo2.jpeg"
            alt="Daiana de pequeña"
          />
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

        <div className={`${styles.block} ${styles.reverse}`}>
          <PhotoCard
            pixelSrc="/images/yo3p.jpg"
            realSrc="/images/yo3.jpeg"
            alt="Daiana frente a la computadora"
          />
          <div className={styles.text}>
            <p>Siempre tuve dos maneras de ver el mundo.</p>
            <br />
            <p>Mi lado artístico me impulsa a explorar la fantasía y lo estético.</p>
            <p>Mi lado lógico me lleva a buscar el orden en la complejidad.</p>
            <br />
            <p>
              Aquella niña creció y hoy explota su creatividad — creando,
              diseñando y construyendo ideas.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}