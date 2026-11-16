import { checkAdminAuth, getAdminProjects } from './actions'
import AdminPanel from './AdminPanel'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Panel // DAI_OS',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminPage() {
  const isAuth = await checkAdminAuth()
  const initialProjects = isAuth ? await getAdminProjects() : []

  return (
    <AdminPanel
      initialAuth={isAuth}
      initialProjects={initialProjects}
    />
  )
}

