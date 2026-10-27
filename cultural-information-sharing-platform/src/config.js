// Shared API settings and helpers.
// Set VITE_API_URL in a .env file to point to a different backend.
export const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

// Turns a stored image value into something an <img> can load.
//   "https://..."          -> used as it is
//   "/media/cultural/x.jpg" -> served by FastAPI
//   "x.jpg" (old style)     -> served from /media/cultural
export function resolveImage(image) {
  if (!image) return null
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image
  }
  if (image.startsWith("/")) return `${API_URL}${image}`
  return `${API_URL}/media/cultural/${image}`
}

// Login token returned by /auth/login (null when logged out).
export function getToken() {
  return localStorage.getItem("token")
}

// Removes the saved login (used by every Logout button).
export function clearLogin() {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
}

// Logged-in user saved by Login.jsx (null when logged out).
// A user saved without a token (an old session from before login tokens
// were added) counts as logged out.
export function getStoredUser() {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || null

    if (user && !getToken()) return null

    return user
  } catch {
    return null
  }
}

// Makes every fetch() call to the backend send the login token, so the
// pages do not have to add it themselves. If the backend answers 401
// (token missing or expired) the saved login is cleared and the visitor is
// sent to the Login page.
export function installAuthFetch() {
  if (window.__authFetchInstalled) return
  window.__authFetchInstalled = true

  const originalFetch = window.fetch.bind(window)

  const isBackendUrl = (url) =>
    url.startsWith(API_URL) ||
    url.startsWith("http://127.0.0.1:8000") ||
    url.startsWith("http://localhost:8000")

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url
    const backend = isBackendUrl(url)
    const token = getToken()

    if (backend && token) {
      const headers = new Headers(
        init.headers || (typeof input === "string" ? undefined : input.headers)
      )

      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`)
      }

      init = { ...init, headers }
    }

    const response = await originalFetch(input, init)

    const isLoginRequest =
      url.includes("/auth/login") || url.includes("/auth/register")

    if (backend && response.status === 401 && !isLoginRequest) {
      clearLogin()

      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    return response
  }
}
