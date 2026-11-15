'use client'
import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'
import { NAV_LINKS, NavLink } from '@/config/navigation'

function subscribeTheme(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener('themechange', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('themechange', callback)
  }
}

function getThemeSnapshot(): 'dark' | 'light' {
  if (typeof document === 'undefined') return 'dark'
  const currentTheme = document.documentElement.getAttribute('data-theme')
  return currentTheme === 'light' ? 'light' : 'dark'
}

function getServerThemeSnapshot(): 'dark' | 'light' {
  return 'dark'
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const isHome = pathname === '/'

  const getHref = (link: NavLink): string => {
    if (link.isRoute) return link.href
    return isHome ? link.href : `/${link.href}`
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('theme', nextTheme)
    window.dispatchEvent(new Event('themechange'))
  }

  // Cierre de menú responsive al cambiar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Cierre al hacer click fuera del menú abierto
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <nav className={styles.nav} ref={navRef} aria-label="Navegación principal">
      <Link href="/#hero" className={styles.logo} onClick={() => setOpen(false)} aria-label="Ir al inicio">
        <Image 
          src="/DG.svg" 
          alt="Logo Daiana Del Grecco" 
          width={40} 
          height={40} 
          className={styles.logoSvg}
          priority
        />
      </Link>

      <div className={styles.rightSection}>
        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={getHref(link)}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <button 
          onClick={toggleTheme} 
          className={`${styles.themeToggle} ${theme === 'light' ? styles.themeToggleActive : ''}`} 
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          type="button"
        >
          <div className={styles.toggleThumb} />
        </button>

        <button 
          className={styles.hamburger} 
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          type="button"
        >
          {open ? '[ cerrar ]' : '[ menú ]'}
        </button>
      </div>

      {open && (
        <ul id="mobile-nav-menu" className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
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
