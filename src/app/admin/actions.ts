'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export type ProjectStatus = 'en_desarrollo' | 'finalizado' | 'archivado'

export interface EditableProject {
  id?: number
  title: string
  slug: string
  category: string
  role?: string
  completed_at?: string | null
  short_description: string
  description: string
  tech_stack: string[]
  image_url: string
  images: string[]
  github_url: string
  live_url: string
  status: ProjectStatus
  is_published: boolean
  featured: boolean
  order_index: number
  created_at?: string
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

// ── OBTENER TODOS LOS PROYECTOS (ADMIN) ──
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
    category: p.category || 'Desarrollo de software',
    role: p.role || '',
    completed_at: p.completed_at ? String(p.completed_at).slice(0, 10) : null,
    short_description: p.short_description || '',
    description: p.description || '',
    tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
    image_url: p.image_url || '',
    images: Array.isArray(p.images) ? p.images : [],
    github_url: p.github_url || '',
    live_url: p.live_url || '',
    status: (p.status as ProjectStatus) || 'finalizado',
    is_published: p.is_published ?? true,
    featured: Boolean(p.featured),
    order_index: Number(p.order_index) || 0,
    created_at: p.created_at || '',
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
    role: project.role?.trim() || null,
    completed_at: project.completed_at || null,
    short_description: project.short_description.trim(),
    description: project.description.trim(),
    tech_stack: project.tech_stack,
    image_url: project.image_url.trim() || null,
    images: project.images || [],
    github_url: project.github_url.trim() || null,
    live_url: project.live_url.trim() || null,
    status: project.status || 'finalizado',
    is_published: Boolean(project.is_published),
    featured: Boolean(project.featured),
    order_index: Number(project.order_index) || 0,
  }

  try {
    if (project.id) {
      // Actualizar proyecto existente
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
      // Insertar nuevo proyecto
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

// ── ELIMINAR PROYECTO ──
export async function deleteProject(id: number): Promise<{ success: boolean; error?: string }> {
  const isAuth = await checkAdminAuth()
  if (!isAuth) {
    return { success: false, error: 'No autorizado.' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/projects')

    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al eliminar'
    return { success: false, error: msg }
  }
}

// ── DUPLICAR PROYECTO (CREA BORRADOR) ──
export async function duplicateProject(
  id: number
): Promise<{ success: boolean; project?: EditableProject; error?: string }> {
  const isAuth = await checkAdminAuth()
  if (!isAuth) {
    return { success: false, error: 'No autorizado.' }
  }

  try {
    const { data: original, error: fetchErr } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchErr || !original) {
      throw new Error('No se encontró el proyecto a duplicar.')
    }

    const newSlug = `${original.slug}-copia-${Math.floor(Math.random() * 1000)}`
    const newTitle = `${original.title} (Copia)`

    const payload = {
      title: newTitle,
      slug: newSlug,
      category: original.category,
      role: original.role,
      completed_at: original.completed_at,
      short_description: original.short_description,
      description: original.description,
      tech_stack: original.tech_stack,
      image_url: original.image_url,
      images: original.images || [],
      github_url: original.github_url,
      live_url: original.live_url,
      status: original.status || 'finalizado',
      is_published: false, // Las copias nacen como borrador
      featured: false,
      order_index: (original.order_index || 0) + 1,
    }

    const { data: created, error: insertErr } = await supabaseAdmin
      .from('projects')
      .insert([payload])
      .select()
      .single()

    if (insertErr) throw insertErr

    revalidatePath('/')
    revalidatePath('/projects')

    return { success: true, project: created }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al duplicar proyecto'
    return { success: false, error: msg }
  }
}

// ── TOGGLE PUBLICACIÓN RÁPIDO (1 CLIC) ──
export async function togglePublishProject(
  id: number,
  is_published: boolean
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await checkAdminAuth()
  if (!isAuth) {
    return { success: false, error: 'No autorizado.' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ is_published })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/projects')

    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al cambiar publicación'
    return { success: false, error: msg }
  }
}

// ── SUBIDA DE IMAGEN A SUPABASE STORAGE (BUCKET 'projects') ──
export async function uploadProjectImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const isAuth = await checkAdminAuth()
  if (!isAuth) {
    return { success: false, error: 'No autorizado.' }
  }

  try {
    const file = formData.get('file') as File | null
    if (!file) {
      return { success: false, error: 'No se envió ningún archivo.' }
    }

    // Validar tamaño máximo (5 MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return { success: false, error: 'El archivo excede el tamaño máximo permitido de 5 MB.' }
    }

    // Validar tipo MIME
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Formato no soportado. Usá JPG, PNG, WEBP, GIF o SVG.' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${Date.now()}-${sanitizedName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('projects')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabaseAdmin.storage
      .from('projects')
      .getPublicUrl(fileName)

    return { success: true, url: urlData.publicUrl }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al subir la imagen'
    return { success: false, error: msg }
  }
}
