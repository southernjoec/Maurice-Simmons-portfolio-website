import { useState } from 'react'

const EMPTY = { name: '', email: '', message: '', website: '' }

export default function Contact({ contact }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [serverMsg, setServerMsg] = useState('')

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    setErrors({})
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const body = await res.json()
      if (res.ok && body.ok) {
        setStatus('sent')
        setForm(EMPTY)
      } else {
        setErrors(body.errors || {})
        setServerMsg(body.error || 'Please fix the highlighted fields.')
        setStatus('error')
      }
    } catch {
      setServerMsg('Network error. Please try again or email me directly.')
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section section--alt">
      <div className="container contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 className="section__title">Let's work together</h2>
          <p className="lead">
            I'm looking for internships and collaborative projects. Send me a message, or reach me directly:
          </p>
          <ul className="contact__links">
            <li><span>Email</span><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            <li><span>LinkedIn</span><a href={contact.linkedin} target="_blank" rel="noopener noreferrer">View profile ↗</a></li>
            <li><span>GitHub</span><a href={contact.github} target="_blank" rel="noopener noreferrer">View profile ↗</a></li>
          </ul>
        </div>

        <form className="card contact__form" onSubmit={submit} noValidate>
          <label>
            Name
            <input name="name" value={form.name} onChange={update} autoComplete="name" aria-invalid={!!errors.name} />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={update} autoComplete="email" aria-invalid={!!errors.email} />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>
          <label>
            Message
            <textarea name="message" rows={5} value={form.message} onChange={update} aria-invalid={!!errors.message} />
            {errors.message && <small className="field-error">{errors.message}</small>}
          </label>
          {/* Honeypot field, hidden from people */}
          <input className="hp" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} aria-hidden="true" />
          <button className="btn btn--primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p className="form-status" role="status" aria-live="polite">
            {status === 'sent' && <span className="ok">Thanks! Your message was sent.</span>}
            {status === 'error' && <span className="err">{serverMsg}</span>}
          </p>
        </form>
      </div>
    </section>
  )
}
