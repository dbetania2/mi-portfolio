import styles from './About.module.css'

interface AboutItem {
  id: string
  title: string
  role: string
  description: string
  spriteClass: string
  quote: string
  author?: string
  reverse?: boolean
}

const ABOUT_ITEMS: AboutItem[] = [
  {
    id: 'design',
    title: 'Diseño',
    role: '[ UX/UI ]',
    description:
      'El diseño es una de mis etapas favoritas del desarrollo. Trabajo con paletas de color, iconografía, wireframes y prototipos para definir la identidad visual y la estructura de las aplicaciones. El pixel art es mi estilo preferido.',
    spriteClass: styles.bobRoss,
    quote: '“ No cometemos errores, solo pequeños accidentes felices. ”',
    author: '— Bob Ross',
  },
  {
    id: 'programming',
    title: 'Programación',
    role: '[ DEVELOPER ]',
    description:
      'Desarrollo soluciones full stack trabajando tanto en frontend como backend. Integro herramientas modernas y, cuando es necesario, soluciones no-code para optimizar tiempos y procesos.',
    spriteClass: styles.pcYo,
    quote: '*tap* *tap*',
    reverse: true,
  },
  {
    id: 'automation',
    title: 'Automatización',
    role: '[ IA & AUTOMATION ]',
    description:
      'Utilizo inteligencia artificial y automatización de procesos para reducir tareas repetitivas, optimizar flujos de trabajo y mejorar la eficiencia en desarrollo y gestión de proyectos.',
    spriteClass: styles.yoRobot,
    quote: '"beep boop beep"',
  },
]

export default function About() {
  return (
    <section id="about" className={styles.section} aria-label="Sobre mí">
      <div className="container">
        <header className={styles.header}>
          <h2 className="title-neon">[ SOBRE MÍ ]</h2>
        </header>

        {ABOUT_ITEMS.map((item) => (
          <article
            key={item.id}
            className={`${styles.aboutCard} ${item.reverse ? styles.reverse : ''}`}
          >
            <div className={styles.visualCol}>
              <div 
                className={`${styles.sprite} ${item.spriteClass}`} 
                aria-hidden="true" 
              />
              <p className={styles.quote}>
                {item.quote}
                {item.author && <span className={styles.author}>{item.author}</span>}
              </p>
            </div>

            <div className={styles.textCol}>
              <h3 className={styles.blockTitle}>{item.title}</h3>
              <span className={styles.roleLabel}>{item.role}</span>
              <p className={styles.description}>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
