# Extractable Components

## SiteHeader

- Source: `frontend/src/App.jsx`
- Category: layout
- Description: Sticky personal-brand header with six anchor navigation links.
- Extractable props: activeItem (string, default: "home")
- Hardcoded: HIREN VISODIYA brand text, navigation labels, anchor URLs, CSS classes

## SiteFooter

- Source: `frontend/src/App.jsx`
- Category: layout
- Description: Minimal centered copyright and professional-title footer.
- Extractable props: none
- Hardcoded: Footer copy and CSS classes

## HeroSection

- Source: `frontend/src/App.jsx`
- Category: layout
- Description: Profile Hero with greeting, large name, rotating circular portrait text, title, introduction, and two action links.
- Extractable props: none
- Hardcoded: Hero copy, profile image URL, SVG circle path and text, action labels and URLs

## ProjectCard

- Source: `frontend/src/App.jsx`
- Category: basic
- Description: API-driven project card with category, title, and description.
- Extractable props: none
- Hardcoded: CSS class structure; visible content is supplied by mapped project data

## ContactForm

- Source: `frontend/src/App.jsx`
- Category: basic
- Description: Controlled Name, Email, and Message form posting JSON to the Express backend.
- Extractable props: none
- Hardcoded: Field labels, input types, submit label, and CSS classes

