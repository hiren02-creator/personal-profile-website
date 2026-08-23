# Personal Profile Website Design System

## Product context

A single-page professional portfolio for Hiren Visodiya, presenting AI development experience, investment interests, featured projects, API-backed profile data, and contact options. The current task is a focused refinement of the existing Hero only; the sticky header and all downstream sections must remain visually and structurally unchanged.

## Visual direction

- Bright, minimal, premium personal portfolio.
- Use a restrained white, off-white, and pale blue-green background palette.
- Use dark slate for headings and muted slate for supporting copy.
- Preserve the current system sans-serif typography and restrained violet accent.
- Avoid saturated colors, heavy shadows, glass effects, decorative clutter, and excessive borders.
- Keep the circular portrait and rotating text as the Hero's primary visual signature.

## Hero composition

- A centered inner container capped near 1200px.
- Greeting directly above an oversized, uppercase, heavy-weight name aligned to the upper-left.
- Generous controlled spacing before a horizontally centered circular portrait treatment.
- Professional title, readable introduction, and action buttons centered beneath the portrait.
- Paragraph measure capped near 680–700px.
- Desktop actions sit side by side; mobile actions stack.
- The Hero should remain one cohesive vertical composition with no heading/portrait overlap.

## Responsive behavior

- Desktop: spacious composition and prominent name.
- Tablet: reduced responsive name scale and outer-circle size.
- Mobile: reduced section padding, centered portrait, proportionally reduced image, stacked actions, and no horizontal overflow.
- Only the SVG circular text rotates; the portrait remains stationary.
- Circular lettering must remain legible and contained at every supported width.

## Tokens

- Font family: system-ui, Segoe UI, Roboto, sans-serif.
- Heading: `#17212b`.
- Supporting text: `#5f6b76`.
- Accent: restrained violet `#5b3fd1`.
- Accent tint: `#eeeaff`.
- Background: white/off-white/pale blue-green gradient.
- Control radius: 6px.
- Motion: 0.2s hover transitions; existing 25s linear infinite circular-text rotation.
- Shadow: none by default; avoid introducing large shadows.

## Invariants

- Preserve every requested Hero content item and the existing profile image.
- Preserve header/navigation, API behavior, About, Skills, Investment, Projects, Insights, Contact, and footer.
- Do not introduce new fonts, bright gradients, icons, or unrelated visual motifs.


