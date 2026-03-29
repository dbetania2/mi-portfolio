export default function Hero() {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', /* 🔥 FIX: Centra la sección entera horizontalmente */
      paddingTop: '5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* 🔥 FIX: Agregamos "container" para limitar el ancho máximo */}
      <div className="hero-layout container" style={{ width: '100%', gap: '2rem' }}>

        {/* Sprite primero en mobile */}
        <div className="hero-sprite-container">
          <img
            src="/sprites/fondochibi.png"
            alt=""
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 0,
              opacity: 0.5,
            }}
          />
          <div className="chibi chibi-scaled" />
        </div>

        {/* Texto */}
        <div className="hero-text">
          <p style={{ color: 'var(--border)', marginBottom: '0.75rem' }}>
            &gt; Hola, soy
          </p>
          <h1>Daiana Del Grecco</h1>
          <h2>Full Stack Developer</h2>
          <p style={{ maxWidth: '35rem', marginBottom: '2.5rem', lineHeight: '2' }}>
            Construyo productos digitales con código limpio y diseño con personalidad.
          </p>
          
          {/* 🔥 FIX: Nueva clase para manejar el responsive de los botones limpiamente */}
          <div className="hero-buttons">
            <a href="#proyectos" className="pixel-btn">Ver proyectos</a>
            <a href="#contacto" className="pixel-btn">Contacto</a>
          </div>
        </div>

      </div>
    </section>
  )
}