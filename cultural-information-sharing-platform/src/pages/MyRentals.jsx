import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"
import { API_URL, getStoredUser } from "../config"

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  returned: "bg-gray-100 text-gray-700 border-gray-200",
}

function MyRentals() {
  const user = getStoredUser()

  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(Boolean(user?.id))
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user?.id) return

    const loadRentals = async () => {
      try {
        const response = await fetch(`${API_URL}/rentals/user/${user.id}`)

        if (!response.ok) throw new Error("Failed to load your rentals.")

        setRentals(await response.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadRentals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-8 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
          Traditional Attire
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          My Rentals
        </h1>

        {!user && (
          <p className="mt-6 text-gray-600">
            Please{" "}
            <Link to="/login" className="font-semibold text-green-700">
              log in
            </Link>{" "}
            to see your rental requests.
          </p>
        )}

        {loading && <p className="mt-6 text-gray-500">Loading...</p>}

        {error && <p className="mt-6 text-red-600">{error}</p>}

        {user && !loading && !error && rentals.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-white p-10 text-center">
            <p className="font-semibold text-gray-900">
              You have no rental requests yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Open a Traditional Attire item in Explore to request a rental.
            </p>
            <Link
              to="/explore"
              className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
            >
              Explore attire
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {rental.cultural_title}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {rental.start_date} to {rental.end_date}
                  </p>
                  {rental.note && (
                    <p className="mt-1 text-sm text-gray-500">
                      Note: {rental.note}
                    </p>
                  )}
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                    statusStyles[rental.status] || statusStyles.pending
                  }`}
                >
                  {rental.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default MyRentals
