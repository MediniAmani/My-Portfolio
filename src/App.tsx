import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ContentProvider } from './context/ContentContext'
import { EditorProvider } from './context/EditorContext'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { Work } from './pages/Work'
import { WorkDetail } from './pages/WorkDetail'
import { AdminLogin } from './pages/admin/AdminLogin'
import { EditorShell, RequireAuth } from './pages/admin/EditorShell'

function PublicTree() {
  return (
    <ContentProvider>
      <Layout />
    </ContentProvider>
  )
}

function EditorTree() {
  return (
    <RequireAuth>
      <ContentProvider>
        <EditorProvider>
          <EditorShell />
        </EditorProvider>
      </ContentProvider>
    </RequireAuth>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<EditorTree />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="work" element={<Work />} />
            <Route path="work/:slug" element={<WorkDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

        <Route element={<PublicTree />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="work/:slug" element={<WorkDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="fr/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
