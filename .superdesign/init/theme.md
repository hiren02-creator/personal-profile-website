# Theme

## Compact token summary

- Framework styling: vanilla CSS imported by React.
- Font families: system UI / Segoe UI / Roboto sans-serif; system heading stack; Consolas-based monospace.
- Base type: 18px at desktop and 16px below 1024px, 145% line height.
- Core light colors: background `#ffffff`, heading `#08060d`, body text `#6b6375`, border `#e5e4e7`.
- Hero palette: dark slate `#17212b`, muted slate `#5f6b76`, restrained violet accent `#5b3fd1`, pale accent `#eeeaff`.
- Hero background: bright white to pale blue-green gradient.
- Radii: mostly 6px for controls/tags, 8px for project cards, 50% for the portrait.
- Shadows: restrained; project-card hover uses a low-opacity soft shadow.
- Breakpoints: 1024px global typography; 900px projects; 768px header/Hero/content sections; 600px cards/contact/footer; 480px compact header.
- Motion: 0.2s hover transitions; circular profile text rotates linearly over 25 seconds.
- Layout: centered root capped at 1126px; header inner width capped at 1200px; section content generally capped between 700px and 1000px.

## Raw `frontend/src/index.css`

```css
:root {
  --text: #6b6375;
  --text-h: #08060d;
  --bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #aa3bff;
  --accent-bg: rgba(170, 59, 255, 0.1);
  --accent-border: rgba(170, 59, 255, 0.5);
  --social-bg: rgba(244, 243, 236, 0.5);
  --shadow:
    rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;

  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
  --heading: system-ui, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);
  letter-spacing: 0.18px;
  color-scheme: light dark;
  color: var(--text);
  background: var(--bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 1024px) {
    font-size: 16px;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #9ca3af;
    --text-h: #f3f4f6;
    --bg: #16171d;
    --border: #2e303a;
    --code-bg: #1f2028;
    --accent: #c084fc;
    --accent-bg: rgba(192, 132, 252, 0.15);
    --accent-border: rgba(192, 132, 252, 0.5);
    --social-bg: rgba(47, 48, 58, 0.5);
    --shadow:
      rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
  }

  #social .button-icon {
    filter: invert(1) brightness(2);
  }
}

body {
  margin: 0;
}

#root {
  width: 1126px;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  border-inline: 1px solid var(--border);
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

h1,
h2 {
  font-family: var(--heading);
  font-weight: 500;
  color: var(--text-h);
}

h1 {
  font-size: 56px;
  letter-spacing: -1.68px;
  margin: 32px 0;
  @media (max-width: 1024px) {
    font-size: 36px;
    margin: 20px 0;
  }
}
h2 {
  font-size: 24px;
  line-height: 118%;
  letter-spacing: -0.24px;
  margin: 0 0 8px;
  @media (max-width: 1024px) {
    font-size: 20px;
  }
}
p {
  margin: 0;
}

code,
.counter {
  font-family: var(--mono);
  display: inline-flex;
  border-radius: 4px;
  color: var(--text-h);
}

code {
  font-size: 15px;
  line-height: 135%;
  padding: 4px 8px;
  background: var(--code-bg);
}

```

## Raw `frontend/src/App.css`

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px clamp(20px, 4vw, 48px);
  box-sizing: border-box;
}

.site-brand {
  flex-shrink: 0;
  color: #17212b;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
}

.site-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(16px, 2.5vw, 32px);
  min-width: 0;
}

.site-nav a {
  color: #374151;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-nav a:hover {
  color: #5b3fd1;
}

.site-brand:focus-visible,
.site-nav a:focus-visible {
  outline: 2px solid #5b3fd1;
  outline-offset: 4px;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 20px;
  }

  .site-nav {
    flex-wrap: wrap;
    justify-content: flex-start;
    column-gap: 20px;
    row-gap: 10px;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 12px 16px;
  }

  .site-nav {
    column-gap: 16px;
  }
}

.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}

.profile-circle {
  position: relative;
  order: 3;
  grid-column: 1 / -1;
  justify-self: center;
  width: min(320px, 100%);
  height: auto;
  margin: clamp(48px, 8vw, 80px) auto 32px;
  aspect-ratio: 1;
}

