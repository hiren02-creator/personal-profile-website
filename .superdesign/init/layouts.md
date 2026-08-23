# Shared Layouts

## App shell

- Source: `frontend/src/App.jsx`
- Description: Single-page React application containing the sticky site header, navigation, Hero, profile data, About, Skills, Investment, Projects, Insights, Contact, and footer.

```jsx
import { useEffect, useState } from 'react'
import './App.css'

async function requestJson(url, options) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error('Request failed.')
  }

  return response.json()
}

function App() {
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState('')
  const [skills, setSkills] = useState(null)
  const [skillsLoading, setSkillsLoading] = useState(true)
  const [skillsError, setSkillsError] = useState('')
  const [projects, setProjects] = useState(null)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [contactStatus, setContactStatus] = useState('')

  useEffect(() => {
    async function loadData(
      url,
      setData,
      setRequestError,
      setIsLoading,
      errorMessage,
    ) {
      try {
        const data = await requestJson(url)
        setData(data)
      } catch {
        setRequestError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadData(
      '/api/profile',
      setProfile,
      setProfileError,
      setProfileLoading,
      'Unable to load profile information.',
    )
    loadData(
      '/api/skills',
      setSkills,
      setSkillsError,
      setSkillsLoading,
      'Unable to load skills.',
    )
    loadData(
      '/api/projects',
      setProjects,
      setProjectsError,
      setProjectsLoading,
      'Unable to load projects.',
    )
  }, [])

  async function handleContactSubmit(event) {
    event.preventDefault()
    setContactStatus('')

    try {
      const data = await requestJson('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })

      if (!data.success) {
        throw new Error('Unable to send message.')
      }

      setContactStatus('Message sent successfully.')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setContactStatus('Unable to send message. Please try again.')
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          <a className="site-brand" href="#home">
            HIREN VISODIYA
          </a>
          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#investment">Investment</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="home">
          <p>Hello, I'm</p>
          <h1>Hiren Visodiya</h1>
          <h2>AI Developer | Investment Enthusiast</h2>
          <div className="profile-circle">
            <svg className="circle-text" viewBox="0 0 200 200">
              <defs>
                <path
                  id="profileCirclePath"
                  d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                />
              </defs>
              <text>
                <textPath href="#profileCirclePath">
                  AI DEVELOPER • INVESTMENT • TECHNOLOGY • PERSONAL FINANCE •
                </textPath>
              </text>
            </svg>
            <div className="profile-image">
              <img src="/images/profile.jpg" alt="Profile photo" />
            </div>
          </div>
          <p>
            I build intelligent applications and explore practical ideas in
            technology, personal finance, and long-term investing.
          </p>
          <a href="#projects">View My Projects</a>
          <a href="#contact">Contact Me</a>
        </section>

        <section aria-labelledby="profile-information-heading">
          <h2 id="profile-information-heading">Profile Information</h2>
          {profileLoading ? (
            <p>Loading profile...</p>
          ) : profileError ? (
            <p>{profileError}</p>
          ) : (
            <div>
              <p>
                <strong>Name:</strong> {profile?.name}
              </p>
              <p>
                <strong>Role:</strong> {profile?.role}
              </p>
              <p>
                <strong>Interest:</strong> {profile?.interest}
              </p>
              <p>
                <strong>Website:</strong> {profile?.website}
              </p>
            </div>
          )}
        </section>

        <section id="about">
          <h2>About Me</h2>
          <p>
            I am interested in artificial intelligence, AI development,
            technology, and investment research. I enjoy building useful
            digital projects and learning how technology and Personal
            Investment can work together.
          </p>
        </section>

        <section id="skills">
          <h2>AI Developer Skills</h2>
          {skillsLoading ? (
            <p>Loading skills...</p>
          ) : skillsError ? (
            <p>{skillsError}</p>
          ) : (
            <ul>
              {skills?.aiDeveloper.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          )}
        </section>

        <section id="investment">
          <h2>Investment Skills</h2>
          {skillsLoading ? (
            <p>Loading skills...</p>
          ) : skillsError ? (
            <p>{skillsError}</p>
          ) : (
            <ul>
              {skills?.investment.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          )}
        </section>

        <section id="projects">
          <h2>Featured Projects</h2>
          {projectsLoading ? (
            <p>Loading projects...</p>
          ) : projectsError ? (
            <p>{projectsError}</p>
          ) : (
            <div className="projects-grid">
              {projects?.map((project) => (
                <article className="project-card" key={project.title}>
                  <p className="project-category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="insights">
          <h2>Investment Insights</h2>
          <p>
            I am interested in personal finance, mutual funds, asset
            allocation, budgeting, stock market research, and long-term wealth
            planning.
          </p>
          <ul className="insights-list">
            <li className="insight-item">Mutual Funds</li>
            <li className="insight-item">Asset Allocation</li>
            <li className="insight-item">Budget Planning</li>
            <li className="insight-item">Stock Market Research</li>
            <li className="insight-item">Risk Management</li>
          </ul>
        </section>

        <section id="contact">
          <h2>Contact Me</h2>
          <p>
            Feel free to connect with me for AI development, technology, and
            investment-related discussions.
          </p>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <label htmlFor="contact-name">
              Name
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>

            <label htmlFor="contact-email">
              Email
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label htmlFor="contact-message">
              Message
              <textarea
                id="contact-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows="5"
                required
              />
            </label>

            <button type="submit">Send Message</button>
          </form>
          {contactStatus && <p className="contact-status">{contactStatus}</p>}
          <ul className="contact-list">
            <li>
              <a
                className="contact-link"
                href="mailto:yourname@example.com"
              >
                Email
              </a>
            </li>
            <li>
              <a
                className="contact-link"
                href="https://github.com/yourusername"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                className="contact-link"
                href="https://www.linkedin.com/in/yourusername"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 Hiren Visodiya. All rights reserved.</p>
        <p>AI Developer | Investment Enthusiast</p>
      </footer>
    </>
  )
}

export default App

```

