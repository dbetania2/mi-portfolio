"use client";
import { useState, useEffect, useRef } from 'react';
import styles from './ChatBot.module.css';
import { sendMessageToBot } from '../../services/chatService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: '¡Hola! Soy el asistente de Daiana. ¿En qué puedo ayudarte hoy?' }
  ]);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToBot(input);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Error de conexión. Intentá de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* BOTÓN DISPARADOR */}
      {!isOpen && (
        <button className={styles.launcher} onClick={() => setIsOpen(true)}>
          <img src="/images/robot-head.png" alt="Bot" className={styles.robotImage} />
        </button>
      )}

      {/* VENTANA DEL CHAT */}
      {isOpen && (
        <div className={styles.window}>
          {/* HEADER: Al tocarlo se cierra el chat */}
          <div className={styles.header} onClick={() => setIsOpen(false)} title="Cerrar chat">
            <div className={styles.headerTitle}>
              <span className={styles.blink}>●</span>
              <span className={styles.title}>DAI_OS v1.0</span>
            </div>
            <span className={styles.closeX}>[X]</span>
          </div>
          
          <div className={styles.history} ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.message} ${styles[m.role]}`}>
                <span className={styles.text}>{m.content}</span>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.bot}`}>
                <span className={styles.loading}>Procesando...</span>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribí un mensaje..."
              className={styles.input}
            />
            <button onClick={handleSend} className={styles.sendBtn}>ENVIAR</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;