import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IntroSection } from './IntroSection'

describe('IntroSection', () => {
  it('explains what OpoData organizes for the visitor', () => {
    render(<IntroSection />)

    expect(
      screen.getByText(/hace difícil tener una visión completa del proceso/),
    ).toBeInTheDocument()
    expect(
      screen.getByText('OpoData organiza toda esa información para que puedas consultarla de forma sencilla.'),
    ).toBeInTheDocument()
  })
})
