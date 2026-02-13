import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// mock redirect
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

// mock supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getClaims: jest.fn().mockResolvedValue({
        data: { claims: { sub: '123' } },
        error: null,
      }),
    },
  })),
}))

describe('Home', () => {
  it('renders dashboard when user is authenticated', async () => {
    const Page = await Home() // because async component

    render(Page)

    expect(
      screen.getByRole('heading', { name: /dashboard/i })
    ).toBeInTheDocument()
  })
})
