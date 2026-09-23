import { memo, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  { title: 'AI', tag: '01 / INTELLIGENCE', skills: ['Python', 'AI APIs'] },
  { title: 'Frontend', tag: '02 / INTERFACE', skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Vite'] },
  { title: 'Backend', tag: '03 / SYSTEM', skills: ['Node.js', 'REST APIs', 'Supabase', 'PostgreSQL'] },
  { title: 'Tools', tag: '04 / TOOLKIT', skills: ['Git', 'GitHub', 'Terminal & Command Line'] },
  { title: 'Investment', tag: '05 / FINANCE', skills: ['Mutual Funds', 'ETFs & Index investing', 'Investment Concepts'] },
]

const skillNodeShapes = {
  React: 'circle',
  HTML: 'square',
  CSS: 'circle',
  Vite: 'square',
  'Node.js': 'square',
  Supabase: 'square',
  Git: 'circle',
  GitHub: 'square',
}
const featuredSkills = new Set(['React', 'JavaScript', 'Node.js', 'Mutual Funds'])

// Decorative motifs have no data meaning and never connect skill nodes.
const SkillClusterAccent = memo(function SkillClusterAccent({ category }) {
  const motifs = {
    AI: <><path d="M4 14H20L28 6H42M54 14H66L74 6H90" /><rect x="43" y="3" width="10" height="14" rx="2" /><path d="M46 7H50M46 11H50" /><circle cx="4" cy="14" r="2" /><circle cx="90" cy="6" r="2" /></>,
    Frontend: <><rect x="3" y="2" width="48" height="16" rx="3" /><path d="M3 7H51M18 7V18" /><rect x="59" y="3" width="14" height="14" rx="4" /><circle cx="85" cy="10" r="6" /></>,
    Backend: <><rect x="3" y="3" width="24" height="14" rx="2" /><rect x="36" y="3" width="24" height="14" rx="2" /><rect x="69" y="3" width="24" height="14" rx="2" /><path d="M8 7H22M8 12H15M41 7H55M41 12H48M74 7H88M74 12H81" /></>,
    Tools: <><path d="M5 5L11 10L5 15M16 15H27" /><rect x="40" y="4" width="12" height="12" rx="2" /><path d="M46 7V13M43 10H49M64 6H90M64 14H82" /></>,
    Investment: <><path className="skill-accent-guides" d="M4 3V17H92M24 3V17M46 3V17M68 3V17M4 8H92" /><path className="skill-investment-chart" d="M12 12L28 7L44 11L60 5L76 9L90 4" /><path className="skill-investment-trace" pathLength="100" d="M12 12L28 7L44 11L60 5L76 9L90 4" /></>,
  }

  return (
    <svg className="skill-cluster-accent" viewBox="0 0 96 20" fill="none" aria-hidden="true" focusable="false">
      {motifs[category]}
    </svg>
  )
})

const skillConnections = {
  AI: [['Python', 'AI APIs']],
  Frontend: [['React', 'JavaScript'], ['HTML', 'CSS']],
  Backend: [['Node.js', 'REST APIs'], ['Supabase', 'PostgreSQL']],
  Tools: [['Git', 'GitHub']],
  Investment: [['Mutual Funds', 'ETFs & Index investing'], ['ETFs & Index investing', 'Investment Concepts']],
}

const SkillConnections = memo(function SkillConnections({ category, skillsKey }) {
  const svgRef = useRef(null)
  const [paths, setPaths] = useState([])

  useLayoutEffect(() => {
    const area = svgRef.current.parentElement
    const nodes = new Map(
      [...area.querySelectorAll('[data-skill]')].map((node) => [node.dataset.skill, node]),
    )
    if (nodes.size < 2) return

    function measure() {
      // Layout coordinates stay stable while cards and nodes animate with transforms.
      const bounds = { width: area.clientWidth, height: area.clientHeight }
      const centers = new Map([...nodes].map(([name, node]) => {
        let x = node.offsetWidth / 2
        let y = node.offsetHeight / 2
        for (let parent = node; parent && parent !== area; parent = parent.offsetParent) {
          x += parent.offsetLeft
          y += parent.offsetTop
        }
        return [name, { x, y }]
      }))
      const nextPaths = skillConnections[category].flatMap(([from, to]) => {
        const start = centers.get(from)
        const end = centers.get(to)
        if (!start || !end) return []
        const dx = end.x - start.x
        const dy = end.y - start.y
        // Keep the control points inside the node area at every wrap width.
        const bend = Math.min(22, Math.hypot(dx, dy) * .2)
        const horizontal = Math.abs(dx) >= Math.abs(dy)
        const cx1 = Math.min(bounds.width - 2, Math.max(2, start.x + dx / 3 + (horizontal ? 0 : bend)))
        const cx2 = Math.min(bounds.width - 2, Math.max(2, start.x + dx * 2 / 3 + (horizontal ? 0 : bend)))
        const cy1 = Math.min(bounds.height - 2, Math.max(2, start.y + dy / 3 + (horizontal ? bend : 0)))
        const cy2 = Math.min(bounds.height - 2, Math.max(2, start.y + dy * 2 / 3 + (horizontal ? bend : 0)))
        return [`M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`]
      })
      setPaths((previous) => previous.join('|') === nextPaths.join('|') ? previous : nextPaths)
    }

    measure()
    // Resize observation covers wrapping, zoom, and font changes without a frame loop.
    const observer = new ResizeObserver(measure)
    observer.observe(area)
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [category, skillsKey])

  return (
    <svg ref={svgRef} className="skill-connections" aria-hidden="true" focusable="false">
      {paths.map((path, index) => <path key={index} d={path} />)}
    </svg>
  )
})

const skillDescriptions = {
  JavaScript: 'I build interactive website behavior.',
  'Node.js': 'I run server-side application logic.',
  HTML: 'I structure accessible web content.',
  CSS: 'I style responsive layouts.',
  Supabase: 'I store and retrieve application data.',
  PostgreSQL: 'I organize and query relational data.',
  'Terminal & Command Line': 'I run development tools and project commands.',
  Git: 'I track changes in my projects.',
  GitHub: 'I host and manage my code repositories.',
  React: 'I build reusable interface components.',
  Vite: 'I develop and build frontend projects.',
  'REST APIs': 'I connect applications to services.',
  'Mutual Funds': 'I research pooled investment options.',
  'ETFs & Index investing': 'I explore diversified index investing.',
  'Investment Concepts': 'I study risk and diversification.',
  Python: 'I write scripts for AI development.',
  'AI APIs': 'I integrate AI features into applications.',
}

function SkillTooltip({ target, id, onDismiss, onEnter, onLeave }) {
  const tooltipRef = useRef(null)
  const updatePositionRef = useRef(null)
  const [position, setPosition] = useState(null)

  useLayoutEffect(() => {
    function updatePosition() {
      const tooltip = tooltipRef.current
      const anchor = target.node.getBoundingClientRect()
      const { width, height } = tooltip.getBoundingClientRect()
      const gap = 8
      const margin = 12
      const viewport = window.visualViewport
      const leftEdge = (viewport?.offsetLeft || 0) + margin
      const topEdge = (viewport?.offsetTop || 0) + margin
      const rightEdge = leftEdge + (viewport?.width || window.innerWidth) - margin * 2
      const bottomEdge = topEdge + (viewport?.height || window.innerHeight) - margin * 2
      const obstacles = [...document.querySelectorAll('#skills .skill-node, #skills h2, #skills h3, .site-header')]
        .map((node) => node.getBoundingClientRect())
      const candidates = [
        { left: anchor.left + (anchor.width - width) / 2, top: anchor.top - height - gap },
        { left: anchor.left + (anchor.width - width) / 2, top: anchor.bottom + gap },
        { left: anchor.right + gap, top: anchor.top + (anchor.height - height) / 2 },
        { left: anchor.left - width - gap, top: anchor.top + (anchor.height - height) / 2 },
      ].map((candidate) => {
        const left = Math.max(leftEdge, Math.min(candidate.left, rightEdge - width))
        const top = Math.max(topEdge, Math.min(candidate.top, bottomEdge - height))
        const overlap = obstacles.reduce((total, rect) => total +
          Math.max(0, Math.min(left + width, rect.right) - Math.max(left, rect.left)) *
          Math.max(0, Math.min(top + height, rect.bottom) - Math.max(top, rect.top)), 0)
        return { left, top, overlap }
      })
      candidates.sort((a, b) => a.overlap - b.overlap)
      setPosition({ left: candidates[0].left, top: candidates[0].top })
    }
    updatePositionRef.current = updatePosition
    updatePosition()
    return () => { updatePositionRef.current = null }
  }, [target])

  useEffect(() => {
    let frame
    function onScroll() {
      if (document.activeElement !== target.node) { onDismiss(); return }
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const rect = target.node.getBoundingClientRect()
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) onDismiss()
        else updatePositionRef.current?.()
      })
    }
    function dismissOnEscape(event) {
      if (event.key === 'Escape') onDismiss()
    }
    function dismissOutside(event) {
      if (!target.node.contains(event.target) && !tooltipRef.current?.contains(event.target)) onDismiss()
    }
    document.addEventListener('keydown', dismissOnEscape)
    document.addEventListener('pointerdown', dismissOutside)
    document.addEventListener('wheel', onDismiss, { passive: true })
    document.addEventListener('touchmove', onDismiss, { passive: true })
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onDismiss)
    window.visualViewport?.addEventListener('resize', onDismiss)
    window.visualViewport?.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('keydown', dismissOnEscape)
      document.removeEventListener('pointerdown', dismissOutside)
      document.removeEventListener('wheel', onDismiss)
      document.removeEventListener('touchmove', onDismiss)
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onDismiss)
      window.visualViewport?.removeEventListener('resize', onDismiss)
      window.visualViewport?.removeEventListener('scroll', onScroll)
    }
  }, [target, onDismiss])

  return createPortal(
    <div ref={tooltipRef} id={id} role="tooltip" className="skill-tooltip"
      style={position || { visibility: 'hidden' }} onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <strong>{target.skill}</strong>
      <p>{skillDescriptions[target.skill]}</p>
      <span className="skill-tooltip-category">{target.category}</span>
    </div>,
    document.body,
  )
}

