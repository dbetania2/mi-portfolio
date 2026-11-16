'use client'

import { useState, useRef, ChangeEvent } from 'react'
import Image from 'next/image'
import styles from './AdminPanel.module.css'
import { EditableProject, uploadProjectImage } from './actions'
import { techIcons } from '@/lib/techIcons'

interface ProjectFormProps {
  initialProject: EditableProject
  onCancel: () => void
  onSave: (project: EditableProject) => Promise<void>
  isSaving: boolean
  saveStatus: { type: 'success' | 'error'; text: string } | null
}

const CATALOG_TECHS = Object.keys(techIcons).sort((a, b) => a.localeCompare(b))

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProjectForm({
  initialProject,
  onCancel,
  onSave,
  isSaving,
  saveStatus,
}: ProjectFormProps) {
  const [form, setForm] = useState<EditableProject>(initialProject)
  const [newTagInput, setNewTagInput] = useState('')
  const [galleryUrlInput, setGalleryUrlInput] = useState('')
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const coverFileRef = useRef<HTMLInputElement>(null)
  const galleryFileRef = useRef<HTMLInputElement>(null)

  const isNew = !initialProject.id

  // ── MANEJO DE TÍTULO Y SLUG AUTOMÁTICO ──
  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: isNew ? slugify(val) : prev.slug,
    }))
  }

  // ── GESTIÓN DE TECNOLOGÍAS (TAGS) ──
  const handleAddTag = (techName?: string) => {
    const raw = techName !== undefined ? techName : newTagInput
    const trimmed = raw.trim()
    if (!trimmed) return
    if (form.tech_stack.includes(trimmed)) {
      if (techName === undefined) setNewTagInput('')
      return
    }
    setForm((prev) => ({
      ...prev,
      tech_stack: [...prev.tech_stack, trimmed],
    }))
    if (techName === undefined) setNewTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tagToRemove),
    }))
  }

  // ── SUBIDA DE IMAGEN DE PORTADA ──
  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingCover(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadProjectImage(formData)
    setIsUploadingCover(false)

    if (res.success && res.url) {
      setForm((prev) => ({ ...prev, image_url: res.url! }))
    } else {
      setUploadError(res.error || 'No se pudo subir la imagen de portada.')
    }
  }

  // ── SUBIDA DE IMAGEN A LA GALERÍA ──
  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingGallery(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadProjectImage(formData)
    setIsUploadingGallery(false)

    if (res.success && res.url) {
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), res.url!],
      }))
    } else {
      setUploadError(res.error || 'No se pudo subir la imagen a la galería.')
    }
  }

  const handleAddGalleryUrl = () => {
    const trimmed = galleryUrlInput.trim()
    if (!trimmed) return
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), trimmed],
    }))
    setGalleryUrlInput('')
  }

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }))
  }

  // ── SUBMIT DEL FORMULARIO ──
  const handleSubmit = async (publishStatus: boolean) => {
    const toSave: EditableProject = {
      ...form,
      is_published: publishStatus,
    }
    await onSave(toSave)
  }

  return (
    <div className={styles.editorCard}>
      {/* ── ENCABEZADO DEL FORMULARIO ── */}
      <div className={styles.editorHeader}>
        <div>
          <button type="button" onClick={onCancel} className={styles.topBtn} style={{ marginBottom: '0.5rem' }}>
            &lt; Volver al Dashboard
          </button>
          <h2 className={styles.editorTitle}>
            {isNew ? '> Crear Nuevo Proyecto' : `> Editando: ${form.title || 'Proyecto'}`}
          </h2>
        </div>

        <span
          className={`${styles.badge} ${
            form.is_published ? styles.badgePublished : styles.badgeDraft
          }`}
        >
          {form.is_published ? '● Estado actual: Publicado' : '○ Estado actual: Borrador'}
        </span>
      </div>

      {uploadError && (
        <div className={`${styles.statusMessage} ${styles.statusError}`}>
          ✗ {uploadError}
        </div>
      )}

      {saveStatus && (
        <div
          className={`${styles.statusMessage} ${
            saveStatus.type === 'success' ? styles.statusSuccess : styles.statusError
          }`}
        >
          {saveStatus.text}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(form.is_published) }}>
        {/* ── SECCIÓN 1: INFORMACIÓN GENERAL ── */}
        <fieldset className={styles.formSection}>
          <legend className={styles.sectionTitle}>1. Información General</legend>

          <div className={styles.formGrid2} style={{ marginBottom: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre del Proyecto *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="ej: Sistema de Automatización"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Slug (URL pública única) *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                required
                placeholder="ej: sistema-automatizacion"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGrid3} style={{ marginBottom: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Categoría *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={styles.select}
              >
                <option value="Desarrollo de software">Desarrollo de software</option>
                <option value="Automatización de procesos">Automatización de procesos</option>
                <option value="Datos y Análisis">Datos y Análisis</option>
                <option value="Diseño UI/UX">Diseño UI/UX</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Rol desempeñado</label>
              <input
                type="text"
                value={form.role || ''}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="ej: Full Stack Developer / UX"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Fecha de Realización</label>
              <input
                type="date"
                value={form.completed_at || ''}
                onChange={(e) => setForm({ ...form, completed_at: e.target.value || null })}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
            <label className={styles.label}>Descripción Breve (aparece en tarjetas y listados)</label>
            <textarea
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              rows={2}
              placeholder="Resumen conciso del objetivo y resultado del proyecto..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
            <label className={styles.label}>Descripción Detallada (vista completa del proyecto)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              placeholder="Explicación detallada de la arquitectura, desafíos técnicos y soluciones implementadas..."
              className={styles.textarea}
            />
          </div>

          {/* Tecnologías utilizadas */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Tecnologías utilizadas (Stack)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {form.tech_stack.length === 0 && (
                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Sin tecnologías asignadas.</span>
              )}
              {form.tech_stack.map((t) => (
                <span key={t} className={styles.badge} style={{ background: '#242432', color: '#ffea00', border: '1px solid #3a3a4c' }}>
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '4px' }}
                    title="Quitar"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '0.75rem' }}>
              <select
                value=""
                onChange={(e) => { if (e.target.value) handleAddTag(e.target.value) }}
                className={styles.select}
              >
                <option value="">+ Seleccionar del catálogo...</option>
                {CATALOG_TECHS.map((tech) => (
                  <option key={tech} value={tech} disabled={form.tech_stack.includes(tech)}>
                    {tech} {form.tech_stack.includes(tech) ? '✓' : ''}
                  </option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag() } }}
                  placeholder="O escribir nueva tech y presionar Enter..."
                  className={styles.input}
                />
                <button type="button" onClick={() => handleAddTag()} className={styles.topBtn}>
                  + Añadir
                </button>
              </div>
            </div>
          </div>
        </fieldset>

        {/* ── SECCIÓN 2: RECURSOS VISUALES Y ENLACES ── */}
        <fieldset className={styles.formSection}>
          <legend className={styles.sectionTitle}>2. Recursos Visuales y Enlaces</legend>

          {/* Imagen de Portada Principal */}
          <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
            <label className={styles.label}>Imagen de Portada Principal</label>
            <div className={styles.imageUploadBox}>
              <div className={styles.previewContainer}>
                {form.image_url ? (
                  <Image src={form.image_url} alt="Portada" width={180} height={120} className={styles.previewImg} />
                ) : (
                  <div className={styles.previewEmpty}>Sin portada asignada</div>
                )}
              </div>

              <div className={styles.uploadControls}>
                <input
                  type="file"
                  ref={coverFileRef}
                  onChange={handleCoverUpload}
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => coverFileRef.current?.click()}
                  className={styles.uploadFileBtn}
                  disabled={isUploadingCover}
                >
                  {isUploadingCover ? 'Subiendo archivo a Supabase Storage...' : '📁 Subir imagen desde tu dispositivo'}
                </button>

                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="O ingresá una URL directa (https://...)"
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Galería de Imágenes */}
          <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
            <label className={styles.label}>Galería de Capturas Adicionales ({form.images?.length || 0})</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <input
                type="file"
                ref={galleryFileRef}
                onChange={handleGalleryUpload}
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => galleryFileRef.current?.click()}
                className={styles.uploadFileBtn}
                disabled={isUploadingGallery}
              >
                {isUploadingGallery ? 'Subiendo captura...' : '📁 Subir captura a galería'}
              </button>

              <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
                <input
                  type="text"
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="O agregar URL de imagen..."
                  className={styles.input}
                />
                <button type="button" onClick={handleAddGalleryUrl} className={styles.topBtn}>
                  + Añadir URL
                </button>
              </div>
            </div>

            {form.images && form.images.length > 0 && (
              <div className={styles.galleryGrid}>
                {form.images.map((imgUrl, idx) => (
                  <div key={`${imgUrl}-${idx}`} className={styles.galleryItem}>
                    <Image src={imgUrl} alt={`Captura ${idx + 1}`} width={140} height={80} className={styles.galleryImg} />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className={styles.removeGalleryBtn}
                      title="Eliminar de galería"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enlaces: GitHub y Live */}
          <div className={styles.formGrid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>URL Repositorio GitHub</label>
              <input
                type="url"
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>URL Demostración en Vivo (Demo / Sitio)</label>
              <input
                type="url"
                value={form.live_url}
                onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                placeholder="https://misitio.com"
                className={styles.input}
              />
            </div>
          </div>
        </fieldset>

        {/* ── SECCIÓN 3: PUBLICACIÓN Y ORDEN ── */}
        <fieldset className={styles.formSection}>
          <legend className={styles.sectionTitle}>3. Publicación y Visibilidad</legend>

          <div className={styles.formGrid3}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Estado del Proyecto</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as EditableProject['status'] })}
                className={styles.select}
              >
                <option value="finalizado">Finalizado</option>
                <option value="en_desarrollo">En desarrollo</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Visibilidad Inicial</label>
              <select
                value={form.is_published ? 'published' : 'draft'}
                onChange={(e) => setForm({ ...form, is_published: e.target.value === 'published' })}
                className={styles.select}
              >
                <option value="published">● Publicado (Visible en la web)</option>
                <option value="draft">○ Borrador (Oculto al público)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Orden de aparición (Prioridad)</label>
              <input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })}
                className={styles.input}
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#ffea00' }}
              />
              <span className={styles.label} style={{ color: '#fff' }}>
                ★ Destacar en la página de inicio (Home carrusel)
              </span>
            </label>
          </div>
        </fieldset>

        {/* ── BARRA DE ACCIONES INFERIOR ── */}
        <div className={styles.formActionBar}>
          <button type="button" onClick={onCancel} className={styles.btnCancel} disabled={isSaving}>
            Cancelar
          </button>

          <div className={styles.btnGroup}>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className={styles.btnSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar como Borrador'}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className={styles.btnSavePublish}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar y Publicar ✓'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