.profile-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 65.625%;
  height: 65.625%;
  transform: translate(-50%, -50%);
  border: 4px solid white;
  border-radius: 50%;
  overflow: hidden;
  box-sizing: border-box;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circle-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  fill: #222;
  font-weight: bold;
  letter-spacing: 1.5px;
  transform-origin: center;
  animation: rotateCircleText 25s linear infinite;
}

@keyframes rotateCircleText {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

#home {
  --hero-accent: #5b3fd1;
  --hero-accent-soft: #eeeaff;

  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  column-gap: 12px;
  width: 100%;
  max-width: 100%;
  padding: clamp(64px, 10vw, 112px) clamp(16px, 5vw, 64px) 80px;
  color: #4b5563;
  background: linear-gradient(135deg, #ffffff 0%, #f7faf9 55%, #edf7f5 100%);
  box-sizing: border-box;
  overflow-x: hidden;
}

#home > p:first-child {
  order: 1;
  grid-column: 1 / -1;
  margin: 0 0 8px;
  color: #374151;
  font-size: 1rem;
  text-align: left;
}

#home > h1 {
  order: 2;
  grid-column: 1 / -1;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  margin: 0;
  color: #17212b;
  font-size: clamp(3rem, 9vw, 7.5rem);
  font-weight: 900;
  line-height: 0.9;
  text-align: left;
  text-transform: uppercase;
}

#home > h2 {
  order: 4;
  grid-column: 1 / -1;
  margin: 0 0 16px;
  color: #17212b;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  text-align: center;
}

#home > p:not(:first-child) {
  order: 5;
  grid-column: 1 / -1;
  width: 100%;
  max-width: 700px;
  margin: 0 auto 28px;
  color: #5f6b76;
  text-align: center;
  box-sizing: border-box;
}

#home > a {
  order: 6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border: 2px solid var(--hero-accent);
  border-radius: 6px;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

#home > a:first-of-type {
  justify-self: end;
  color: white;
  background-color: var(--hero-accent);
}

#home > a:first-of-type:hover {
  filter: brightness(0.9);
  transform: translateY(-2px);
}

#home > a:last-of-type {
  justify-self: start;
  color: var(--hero-accent);
  background-color: transparent;
}

#home > a:last-of-type:hover {
  background-color: var(--hero-accent-soft);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  #home {
    grid-template-columns: 1fr;
    padding: clamp(48px, 8vw, 64px) clamp(16px, 4vw, 24px) 64px;
  }

  #home > h1 {
    font-size: clamp(2.75rem, 10vw, 4.5rem);
    line-height: 0.92;
  }

  .profile-circle {
    width: min(280px, 100%);
    margin: 48px auto 28px;
  }

  .circle-text {
    letter-spacing: 1.25px;
  }

  #home > a {
    grid-column: 1;
    justify-self: center;
    width: 100%;
    max-width: 280px;
    box-sizing: border-box;
  }

  #home > a + a {
    margin-top: 12px;
  }
}

#about {
  padding: clamp(64px, 9vw, 96px) clamp(20px, 5vw, 64px);
  text-align: center;
}

#about h2 {
  margin: 0 0 20px;
  color: #17212b;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

#about p {
  max-width: 700px;
  margin: 0 auto;
  color: #5f6b76;
  line-height: 1.7;
}

@media (max-width: 768px) {
  #about {
    padding: 56px 20px;
  }

  #about h2 {
    margin-bottom: 16px;
  }
}

#skills {
  padding: clamp(64px, 9vw, 96px) clamp(20px, 5vw, 64px);
  text-align: center;
}

#skills h2 {
  margin: 0 0 28px;
  color: #17212b;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

#skills ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

#skills li {
  padding: 10px 16px;
  color: #374151;
  background-color: #f7faf9;
  border: 1px solid #dce7e4;
  border-radius: 6px;
}

@media (max-width: 768px) {
  #skills {
    padding: 56px 20px;
  }

  #skills h2 {
    margin-bottom: 24px;
  }

  #skills ul {
    gap: 10px;
  }
}

#investment {
  padding: clamp(64px, 9vw, 96px) clamp(20px, 5vw, 64px);
  text-align: center;
}

