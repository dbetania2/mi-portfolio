'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './ChatBot.module.css'
import { sendMessageToBot } from '@/services/chatService'

interface Message {
  id: string
  role: 'bot' | 'user'
  content: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-welcome-message',
      role: 'bot',
      content: '¡Hola! Soy el asistente de Daiana. ¿En qué puedo ayudarte hoy?',
    },
  ])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessageContent = input.trim()
    const userMsgId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const userMsg: Message = { id: userMsgId, role: 'user', content: userMessageContent }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const response = await sendMessageToBot(userMessageContent)
      const botMsgId = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setMessages((prev) => [...prev, { id: botMsgId, role: 'bot', content: response }])
    } catch {
      const errorMsgId = `error-${Date.now()}`
      setMessages((prev) => [
        ...prev,
        { id: errorMsgId, role: 'bot', content: 'Error de conexión. Intentá de nuevo.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* BOTÓN DISPARADOR */}
      {!isOpen && (
        <button 
          className={styles.launcher} 
          onClick={() => setIsOpen(true)}
          aria-label="Abrir asistente virtual"
          type="button"
        >
          <Image 
            src="/images/robot-head.png" 
            alt="Asistente DAI_OS" 
            width={60} 
            height={60} 
            className={styles.robotImage} 
          />
        </button>
      )}

      {/* VENTANA DEL CHAT */}
      {isOpen && (
        <div 
          className={styles.window} 
          role="dialog" 
          aria-modal="true" 
          aria-label="Asistente virtual DAI_OS"
        >
          {/* HEADER ACCESIBLE */}
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <span className={styles.blink} aria-hidden="true">●</span>
              <span>DAI_OS v1.0</span>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
            >
              [X]
            </button>
          </div>

          <div className={styles.history} ref={scrollRef} tabIndex={0} aria-label="Historial de mensajes">
            {messages.map((m) => (
              <div key={m.id} className={`${styles.message} ${styles[m.role]}`}>
                <span className={styles.text}>{m.content}</span>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.bot}`}>
                <span className={styles.loading}>Procesando...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className={styles.footer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí un mensaje..."
              className={styles.input}
              aria-label="Mensaje para el asistente"
            />
            <button type="submit" className={styles.sendBtn} disabled={isLoading}>
              ENVIAR
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

