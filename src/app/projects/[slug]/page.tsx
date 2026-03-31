import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ImageLightbox from '@/components/ImageLightbox/ImageLightbox'
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

  return (
    <main className={styles.main}>
      <div className="container">
        <Link href="/projects" className={styles.back}>
          &lt; Volver a proyectos
        </Link>

        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.shortDescription}>{project.short_description}</p>

        {project.image_url && (
          <ImageLightbox src={project.image_url} alt={project.title} />
        )}

        <div className={styles.body}>
          <div className={styles.description}>
            <h2 className={styles.sectionTitle}>&gt; Descripción</h2>
            {project.description?.split(/\r?\n/).map((paragraph: string, index: number) => (
              paragraph.trim() !== "" && (
                <p key={index} className={styles.paragraph}>{paragraph}</p>
              )
            ))}
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sideBlock}>
              <h3 className={styles.sectionTitle}>&gt; Tecnologías</h3>
              <div className={styles.badges}>
                {project.tech_stack?.map((t: string) => (
                  <TechIcon key={t} name={t} size="medium" />
                ))}
              </div>
            </div>

            <div className={styles.sideBlock}>
              <h3 className={styles.sectionTitle}>&gt; Categoría</h3>
              <span className="pixel-badge">{project.category}</span>
            </div>

            <div className={styles.buttons}>
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="pixel-btn">
                  GitHub
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="pixel-btn">
                  Live
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}