import { supabase } from '@/lib/supabase'
import styles from './Projects.module.css'
import Link from 'next/link'
import ProjectsCarousel from '../ProjectsCarousel/ProjectsCarousel'

async function getFeaturedProjects() {
  const { data } = await supabase
    .from('projects')
    .select('id, title, short_description, tech_stack, github_url, live_url, image_url, category, slug')
    .eq('featured', true)
    .order('order_index', { ascending: true })

  return data ?? []
}

export default async function Projects() {
  const projects = await getFeaturedProjects()

  return (
    <section id="proyectos" className={styles.section}>
      <div className="container">
        <h2 className="title-neon">[ PROYECTOS DESTACADOS ]</h2>

        <ProjectsCarousel projects={projects} />

        <div className={styles.verMasGroup} style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/projects" className="pixel-btn">
            VER TODOS LOS PROYECTOS
          </Link>
        </div>
      </div>
    </section>
  )
}