import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

const navigation = ['Home', 'About', 'Skills', 'Contact', 'Resume']
const sectionIds = navigation
  .filter((item) => item !== 'Resume')
  .map((item) => item.toLowerCase())
function navigationHref(item) {
  return item === 'Resume' ? '#/resume' : `#${item.toLowerCase()}`
}

function isResumeHash(hash) {
  return hash === '#/resume' || hash.startsWith('#/resume/')
}

const profile = {
  name: 'Hiren Visodiya',
  role: 'AI Developer',
  interest: 'Investment',
  website: 'Personal Profile Website',
}

const skills = [
  'Python',
  'Node.js',
  'Express.js',
  'REST APIs',
  'Supabase',
  'PostgreSQL',
  'Git',
  'GitHub',
  'AI APIs',
]

const skillCategories = [
  { title: 'AI & Development', skills: ['Python', 'AI APIs'] },
  { title: 'Backend', skills: ['Node.js', 'Express.js', 'REST APIs'] },
  { title: 'Frontend', skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Vite'] },
  { title: 'Databases', skills: ['Supabase', 'PostgreSQL'] },
  { title: 'Tools', skills: ['Git', 'GitHub'] },
]

function SkillCategories({ items }) {
  if (!items.length) return <p className="resource-status">More skills will be added soon.</p>
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

const profileFields = [
  ['Name', 'name'],
  ['Focus', 'interest'],
  ['Interest', 'role'],
  ['Website', 'website'],
]

function AboutSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('about-entered')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })
    sectionRef.current.querySelectorAll('[data-about-reveal]').forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="section screen-section" aria-labelledby="about-heading">
      <div className="container about-layout">
        <div className="about-statement" data-about-reveal>
          <p className="eyebrow">01 / About Me</p>
          <h2 id="about-heading">Building<br /><em>technology</em><br />with purpose.</h2>
          <p className="about-annotation">AI • Technology • Investment</p>
        </div>
        <div className="about-copy" data-about-reveal>
          <p className="lead-copy"><strong>I am interested in artificial intelligence, AI development, technology, and investment research.</strong></p>
          <p className="about-body">I enjoy building useful digital projects and learning how technology and personal investment can work together.</p>
        </div>
        <dl className="profile-details" data-about-reveal>
          {profileFields.map(([label, key], index) => (
            <div className="about-detail" key={key} style={{ '--about-delay': `${index * 90}ms` }}>
              <dt><span className="about-detail-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{label}</dt>
              <dd>{key === 'website' ? <a href="#home">{profile[key]} <span className="about-link-arrow" aria-hidden="true">↗</span></a> : profile[key]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
function Website() {
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
  const headerRef = useRef(null)
  const submitting = useRef(false)
  const [sending, setSending] = useState(false)
  const [contactStatus, setContactStatus] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    const hashSection = window.location.hash.slice(1)
    if (!sectionIds.includes(hashSection)) return

    let frame
    function scrollToHashSection() {
      frame = window.requestAnimationFrame(() => {
        document.getElementById(hashSection)?.scrollIntoView()
      })
    }

    if (document.readyState === 'complete') scrollToHashSection()
    else window.addEventListener('load', scrollToHashSection, { once: true })

    return () => {
      window.removeEventListener('load', scrollToHashSection)
      window.cancelAnimationFrame(frame)
    }
  }, [])

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
    let observer
    function observeSections() {
      observer?.disconnect()
      // Pixel margins use viewport height; percentage root margins use width.
      const marker = Math.round(window.innerHeight * 0.3)
      observer = new IntersectionObserver((entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting)
        if (visibleSection) setActiveSection(visibleSection.target.id)
      }, {
        rootMargin: `-${marker}px 0px -${Math.max(0, window.innerHeight - marker - 1)}px 0px`,
        threshold: 0,
      })
      sections.forEach((section) => observer.observe(section))
    }
    observeSections()
    window.addEventListener('resize', observeSections)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', observeSections)
    }
  }, [])

  useEffect(() => {
    const header = headerRef.current
    const updateOffset = () => {
      document.documentElement.style.setProperty('--navigation-offset', `${header.getBoundingClientRect().height}px`)
    }
    updateOffset()
    const observer = new ResizeObserver(updateOffset)
    observer.observe(header)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--navigation-offset')
    }
  }, [])

  function updateField(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
    setContactStatus(null)
  }

  async function handleSubmit(event) {
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
      const { name, email, message } = values
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, message }])
      if (error) throw error
      setContactStatus({ success: true, message: 'Message sent successfully!' })
      setForm({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Supabase contact submission failed:', error)
      setContactStatus({ success: false, message: 'Something went wrong. Please try again.' })
    } finally {
      submitting.current = false
      setSending(false)
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header ref={headerRef} className={`site-header ${headerCompact ? 'is-scrolled' : ''}`} onKeyDown={(event) => {
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
              return <a key={item} className={activeSection === sectionId ? 'active' : ''} href={navigationHref(item)} aria-current={activeSection === sectionId ? 'location' : undefined} onClick={() => {
                setMenuOpen(false)
              }}>{item}</a>
            })}
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section id="home" className="hero screen-section">
          <div className="container hero-container">
            <div className="hero-copy">
              <p className="hero-greeting"><span aria-hidden="true" /> Hello, I&apos;m</p>
              <h1>HIREN<br /><span>VISODIYA</span></h1>
              <p className="hero-role">Investment Enthusiast <span aria-hidden="true">|</span> AI Developer</p>
              <div className="hero-actions">
                <a className="button button-secondary" href="#about">About Me <span aria-hidden="true">↓</span></a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="profile-circle">
                <svg className="circle-text" viewBox="0 0 200 200" aria-hidden="true">
                  <defs><path id="profileCirclePath" d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" /></defs>
                  <text><textPath href="#profileCirclePath" startOffset="1%">INVESTMENT • AI DEVELOPER • TECHNOLOGY • PERSONAL FINANCE • </textPath></text>
                </svg>
                <div className="profile-image"><img src="/images/profile.jpg" alt="Hiren Visodiya" width="480" height="480" fetchPriority="high" decoding="async" /></div>
              </div>

            </div>
          </div>
        </section>

        <AboutSection />

        <section id="skills" className="section section-tinted screen-section">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">02 / Skills</p><h2>Technologies & Capabilities</h2></div></div>
            <SkillCategories items={skills} />
          </div>
        </section>

        <section id="contact" className="section screen-section">
          <div className="container contact-layout">
            <div className="contact-information">
              <p className="eyebrow">05 / Contact</p><h2>Let&apos;s Connect.</h2>
              <p>Have an idea, a question, or a shared interest? Feel free to connect about AI development, technology, and investment research.</p>
              <div className="contact-options" aria-label="Contact details">
                <a className="contact-card" href="mailto:hirenwork62@gmail.com">
                  <span className="contact-card-copy"><span className="contact-card-label">Email</span><strong>hirenwork62@gmail.com</strong></span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="contact-card" href="https://www.linkedin.com/in/hiren-visodiya-416141208/" target="_blank" rel="noopener noreferrer">
                  <span className="contact-card-copy"><span className="contact-card-label">LinkedIn</span><strong>hiren-visodiya</strong></span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="contact-card" href="https://github.com/hiren02-creator" target="_blank" rel="noopener noreferrer">
                  <span className="contact-card-copy"><span className="contact-card-label">GitHub</span><strong>hiren02-creator</strong></span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
              <p className="contact-availability"><span aria-hidden="true">●</span> Available for new conversations</p>
            </div>
            <form className="contact-form" onSubmit={handleSubmit} aria-busy={sending}>
              <div className="form-heading"><span>Send a message</span><span aria-hidden="true">↗</span></div>
              <div className="form-row">
                <label htmlFor="contact-name">Your name<input id="contact-name" name="name" autoComplete="name" placeholder="Full name" value={form.name} onChange={updateField} maxLength={120} disabled={sending} required /></label>
                <label htmlFor="contact-email">Email address<input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={updateField} maxLength={254} disabled={sending} required /></label>
              </div>
              <label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" placeholder="Tell me what’s on your mind…" rows={5} value={form.message} onChange={updateField} maxLength={5000} disabled={sending} required /></label>
              <button className="button button-primary" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send message'} <span aria-hidden="true">↗</span></button>
              <div aria-live="polite" aria-atomic="true">{contactStatus && <p className={`contact-status ${contactStatus.success ? 'success' : 'error'}`}>{contactStatus.message}</p>}</div>
              <p className="contact-form-note">Let&apos;s build something meaningful.</p>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="container footer-container"><a className="site-brand" href="#home"><span className="brand-mark" aria-hidden="true">hv.</span><span>Hiren Visodiya</span></a><p>© {new Date().getFullYear()} Hiren Visodiya</p><a href="#home">Back to top <span aria-hidden="true">↑</span></a></div></footer>
    </>
  )
}

