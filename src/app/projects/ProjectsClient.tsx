'use client'

import { useState } from 'react'
import styles from './ProjectsClient.module.css'
import ProjectCard from '@/components/ProjectCard/ProjectCard'
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
          <ProjectCard key={p.id} project={p} isFeatured={false} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className={styles.empty}>No hay proyectos en esta categoría todavía.</p>
      )}
    </>
  )
}