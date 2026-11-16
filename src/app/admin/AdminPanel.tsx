'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './AdminPanel.module.css'
import AdminDashboard from './AdminDashboard'
import ProjectForm from './ProjectForm'
import {
  EditableProject,
  loginAdmin,
  logoutAdmin,
  saveProject,
  deleteProject,
  duplicateProject,
  togglePublishProject,
} from './actions'

interface AdminPanelProps {
  initialAuth: boolean
  initialProjects: EditableProject[]
}

const EMPTY_PROJECT: EditableProject = {
  title: '',
  slug: '',
  category: 'Desarrollo de software',
  role: '',
  completed_at: null,
  short_description: '',
  description: '',
  tech_stack: [],
  image_url: '',
  images: [],
  github_url: '',
  live_url: '',
  status: 'finalizado',
  is_published: true,
  featured: false,
  order_index: 0,
}

export default function AdminPanel({
  initialAuth,
  initialProjects,
}: AdminPanelProps) {
  const [isAuth, setIsAuth] = useState(initialAuth)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [projects, setProjects] = useState<EditableProject[]>(initialProjects)
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard')
  const [activeProject, setActiveProject] = useState<EditableProject>(EMPTY_PROJECT)

  const [isProcessing, setIsProcessing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // ── AUTENTICACIÓN ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')

    const res = await loginAdmin(password)
    setIsLoggingIn(false)

    if (res.success) {
      setIsAuth(true)
      window.location.reload()
    } else {
      setLoginError(res.error || 'Contraseña incorrecta.')
    }
  }

  const handleLogout = async () => {
    setIsProcessing(true)
    await logoutAdmin()
    setIsAuth(false)
    setIsProcessing(false)
  }

  // ── NAVEGACIÓN ENTRE DASHBOARD Y FORMULARIO ──
  const handleCreateProject = () => {
    setActiveProject({
      ...EMPTY_PROJECT,
      order_index: projects.length + 1,
    })
    setSaveStatus(null)
    setView('form')
  }

  const handleEditProject = (project: EditableProject) => {
    setActiveProject(project)
    setSaveStatus(null)
    setView('form')
  }

  const handleCancelForm = () => {
    setView('dashboard')
    setSaveStatus(null)
  }

  // ── ACCIONES CRUD ──
  const handleSave = async (toSave: EditableProject) => {
    setIsProcessing(true)
    setSaveStatus(null)

    const res = await saveProject(toSave)
    setIsProcessing(false)

    if (res.success && res.project) {
      setSaveStatus({
        type: 'success',
        text: '✓ ¡Proyecto guardado con éxito y reflejado en el portfolio!',
      })

      setProjects((prev) => {
        const exists = prev.some((p) => p.id === res.project?.id)
        if (exists) {
          return prev.map((p) => (p.id === res.project?.id ? res.project! : p))
        }
        return [...prev, res.project!]
      })

      // Regresar al dashboard después de guardar
      setTimeout(() => {
        setView('dashboard')
        setSaveStatus(null)
      }, 900)
    } else {
      setSaveStatus({
        type: 'error',
        text: `✗ Error: ${res.error || 'No se pudo guardar'}`,
      })
    }
  }

  const handleDelete = async (id: number) => {
    setIsProcessing(true)
    const res = await deleteProject(id)
    setIsProcessing(false)

    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } else {
      alert(`Error al eliminar: ${res.error}`)
    }
  }

  const handleDuplicate = async (id: number) => {
    setIsProcessing(true)
    const res = await duplicateProject(id)
    setIsProcessing(false)

    if (res.success && res.project) {
      setProjects((prev) => [...prev, res.project!])
      // Abrir el proyecto duplicado para editarlo
      setActiveProject(res.project)
      setView('form')
    } else {
      alert(`Error al duplicar: ${res.error}`)
    }
  }

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    setIsProcessing(true)
    const res = await togglePublishProject(id, nextStatus)
    setIsProcessing(false)

    if (res.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_published: nextStatus } : p))
      )
    } else {
      alert(`Error al cambiar estado de publicación: ${res.error}`)
    }
  }

  // ── SI NO ESTÁ AUTENTICADO: LOGIN SCREEN ──
  if (!isAuth) {
    return (
      <main className={styles.container}>
        <div className={styles.loginWrapper}>
          <div className={styles.loginCard}>
            <h1 className={styles.loginTitle}>[ ACCESO ADMIN ]</h1>
            <p className={styles.loginSubtitle}>
              Ingresá tu clave maestra para administrar tus proyectos:
            </p>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá contraseña..."
                className={styles.input}
                autoFocus
                required
              />
              <button
                type="submit"
                className={styles.topBtnPrimary}
                style={{ padding: '0.8rem', fontSize: '1.1rem', cursor: 'pointer' }}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Verificando...' : 'INGRESAR AL PANEL'}
              </button>
            </form>

            {loginError && (
              <p className={`${styles.statusMessage} ${styles.statusError}`} style={{ marginTop: '1rem' }}>
                {loginError}
              </p>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link href="/" className={styles.topBtn} style={{ fontSize: '0.9rem' }}>
                &lt; Volver al sitio web principal
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ── PANEL PRINCIPAL AUTENTICADO ──
  return (
    <main className={styles.container}>
      {view === 'dashboard' ? (
        <AdminDashboard
          projects={projects}
          onCreateProject={handleCreateProject}
          onEditProject={handleEditProject}
          onDuplicateProject={handleDuplicate}
          onDeleteProject={handleDelete}
          onTogglePublish={handleTogglePublish}
          onLogout={handleLogout}
          isProcessing={isProcessing}
        />
      ) : (
        <ProjectForm
          initialProject={activeProject}
          onCancel={handleCancelForm}
          onSave={handleSave}
          isSaving={isProcessing}
          saveStatus={saveStatus}
        />
      )}
    </main>
  )
}
