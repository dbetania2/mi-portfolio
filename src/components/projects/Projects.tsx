import { supabase } from '@/lib/supabase'
import styles from './Projects.module.css'
import Image from 'next/image'
import { techIcons } from '@/lib/techIcons'

type Project = {
  id: number
  title: string
  short_description: string
  tech_stack: string[]
  github_url: string | null
  live_url: string | null
  image_url: string | null
}

export default async function Projects() {
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, short_description, tech_stack, github_url, live_url, image_url')
    .order('created_at', { ascending: false })

  return (
    <section id="proyectos" className={styles.section}>
      <div className="container">
        <h2>[ Proyectos Destacados ]</h2>
        <div className={styles.grid}>
          {projects?.map((p: Project) => (
            <div key={p.id} className={`pixel-border ${styles.card}`}>

              {p.image_url && (
                <div className={styles.imgWrapper}>
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    sizes="200px"
                    className={styles.imgPixelated}
                  />
                </div>
              )}

              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.description}>{p.short_description}</p>

              <div className={styles.badges}>
                {p.tech_stack?.map((t) => (
                  <div key={t} className={styles.techIcon}>
                    {techIcons[t] ? (
                      <Image src={techIcons[t]} alt={t} width={23} height={18} className={styles.icon} />
                    ) : (
                      <span className="pixel-badge">{t}</span>
                    )}
                    <span className={styles.tooltip}>{t}</span>
                  </div>
                ))}
              </div>

              <div className={styles.buttons}>
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="pixel-btn">
                    GitHub
                  </a>
                )}
                {p.live_url && (
                  <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="pixel-btn">
                    Live
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}