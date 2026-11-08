export default function Projects({ projects }) {
  return (
    <section id="projects" className="section section--alt">
      <div className="container">
        <p className="eyebrow">Projects</p>
        <h2 className="section__title">Selected work</h2>
        <div className="projects-grid">
          {projects.map((p) => (
            <article key={p.title} className="card project">
              {p.image && (
                <img className="project__img" src={p.image} alt={`${p.title} preview`} loading="lazy" />
              )}
              <div className="project__body">
                {p.highlight && <span className="tag tag--accent">{p.highlight}</span>}
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <ul className="tags" aria-label="Technologies used">
                  {p.tech.map((t) => <li key={t} className="tag">{t}</li>)}
                </ul>
                <div className="project__links">
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                  )}
                  {p.demo && (
                    <a href={p.demo} target={p.demo.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer">
                      Live demo ↗
                    </a>
                  )}
                  {!p.repo && !p.demo && <span className="muted">Repository coming soon</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
