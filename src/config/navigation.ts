export interface NavLink {
  label: string
  href: string
  isRoute?: boolean
}

export interface SocialLink {
  name: string
  icon: string
  url: string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Sobre mí', href: '#about' },
  { label: 'Stack', href: '#skills' },
  { label: 'Proyectos', href: '/projects', isRoute: true },
  { label: 'Contacto', href: '#contacto' },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'LinkedIn',
    icon: '/icons/linkedin.png',
    url: 'https://linkedin.com/in/daianadelgrecco/',
  },
  {
    name: 'GitHub',
    icon: '/icons/github.png',
    url: 'https://github.com/dbetania2',
  },
  {
    name: 'Instagram',
    icon: '/icons/instagram.png',
    url: 'https://instagram.com/daianabetania',
  },
]

