export default function Hero({ profile }) {
  return (
    <section id="home" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <p className="hero__badge">
          <span className="dot" aria-hidden="true" /> {profile.availability}
        </p>
        <h1 className="hero__title">
          Hi, I'm <span className="gradient-text">{profile.name}</span>.
        </h1>
        <p className="hero__role">{profile.title}</p>
        <p className="hero__tagline">{profile.tagline}</p>
        <div className="hero__actions">
          <a href="#projects" className="btn btn--primary">View my work</a>
          <a href="#contact" className="btn btn--ghost">Get in touch</a>
        </div>
        <div className="hero__terminal" aria-hidden="true">
          <div className="terminal__bar"><span /><span /><span /></div>
          <pre>
<span className="t-muted">$</span> git push origin main{'\n'}
<span className="t-muted">→</span> GitHub Actions: build ✔ test ✔ deploy ✔{'\n'}
<span className="t-muted">→</span> Cloud Run: <span className="t-ok">service is live</span>
          </pre>
        </div>
      </div>
    </section>
  )
}
