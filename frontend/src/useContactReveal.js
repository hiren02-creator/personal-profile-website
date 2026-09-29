import { useLayoutEffect } from 'react'

// Match the site's IntersectionObserver + Web Animations reveal system.
export function useContactReveal(sectionRef) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!section || preference.matches || !window.IntersectionObserver || !Element.prototype.animate) return

    const selectors = [
      '.contact-heading h2',
      '.contact-heading > p:last-child',
      '.contact-form',
      '.contact-email',
      '.contact-linkedin',
      '.contact-github',
      '.contact-availability',
    ]
    const records = selectors.map((selector) => ({
      element: section.querySelector(selector),
      visible: false, revealed: false, timer: null, animation: null,
    })).filter((record) => record.element)
    const distance = window.matchMedia('(max-width: 700px)').matches ? '6px' : '10px'
    let nextStart = 0
    let stopped = false

    function finish(record) {
      window.clearTimeout(record.timer)
      record.timer = null
      record.animation?.cancel()
      record.animation = null
      record.revealed = true
      record.element.classList.remove('contact-reveal-pending')
      observer.unobserve(record.element)
    }

    const observer = new IntersectionObserver((entries) => {
      if (stopped) return
      entries.forEach(({ target, isIntersecting }) => {
        const record = records.find((item) => item.element === target)
        record.visible = isIntersecting
        if (!isIntersecting) {
          window.clearTimeout(record.timer)
          record.timer = null
        }
      })
      // Sequence visible targets in the requested order; mobile content need
      // not wait for cards that have not entered the viewport yet.
      const now = performance.now()
      records.forEach((record) => {
        if (!record.visible || record.revealed || record.timer !== null) return
        const start = Math.max(now, Math.min(nextStart, now + 420))
        nextStart = start + 70
        record.timer = window.setTimeout(() => {
          record.timer = null
          if (stopped || !record.visible) return
          record.revealed = true
          observer.unobserve(record.element)
          record.element.classList.remove('contact-reveal-pending')
          // Individual translate leaves the existing hover transforms intact.
          record.animation = record.element.animate([
            { opacity: 0, translate: '0 ' + distance },
            { opacity: 1, translate: '0 0' },
          ], { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })
          record.animation.onfinish = () => { record.animation = null }
        }, start - now)
      })
    }, { threshold: 0, rootMargin: '0px 0px -12px 0px' })

    function revealAll() {
      stopped = true
      records.forEach(finish)
      observer.disconnect()
    }
    function onPreferenceChange(event) {
      if (event.matches) revealAll()
    }
    function onInteraction(event) {
      // Never leave a focused field/card hidden or moving under the pointer.
      const index = records.findIndex(({ element }) => element.contains(event.target))
      if (index >= 0) records.slice(0, index + 1).forEach(finish)
    }

    records.forEach(({ element }) => {
      element.classList.add('contact-reveal-pending')
      observer.observe(element)
    })
    preference.addEventListener('change', onPreferenceChange)
    section.addEventListener('focusin', onInteraction, true)
    section.addEventListener('pointerdown', onInteraction, true)
    return () => {
      revealAll()
      preference.removeEventListener('change', onPreferenceChange)
      section.removeEventListener('focusin', onInteraction, true)
      section.removeEventListener('pointerdown', onInteraction, true)
    }
  }, [sectionRef])
}