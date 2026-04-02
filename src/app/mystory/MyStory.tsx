import styles from './MyStory.module.css'
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
            <p>Hola, soy Daiana, desarrolladora Full Stack.</p>
            <br />
            <p>
                Todo comenzó de pequeña, frente a mi primera computadora.             </p>
          <p>Desde ese momento, la curiosidad por la tecnología pasó a formar parte de mi día a día y terminó convirtiéndose en el camino que hoy sigo como desarrolladora.</p>
          </div>
        </div>

        <div className={`${styles.block} ${styles.reverse}`}>
          <PhotoCard
            pixelSrc="/images/yo3p.jpg"
            realSrc="/images/yo3.jpeg"
            alt="Daiana frente a la computadora"
          />
          <div className={styles.text}>
            <p>Siempre sentí que tenía dos formas de ver el mundo.</p>
            <br />
            <p>Por un lado, mi lado artístico me impulsa a imaginar, diseñar y dar vida a ideas con una mirada estética y creativa.</p>
            <p>Por otro, mi lado lógico me lleva a buscar estructura, orden y soluciones dentro de la complejidad.</p>
            <br />
            <p>
              Hoy, esa combinación guía mi trabajo.Desarrollo aplicaciones funcionales, claras e intuitivas.
              Aquella niña curiosa creció, y hoy transforma esa misma fascinación por la tecnología en cada proyecto que diseña y construye.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}