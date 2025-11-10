// ✅ Generic API client for Next.js frontend
// Handles base URL, headers, JSON body parsing, and error handling.

export interface FetchOptions extends RequestInit {
  body?: any
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Generic fetch wrapper
export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : ""

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body:
      options.body && typeof options.body === "object"
        ? JSON.stringify(options.body)
        : options.body,
  })

  if (!response.ok) {
    let message = "API request failed"
    try {
      const errorData = await response.json()
      message = errorData.message || message
    } catch {
      // fallback to status text
      message = response.statusText || message
    }
    throw new Error(`${response.status}: ${message}`)
  }

  try {
    return (await response.json()) as T
  } catch {
    return {} as T
  }
}
