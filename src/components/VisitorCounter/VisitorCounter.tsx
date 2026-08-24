'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './VisitorCounter.module.css'

export default function VisitorCounter() {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    async function handleViews() {
      try {
        const isLocal = process.env.NEXT_PUBLIC_IS_LOCAL === 'true'

        // 1. Incrementamos el contador en la base de datos SOLO si no es local
        if (!isLocal) {
          await supabase.rpc('increment_views', { row_label: 'total_views' })
        }

        // 2. Traemos el valor actualizado
        const { data } = await supabase
          .from('site_stats')
          .select('count')
          .eq('label', 'total_views')
          .maybeSingle()

        if (data) {
          setViews(data.count)
        }
      } catch (error) {
        console.error('Error en el contador de visitas:', error)
      }
    }

    handleViews()
  }, [])

  // Formateamos a 6 dígitos (ej: 000042). Si está cargando mostramos guiones.
  const formattedViews = views !== null 
    ? String(views).padStart(6, '0') 
    : '------'

  return (
    <div className={styles.counterWrapper}>
      <span className={styles.counterText}>
        [ VISITAS: {formattedViews} ]
      </span>
    </div>
  )
}