const educationTimelineEntries = [
  { period: '2026–Present', title: 'Instructor', organization: 'Deaf Enabled Foundation', location: 'Ahmedabad, India' },
  { period: '2025–Present', university: 'Amity University', },
  { period: '2025–2026', title: 'Internship', organization: 'Deaf Enabled Foundation', location: 'Hyderabad, India' },
  { period: '2022–2025', title: 'Deaf Enabled Foundation', },
  { period: '2019–2022', institution: 'K.L Institute for The DEAF'},
  { period: '2008–2019', institution: 'Mata Lachmin Rotary Institute For Deaf' },
]

function ResumeTimelineItem({ entry }) {
  const itemRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const item = itemRef.current
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.25 })

    observer.observe(item)
    return () => observer.disconnect()
  }, [])

  return (
    <li ref={itemRef} className={isVisible ? 'is-visible' : ''}>
      <span className="resume-timeline-dot" aria-hidden="true" />
      <div className="resume-timeline-card">
        <time>{entry.period}</time>
        <h3>{entry.title || entry.university || entry.institution}</h3>
        {entry.organization && <p>{entry.organization}</p>}
        {entry.location && <p>{entry.location}</p>}
      </div>
    </li>
  )
}

function ResumeTimeline({ entries }) {
  return (
    <ol className="resume-timeline">
      {entries.map((entry) => (
        <ResumeTimelineItem key={`${entry.period}-${entry.title}`} entry={entry} />
      ))}
    </ol>
  )
}

