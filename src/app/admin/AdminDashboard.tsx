'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './AdminPanel.module.css'
import { EditableProject } from './actions'

interface AdminDashboardProps {
  projects: EditableProject[]
  onCreateProject: () => void
  onEditProject: (project: EditableProject) => void
  onDuplicateProject: (id: number) => Promise<void>
  onDeleteProject: (id: number) => Promise<void>
  onTogglePublish: (id: number, currentStatus: boolean) => Promise<void>
  onLogout: () => Promise<void>
  isProcessing: boolean
}

export default function AdminDashboard({
  projects,
  onCreateProject,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
  onTogglePublish,
  onLogout,
  isProcessing,
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')

  // Modal de confirmación de eliminación
  const [deleteModalProject, setDeleteModalProject] = useState<EditableProject | null>(null)

  // ── MÉTRICAS CALCULADAS ──
  const totalCount = projects.length
  const publishedCount = projects.filter((p) => p.is_published).length
  const draftsCount = projects.filter((p) => !p.is_published).length
  const featuredCount = projects.filter((p) => p.featured).length

  // Obtener categorías únicas dinámicas
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set)
  }, [projects])

  // ── FILTRADO Y BÚSQUEDA ──
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase()

      const matchesStatus =
        statusFilter === 'all' || p.status === statusFilter

      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'published' && p.is_published) ||
        (visibilityFilter === 'draft' && !p.is_published)

      return matchesSearch && matchesCategory && matchesStatus && matchesVisibility
    })
  }, [projects, searchTerm, categoryFilter, statusFilter, visibilityFilter])

  return (
    <>
      {/* ── BARRA SUPERIOR ── */}
      <header className={styles.topBar}>
        <div className={styles.topTitleBlock}>
          <h1 className={styles.topTitle}>PORTFOLIO // PANEL DE CONTROL</h1>
          <span className={styles.topBadge}>ADMIN V2.0</span>
        </div>

        <div className={styles.topActions}>
          <button
            type="button"
            onClick={onCreateProject}
            className={`${styles.topBtn} ${styles.topBtnPrimary}`}
            disabled={isProcessing}
          >
            + Crear Proyecto
          </button>
          <Link href="/" target="_blank" className={styles.topBtn}>
            Ver Sitio ↗
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className={styles.topBtn}
            disabled={isProcessing}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* ── KPI METRICS BAR ── */}
      <section className={styles.metricsGrid} aria-label="Métricas del portfolio">
        <div className={`${styles.metricCard} ${styles.metricCardActive}`}>
          <span className={styles.metricLabel}>Total Proyectos</span>
          <span className={styles.metricValue}>{totalCount}</span>
          <span className={styles.metricSub}>Registrados en el sistema</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Publicados</span>
          <span className={styles.metricValue} style={{ color: '#10b981' }}>
            {publishedCount}
          </span>
          <span className={styles.metricSub}>Visibles en la web pública</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Borradores</span>
          <span className={styles.metricValue} style={{ color: '#9ca3af' }}>
            {draftsCount}
          </span>
          <span className={styles.metricSub}>Ocultos / En preparación</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Destacados Home</span>
          <span className={styles.metricValue} style={{ color: '#ffea00' }}>
            {featuredCount}
          </span>
          <span className={styles.metricSub}>Mostrados en carrusel</span>
        </div>
      </section>

      {/* ── BARRA DE BÚSQUEDA Y FILTROS ── */}
      <section className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o slug..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterSelects}>
          {/* Categoría */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las categorías</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos los estados</option>
            <option value="finalizado">Finalizado</option>
            <option value="en_desarrollo">En desarrollo</option>
            <option value="archivado">Archivado</option>
          </select>

          {/* Visibilidad */}
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filtrar por visibilidad"
          >
            <option value="all">Toda la visibilidad</option>
            <option value="published">Solo Publicados</option>
            <option value="draft">Solo Borradores</option>
          </select>
        </div>
      </section>

      {/* ── TABLA DE PROYECTOS ── */}
      <section className={styles.tableContainer}>
        <table className={styles.projectTable}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Miniatura</th>
              <th>Proyecto</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Visibilidad</th>
              <th>Destacado</th>
              <th style={{ textAlign: 'center' }}>Orden</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#9ca3af' }}>
                  No se encontraron proyectos con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredProjects.map((p) => (
                <tr key={p.id ?? p.slug} className={styles.tableRow}>
                  {/* Miniatura */}
                  <td>
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt=""
                        width={50}
                        height={36}
                        className={styles.thumbPreview}
                      />
                    ) : (
                      <div className={styles.thumbPlaceholder}>N/A</div>
                    )}
                  </td>

                  {/* Título y Slug */}
                  <td>
                    <div className={styles.projectTitleCell}>
                      <span className={styles.tableTitle}>{p.title}</span>
                      <span className={styles.tableSlug}>/{p.slug}</span>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td>
                    <span className={`${styles.badge} ${styles.badgeCategory}`}>
                      {p.category}
                    </span>
                  </td>

                  {/* Estado */}
                  <td>
                    <span
                      className={styles.badge}
                      style={{
                        background:
                          p.status === 'finalizado'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : p.status === 'en_desarrollo'
                            ? 'rgba(96, 165, 250, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                        color:
                          p.status === 'finalizado'
                            ? '#34d399'
                            : p.status === 'en_desarrollo'
                            ? '#60a5fa'
                            : '#f87171',
                      }}
                    >
                      {p.status === 'finalizado'
                        ? 'Finalizado'
                        : p.status === 'en_desarrollo'
                        ? 'En desarrollo'
                        : 'Archivado'}
                    </span>
                  </td>

                  {/* Visibilidad con toggle rápido */}
                  <td>
                    <button
                      type="button"
                      onClick={() => onTogglePublish(p.id!, p.is_published)}
                      disabled={isProcessing}
                      className={`${styles.badge} ${
                        p.is_published ? styles.badgePublished : styles.badgeDraft
                      }`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Clic para cambiar publicación"
                    >
                      {p.is_published ? '● Publicado' : '○ Borrador'}
                    </button>
                  </td>

                  {/* Destacado */}
                  <td style={{ textAlign: 'center' }}>
                    {p.featured ? (
                      <span className={styles.badgeFeatured} title="Destacado en Home">
                        ★ Home
                      </span>
                    ) : (
                      <span style={{ color: '#4b4b60' }}>—</span>
                    )}
                  </td>

                  {/* Orden */}
                  <td style={{ textAlign: 'center', color: '#9ca3af' }}>
                    #{p.order_index}
                  </td>

                  {/* Acciones */}
                  <td>
                    <div className={styles.tableActions} style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => onEditProject(p)}
                        className={styles.actionBtn}
                        title="Editar información"
                        disabled={isProcessing}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateProject(p.id!)}
                        className={styles.actionBtn}
                        title="Duplicar como borrador"
                        disabled={isProcessing}
                      >
                        Duplicar
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteModalProject(p)}
                        className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                        title="Eliminar proyecto"
                        disabled={isProcessing}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* ── MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ── */}
      {deleteModalProject && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>¿Eliminar este proyecto?</h3>
            <p className={styles.modalText}>
              Estás a punto de eliminar permanentemente el proyecto{' '}
              <strong>&quot;{deleteModalProject.title}&quot;</strong> (/{deleteModalProject.slug}).
              Esta acción no se puede deshacer.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setDeleteModalProject(null)}
                className={styles.btnCancel}
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = deleteModalProject.id!
                  setDeleteModalProject(null)
                  await onDeleteProject(id)
                }}
                className={styles.btnDanger}
                disabled={isProcessing}
              >
                Sí, eliminar permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

