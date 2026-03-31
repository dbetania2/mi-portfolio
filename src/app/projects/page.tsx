import { supabase } from '@/lib/supabase'
import ProjectsClient from './ProjectsClient'
import Link from 'next/link'
import styles from './ProjectsClient.module.css' // Importamos los estilos aquí también

export type Project = {
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

async function getAllProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('id, title, short_description, tech_stack, github_url, live_url, image_url, category, slug')
    .order('order_index', { ascending: true })

  return data ?? []
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    /* Agregamos la clase .main para que tome los paddings del CSS */
    <main className={styles.main}>
      <div className="container">
        
        {/* Agregamos el botón de volver antes del título */}
        <Link href="/" className={styles.back}>
          &lt; Volver al inicio
        </Link>

        <h2>[ Todos los Proyectos ]</h2>
        
        <ProjectsClient projects={projects} />
      </div>
    </main>
  )
}