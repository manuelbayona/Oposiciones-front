import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { NotFoundPage } from './NotFoundPage'
import { HomePage } from '../features/convocations/pages/HomePage'
import { CandidatesExplorerPage } from '../features/candidates/pages/CandidatesExplorerPage'
import { CandidateDetailPage } from '../features/candidates/pages/CandidateDetailPage'
import { InterinosListPage } from '../features/interinos/pages/InterinosListPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'convocations/:convocationYear', element: <CandidatesExplorerPage /> },
      {
        path: 'convocations/:convocationYear/specialities/:specialty',
        element: <CandidatesExplorerPage />,
      },
      {
        path: 'convocations/:convocationYear/specialities/:specialty/tribunals/:tribunalNumber',
        element: <CandidatesExplorerPage />,
      },
      { path: 'interinos', element: <InterinosListPage /> },
      { path: 'candidates/:id', element: <CandidateDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
