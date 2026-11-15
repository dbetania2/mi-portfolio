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

    if (trimmed === 'help') {
      output = `Comandos disponibles:
  - ./linkedin.sh    : Abrir perfil de LinkedIn
  - ./github.sh      : Abrir repositorio de GitHub
  - ./instagram.sh   : Abrir cuenta de Instagram
  - mail / contact   : Enviar un email directo
  - whoami           : Información de la desarrolladora
  - status           : Estado actual del deploy
  - clear            : Limpiar historial de terminal`
    } else if (trimmed === 'ls' || trimmed === 'ls -la' || trimmed === 'ls ./links') {
      output = `-rwxr-xr-x  1 daiana staff   ./linkedin.sh
-rwxr-xr-x  1 daiana staff   ./github.sh
-rwxr-xr-x  1 daiana staff   ./instagram.sh
-rwxr-xr-x  1 daiana staff   ./email.sh
-rw-r--r--  1 daiana staff   about_me.txt`
    } else if (trimmed === 'whoami' || trimmed === 'cat about_me.txt') {
      output = `Daiana Del Grecco | Full Stack Developer & Automatización
Diseño UI/UX, desarrollo web y optimización de procesos.`
    } else if (trimmed === 'status') {
      output = `HTTP/1.1 503 Service Unavailable
State: En mantenimiento y actualización de componentes UI.
Estimación: Volvemos en breve.`
    } else if (trimmed.includes('github') || trimmed === './github.sh') {
      output = `Ejecutando ./github.sh... Abriendo GitHub en una nueva pestaña.`
      window.open('https://github.com/dbetania2', '_blank')
    } else if (trimmed.includes('linkedin') || trimmed === './linkedin.sh') {
      output = `Ejecutando ./linkedin.sh... Abriendo LinkedIn en una nueva pestaña.`
      window.open('https://linkedin.com/in/daianadelgrecco/', '_blank')
    } else if (trimmed.includes('instagram') || trimmed === './instagram.sh') {
      output = `Ejecutando ./instagram.sh... Abriendo Instagram en una nueva pestaña.`
      window.open('https://instagram.com/daianabetania', '_blank')
    } else if (trimmed.includes('mail') || trimmed.includes('email') || trimmed === './email.sh' || trimmed.includes('contact')) {
      output = `Iniciando cliente de correo hacia daiana076@gmail.com...`
      window.location.href = 'mailto:daiana076@gmail.com?subject=Contacto%20Portfolio'
    } else {
      output = `bash: ${trimmed}: orden no encontrada. Escribí "help" para ver la lista de comandos.`
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
            <Image src="/DG.svg" alt="DG" width={20} height={20} priority />
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

          {/* 1. NEOFETCH SECTION */}
          <section className={styles.neofetchContainer} aria-label="Información del sistema">
            <div className={styles.avatarColumn}>
              <div className={styles.spritesRow}>
                <div className={`chibi ${styles.chibiSprite}`} aria-hidden="true" />
                <div className={styles.robotSprite} aria-hidden="true" />
              </div>
              <span className={styles.avatarCaption}>DAI_OS v1.0 [ROBOT+DEV]</span>
            </div>

            <div className={styles.specsColumn}>
              <p className={styles.specsHeader}>daiana@dai-os</p>
              <p className={styles.specsDivider}>---------------------------------</p>
              
              <div className={styles.specRow}>
                <span className={styles.specKey}>OS:</span>
                <span className={styles.specVal}>DAI_OS v1.0 (Linux Mint / Next.js 16)</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specKey}>Host:</span>
                <span className={styles.specVal}>daianadg-portfolio.vercel.app</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specKey}>Status:</span>
                <span className={styles.statusUnavailable}>503 Service Unavailable (Deploying)</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specKey}>Uptime:</span>
                <span className={styles.specVal}>Actualizando componentes UI y proyectos...</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specKey}>Packages:</span>
                <span className={styles.specVal}>Next.js 16, React 19, Turbopack, Supabase</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specKey}>Shell:</span>
                <span className={styles.specVal}>bash 5.2.21</span>
              </div>

              {/* Terminal Color Blocks */}
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

          {/* 2. SYSTEMD / BUILD LOGS */}
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
              <span>Turbopack: Building new UI components & pixel shaders...</span>
            </div>
            <div className={styles.logLine}>
              <span className={styles.logProgress}>[  ..  ]</span>
              <span>Deploying portfolio v2.0 (75%)</span>
              <span className={styles.progressBar}>[██████████░░░░]</span>
            </div>
          </section>

          {/* 3. PROMPT INTERACTIVO Y ACCIONES RÁPIDAS */}
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
                placeholder="Escribí un comando (ej: help, ls, whoami)..."
                className={styles.promptInput}
                autoComplete="off"
                spellCheck={false}
              />
            </form>

            <div className={styles.quickActions}>
              <span className={styles.quickActionLabel}>Acciones rápidas:</span>
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
                onClick={() => handleRunCommand('./instagram.sh')}
              >
                ./instagram.sh
              </button>
              <button
                type="button"
                className={styles.cmdBtn}
                onClick={() => handleRunCommand('mail -s "Hola"')}
              >
                mail -s &quot;Hola&quot;
              </button>
              <button
                type="button"
                className={styles.cmdBtn}
                onClick={() => handleRunCommand('help')}
              >
                help
              </button>
            </div>
          </section>

        </div>

      </div>
    </main>
  )
}
