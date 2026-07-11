import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginAdmin } from '../../api/client'
import { clearToken, getToken, setToken } from './authStorage'
import styles from './Admin.module.css'

export function AdminLogin() {
  const navigate = useNavigate()
  const existing = getToken()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (existing) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const token = await loginAdmin(username.trim(), password)
      setToken(token)
      navigate('/admin', { replace: true })
    } catch (err) {
      clearToken()
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.shell}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1>Admin login</h1>
        <p className={styles.lead}>Sign in to edit portfolio content.</p>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
