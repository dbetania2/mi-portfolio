import Image from 'next/image'
import Link from 'next/link'
import styles from './ProjectCard.module.css'
import TechIcon from '@/components/TechIcon/TechIcon'
import type { Project } from '@/app/projects/page'

type Props = {
  project: Project
  isFeatured?: boolean
}

export default function ProjectCard({ project: p, isFeatured }: Props) {
  return (
    <div className={styles.card}>
      {isFeatured && (
        <div className={styles.featuredLabel}>
          [ {p.category?.toUpperCase() || 'PROYECTO'} ]
        </div>
      )}

      {p.image_url && (
        <Link href={`/projects/${p.slug}`}>
          <div className={styles.imgWrapper}>
            <Image
              src={p.image_url}
              alt={p.title}
              fill
              sizes="(max-width: 1024px) 100vw, 350px"
              className={styles.imgPixelated}
            />
            {/* Efecto de scanlines directamente sobre la imagen */}
            <div className={styles.scanlinesOverlay} />
          </div>
        </Link>
      )}

      <h3 className={styles.title}>{p.title}</h3>

      {/* Si no es destacado, mostramos la descripción (en la página de proyectos) */}
      {!isFeatured && (
        <p className={styles.description}>{p.short_description}</p>
      )}

      <div className={styles.badges}>
        {p.tech_stack?.slice(0, 8).map((t) => (
          <div key={t} className={styles.techIconWrapper}>
            <TechIcon name={t} size="small" />
          </div>
        ))}
      </div>

      <div className={styles.buttons}>
        {p.github_url && (
          <a href={p.github_url} target="_blank" rel="noopener noreferrer" className={styles.cardBtn}>
            GITHUB
          </a>
        )}
        <Link href={`/projects/${p.slug}`} className={styles.cardBtn}>
          VER DETALLE
        </Link>
      </div>
    </div>
  )
}
