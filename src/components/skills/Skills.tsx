const skills = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'CSS'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'Supabase'] },
  { category: 'Tools', items: ['Git', 'GitHub', 'Vercel', 'VS Code'] },
]

export default function Skills() {
  return (
    <section id="skills">
      <h2>[ Skills ]</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
        gap: '1.5rem',
      }}>
        {skills.map((group) => (
          <div key={group.category} className="pixel-border" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--border)' }}>
              {group.category}
            </h3>
            <ul style={{ listStyle: 'none' }}>
              {group.items.map((skill) => (
                <li key={skill} style={{
                  padding: '0.4rem 0',
                  borderBottom: '2px solid var(--primary)',
                  color: 'var(--accent)',
                }}>
                  ▸ {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}