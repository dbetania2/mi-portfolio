'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import styles from './Maintenance.module.css'

interface TerminalHistoryItem {
  id: string
  command: string
  output: string
}

export default function Maintenance() {
  const [inputCmd, setInputCmd] = useState('')
  const [history, setHistory] = useState<TerminalHistoryItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleRunCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    let output = ''

    if (trimmed === 'clear') {
      setHistory([])
      setInputCmd('')
      return
    }

    if (trimmed === 'help' || trimmed === 'ls') {
      output = `Comandos disponibles:
  - ./linkedin.sh : Abrir perfil de LinkedIn
  - ./github.sh   : Abrir repositorio de GitHub
  - ./email.sh    : Enviar email directo
  - whoami        : Información de Daiana
  - clear         : Limpiar consola`
    } else if (trimmed === 'whoami') {
      output = `Daiana Del Grecco | Full Stack Developer & Automatización`
    } else if (trimmed.includes('github') || trimmed === './github.sh') {
      output = `Abriendo GitHub en una nueva pestaña...`
      window.open('https://github.com/dbetania2', '_blank')
    } else if (trimmed.includes('linkedin') || trimmed === './linkedin.sh') {
      output = `Abriendo LinkedIn en una nueva pestaña...`
      window.open('https://linkedin.com/in/daianadelgrecco/', '_blank')
    } else if (trimmed.includes('mail') || trimmed.includes('email') || trimmed === './email.sh') {
      output = `Abriendo cliente de correo hacia daiana076@gmail.com...`
      window.location.href = 'mailto:daiana076@gmail.com?subject=Contacto%20Portfolio'
    } else {
      output = `orden no encontrada: ${trimmed}. Escribí "help" para ver los enlaces.`
    }

    const newItem: TerminalHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      command: cmd,
      output,
    }

    setHistory((prev) => [...prev, newItem])
    setInputCmd('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleRunCommand(inputCmd)
  }

  return (
    <main 
      className={styles.screen} 
      role="main" 
      aria-label="Terminal de mantenimiento DAI_OS"
      onClick={() => inputRef.current?.focus()}
    >
      <div className={styles.terminalWindow}>

        {/* ── BARRA SUPERIOR (WINDOW CHROME) ── */}
        <header className={styles.windowBar}>
          <div className={styles.windowTitle}>
            <Image src="/DG.svg" alt="DG Logo" width={20} height={20} priority />
            <span>daiana@dai-os: ~/portfolio</span>
          </div>
          <div className={styles.windowControls}>
            <span className={styles.ttyBadge}>TTY1 // 503 MAINTENANCE</span>
            <div className={styles.controlButtons} aria-hidden="true">
              <span>[ _ ]</span>
              <span>[ □ ]</span>
              <span>[ X ]</span>
            </div>
          </div>
        </header>

        {/* ── CUERPO DE LA CONSOLA ── */}
        <div className={styles.terminalBody}>

          {/* 1. NEOFETCH SECTION (SOLO EL ROBOT) */}
          <section className={styles.neofetchContainer} aria-label="Información del sistema">
            <div className={styles.avatarColumn}>
              <div className={styles.robotSprite} aria-hidden="true" />
            </div>

            <div className={styles.specsColumn}>
              <p className={styles.specsHeader}>daiana@dai-os</p>
              <p className={styles.specsDivider}>---------------------------------</p>
              
              <div className={styles.specRow}>
                <span className={styles.specKey}>Host:</span>
                <span className={styles.specVal}>daianadg-portfolio.vercel.app</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specKey}>Status:</span>
                <span className={styles.statusUnavailable}>503 Maintenance (Deploying v2.0)</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specKey}>Notice:</span>
                <span className={styles.specVal}>Actualizando proyectos y componentes visuales.</span>
              </div>

              {/* Bloques de colores de terminal */}
              <div className={styles.colorBlocks} aria-hidden="true">
                <span className={styles.colorBlock} style={{ background: '#ff1e8a' }} />
                <span className={styles.colorBlock} style={{ background: '#00f0ff' }} />
                <span className={styles.colorBlock} style={{ background: '#39ff14' }} />
                <span className={styles.colorBlock} style={{ background: '#ffea00' }} />
                <span className={styles.colorBlock} style={{ background: '#a020f0' }} />
                <span className={styles.colorBlock} style={{ background: '#ffffff' }} />
              </div>
            </div>
          </section>

          {/* 2. SYSTEMD / DEPLOY LOGS */}
          <section className={styles.logsSection} aria-label="Logs de despliegue">
            <div className={styles.logLine}>
              <span className={styles.logOk}>[  OK  ]</span>
              <span>Stopped nginx.service - Web Server.</span>
            </div>
            <div className={styles.logLine}>
              <span className={styles.logOk}>[  OK  ]</span>
              <span>Optimized PostgreSQL & Supabase database storage.</span>
            </div>
            <div className={styles.logLine}>
              <span className={styles.logInfo}>[ INFO ]</span>
              <span>Turbopack: Building UI & pixel shaders...</span>
            </div>
            <div className={styles.logLine}>
              <span className={styles.logProgress}>[  ..  ]</span>
              <span>Deploying portfolio v2.0 (75%)</span>
              <span className={styles.progressBar}>[██████████░░░░]</span>
            </div>
          </section>

          {/* 3. PROMPT Y ACCIONES DIRECTAS */}
          <section className={styles.cliSection} aria-label="Consola de comandos">
            {history.length > 0 && (
              <div className={styles.historyLogs}>
                {history.map((h) => (
                  <div key={h.id}>
                    <p className={styles.historyCommand}>
                      daiana@dai-os:~$ {h.command}
                    </p>
                    <pre className={styles.historyOutput}>{h.output}</pre>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.promptForm}>
              <label htmlFor="cli-input" className={styles.promptPrefix}>
                daiana@dai-os:~$
              </label>
              <input
                id="cli-input"
                ref={inputRef}
                type="text"
                value={inputCmd}
                onChange={(e) => setInputCmd(e.target.value)}
                placeholder="Escribí un comando o hacé clic abajo..."
                className={styles.promptInput}
                autoComplete="off"
                spellCheck={false}
              />
            </form>

            <div className={styles.quickActions}>
              <span className={styles.quickActionLabel}>Contacto:</span>
              <button
                type="button"
                className={`${styles.cmdBtn} ${styles.cmdBtnPrimary}`}
                onClick={() => handleRunCommand('./linkedin.sh')}
              >
                ./linkedin.sh
              </button>
              <button
                type="button"
                className={`${styles.cmdBtn} ${styles.cmdBtnPrimary}`}
                onClick={() => handleRunCommand('./github.sh')}
              >
                ./github.sh
              </button>
              <button
                type="button"
                className={styles.cmdBtn}
                onClick={() => handleRunCommand('./email.sh')}
              >
                ./email.sh
              </button>
            </div>
          </section>

        </div>

      </div>
    </main>
  )
}
