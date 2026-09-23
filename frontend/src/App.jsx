import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  role: 'Investment',
  interest: 'AI Development',
  website: 'Personal Profile Website',
}

const skills = [
  'JavaScript',
  'Node.js',
  'HTML',
  'CSS',
  'Supabase',
  'PostgreSQL',
  'Terminal & Command Line',
  'Git',
  'GitHub',
  'React',
  'Vite',
  'REST APIs',
  'Mutual Funds',
  'ETFs & Index investing',
  'Investment Concepts',
]

const skillCategories = [
  { title: 'AI & Development', skills: ['Python', 'AI APIs'] },
  { title: 'Backend', skills: ['Node.js','REST APIs'] },
  { title: 'Frontend', skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Vite'] },
  { title: 'Databases', skills: ['Supabase', 'PostgreSQL'] },
  { title: 'Tools', skills: ['Git', 'GitHub', 'Terminal & Command Line'] },
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
  if (otherSkills.length) groups.push({ title: 'Investments', skills: otherSkills })

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
  ['Focus', 'role'],
  ['Interest', 'interest'],
  ['Website', 'website'],
]

const AboutSection = memo(function AboutSection() {
  const aboutRef = useRef(null)

  useLayoutEffect(() => {
    const section = aboutRef.current
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches || !window.IntersectionObserver || !Element.prototype.animate) return

    const targets = [
      section.querySelector('.about-statement'),
      section.querySelector('.about-identity'),
      section.querySelector('.about-ai'),
      section.querySelector('.about-investment'),
      section.querySelector('.about-journey'),
    ]
    const visible = new Set()
    const revealed = new Set()
    const timers = new Map()
    const animations = new Map()
    let nextStart = 0
    let stopped = false

    function reveal(target, immediate = false) {
      window.clearTimeout(timers.get(target))
      timers.delete(target)
      if (immediate) {
        animations.get(target)?.cancel()
        animations.delete(target)
      }
      if (stopped || revealed.has(target)) return
      revealed.add(target)
      observer.unobserve(target)
      target.classList.remove('about-reveal-pending')
      if (immediate) return

      const transform = target.classList.contains('about-ai')
        ? 'translateX(-12px)'
        : target.classList.contains('about-investment')
          ? 'scale(0.975)'
          : 'translateY(12px)'
      const animation = target.animate([
        { opacity: 0, transform },
        { opacity: 1, transform: 'none' },
      ], { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })
      animations.set(target, animation)
      animation.onfinish = () => animations.delete(target)
    }

    const observer = new IntersectionObserver((entries) => {
      if (stopped) return
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) visible.add(target)
        else {
          visible.delete(target)
          window.clearTimeout(timers.get(target))
          timers.delete(target)
        }
      })
      // DOM order keeps cards entering together in the storytelling sequence.
      targets.forEach((target) => {
        if (!visible.has(target) || revealed.has(target) || timers.has(target)) return
        const now = performance.now()
        const delay = Math.min(360, Math.max(0, nextStart - now))
        nextStart = now + delay + 90
        timers.set(target, window.setTimeout(() => {
          if (visible.has(target)) reveal(target)
        }, delay))
      })
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' })

    function revealAll() {
      stopped = true
      visible.clear()
      observer.disconnect()
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
      animations.forEach((animation) => animation.cancel())
      animations.clear()
      targets.forEach((target) => target.classList.remove('about-reveal-pending'))
    }

    function onMotionChange(event) {
      if (event.matches) revealAll()
    }

    function onFocus(event) {
      const target = targets.find((item) => item.contains(event.target))
      if (target) reveal(target, true)
    }

    targets.forEach((target) => {
      target.classList.add('about-reveal-pending')
      observer.observe(target)
    })
    motionPreference.addEventListener('change', onMotionChange)
    section.addEventListener('focusin', onFocus)
    return () => {
      revealAll()
      motionPreference.removeEventListener('change', onMotionChange)
      section.removeEventListener('focusin', onFocus)
    }
  }, [])
  function renderDetails(keys) {
    return (
      <dl className="profile-details">
        {profileFields.filter(([, key]) => keys.includes(key)).map(([label, key]) => (
          <div className="about-detail" key={key}>
            <dt>{label}</dt>
            <dd>{key === 'website' ? <a href="#home">{profile[key]} <span aria-hidden="true">↗</span></a> : profile[key]}</dd>
          </div>
        ))}
      </dl>
    )
  }

  return (
    <section ref={aboutRef} id="about" className="section screen-section" aria-labelledby="about-heading">
      <div className="container about-layout">
        <header className="about-statement">
          <p className="eyebrow">01 / About Me</p>
          <h2 id="about-heading">I build. I learn. I invest. I evolve.</h2>
          <p className="about-annotation">AI • Technology • Investment</p>
        </header>
        <div className="about-cards">
          <article className="about-card about-identity" aria-labelledby="about-identity-heading">
            <div className="about-portrait">
              <img src={`${import.meta.env.BASE_URL}images/profile.jpg`} alt="Hiren Visodiya" width="768" height="1680" loading="lazy" decoding="async" />
            </div>
            <h3 id="about-identity-heading">Identity</h3>
            <p className="about-identity-statement">Building <em>technology</em> with purpose.</p>
            <p className="lead-copy"><strong>I am interested in artificial intelligence, AI development, technology, and investment research.</strong></p>
            {renderDetails(['name', 'website'])}
          </article>
          <article className="about-card about-ai" aria-labelledby="about-ai-heading">
            <div className="about-ai-heading">
              <span className="about-ai-code" aria-hidden="true">{'{ }'}</span>
              <h3 id="about-ai-heading">AI</h3>
              <span className="about-ai-dot" aria-hidden="true" />
            </div>
            <svg className="about-ai-circuit" viewBox="0 0 240 64" fill="none" aria-hidden="true" focusable="false">
              <path d="M12 32H76L104 12H164L192 32H228M76 32L104 52H164L192 32" />
              <circle cx="12" cy="32" r="4" />
              <circle cx="104" cy="12" r="4" />
              <circle cx="164" cy="52" r="4" />
              <circle cx="228" cy="32" r="4" />
            </svg>
            {renderDetails(['interest'])}
          </article>
          <article className="about-card about-investment" aria-labelledby="about-investment-heading">
            <div className="about-investment-heading">
              <span className="about-investment-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" focusable="false">
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                  <path d="M4 10H20M10 10V20M14 14H17M14 17H17" />
                </svg>
              </span>
              <h3 id="about-investment-heading">Investment</h3>
            </div>
            <svg className="about-investment-grid" viewBox="0 0 240 64" fill="none" aria-hidden="true" focusable="false">
              <path className="about-investment-guides" d="M16 12H224M16 32H224M16 52H224M16 12V52M68 12V52M120 12V52M172 12V52M224 12V52" />
              <path className="about-investment-axis" d="M16 8V56H228M64 56V60M116 56V60M168 56V60M220 56V60" />
              <path className="about-investment-brackets" d="M106 22H100V42H106M134 22H140V42H134" />
            </svg>
            {renderDetails(['role'])}
          </article>
          <article className="about-card about-journey" aria-labelledby="about-journey-heading">
            <h3 id="about-journey-heading">Journey</h3>
            <ol className="about-journey-timeline" role="list">
              <li>Building useful digital projects</li>
              <li>Learning how technology and personal investment can work together</li>
            </ol>
          </article>
        </div>
        <div className="about-actions">
          <a className="button button-primary" href="#skills">Explore My Skills <span aria-hidden="true">↓</span></a>
          <a className="button button-secondary" href="#/resume">View My Resume <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  )
})
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
      if (!supabase) throw new Error('Contact service is not configured')
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
                  <defs><path id="profileCirclePath" d="M 100, 100 m -86, 0 a 86,86 0 1,1 172,0 a 86,86 0 1,1 -172,0" /></defs>
                  <text textLength="526" lengthAdjust="spacing"><textPath href="#profileCirclePath" startOffset="1%">INVESTMENT • AI DEVELOPER • TECHNOLOGY • PERSONAL FINANCE • </textPath></text>
                </svg>
                <div className="profile-image"><img src={`${import.meta.env.BASE_URL}images/profile.jpg`} alt="Hiren Visodiya" width="480" height="480" fetchPriority="high" decoding="async" /></div>
                <svg className="profile-sparkle" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2C16 12 12 16 2 16c10 0 14 4 14 14 0-10 4-14 14-14C20 16 16 12 16 2Z" /></svg>
                <span className="profile-dots" aria-hidden="true" />
                <svg className="profile-doodle" viewBox="0 0 44 24" aria-hidden="true"><path d="M3 18C10 3 17 3 19 13s8 10 12-2c2-6 6-8 10-7" /></svg>
              </div>

            </div>
          </div>
        </section>

        <AboutSection />

        <section id="skills" className="section section-tinted screen-section">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">02 / Skills</p><h2>Technologies &amp; Capabilities</h2></div>
              <p className="skills-status"><span aria-hidden="true" />Always learning</p>
            </div>
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
  { period: '2026–Present', title: 'Instructor', organization: 'Deaf Enabled Foundation', location: 'Ahmedabad, Gujarat' },
  { period: '2025–Present', university: 'Amity University', location: 'Noida, Uttar Pradesh' },
  { period: '2025–2026', title: 'Internship', organization: 'Deaf Enabled Foundation', location: 'Hyderabad, Telangana' },
  { period: '2022–2025', title: 'Deaf Enabled Foundation', location: 'Hyderabad, Telangana' },
  { period: '2019–2022', institution: 'K.L Institute for The DEAF', location: 'Bhavnagar, Gujarat'},
  { period: '2008–2019', institution: 'Mata Lachmin Rotary Institute For Deaf', location: 'Kutch, Gujarat'},
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
  useLayoutEffect(() => {
    const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    scrollToTop()
    // Reset again after the browser finishes the hash navigation.
    const frame = window.requestAnimationFrame(scrollToTop)
    return () => window.cancelAnimationFrame(frame)
  }, [])

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
