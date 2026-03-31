import { supabase } from '@/lib/supabase'
import styles from '../footer/Footer.module.css'

export default async function VisitorCounter() {
  //  Llamamos a la función RPC que creamos en el SQL Editor para sumar +1
  // Esto se ejecuta en el servidor cada vez que alguien carga el Footer
  try {
    await supabase.rpc('increment_views', { row_label: 'total_views' })
  } catch (error) {
    console.error('Error incrementing views:', error)
  }

  // Traemos el dato actualizado de la tabla site_stats
  const { data } = await supabase
    .from('site_stats')
    .select('count')
    .eq('label', 'total_views')
    .single()

  const views = data?.count ?? 0
  
  // Formateamos el número a 6 dígitos (ej: 000042) para el estilo retro
  const formattedViews = String(views).padStart(6, '0')

  return (
    <div className={styles.counterWrapper}>
      <span className={styles.counterText}>
        [ VISITAS: {formattedViews} ]
      </span>
    </div>
  )
}