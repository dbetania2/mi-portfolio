# 👾 Daiana Del Grecco — Portfolio

Portfolio web personal con estética pixel art, construido con Next.js, TypeScript, Supabase y CSS Modules.

Siempre me gustó el pixel art y quería ver si podía llevarlo a una web real. Este proyecto fue la excusa perfecta para intentarlo, y terminó siendo mucho más que una página de presentación.

---

## Tecnologías

Next.js como framework principal, TypeScript para tipar todo el proyecto, Supabase como base de datos, CSS Modules para los estilos y la fuente VT323 para mantener la estética retro en cada texto.

---

## Funcionalidades y decisiones técnicas

**Componente de iconos reutilizable**
Todos los iconos de tecnologías del sitio pasan por un mismo componente. Así el tamaño, el tooltip y el estilo son consistentes en cualquier lugar donde aparezcan, sin repetir código.

**Lightbox de proyectos**
Los proyectos se abren en un visor tipo galería hecho desde cero, sin librerías externas. Tiene zoom, overlay, navegación con teclado y bloqueo de scroll. Quería que se sintiera como una UI de verdad, no un componente genérico.

**Animaciones con `steps()`**
Las animaciones no son suaves ni lineales. Usan `steps()` para imitar el movimiento de los sprites, que es exactamente como se mueven los personajes en los juegos de pixel art.

**Contador de visitas**
Tiene un contador persistente con Supabase, inspirado en los contadores clásicos de los sitios de los 2000. No era necesario. Pero encajaba perfecto con la estética y me pareció divertido hacerlo.

**Cursores personalizados**
Hasta los cursores son pixelados. Cada detalle cuenta.

---

## Intención

Este portfolio es mi proof of code. Una forma de mostrar cómo pienso, cómo organizo un proyecto y cómo tomo decisiones de diseño y desarrollo al mismo tiempo.

Quería demostrar que puedo crear una estética coherente de principio a fin, no solo escribir código que funcione. El pixel art fue el desafío visual, y Next.js con Supabase fue la base técnica para sostenerlo.

El rosa no fue un accidente.

---

## Estructura del proyecto
```
src/
├── app/          → Rutas y Server Components
├── components/   → Componentes reutilizables
├── lib/          → Utilidades (Supabase, iconos, helpers)
└── public/       → Imágenes, cursores y assets
```

---

👾