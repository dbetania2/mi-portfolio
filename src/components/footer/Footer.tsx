import styles from './Footer.module.css'
import Image from 'next/image'
import Link from 'next/link'
import VisitorCounter from '../VisitorCounter/VisitorCounter'
import ScrambleText from '../ScrambleText/ScrambleText'
import { NAV_LINKS, SOCIAL_LINKS } from '@/config/navigation'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>

        <div className={styles.top}>

          {/* BRAND */}
          <div className={styles.brand}>
            <Image
              src="/DG.svg"
              alt="DG Logo"
              width={42}
              height={42}
              className={styles.logo}
            />

            <p className={styles.tagline}>
              Desarrollo web, automatización de procesos y diseño de interfaces.
            </p>
          </div>

          {/* NAV */}
          <nav className={styles.nav} aria-label="Navegación del pie de página">
            <p className={styles.navTitle}>Navegación</p>
            {NAV_LINKS.map((link) => {
              const targetHref = link.href.startsWith('#') ? `/${link.href}` : link.href
              return (
                <Link key={link.href} href={targetHref} className={styles.navLink}>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* SOCIALS */}
          <div className={styles.socials}>
            <p className={styles.socialsTitle}>Redes</p>
            {SOCIAL_LINKS.map((s) => (
              <a 
                key={s.name} 
                href={s.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialLink}
                aria-label={`Visitar perfil en ${s.name}`}
              >
                <Image src={s.icon} alt="" width={23} height={18} className={styles.socialIcon} aria-hidden="true" />
                {s.name}
              </a>
            ))}
          </div>

        </div>

        {/* CONTADOR */}
        <VisitorCounter />

        {/* BOTTOM */}
        <div className={styles.bottom}>
          <span>© {year} <ScrambleText text="Daiana Del Grecco" className={styles.scrambleName} />. Todos los derechos reservados.</span>
          <span>Hecho con mucho amor.</span>
        </div>

      </div>
    </footer>
  )
}
