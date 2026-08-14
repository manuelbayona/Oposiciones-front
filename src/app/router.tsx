import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { NotFoundPage } from './NotFoundPage'
import { HomePage } from '../features/convocations/pages/HomePage'
import { CandidatesExplorerPage } from '../features/candidates/pages/CandidatesExplorerPage'
import { CandidateDetailPage } from '../features/candidates/pages/CandidateDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'convocations/:convocationId', element: <CandidatesExplorerPage /> },
      {
        path: 'convocations/:convocationId/specialities/:specialityId',
        element: <CandidatesExplorerPage />,
      },
      {
        path: 'convocations/:convocationId/specialities/:specialityId/tribunals/:tribunalId',
        element: <CandidatesExplorerPage />,
      },
      { path: 'candidates/:candidateId', element: <CandidateDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
