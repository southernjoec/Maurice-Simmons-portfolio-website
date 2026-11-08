import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`)
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  if (error) {
    return (
      <div className="state-screen">
        <p>Sorry, the portfolio content couldn't be loaded.</p>
        <small>{error}</small>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="state-screen" aria-busy="true">
        <div className="spinner" aria-hidden="true" />
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <>
      <Navbar name={data.profile.name} />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Projects projects={data.projects} />
        <Skills skills={data.skills} learning={data.learning} tools={data.tools} />
        <Contact contact={data.contact} />
      </main>
      <Footer name={data.profile.name} contact={data.contact} />
    </>
  )
}
