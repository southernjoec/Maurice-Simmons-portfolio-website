import { useEffect, useRef, useState } from 'react'

function levelLabel(level) {
  if (level >= 80) return 'Proficient'
  if (level >= 65) return 'Comfortable'
  if (level >= 50) return 'Developing'
  return 'Learning'
}

export default function Skills({ skills, learning, tools }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <p className="eyebrow">Skills</p>
        <h2 className="section__title">Tools of the trade</h2>
        <div className="skills-grid">
          {skills.map((group) => (
            <div key={group.category} className="card skill-group">
              <h3>{group.category}</h3>
              <ul>
                {group.items.map((s) => (
                  <li key={s.name} className="skill">
                    <div className="skill__head">
                      <span>{s.name}</span>
                      <span className="muted">{levelLabel(s.level)}</span>
                    </div>
                    <div
                      className="skill__bar"
                      role="progressbar"
                      aria-label={s.name}
                      aria-valuenow={s.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span style={{ width: visible ? `${s.level}%` : 0 }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="chips-row">
          <div>
            <h3>Currently learning</h3>
            <ul className="tags">{learning.map((t) => <li key={t} className="tag tag--accent">{t}</li>)}</ul>
          </div>
          <div>
            <h3>Everyday tools</h3>
            <ul className="tags">{tools.map((t) => <li key={t} className="tag">{t}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  )
}
