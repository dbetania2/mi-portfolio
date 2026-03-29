'use client'
import { useState } from 'react'

const links = [
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Skills', href: '#skills' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      background: 'var(--bg)',
      borderBottom: '4px solid var(--border)',
      zIndex: 100,
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>

      <span style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>
        DG
      </span>

      <ul className="navbar-links" style={{ gap: '2rem', listStyle: 'none' }}>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} style={{ fontSize: '1.25rem' }}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        className="navbar-hamburger"
        onClick={() => setOpen(!open)}
      >
        {open ? 'cerrar' : 'menu'}
      </button>

      {open && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          background: 'var(--bg)',
          borderBottom: '4px solid var(--border)',
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem 1.5rem',
          gap: '1rem',
        }}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}

    </nav>
  )
}