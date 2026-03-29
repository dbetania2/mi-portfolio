'use client'
import { useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg)',
  border: '4px solid var(--primary)',
  color: 'var(--accent)',
  padding: '0.625rem',
  fontFamily: 'var(--font)',
  fontSize: '1.25rem',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  color: 'var(--secondary)',
}

export default function Contact() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Enviando...')
    setTimeout(() => setStatus('✓ Mensaje enviado!'), 1000)
  }

  return (
    <section id="contacto">
      <h2>[ Contacto ]</h2>
      <div className="pixel-border" style={{ padding: '2rem', maxWidth: '35rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>&gt; nombre:</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>&gt; email:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>&gt; mensaje:</label>
            <textarea
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              required
              rows={5}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>
          <button type="submit" className="pixel-btn" style={{ alignSelf: 'flex-start' }}>
            Enviar mensaje
          </button>
          {status && <p style={{ color: 'var(--secondary)' }}>{status}</p>}
        </form>
      </div>
    </section>
  )
}