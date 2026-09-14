import { useEffect, useRef, useState } from 'react'
import './App.css'

const navigation = ['Home', 'About', 'Skills', 'Projects', 'Investment', 'Contact']
const sectionIds = navigation.map((item) => item.toLowerCase())

async function requestJson(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error('Request failed.')
  return response.json()
}

function useResource(url, validate) {
  const [state, setState] = useState({ data: null, loading: true, error: false })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    requestJson(url, { signal: controller.signal })
      .then((data) => {
        if (!validate(data)) throw new Error('Unexpected response.')
        if (!controller.signal.aborted) setState({ data, loading: false, error: false })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ data: null, loading: false, error: true })
      })
    return () => controller.abort()
  }, [url, validate, attempt])
  function retry() {
    setState({ data: null, loading: true, error: false })
    setAttempt((value) => value + 1)
  }

  return { ...state, retry }
}

const isProfile = (data) => data && ['name', 'role', 'interest', 'website'].every((key) => typeof data[key] === 'string')
const isSkillList = (data) => Array.isArray(data) && data.every((skill) => typeof skill === 'string')
const isSkills = (data) => data && isSkillList(data.aiDeveloper) && isSkillList(data.investment)
const isProjects = (data) => Array.isArray(data) && data.every((project) => project && ['title', 'category', 'description'].every((key) => typeof project[key] === 'string'))

function ResourceStatus({ resource, label }) {
  if (resource.loading) return <p className="resource-status" role="status">Loading {label}…</p>
  if (resource.error) return (
    <div className="resource-status" role="status">
      <p>Unable to load {label}. Please try again.</p>
      <button className="text-button" type="button" onClick={resource.retry}>Try again <span aria-hidden="true">↗</span></button>
    </div>
  )
  return null
}

