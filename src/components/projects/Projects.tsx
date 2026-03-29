const projects = [
  {
    title: 'Proyecto 1',
    description: 'Descripción breve del proyecto y las tecnologías usadas.',
    tech: ['Next.js', 'Supabase'],
    github: '#',
    live: '#',
  },
  {
    title: 'Proyecto 2',
    description: 'Descripción breve del proyecto y las tecnologías usadas.',
    tech: ['React', 'Node.js'],
    github: '#',
    live: '#',
  },
  {
    title: 'Proyecto 3',
    description: 'Descripción breve del proyecto y las tecnologías usadas.',
    tech: ['TypeScript', 'PostgreSQL'],
    github: '#',
    live: '#',
  },
]

export default function Projects() {
  return (
    <section id="proyectos">
      <h2>[ Proyectos ]</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
        gap: '1.5rem',
      }}>
        {projects.map((p) => (
          <div key={p.title} className="pixel-border" style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <h3 style={{ color: 'var(--accent)' }}>{p.title}</h3>
            <p style={{ lineHeight: '2' }}>{p.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {p.tech.map((t) => (
                <span key={t} className="pixel-badge">{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              <a href={p.github} className="pixel-btn">GitHub</a>
              <a href={p.live} className="pixel-btn">Live</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}