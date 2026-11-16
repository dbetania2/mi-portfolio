'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export interface EditableProject {
  id?: number
  title: string
  slug: string
  category: string
  featured: boolean
  order_index: number
  short_description: string
  description: string
  tech_stack: string[]
  image_url: string
  github_url: string
  live_url: string
}

// ── AUTENTICACIÓN ADMIN ──
export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  const configuredPass = process.env.ADMIN_PASSWORD

  if (!configuredPass) {
    return { success: false, error: 'ADMIN_PASSWORD no está configurado en las variables de entorno.' }
  }

  if (password.trim() === configuredPass.trim()) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    })
    return { success: true }
  }

  return { success: false, error: 'Contraseña incorrecta.' }
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

// ── OBTENER PROYECTOS ──
export async function getAdminProjects(): Promise<EditableProject[]> {
  const isAuth = await checkAdminAuth()
  if (!isAuth) return []

  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error al cargar proyectos admin:', error)
    return []
  }

  return (data || []).map((p) => ({
    id: p.id,
    title: p.title || '',
    slug: p.slug || '',
    category: p.category || 'desarrollo',
    featured: Boolean(p.featured),
    order_index: Number(p.order_index) || 0,
    short_description: p.short_description || '',
    description: p.description || '',
    tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
    image_url: p.image_url || '',
    github_url: p.github_url || '',
    live_url: p.live_url || '',
  }))
}

// ── GUARDAR O ACTUALIZAR PROYECTO ──
export async function saveProject(
  project: EditableProject
): Promise<{ success: boolean; project?: EditableProject; error?: string }> {
  const isAuth = await checkAdminAuth()
  if (!isAuth) {
    return { success: false, error: 'No autorizado. Por favor inicia sesión.' }
  }

  const payload = {
    title: project.title.trim(),
    slug: project.slug.trim(),
    category: project.category.trim(),
    featured: project.featured,
    order_index: project.order_index,
    short_description: project.short_description.trim(),
    description: project.description.trim(),
    tech_stack: project.tech_stack,
    image_url: project.image_url.trim() || null,
    github_url: project.github_url.trim() || null,
    live_url: project.live_url.trim() || null,
  }

  try {
    if (project.id) {
      // Actualizar existente
      const { data, error } = await supabaseAdmin
        .from('projects')
        .update(payload)
        .eq('id', project.id)
        .select()
        .single()

      if (error) throw error

      revalidatePath('/')
      revalidatePath('/projects')
      revalidatePath(`/projects/${project.slug}`)

      return { success: true, project: data }
    } else {
      // Insertar nuevo
      const { data, error } = await supabaseAdmin
        .from('projects')
        .insert([payload])
        .select()
        .single()

      if (error) throw error

      revalidatePath('/')
      revalidatePath('/projects')

      return { success: true, project: data }
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido al guardar en Supabase'
    console.error('Error al guardar proyecto:', err)
    return { success: false, error: errorMsg }
  }
}

