import { supabase } from '@/lib/supabase'
import styles from './Projects.module.css'
import Image from 'next/image'
import Link from 'next/link'
import TechIcon from '@/components/TechIcon/TechIcon'

type Project = {
  id: number
  title: string
  short_description: string
  tech_stack: string[]
  github_url: string | null
  live_url: string | null
  image_url: string | null
  category: string
  slug: string
}

async function getFeaturedProjects() {
  const { data } = await supabase
    .from('projects')
    .select('id, title, short_description, tech_stack, github_url, live_url, image_url, category, slug')
    .eq('featured', true)
    .order('order_index', { ascending: true })

  return data ?? []
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <div className={`pixel-border ${styles.card}`}>

      {p.image_url && (
        <Link href={`/projects/${p.slug}`}>
          <div className={styles.imgWrapper}>
            <Image
              src={p.image_url}
              alt={p.title}
              fill
              sizes="(max-width: 1024px) 220px, 280px"
              className={styles.imgPixelated}
            />
          </div>
        </Link>
      )}

      <h3 className={styles.title}>{p.title}</h3>
      <p className={styles.description}>{p.short_description}</p>

      <div className={styles.badges}>
        {p.tech_stack?.map((t) => (
          /* Aplicamos TechIcon con tamaño medium (equivale a tu scale 1.5) */
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
  )
}

export default async function Projects() {
  const projects = await getFeaturedProjects()

  const desarrollo = projects.filter((p) => p.category === 'desarrollo')
  const automatizacion = projects.filter((p) => p.category === 'automatizacion')

  return (
    <section id="proyectos" className={styles.section}>
      <div className="container">
        <h2>[ Proyectos Destacados ]</h2>

        {desarrollo.length > 0 && (
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>&gt; Desarrollo</h3>
            <div className={styles.grid}>
              {desarrollo.map((p) => <ProjectCard key={p.id} p={p} />)}
            </div>
            <div className={styles.verMasGroup}>
              <Link href="/projects?filter=desarrollo" className={styles.cardBtn}>
                Ver más de Desarrollo
              </Link>
            </div>
          </div>
        )}

        {automatizacion.length > 0 && (
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>&gt; Automatización</h3>
            <div className={styles.grid}>
              {automatizacion.map((p) => <ProjectCard key={p.id} p={p} />)}
            </div>
            <div className={styles.verMasGroup}>
              <Link href="/projects?filter=automatizacion" className={styles.cardBtn}>
                Ver más de Automatización
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}