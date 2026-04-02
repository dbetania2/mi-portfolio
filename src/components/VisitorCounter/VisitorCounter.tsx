import { supabase } from '@/lib/supabase'
import styles from './VisitorCounter.module.css'

export default async function VisitorCounter() {
  let views = 0;

  try {
    // 1. Incrementamos el contador en la base de datos
    // Solo lo hacemos si estamos en producción para no sumar tus propias visitas locales
    if (process.env.NODE_ENV === 'production') {
      await supabase.rpc('increment_views', { row_label: 'total_views' });
    }

    // 2. Traemos el valor actualizado
    const { data } = await supabase
      .from('site_stats')
      .select('count')
      .eq('label', 'total_views')
      .maybeSingle();

    if (data) {
      views = data.count;
    }
  } catch (error) {
    console.error('Error en el contador de visitas:', error);
  }

  // 3. Formateamos a 6 dígitos (ej: 000042)
  const formattedViews = String(views).padStart(6, '0');

  return (
    <div className={styles.counterWrapper}>
      <span className={styles.counterText}>
        [ VISITAS: {formattedViews} ]
      </span>
    </div>
  )
}