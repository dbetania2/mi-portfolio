'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './ProjectsClient.module.css'
import TechIcon from '@/components/TechIcon/TechIcon'
import type { Project } from './page'

const FILTERS = [
  { label: 'Todos',          value: 'todos' },
  { label: 'Desarrollo',     value: 'desarrollo' },
  { label: 'Automatización', value: 'automatizacion' },
  { label: 'Datos',          value: 'datos' },
]

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState('todos')

  const filtered = active === 'todos'
    ? projects
    : projects.filter((p) => p.category === active)

  return (
    <>
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`pixel-btn ${active === f.value ? styles.filterActive : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((p) => (
          <div key={p.id} className={`pixel-border ${styles.card}`}>

            {p.image_url && (
              <Link href={`/projects/${p.slug}`}>
                <div className={styles.imgWrapper}>
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.imgPixelated}
                  />
                </div>
              </Link>
            )}

            <h3 className={styles.title}>{p.title}</h3>
            <p className={styles.description}>{p.short_description}</p>

            <div className={styles.badges}>
              {p.tech_stack?.map((t) => (
                /* Usamos el componente universal con tamaño medium */
                <TechIcon key={t} name={t} size="medium" />
              ))}
            </div>

            <div className={styles.buttons}>
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noopener noreferrer" className={styles.cardBtn}>
                  GitHub
                </a>
              )}
              {p.live_url && (
                <a href={p.live_url} target="_blank" rel="noopener noreferrer" className={styles.cardBtn}>
                  Live
                </a>
              )}
              <Link href={`/projects/${p.slug}`} className={styles.cardBtn}>
                Ver detalle
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className={styles.empty}>No hay proyectos en esta categoría todavía.</p>
      )}
    </>
  )
}