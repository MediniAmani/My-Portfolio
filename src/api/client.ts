const API_URL = import.meta.env.VITE_API_URL

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024
const MAX_EDGE_PX = 2400
const TARGET_MIME_JPEG = 'image/jpeg'
const JPEG_QUALITY = 0.85

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

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image file'))
    }
    image.src = url
  })
}

/**
 * Downscale oversized images in the browser before upload.
 * SVG and GIF are left unchanged (GIF animation must be preserved).
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('File too large (max 50MB)')
  }

  const type = file.type.toLowerCase()
  if (type === 'image/svg+xml' || type === 'image/gif') {
    return file
  }
  if (!type.startsWith('image/')) {
    throw new Error(`Unsupported content type: ${type || '(none)'}`)
  }

  const image = await loadImageElement(file)
  const longest = Math.max(image.naturalWidth, image.naturalHeight)
  const needsResize = longest > MAX_EDGE_PX
  const needsReencode = file.size > 2 * 1024 * 1024 || needsResize
  if (!needsReencode) {
    return file
  }

  const scale = needsResize ? MAX_EDGE_PX / longest : 1
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not prepare image canvas')
  }
  ctx.drawImage(image, 0, 0, width, height)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error('Could not compress image'))
          return
        }
        resolve(result)
      },
      TARGET_MIME_JPEG,
      JPEG_QUALITY,
    )
  })

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'upload'
  return new File([blob], `${baseName}.jpg`, { type: TARGET_MIME_JPEG })
}

export async function uploadImage(token: string, file: File): Promise<string> {
  const prepared = await prepareImageForUpload(file)
  const body = new FormData()
  body.append('file', prepared)
  const response = await fetch(apiUrl('/api/upload'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
  if (!response.ok) {
    let detail = `Upload failed (${response.status})`
    const errBody: unknown = await response.json().catch(() => null)
    if (
      errBody &&
      typeof errBody === 'object' &&
      'detail' in errBody &&
      typeof (errBody as { detail: unknown }).detail === 'string'
    ) {
      detail = (errBody as { detail: string }).detail
    }
    throw new Error(detail)
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
