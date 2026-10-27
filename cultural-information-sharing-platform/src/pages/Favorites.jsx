import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"
import { API_URL, resolveImage, getStoredUser } from "../config"

function Favorites() {
  const user = getStoredUser()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(Boolean(user?.id))
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user?.id) return

    const loadFavorites = async () => {
      try {
        const response = await fetch(`${API_URL}/favorites/user/${user.id}`)

        if (!response.ok) throw new Error("Failed to load your favorites.")

        setItems(await response.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeFavorite = async (itemId) => {
    try {
      const response = await fetch(
        `${API_URL}/favorites/${user.id}/${itemId}`,
        { method: "DELETE" }
      )

      if (!response.ok) throw new Error("Failed to remove the favorite.")

      setItems((current) => current.filter((item) => item.id !== itemId))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-8 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
          Saved
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          My Favorites
        </h1>

        {!user && (
          <p className="mt-6 text-gray-600">
            Please{" "}
            <Link to="/login" className="font-semibold text-green-700">
              log in
            </Link>{" "}
            to see your favorites.
          </p>
        )}

        {loading && <p className="mt-6 text-gray-500">Loading...</p>}

        {error && <p className="mt-6 text-red-600">{error}</p>}

        {user && !loading && !error && items.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-white p-10 text-center">
            <p className="font-semibold text-gray-900">
              You have not saved anything yet
            </p>
            <Link
              to="/explore"
              className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
            >
              Explore culture
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <div className="h-48 bg-gray-100">
                {item.image ? (
                  <img
                    src={resolveImage(item.image)}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No image available
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                  {item.category}
                </p>

                <h2 className="mt-2 text-lg font-bold text-gray-900">
                  {item.title}
                </h2>

                {item.community && (
                  <p className="mt-1 text-xs text-gray-500">
                    Community: {item.community}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to={`/explore/${item.slug}`}
                    className="text-sm font-semibold text-green-700 hover:text-green-900"
                  >
                    View Details →
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeFavorite(item.id)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Favorites
