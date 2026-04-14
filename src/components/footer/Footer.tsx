import styles from './Footer.module.css'
import Image from 'next/image'
import VisitorCounter from '../VisitorCounter/VisitorCounter'

const links = [
  { label: 'Sobre mí', href: '#about' },
  { label: 'Stack', href: '#skills' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Contacto', href: '#contacto' },
]

const socials = [
  { name: 'LinkedIn', icon: '/icons/linkedin.png', url: 'https://linkedin.com/in/daianadelgrecco/' },
  { name: 'GitHub', icon: '/icons/github.png', url: 'https://github.com/dbetania2' },
  { name: 'Instagram', icon: '/icons/instagram.png', url: 'https://instagram.com/daianabetania' },
]

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
          <div className={styles.nav}>
            <p className={styles.navTitle}>Navegación</p>
            {links.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </div>

          {/* SOCIALS */}
          <div className={styles.socials}>
            <p className={styles.socialsTitle}>Redes</p>
            {socials.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <Image src={s.icon} alt={s.name} width={23} height={18} className={styles.socialIcon} />
                {s.name}
              </a>
            ))}
          </div>

        </div>

        {/* CONTADOR */}
        <VisitorCounter />

        {/* BOTTOM */}
        <div className={styles.bottom}>
          <span>© {year} Daiana Del Grecco. Todos los derechos reservados.</span>
          <span>Hecho con mucho amor.</span>
        </div>

      </div>
    </footer>
  )
}