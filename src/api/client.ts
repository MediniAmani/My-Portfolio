const API_URL = import.meta.env.VITE_API_URL

export function apiUrl(path: string): string {
  if (!API_URL) {
    throw new Error('VITE_API_URL is not set')
  }
  return `${API_URL.replace(/\/$/, '')}${path}`
}

/** Resolve content image paths: uploaded files live on the API host. */
export function resolveMediaUrl(url: string): string {
  if (!url) return url
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url
  }
  if (url.startsWith('/uploads/')) {
    return apiUrl(url)
  }
  return url
}

export async function uploadImage(token: string, file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const response = await fetch(apiUrl('/api/upload'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
  if (!response.ok) {
    throw new Error(`Upload failed (${response.status})`)
  }
  const data = (await response.json()) as { url: string }
  if (!data.url) {
    throw new Error('Upload response missing url')
  }
  return data.url
}

export async function fetchContent(): Promise<unknown> {
  const response = await fetch(apiUrl('/api/content'))
  if (!response.ok) {
    throw new Error(`Failed to load content (${response.status})`)
  }
  return response.json()
}

export async function loginAdmin(username: string, password: string): Promise<string> {
  const response = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    throw new Error('Invalid credentials')
  }
  const data = (await response.json()) as { access_token: string }
  return data.access_token
}

export async function saveContent(token: string, payload: unknown): Promise<unknown> {
  const response = await fetch(apiUrl('/api/content'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ payload }),
  })
  if (!response.ok) {
    throw new Error(`Failed to save content (${response.status})`)
  }
  return response.json()
}
