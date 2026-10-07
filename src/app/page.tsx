
import Hero from '@/components/hero/Hero'
import About from '@/components/about/About'
import Skills from '@/components/skills/Skills'
import Projects from '@/components/projects/Projects'
import Contact from '@/components/contact/Contact'



export default async function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <About />
      <Skills />
      <Contact />
    </main>
  )
}