#investment h2 {
  margin: 0 0 28px;
  color: #17212b;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

#investment ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

#investment li {
  padding: 10px 16px;
  color: #374151;
  background-color: #f7faf9;
  border: 1px solid #dce7e4;
  border-radius: 6px;
}

@media (max-width: 768px) {
  #investment {
    padding: 56px 20px;
  }

  #investment h2 {
    margin-bottom: 24px;
  }

  #investment ul {
    gap: 10px;
  }
}

#projects {
  padding: clamp(64px, 9vw, 96px) clamp(20px, 5vw, 64px);
  text-align: center;
}

#projects > h2 {
  margin: 0 0 32px;
  color: #17212b;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.project-card {
  padding: 24px;
  text-align: left;
  background-color: #f7faf9;
  border: 1px solid #dce7e4;
  border-radius: 8px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.project-card:hover {
  box-shadow: 0 10px 24px rgba(23, 33, 43, 0.08);
  transform: translateY(-4px);
}

.project-card h3 {
  margin: 8px 0 12px;
  color: #17212b;
  font-size: 1.25rem;
  line-height: 1.3;
}

.project-category {
  margin: 0;
  color: #5b3fd1;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.project-card p:not(.project-category) {
  margin: 0;
  color: #5f6b76;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .projects-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  #projects {
    padding: 56px 20px;
  }

  #projects > h2 {
    margin-bottom: 24px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}

#insights {
  padding: clamp(64px, 9vw, 96px) clamp(20px, 5vw, 64px);
  text-align: center;
}

#insights h2 {
  margin: 0 0 20px;
  color: #17212b;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

#insights > p {
  max-width: 700px;
  margin: 0 auto 28px;
  color: #5f6b76;
  line-height: 1.7;
}

.insights-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

.insight-item {
  padding: 10px 16px;
  color: #374151;
  background-color: #f7faf9;
  border: 1px solid #dce7e4;
  border-radius: 6px;
}

@media (max-width: 768px) {
  #insights {
    padding: 56px 20px;
  }

  #insights h2 {
    margin-bottom: 16px;
  }

  #insights > p {
    margin-bottom: 24px;
  }

  .insights-list {
    gap: 10px;
  }
}

#contact {
  padding: clamp(64px, 9vw, 96px) clamp(20px, 5vw, 64px);
  text-align: center;
}

#contact h2 {
  margin: 0 0 20px;
  color: #17212b;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

#contact > p {
  max-width: 700px;
  margin: 0 auto 28px;
  color: #5f6b76;
  line-height: 1.7;
}

.contact-list {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.contact-link {
  display: inline-block;
  padding: 10px 16px;
  color: #5b3fd1;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid #d8cff7;
  border-radius: 6px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.contact-link:hover {
  background-color: #eeeaff;
  transform: translateY(-2px);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 28px;
  text-align: left;
}

.contact-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #374151;
  font-weight: 700;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 12px;
  color: #17212b;
  font: inherit;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
}

.contact-form textarea {
  min-height: 140px;
  resize: vertical;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: #5b3fd1;
  outline: 2px solid #eeeaff;
}

.contact-form button {
  align-self: flex-start;
  padding: 12px 20px;
  color: white;
  font: inherit;
  font-weight: 700;
  background-color: #5b3fd1;
  border: 2px solid #5b3fd1;
  border-radius: 6px;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.2s ease;
}

.contact-form button:hover {
  filter: brightness(0.9);
  transform: translateY(-2px);
}

.contact-status {
  margin: 0 0 24px;
  color: #374151;
  font-weight: 700;
}

@media (max-width: 600px) {
  #contact {
    padding: 56px 20px;
  }

  #contact h2 {
    margin-bottom: 16px;
  }

  #contact > p {
    margin-bottom: 24px;
  }

  .contact-list {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .contact-link {
    min-width: 160px;
    box-sizing: border-box;
  }

  .contact-form button {
    align-self: stretch;
  }
}

.site-footer {
  padding: 28px 20px;
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}

.site-footer p {
  margin: 0;
}

.site-footer p + p {
  margin-top: 6px;
}

@media (max-width: 600px) {
  .site-footer {
    padding: 24px 16px;
  }
}

```

