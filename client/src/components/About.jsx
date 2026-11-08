export default function About({ profile }) {
  return (
    <section id="about" className="section">
      <div className="container about">
        <div>
          <p className="eyebrow">About me</p>
          <h2 className="section__title">What I do</h2>
          <p className="lead">{profile.valueProposition}</p>
        </div>
        <div className="about__body">
          {profile.about.map((p, i) => <p key={i}>{p}</p>)}
          <ul className="about__facts">
            <li><strong>Based in</strong>{profile.location}</li>
            <li><strong>Focus</strong>{profile.title}</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