const skillCategories = [
  { title: 'AI & Development', skills: ['Python', 'AI APIs'] },
  { title: 'Backend', skills: ['Node.js', 'Express.js', 'REST APIs'] },
  { title: 'Frontend', skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Vite'] },
  { title: 'Databases', skills: ['Supabase', 'PostgreSQL'] },
  { title: 'Tools', skills: ['Git', 'GitHub'] },
]

function SkillCategories({ items }) {
  const knownSkills = new Set(skillCategories.flatMap((category) => category.skills))
  const groups = skillCategories
    .map((category) => ({
      ...category,
      skills: category.skills.filter((skill) => items.includes(skill)),
    }))
    .filter((category) => category.skills.length)
  const otherSkills = items.filter((skill) => !knownSkills.has(skill))
  if (otherSkills.length) groups.push({ title: 'More Capabilities', skills: otherSkills })

  return (
    <div className="skill-categories">
      {groups.map((category, index) => (
        <article className="skill-category" key={category.title}>
          <div className="skill-category-heading">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{category.title}</h3>
          </div>
          <ul>
            {category.skills.map((skill) => <li key={skill}>{skill}</li>)}
          </ul>
        </article>
      ))}
    </div>
  )
}

const investmentTopics = [
  ['Long-Term Investing', 'Learning how patience, consistency, and clear goals shape stronger financial decisions.'],
  ['Market Research', 'Studying businesses, market information, and the factors behind investment ideas.'],
  ['Personal Finance', 'Exploring budgeting, mutual funds, asset allocation, and practical wealth planning.'],
  ['Risk Management', 'Understanding uncertainty and balancing opportunity with thoughtful protection.'],
]

function App() {
  const profile = useResource('/api/profile', isProfile)
  const skills = useResource('/api/skills', isSkills)
  const projects = useResource('/api/projects', isProjects)
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerCompact, setHeaderCompact] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 24,
  )
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === 'undefined') return 'home'
    const hashSection = window.location.hash.slice(1)
    return sectionIds.includes(hashSection) ? hashSection : 'home'
  })
  const menuButton = useRef(null)
  const submitting = useRef(false)
  const [sending, setSending] = useState(false)
  const [contactStatus, setContactStatus] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    function updateHeaderState() {
      setHeaderCompact(window.scrollY > 24)
    }

    window.addEventListener('scroll', updateHeaderState, { passive: true })
    return () => window.removeEventListener('scroll', updateHeaderState)
  }, [])

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting)
        if (visibleSection) setActiveSection(visibleSection.target.id)
      },
      {
        rootMargin: '-22% 0px -62% 0px',
        threshold: 0,
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  function updateField(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
    setContactStatus(null)
  }

  async function handleContactSubmit(event) {
    event.preventDefault()
    if (submitting.current) return
    const values = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]))
    if (Object.values(values).some((value) => !value)) {
      setContactStatus({ success: false, message: 'Please complete every field before sending.' })
      return
    }
    submitting.current = true
    setSending(true)
    setContactStatus(null)
    try {
      const data = await requestJson('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!data.success) throw new Error('Unable to send message.')
      setContactStatus({ success: true, message: 'Your message was received by the website. Thank you for reaching out.' })
      setForm({ name: '', email: '', message: '' })
    } catch {
      setContactStatus({ success: false, message: 'Unable to send your message. Your text is saved here so you can try again.' })
    } finally {
      submitting.current = false
      setSending(false)
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`site-header ${headerCompact ? 'is-scrolled' : ''}`} onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false)
          menuButton.current?.focus()
        }
      }}>
        <div className="container header-container">
          <a className="header-brand" href="#home" onClick={() => {
            setMenuOpen(false)
          }}>Personal Profile Website</a>
          <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="menu-toggle-label">{menuOpen ? 'Close' : 'Menu'}</span>
            <span className={`hamburger ${menuOpen ? 'is-open' : ''}`} aria-hidden="true"><span /><span /></span>
          </button>
          <nav id="primary-navigation" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
            {navigation.map((item) => {
              const sectionId = item.toLowerCase()
              return <a key={item} className={activeSection === sectionId ? 'active' : ''} href={`#${sectionId}`} aria-current={activeSection === sectionId ? 'location' : undefined} onClick={() => {
                setMenuOpen(false)
              }}>{item}</a>
            })}
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section id="home" className="hero screen-section">
          <div className="container hero-container">
            <div className="hero-heading">
              <p className="hero-greeting">Hello, I&apos;m</p>
              <h1>HIREN VISODIYA</h1>
            </div>
            <div className="profile-circle">
              <svg className="circle-text" viewBox="0 0 200 200" aria-hidden="true">
                <defs><path id="profileCirclePath" d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" /></defs>
                <text><textPath href="#profileCirclePath">AI DEVELOPER • INVESTMENT • TECHNOLOGY • PERSONAL FINANCE • </textPath></text>
              </svg>
              <div className="profile-image"><img src="/images/profile.jpg" alt="Hiren Visodiya" width="480" height="480" fetchPriority="high" /></div>
            </div>
            <div className="hero-details">
              <h2>AI Developer | Investment Enthusiast</h2>
              <p className="hero-introduction">I build intelligent applications and explore practical ideas in technology, personal finance, and long-term investing.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#projects">View My Projects <span aria-hidden="true">↗</span></a>
                <a className="button button-secondary" href="#contact">Contact Me <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section screen-section">
          <div className="container about-layout">
            <div className="section-intro">
              <span className="section-number" aria-hidden="true">01</span>
              <p className="eyebrow">About Me</p>
              <h2>Building technology<br />with purpose.</h2>
            </div>
            <div className="about-copy">
              <p className="lead-copy">I am interested in artificial intelligence, AI development, technology, and investment research. I enjoy building useful digital projects and learning how technology and personal investment can work together.</p>
              <ResourceStatus resource={profile} label="profile information" />
              {profile.data && <dl className="profile-details">{[['Name', profile.data.name], ['Focus', profile.data.role], ['Interest', profile.data.interest], ['Website', profile.data.website]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
              <p className="about-note">My approach combines practical experimentation, continuous learning, and a focus on work that can create lasting value.</p>
            </div>
          </div>
        </section>

        <section id="skills" className="section section-tinted screen-section">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">02 / Skills</p><h2>Technologies & Capabilities</h2></div><p>From intelligent APIs to reliable backend systems, these are the tools I use to turn ideas into working products.</p></div>
            <ResourceStatus resource={skills} label="skills" />
            {skills.data && <SkillCategories items={skills.data.aiDeveloper} />}
          </div>
        </section>

        <section id="projects" className="section screen-section">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">03 / Selected Projects</p><h2>Projects with a purpose.</h2></div><p>Exploring the intersection of intelligent software, useful web experiences, and everyday decisions.</p></div>
            <ResourceStatus resource={projects} label="projects" />
            {projects.data && (projects.data.length ? <div className="projects-grid">{projects.data.map((project, index) => (
              <article className="project-card" key={`${project.title}-${index}`}>
                <div className={`project-art project-art-${index % 3}`} aria-hidden="true"><span className="project-number">{String(index + 1).padStart(2, '0')}</span><span className="project-symbol">{['✳', '</>', '↗'][index % 3]}</span><span className="project-art-label">{project.category}</span></div>
                <div className="project-copy"><p className="eyebrow">Project {String(index + 1).padStart(2, '0')}</p><h3>{project.title}</h3><p>{project.description}</p><ul className="project-stack" aria-label={`${project.title} technology stack`}><li>{project.category}</li></ul><span className="project-note">Project details available on request</span></div>
              </article>
            ))}</div> : <p className="resource-status">New projects are on the way.</p>)}
          </div>
        </section>

        <section id="investment" className="section investment-section screen-section">
          <div className="container investment-layout">
            <div className="investment-intro"><p className="eyebrow">04 / Investment</p><h2>Long-Term<br />Thinking</h2><p className="investment-introduction">My curiosity extends to personal finance, mutual funds, asset allocation, budgeting, stock market research, and thoughtful wealth planning.</p><p className="investment-note">Learning today. Planning for tomorrow.</p></div>
            <div className="investment-content">
              <div className="investment-topics">{investmentTopics.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
              <ResourceStatus resource={skills} label="investment skills" />
              {skills.data && <ul className="investment-tags" aria-label="Investment skills">{skills.data.investment.map((skill) => <li key={skill}>{skill}</li>)}</ul>}
            </div>
          </div>
        </section>

        <section id="contact" className="section screen-section">
          <div className="container contact-layout">
            <div className="contact-information">
              <p className="eyebrow">05 / Contact</p><h2>Let&apos;s Connect.</h2>
              <p>Have an idea, a question, or a shared interest? Feel free to connect about AI development, technology, and investment research.</p>
              <div className="contact-options" aria-label="Contact details">
                <div><span>Email</span><strong>Configure email address</strong></div>
                <div><span>LinkedIn</span><strong>Configure profile URL</strong></div>
                <div><span>GitHub</span><strong>Configure profile URL</strong></div>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleContactSubmit} aria-busy={sending}>
              <div className="form-heading"><span>Send a message</span><span aria-hidden="true">↗</span></div>
              <div className="form-row">
                <label htmlFor="contact-name">Your name<input id="contact-name" name="name" autoComplete="name" placeholder="Full name" value={form.name} onChange={updateField} maxLength={120} disabled={sending} required /></label>
                <label htmlFor="contact-email">Email address<input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={updateField} maxLength={254} disabled={sending} required /></label>
              </div>
              <label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" placeholder="Tell me what’s on your mind…" rows={5} value={form.message} onChange={updateField} maxLength={5000} disabled={sending} required /></label>
              <button className="button button-primary" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span></button>
              <div aria-live="polite" aria-atomic="true">{contactStatus && <p className={`contact-status ${contactStatus.success ? 'success' : 'error'}`}>{contactStatus.message}</p>}</div>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="container footer-container"><a className="site-brand" href="#home"><span className="brand-mark" aria-hidden="true">hv.</span><span>Hiren Visodiya</span></a><p>© {new Date().getFullYear()} Hiren Visodiya</p><a href="#home">Back to top <span aria-hidden="true">↑</span></a></div></footer>
    </>
  )
}

export default App
