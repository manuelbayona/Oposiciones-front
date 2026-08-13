import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { queryClient } from './queryClient'

describe('queryClient', () => {
  it('is a configured QueryClient instance', () => {
    expect(queryClient).toBeInstanceOf(QueryClient)
  })

  it('disables refetch on window focus so background list refreshes do not surprise the user', () => {
    expect(queryClient.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(false)
  })
})