const SkillCategories = memo(function SkillCategories({ items }) {
  const [selectedSkills, setSelectedSkills] = useState(() => new Set())
  const [tooltip, setTooltip] = useState(null)
  const tooltipId = useId()
  const tooltipTimer = useRef(null)
  const dismissTooltip = useCallback(() => {
    window.clearTimeout(tooltipTimer.current)
    setTooltip(null)
  }, [])
  const keepTooltip = () => window.clearTimeout(tooltipTimer.current)
  function showTooltip(node, skill, category) {
    keepTooltip()
    setTooltip((current) => current?.node === node ? current : { node, skill, category })
  }
  function leaveTooltip() {
    keepTooltip()
    tooltipTimer.current = window.setTimeout(() => {
      setTooltip((current) => current?.node === document.activeElement ? current : null)
    }, 120)
  }
  useEffect(() => () => window.clearTimeout(tooltipTimer.current), [])

  function toggleSkill(skill) {
    setSelectedSkills((previous) => {
      const next = new Set(previous)
      if (next.has(skill)) next.delete(skill)
      else next.add(skill)
      return next
    })
  }
  const groups = skillCategories.map((category) => ({
    ...category,
    skills: category.skills.filter((skill) => items.includes(skill)),
  }))

  return (
    <div className="skill-categories">
      {groups.map((category) => (
        <article className={`skill-category skill-category-${category.title.toLowerCase()}`} key={category.title} aria-labelledby={`skill-heading-${category.title.toLowerCase()}`}>
          <div className="skill-category-heading">
            <span className="skill-category-tag">{category.tag}</span>
            <h3 id={`skill-heading-${category.title.toLowerCase()}`}>{category.title}</h3>
            <SkillClusterAccent category={category.title} />
          </div>
          <div className="skill-node-space">
            <SkillConnections category={category.title} skillsKey={category.skills.join('|')} />
            {category.skills.length > 0 && (
              <ul role="list">
                {category.skills.map((skill) => (
                  <li key={skill}>
                    <button
                      type="button"
                      className={`skill-node skill-node-${skillNodeShapes[skill] || 'pill'}${featuredSkills.has(skill) ? ' skill-node-featured' : ''}`}
                      data-skill={skill}
                      aria-describedby={tooltip?.skill === skill ? tooltipId : undefined}
                      onPointerEnter={(event) => {
                        if (event.pointerType !== 'touch') showTooltip(event.currentTarget, skill, category.title)
                      }}
                      onPointerLeave={leaveTooltip}
                      onFocus={(event) => showTooltip(event.currentTarget, skill, category.title)}
                      onBlur={dismissTooltip}
                      onPointerUp={(event) => {
                        if (event.pointerType === 'touch') {
                          event.currentTarget.focus({ preventScroll: true })
                          showTooltip(event.currentTarget, skill, category.title)
                        }
                      }}
                      aria-pressed={selectedSkills.has(skill)}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
      {tooltip && <SkillTooltip key={tooltip.skill} target={tooltip} id={tooltipId} onDismiss={dismissTooltip} onEnter={keepTooltip} onLeave={leaveTooltip} />}
    </div>
  )
})

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
function useSkillsReveal(sectionRef) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (preference.matches || !window.IntersectionObserver || !Element.prototype.animate) return

    const groups = [
      ['.section-heading', 320, 'translateY(8px)'],
      ['.skill-category', 380, 'translateY(10px)'],
      ['.skill-connections', 220, 'none'],
      ['.skill-node', 260, 'translateY(4px) scale(0.97)'],
    ]
    const records = groups.flatMap(([selector, duration, transform], phase) =>
      [...section.querySelectorAll(selector)].map((element) => ({
        element, phase,
        duration: element.classList.contains('skill-category-investment') ? 460 : duration,
        transform: element.classList.contains('skill-category-investment') ? 'translateY(12px) scale(0.99)' : transform,
        visible: false, revealed: false, timer: null, animation: null, end: 0,
      })),
    )
    let stopped = false
    const backgroundObserver = new IntersectionObserver(([entry]) => {
      section.classList.toggle('skills-in-view', entry.isIntersecting)
    })
    backgroundObserver.observe(section)

    function finish(record) {
      if (record.revealed && !record.animation && record.timer === null) return
      window.clearTimeout(record.timer)
      record.timer = null
      record.animation?.cancel()
      record.animation = null
      record.revealed = true
      record.end = 0
      record.element.classList.remove('skills-reveal-pending')
      observer.unobserve(record.element)
    }

    function schedule() {
      const now = performance.now()
      records.forEach((record) => {
        if (!record.visible || record.revealed || record.timer !== null) return
        // Sequence only the content currently entering, so mobile never waits for offscreen cards.
        const earlier = records.filter((other) => other.phase < record.phase && other.end > now)
        const siblings = records.filter((other) => other !== record && other.phase === record.phase && other.end > now)
        const stagger = record.phase === 1 ? 90 : record.phase === 3 ? 35 : 0
        const start = Math.max(now, ...earlier.map((other) => other.end),
          ...siblings.map((other) => other.end - other.duration + stagger))
        record.end = start + record.duration
        record.timer = window.setTimeout(() => {
          record.timer = null
          if (stopped || !record.visible) { record.end = 0; return }
          record.revealed = true
          observer.unobserve(record.element)
          record.element.classList.remove('skills-reveal-pending')
          record.animation = record.element.animate([
            { opacity: 0, transform: record.transform },
            { opacity: 1, transform: 'none' },
          ], { duration: record.duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })
          record.animation.onfinish = () => { record.animation = null }
        }, start - now)
      })
    }

    const observer = new IntersectionObserver((entries) => {
      if (stopped) return
      entries.forEach(({ target, isIntersecting }) => {
        const record = records.find((item) => item.element === target)
        record.visible = isIntersecting
        if (!isIntersecting && record.timer !== null) {
          window.clearTimeout(record.timer)
          record.timer = null
          record.end = 0
        }
      })
      schedule()
    }, { threshold: 0, rootMargin: '0px 0px -16px 0px' })

    function revealAll() {
      stopped = true
      records.forEach(finish)
      observer.disconnect()
      backgroundObserver.disconnect()
      section.classList.remove('skills-in-view')
    }
    function onPreferenceChange(event) {
      if (event.matches) revealAll()
    }
    function onInteraction(event) {
      const card = event.target.closest('.skill-category')
      if (!card) return
      // Settle transforms before a focus/hover tooltip measures its anchor.
      records.filter((record) => record.phase === 0 || record.element === card || card.contains(record.element)).forEach(finish)
    }

    records.forEach((record) => {
      record.element.classList.add('skills-reveal-pending')
      observer.observe(record.element)
    })
    preference.addEventListener('change', onPreferenceChange)
    section.addEventListener('focusin', onInteraction, true)
    section.addEventListener('pointerover', onInteraction, true)
    return () => {
      revealAll()
      preference.removeEventListener('change', onPreferenceChange)
      section.removeEventListener('focusin', onInteraction, true)
      section.removeEventListener('pointerover', onInteraction, true)
    }
  }, [sectionRef])
}

function Website() {
  const skillsRef = useRef(null)
  useSkillsReveal(skillsRef)
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

        <section ref={skillsRef} id="skills" className="section section-tinted screen-section" aria-labelledby="skills-heading">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">02 / Skills</p><h2 id="skills-heading">What I Know. What I Build With.</h2></div>
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
