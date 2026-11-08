export default function Footer({ name, contact }) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>© {new Date().getFullYear()} {name}. Built with React and Express, deployed on Google Cloud Run.</p>
        <p className="footer__links">
          <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="#home">Back to top ↑</a>
        </p>
      </div>
    </footer>
  )
}