function ResumeJourneyHeading() {
  const headingRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.25 })

    observer.observe(headingRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <header ref={headingRef} className={`resume-journey-intro${isVisible ? ' is-visible' : ''}`}>
      <p className="resume-journey-label">MY JOURNEY</p>
      <h2 id="resume-journey-heading">The Journey <span>So Far.</span></h2>
    </header>
  )
}

function ResumePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerCompact, setHeaderCompact] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 24,
  )
  const menuButton = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    function updateHeaderState() {
      setHeaderCompact(window.scrollY > 24)
    }

    window.addEventListener('scroll', updateHeaderState, { passive: true })
    return () => window.removeEventListener('scroll', updateHeaderState)
  }, [])

  useEffect(() => {
    const header = headerRef.current
    const updateOffset = () => {
      document.documentElement.style.setProperty('--navigation-offset', `${header.getBoundingClientRect().height}px`)
    }
    updateOffset()
    const observer = new ResizeObserver(updateOffset)
    observer.observe(header)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--navigation-offset')
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#resume-content">Skip to content</a>
      <header ref={headerRef} className={`site-header ${headerCompact ? 'is-scrolled' : ''}`} onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false)
          menuButton.current?.focus()
        }
      }}>
        <div className="container header-container">
          <a className="header-brand" href="#home" onClick={() => setMenuOpen(false)}>Personal Profile Website</a>
          <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="resume-primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="menu-toggle-label">{menuOpen ? 'Close' : 'Menu'}</span>
            <span className={`hamburger ${menuOpen ? 'is-open' : ''}`} aria-hidden="true"><span /><span /></span>
          </button>
          <nav id="resume-primary-navigation" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
            {navigation.map((item) => <a key={item} className={item === 'Resume' ? 'active' : ''} href={navigationHref(item)} aria-current={item === 'Resume' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{item}</a>)}
          </nav>
        </div>
      </header>

      <main id="resume-content" tabIndex={-1}>
        <section id="resume-header" className="section" aria-labelledby="resume-heading">
          <div className="container">
            <header><h1 id="resume-heading">Resume</h1></header>
            <div className="resume-document">
              <object className="resume-document-preview" data={`${import.meta.env.BASE_URL}resume.pdf#view=FitH`} type="application/pdf" aria-label="Resume PDF preview">
                <p>Your browser cannot display this PDF inline. <a href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noopener noreferrer">View Resume</a> to read it in a new tab.</p>
              </object>
              <div className="resume-document-actions">
                <a className="button button-secondary" href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noopener noreferrer">View Resume</a>
                <a className="button button-primary" href={`${import.meta.env.BASE_URL}resume.pdf`} download="Simple Professional CV Resume.pdf">Download Resume</a>
              </div>
            </div>
          </div>
        </section>

        <section id="resume-journey" className="section" aria-labelledby="resume-journey-heading">
          <div className="container">
            <ResumeJourneyHeading />
            <ResumeTimeline entries={educationTimelineEntries} />
          </div>
        </section>
      </main>
    </>
  )
}

function App() {
  const [showResume, setShowResume] = useState(
    () => typeof window !== 'undefined' && isResumeHash(window.location.hash),
  )

  useEffect(() => {
    function updateView() {
      setShowResume(isResumeHash(window.location.hash))
    }

    window.addEventListener('hashchange', updateView)
    return () => window.removeEventListener('hashchange', updateView)
  }, [])

  return showResume ? <ResumePage /> : <Website />
}

export default App
