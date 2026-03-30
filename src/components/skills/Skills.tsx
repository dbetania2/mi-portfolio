import { supabase } from '@/lib/supabase'
import styles from './Skills.module.css'
import Image from 'next/image'
import { techIcons, techCategories } from '@/lib/techIcons'

const categoryOrder = ['Frontend', 'Backend', 'Tools'] as const

export default async function Skills() {
  const { data: projects } = await supabase
    .from('projects')
    .select('tech_stack')

  const counts: Record<string, number> = {}
  projects?.forEach((p) => {
    p.tech_stack?.forEach((t: string) => {
      counts[t] = (counts[t] || 0) + 1
    })
  })

  const skills = Object.entries(counts).sort((a, b) => b[1] - a[1])

  const grouped = categoryOrder.reduce((acc, cat) => {
    acc[cat] = skills.filter(([name]) => techCategories[name] === cat)
    return acc
  }, {} as Record<string, [string, number][]>)

  return (
    <section id="skills" className={styles.section}>
      <div className="container">
        <h2>[ Skills ]</h2>
        <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
          Puntuación basada en proyectos realizados.
        </p>
        <div className={styles.grid}>
          {categoryOrder.map((cat) => (
            grouped[cat].length > 0 && (
              <div key={cat} className={`pixel-border ${styles.card}`}>
                <h3 className={styles.cardTitle}>{cat}</h3>
                {grouped[cat].map(([name, count]) => (
                  <div key={name} className={styles.row}>
                    <div className={styles.iconWrapper}>
                      {techIcons[name] ? (
                        <Image
                          src={techIcons[name]}
                          alt={name}
                          width={23}
                          height={18}
                          className={styles.icon}
                        />
                      ) : (
                        <span className="pixel-badge">{name}</span>
                      )}
                      <span className={styles.tooltip}>{name}</span>
                    </div>
                    <span className={styles.name}>{name}</span>
                    <span className={styles.dots} />
                    <span className={styles.count}>x{count}</span>
                  </div>
                ))}
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  )
}