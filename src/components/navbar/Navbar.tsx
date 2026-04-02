'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

interface NavLink {
  label: string
  href: string
  isRoute?: boolean
}

const links: NavLink[] = [
  { label: 'Sobre mí',  href: '#about' },
  { label: 'Stack',     href: '#skills' },
  { label: 'Proyectos', href: '/projects', isRoute: true },
  { label: 'Contacto',  href: '#contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const isHome = pathname === '/'

  const getHref = (link: NavLink): string => {
    if (link.isRoute) return link.href
    return isHome ? link.href : `/${link.href}`
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    }
  }, [open])

  return (
    <nav className={styles.nav} ref={navRef}>
      <Link href="/#hero" className={styles.logo} onClick={() => setOpen(false)}>
        <Image 
          src="/DG.svg" 
          alt="Logo DG" 
          width={40} 
          height={40} 
          className={styles.logoSvg}
        />
      </Link>

      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={getHref(link)}>{link.label}</Link>
          </li>
        ))}
      </ul>

      <button 
        className={styles.hamburger} 
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? '[ cerrar ]' : '[ menú ]'}
      </button>

      {open && (
        <ul className={styles.mobileMenu}>
          {links.map((link) => (
            <li key={link.href}>
              <Link 
                href={getHref(link)} 
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}