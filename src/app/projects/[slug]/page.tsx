import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import ProjectGallery from '@/components/ProjectGallery/ProjectGallery'
import TechIcon from '@/components/TechIcon/TechIcon'
import styles from './ProjectDetail.module.css'

async function getProject(slug: string) {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) notFound()

  // Si el proyecto es un borrador (no publicado), solo permitir visualizar si es admin
  if (project.is_published === false) {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated'
    if (!isAdmin) notFound()
  }

  const paragraphs = (project.description?.split(/\r?\n/) || [])
    .map((p: string) => p.trim())
    .filter(Boolean)

  const galleryImages: string[] = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : Array.isArray(project.gallery) && project.gallery.length > 0
    ? project.gallery
    : project.image_url
    ? [project.image_url]
    : []

  const hasBothActions = Boolean(project.live_url && project.github_url)

  return (
    <main className={styles.main}>
      <div className="container">
        <Link href="/projects" className={styles.back}>
          &lt; Volver a proyectos
        </Link>

        {/* ── ENCABEZADO MÓVIL: Título y categoría al inicio en pantallas chicas ── */}
        <div className={styles.mobileHeaderBlock}>
          <h1 className={styles.title}>{project.title}</h1>
          <span className={styles.categoryBadge}>
            [ {project.category?.toUpperCase() || 'PROYECTO'} ]
          </span>
        </div>

        {/* ── ESTRUCTURA DEL LAYOUT (2 COLUMNAS EN DESKTOP: 7 + 5) ── */}
        <div className={styles.gridContainer}>

          {/* ── 1. COLUMNA IZQUIERDA (GALERÍA VISUAL) ── */}
          <div className={styles.leftColumn}>
            <ProjectGallery images={galleryImages} title={project.title} />
          </div>

          {/* ── 2. COLUMNA DERECHA (INFORMACIÓN DEL PROYECTO) ── */}
          <div className={styles.rightColumn}>

            {/* ENCABEZADO DESKTOP: Visible únicamente en pantallas grandes ── */}
            <div className={styles.desktopHeaderBlock}>
              <h1 className={styles.title}>{project.title}</h1>
              <span className={styles.categoryBadge}>
                [ {project.category?.toUpperCase() || 'PROYECTO'} ]
              </span>
            </div>

            {/* BLOQUE 2 — DESCRIPCIÓN */}
            <article className={styles.descriptionBox}>
              <h2 className={styles.sectionHeading}>&gt; Descripción</h2>
              {paragraphs.map((paragraph: string, index: number) => (
                <p 
                  key={`${slug}-p-${index}-${paragraph.slice(0, 15)}`} 
                  className={styles.paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </article>

            {/* BLOQUE 3 — TECNOLOGÍAS Y ACCIONES */}
            <section className={styles.techAndActionsBox}>
              <h3 className={styles.sectionHeading}>&gt; Tecnologías</h3>
              <div className={styles.techGrid}>
                {project.tech_stack?.map((t: string) => (
                  <TechIcon key={t} name={t} size="medium" />
                ))}
              </div>

              {(project.live_url || project.github_url) && (
                <div className={`${styles.actionsRow} ${!hasBothActions ? styles.singleAction : ''}`}>
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnPrimary}
                    >
                      VISITAR SITIO
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnSecondary}
                    >
                      GITHUB
                    </a>
                  )}
                </div>
              )}
            </section>

          </div>

        </div>
      </div>
    </main>
  )
}
