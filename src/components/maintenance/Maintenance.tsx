import Image from 'next/image'
import styles from './Maintenance.module.css'
import { SOCIAL_LINKS } from '@/config/navigation'

export default function Maintenance() {
  return (
    <main className={styles.screen} role="main" aria-label="Pantalla de mantenimiento">
      <div className={styles.card}>
        <Image
          src="/DG.svg"
          alt="Daiana Del Grecco"
          width={48}
          height={48}
          priority
        />

        <div className={styles.spriteWrapper} aria-hidden="true">
          <div className={styles.robotSprite} />
        </div>

        <span className={styles.systemTag}>[ DAI_OS // SISTEMA EN PAUSA ]</span>

        <h1 className={styles.title}>SITIO EN MANTENIMIENTO</h1>

        <p className={styles.message}>
          Estoy actualizando proyectos, optimizando el rendimiento y puliendo detalles en el portfolio. 
          ¡Volvemos en unos momentos!
        </p>

        <div className={styles.terminalBox} aria-label="Estado del sistema">
          <div className={styles.terminalLine}>
            <span>&gt; SERVIDOR:</span>
            <span className={styles.statusWorking}>ACTUALIZANDO PROTOCOLOS...</span>
          </div>
          <div className={styles.terminalLine}>
            <span>&gt; BASE DE DATOS:</span>
            <span className={styles.statusOk}>OPTIMIZADA [OK]</span>
          </div>
          <div className={styles.terminalLine}>
            <span>&gt; ESTADO:</span>
            <span>MODO MANTENIMIENTO <span className={styles.blink}>_</span></span>
          </div>
        </div>

        <div className={styles.linksGroup}>
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`pixel-btn ${styles.contactBtn}`}
              aria-label={`Contactar por ${s.name}`}
            >
              {s.name.toUpperCase()}
            </a>
          ))}
          <a
            href="mailto:daiana076@gmail.com"
            className={`pixel-btn ${styles.contactBtn}`}
          >
            ENVIAR EMAIL
          </a>
        </div>
      </div>
    </main>
  )
}

