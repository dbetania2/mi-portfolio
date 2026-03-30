'use client'

import { useState } from 'react'
import styles from './Contact.module.css'
import Image from 'next/image'

export default function Contact() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Enviando...')
    setTimeout(() => setStatus('✓ Mensaje enviado!'), 1000)
  }

  return (
    <section id="contacto" className={styles.section}>
      <div className="container">
        <h2>[ Contacto ]</h2>

        <div className={styles.layout}>

          {/* Panel izquierdo */}
          <div className={styles.social}>

            <div className={styles.introBlock}>
              <p className={styles.intro}>
                Contactame para hablar de un proyecto,<br />
                una colaboración, o simplemente para decir hola.
              </p>
            </div>

            <div className={styles.socialBlock}>
              <h3 className={styles.socialTitle}>Encontrame en</h3>

              <a href="https://www.linkedin.com/in/daianadelgrecco/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <Image src="/icons/linkedin.png" alt="LinkedIn" width={23} height={18} className={styles.socialIcon} />
                LinkedIn
              </a>

              <a href="https://github.com/dbetania2" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <Image src="/icons/github.png" alt="GitHub" width={23} height={18} className={styles.socialIcon} />
                GitHub
              </a>

              <a href="https://instagram.com/daianabetania" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <Image src="/icons/instagram.png" alt="Instagram" width={23} height={18} className={styles.socialIcon} />
                Instagram
              </a>

            </div>

            <div className={styles.availableBlock}>
              <span className={styles.availableDot} aria-hidden="true" />
              <span className={styles.availableText}>Disponible para proyectos.</span>
            </div>

          </div>

          {/* Formulario */}
          <div className={`pixel-border ${styles.formWrapper}`}>
            <form onSubmit={handleSubmit} className={styles.form}>

              <div className={styles.field}>
                <label className={styles.label}>&gt; nombre:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>&gt; email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>&gt; mensaje:</label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  required
                  rows={4}
                  className={styles.textarea}
                />
              </div>

              <button type="submit" className="pixel-btn" style={{ alignSelf: 'flex-start' }}>
                Enviar mensaje
              </button>

              {status && <p className={styles.status}>{status}</p>}

            </form>
          </div>

        </div>
      </div>
    </section>
  )
}