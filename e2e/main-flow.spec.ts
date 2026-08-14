import { expect, test, type Page } from '@playwright/test'

const convocations = [
  { id: 'c2026', name: '2026 - Maestros', year: 2026 },
  { id: 'c2024', name: '2024 - Maestros', year: 2024 },
]
const specialities = [{ id: 's-infantil', name: 'Educación Infantil' }]
const tribunals = [{ id: 't4', name: 'Tribunal 4' }]
const columns = [
  { key: 'oppositionScore', label: 'Nota oposición', sortable: true },
  { key: 'finalScore', label: 'Nota final', sortable: true },
]

function candidateSummary(id: string, position: number, fullName: string, finalScore: number) {
  return {
    id,
    position,
    fullName,
    status: 'EVALUATED',
    scores: { oppositionScore: finalScore - 0.5, finalScore },
    hasPosition: position <= 2,
  }
}

const candidates = [
  candidateSummary('cand-1', 1, 'García López, María', 8.9),
  candidateSummary('cand-2', 2, 'Martínez Ruiz, Ana', 8.65),
  candidateSummary('cand-3', 3, 'Sánchez Pérez, Laura', 8.32),
]

async function mockBackend(page: Page) {
  await page.route('**/api/v1/**', async (route) => {
    const url = new URL(route.request().url())
    const path = url.pathname

    if (path === '/api/v1/convocations') {
      return route.fulfill({ json: convocations })
    }
    if (path.endsWith('/specialities')) {
      return route.fulfill({ json: specialities })
    }
    if (path.endsWith('/tribunals')) {
      return route.fulfill({ json: tribunals })
    }
    if (path === '/api/v1/candidates') {
      const search = url.searchParams.get('search')?.toLowerCase()
      const sort = url.searchParams.get('sort')
      let items = search
        ? candidates.filter((c) => c.fullName.toLowerCase().includes(search))
        : candidates
      if (sort === 'finalScore,asc') {
        items = [...items].sort((a, b) => a.scores.finalScore - b.scores.finalScore)
      }
      return route.fulfill({
        json: { columns, items, totalCount: items.length, page: 0, pageSize: 50, totalPages: 1 },
      })
    }
    const candidateMatch = path.match(/\/candidates\/(.+)$/)
    if (candidateMatch) {
      const candidate = candidates.find((c) => c.id === candidateMatch[1])
      if (!candidate) {
        return route.fulfill({ status: 404, json: { message: 'not found' } })
      }
      return route.fulfill({
        json: {
          id: candidate.id,
          fullName: candidate.fullName,
          convocation: { id: 'c2026', name: '2026 - Maestros' },
          speciality: { id: 's-infantil', name: 'Educación Infantil' },
          tribunal: { id: 't4', name: 'Tribunal 4' },
          status: 'EVALUATED',
          scoreSections: [
            {
              key: 'first',
              label: 'Primera prueba',
              items: [{ key: 'partA', label: 'Parte A', value: 8.7 }],
              total: { key: 'firstTotal', label: 'Nota primera prueba', value: 8.9 },
            },
          ],
          merits: [{ key: 'experience', label: 'Experiencia docente', value: 4.5 }],
          meritsTotal: 7.2,
          result: {
            oppositionScore: candidate.scores.oppositionScore,
            meritsScore: 7.2,
            finalScore: candidate.scores.finalScore,
            position: candidate.position,
            hasPosition: candidate.hasPosition,
          },
          source: null,
        },
      })
    }
    return route.fulfill({ status: 404, json: { message: 'not found' } })
  })
}

test('user can browse from convocation selection down to a candidate detail', async ({ page }) => {
  await mockBackend(page)

  await page.goto('/')

  // Home redirects to the latest convocation and prompts for the rest of the selection.
  await expect(page).toHaveURL(/\/convocations\/c2026$/)
  await expect(page.getByText('Selecciona una especialidad para continuar.')).toBeVisible()

  await page.selectOption('#speciality-selector', 's-infantil')
  await page.selectOption('#tribunal-selector', 't4')
  await expect(page).toHaveURL(/\/tribunals\/t4$/)

  // Candidate list is visible with the expected count.
  await expect(page.getByText('3 aspirantes')).toBeVisible()
  await expect(page.getByText('García López, María')).toBeVisible()

  // Sorting by a column reorders the table and reflects in the URL.
  await page.getByRole('button', { name: /Nota final/ }).click()
  await expect(page).toHaveURL(/sort=finalScore%2Casc/)
  await expect(page.locator('tbody tr').first()).toContainText('Sánchez Pérez, Laura')

  // Searching filters the list.
  await page.fill('#candidate-search', 'García')
  await expect(page.getByText('1 aspirante')).toBeVisible()
  await expect(page.getByText('Martínez Ruiz, Ana')).not.toBeVisible()

  // Clearing the search and opening a candidate shows its full detail.
  await page.fill('#candidate-search', '')
  await expect(page.getByText('3 aspirantes')).toBeVisible()
  await page.getByLabel('Ver detalle de García López, María').click()

  await expect(page).toHaveURL(/\/candidates\/cand-1/)
  await expect(page.getByRole('heading', { name: 'García López, María' })).toBeVisible()
  await expect(page.getByText('Nota primera prueba')).toBeVisible()
  await expect(page.getByText('Total méritos')).toBeVisible()

  // Back navigation returns to the list, preserving the tribunal context.
  await page.getByText(/← Volver a Tribunal 4/).click()
  await expect(page).toHaveURL(/\/tribunals\/t4/)
  await expect(page.getByText('García López, María')).toBeVisible()
})
