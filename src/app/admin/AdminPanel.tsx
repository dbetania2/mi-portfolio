'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './AdminPanel.module.css'
import { techIcons } from '@/lib/techIcons'
import {
  EditableProject,
  loginAdmin,
  logoutAdmin,
  saveProject,
} from './actions'

interface AdminPanelProps {
  initialAuth: boolean
  initialProjects: EditableProject[]
}

const EMPTY_PROJECT: EditableProject = {
  title: '',
  slug: '',
  category: 'desarrollo',
  featured: false,
  order_index: 0,
  short_description: '',
  description: '',
  tech_stack: [],
  image_url: '',
  github_url: '',
  live_url: '',
}

const CATALOG_TECHS = Object.keys(techIcons).sort((a, b) =>
  a.localeCompare(b)
)

export default function AdminPanel({
  initialAuth,
  initialProjects,
}: AdminPanelProps) {
  const [isAuth, setIsAuth] = useState(initialAuth)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [projects, setProjects] = useState<EditableProject[]>(initialProjects)
  const [selectedId, setSelectedId] = useState<number | 'new'>(
    initialProjects[0]?.id ?? 'new'
  )
  const [activeForm, setActiveForm] = useState<EditableProject>(
    initialProjects[0] || EMPTY_PROJECT
  )

  const [newTagInput, setNewTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // ── MANEJO DE LOGIN ──
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
    await logoutAdmin()
    setIsAuth(false)
  }

  // ── SELECCIÓN DE PROYECTO ──
  const handleSelectProject = (p: EditableProject) => {
    setSelectedId(p.id ?? 'new')
    setActiveForm(p)
    setSaveStatus(null)
  }

  const handleNewProject = () => {
    setSelectedId('new')
    setActiveForm({
      ...EMPTY_PROJECT,
      order_index: projects.length + 1,
    })
    setSaveStatus(null)
  }

  // ── GESTIÓN DE TAGS DE TECNOLOGÍA ──
  const handleAddTag = (techName?: string) => {
    const raw = techName !== undefined ? techName : newTagInput
    const trimmed = raw.trim()
    if (!trimmed) return
    if (activeForm.tech_stack.includes(trimmed)) {
      if (techName === undefined) setNewTagInput('')
      return
    }
    setActiveForm((prev) => ({
      ...prev,
      tech_stack: [...prev.tech_stack, trimmed],
    }))
    if (techName === undefined) setNewTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setActiveForm((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tagToRemove),
    }))
  }

  // ── GUARDAR EN SUPABASE ──
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveStatus(null)

    const res = await saveProject(activeForm)
    setIsSaving(false)

    if (res.success && res.project) {
      setSaveStatus({
        type: 'success',
        text: '✓ ¡Proyecto guardado y web actualizada con éxito!',
      })

      // Actualizar lista local de proyectos
      setProjects((prev) => {
        const exists = prev.some((p) => p.id === res.project?.id)
        if (exists) {
          return prev.map((p) => (p.id === res.project?.id ? res.project! : p))
        }
        return [...prev, res.project!]
      })
      setSelectedId(res.project.id!)
      setActiveForm(res.project)
    } else {
      setSaveStatus({
        type: 'error',
        text: `✗ Error: ${res.error || 'No se pudo guardar'}`,
      })
    }
  }

  // ── SI NO ESTÁ AUTENTICADO: LOGIN SCREEN ──
  if (!isAuth) {
    return (
      <main className={styles.container}>
        <div className={styles.loginWrapper}>
          <div className={styles.loginCard}>
            <h1 className={styles.loginTitle}>[ ACCESO ADMIN ]</h1>
            <p>Ingresá tu clave o PIN maestro para gestionar tus proyectos:</p>

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
                className={styles.btnPrimary}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Verificando...' : 'INGRESAR AL PANEL'}
              </button>
            </form>

            {loginError && (
              <p className={styles.statusError}>{loginError}</p>
            )}

            <Link href="/" className={styles.backLink}>
              &lt; Volver al sitio principal
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── PANEL PRINCIPAL AUTENTICADO ──
  return (
    <main className={styles.container}>
      {/* ── BARRA SUPERIOR ── */}
      <header className={styles.topBar}>
        <h1 className={styles.topTitle}>DAI_OS // PANEL DE PROYECTOS</h1>
        <div className={styles.topActions}>
          <Link href="/" className={styles.backLink}>
            &lt; Ir a la web
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* ── CUERPO EN 2 COLUMNAS ── */}
      <div className={styles.panelLayout}>
        {/* COLUMNA IZQUIERDA: LISTADO */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Proyectos ({projects.length})</h2>
            <button
              type="button"
              onClick={handleNewProject}
              className={styles.newProjectBtn}
            >
              + Nuevo
            </button>
          </div>

          <div className={styles.projectList}>
            {projects.map((p) => {
              const isSelected = selectedId === p.id
              return (
                <button
                  key={p.id ?? p.slug}
                  type="button"
                  onClick={() => handleSelectProject(p)}
                  className={`${styles.projectItem} ${
                    isSelected ? styles.projectItemActive : ''
                  }`}
                >
                  <span className={styles.itemTitle}>{p.title || 'Sin título'}</span>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemBadge}>[{p.category}]</span>
                    {p.featured && <span className={styles.featuredStar}>★ Home</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* COLUMNA DERECHA: FORMULARIO EDITOR */}
        <section className={styles.editorForm}>
          <h2 style={{ color: 'var(--title-neon)', margin: 0 }}>
            {selectedId === 'new'
              ? '> Crear Nuevo Proyecto'
              : `> Editando: ${activeForm.title || 'Proyecto'}`}
          </h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Título & Slug */}
            <div className={styles.formGrid2}>
              <div className={styles.field}>
                <label className={styles.label}>Título del Proyecto:</label>
                <input
                  type="text"
                  value={activeForm.title}
                  onChange={(e) =>
                    setActiveForm({ ...activeForm, title: e.target.value })
                  }
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Slug (URL única):</label>
                <input
                  type="text"
                  value={activeForm.slug}
                  onChange={(e) =>
                    setActiveForm({ ...activeForm, slug: e.target.value })
                  }
                  required
                  placeholder="ej: mi-portfolio-web"
                  className={styles.input}
                />
              </div>
            </div>

            {/* Categoría, Orden & Destacado */}
            <div className={styles.formGrid3}>
              <div className={styles.field}>
                <label className={styles.label}>Categoría:</label>
                <select
                  value={activeForm.category}
                  onChange={(e) =>
                    setActiveForm({ ...activeForm, category: e.target.value })
                  }
                  className={styles.input}
                >
                  <option value="desarrollo">Desarrollo</option>
                  <option value="automatizacion">Automatización</option>
                  <option value="datos">Datos</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Orden:</label>
                <input
                  type="number"
                  value={activeForm.order_index}
                  onChange={(e) =>
                    setActiveForm({
                      ...activeForm,
                      order_index: Number(e.target.value),
                    })
                  }
                  className={styles.input}
                />
              </div>

              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={activeForm.featured}
                  onChange={(e) =>
                    setActiveForm({
                      ...activeForm,
                      featured: e.target.checked,
                    })
                  }
                  className={styles.checkbox}
                />
                <span className={styles.label}>Destacado Home</span>
              </label>
            </div>

            {/* Gestor de Tecnologías */}
            <div className={styles.techTagManager}>
              <div className={styles.techHeader}>
                <label className={styles.label}>Tecnologías (Stack):</label>
                <span className={styles.techHint}>
                  (● con ícono / ○ badge texto)
                </span>
              </div>

              {/* Tags activos */}
              <div className={styles.tagsRow}>
                {activeForm.tech_stack.length === 0 && (
                  <span className={styles.emptyTagsNotice}>
                    Sin tecnologías asignadas todavía.
                  </span>
                )}
                {activeForm.tech_stack.map((t) => {
                  const hasIcon = Boolean(techIcons[t])
                  return (
                    <span key={t} className={styles.tagPill}>
                      <span
                        className={
                          hasIcon ? styles.tagDotIcon : styles.tagDotBadge
                        }
                        title={
                          hasIcon
                            ? 'Ícono PNG registrado en el catálogo'
                            : 'Sin ícono (se mostrará como pixel-badge de texto)'
                        }
                      >
                        {hasIcon ? '●' : '○'}
                      </span>
                      <span>{t}</span>
                      {!hasIcon && (
                        <span className={styles.noIconBadge}>[sin ícono]</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className={styles.removeTagBtn}
                        aria-label={`Eliminar ${t}`}
                        title="Quitar"
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>

              {/* Controles para sumar etiquetas */}
              <div className={styles.addTagControls}>
                <select
                  aria-label="Seleccionar tecnología del catálogo"
                  className={styles.catalogSelect}
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddTag(e.target.value)
                    }
                  }}
                >
                  <option value="">+ Seleccionar del catálogo...</option>
                  {CATALOG_TECHS.map((tech) => (
                    <option
                      key={tech}
                      value={tech}
                      disabled={activeForm.tech_stack.includes(tech)}
                    >
                      {tech} {activeForm.tech_stack.includes(tech) ? '✓' : ''}
                    </option>
                  ))}
                </select>

                <div className={styles.customTagRow}>
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    placeholder="O escribir nueva tech (ej: Docker)..."
                    className={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className={styles.addTagBtn}
                  >
                    + Añadir
                  </button>
                </div>
              </div>
            </div>

            {/* URLs: Imagen, Live, GitHub */}
            <div className={styles.formGrid3} style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className={styles.field}>
                <label className={styles.label}>URL Imagen Principal:</label>
                <input
                  type="text"
                  value={activeForm.image_url}
                  onChange={(e) =>
                    setActiveForm({ ...activeForm, image_url: e.target.value })
                  }
                  placeholder="https://... o /images/..."
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>URL Live Demo:</label>
                <input
                  type="text"
                  value={activeForm.live_url}
                  onChange={(e) =>
                    setActiveForm({ ...activeForm, live_url: e.target.value })
                  }
                  placeholder="https://misitio.com"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>URL Repositorio GitHub:</label>
                <input
                  type="text"
                  value={activeForm.github_url}
                  onChange={(e) =>
                    setActiveForm({ ...activeForm, github_url: e.target.value })
                  }
                  placeholder="https://github.com/..."
                  className={styles.input}
                />
              </div>
            </div>

            {/* Descripción Corta */}
            <div className={styles.field}>
              <label className={styles.label}>
                Descripción Corta (aparece en las tarjetas):
              </label>
              <textarea
                value={activeForm.short_description}
                onChange={(e) =>
                  setActiveForm({
                    ...activeForm,
                    short_description: e.target.value,
                  })
                }
                rows={2}
                className={styles.textarea}
              />
            </div>

            {/* Descripción Completa */}
            <div className={styles.field}>
              <label className={styles.label}>
                Descripción Completa (soporta saltos de línea):
              </label>
              <textarea
                value={activeForm.description}
                onChange={(e) =>
                  setActiveForm({ ...activeForm, description: e.target.value })
                }
                rows={6}
                className={styles.textarea}
              />
            </div>

            {/* Barra de Acciones */}
            <div className={styles.actionBar}>
              <div>
                {saveStatus && (
                  <span
                    className={`${styles.statusMessage} ${
                      saveStatus.type === 'success'
                        ? styles.statusSuccess
                        : styles.statusError
                    }`}
                  >
                    {saveStatus.text}
                  </span>
                )}
              </div>

              <div className={styles.actionButtons}>
                {activeForm.slug && selectedId !== 'new' && (
                  <Link
                    href={`/projects/${activeForm.slug}`}
                    target="_blank"
                    className={styles.viewLink}
                  >
                    Ver en la web ↗
                  </Link>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className={styles.btnPrimary}
                >
                  {isSaving ? 'Guardando en Supabase...' : 'GUARDAR CAMBIOS'}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

