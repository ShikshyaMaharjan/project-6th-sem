import { useEffect, useState } from "react"

import { API_URL } from "../config"

// =========================================================
// ADMIN - FAVORITES (most saved cultural items)
// =========================================================

export function AdminFavorites() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`${API_URL}/favorites/stats`)

        if (!response.ok) throw new Error("Failed to load favorites.")

        setStats(await response.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <p className="text-sm text-gray-500">Loading favorites...</p>
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  if (stats.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-3xl text-gray-300">♡</p>
        <p className="mt-3 font-semibold text-gray-800">No favorites yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Items appear here once users start saving them.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-5 py-3">Cultural item</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3 text-right">Saved by</th>
          </tr>
        </thead>

        <tbody>
          {stats.map((row) => (
            <tr key={row.cultural_id} className="border-t border-gray-100">
              <td className="px-5 py-3 font-medium text-gray-900">
                {row.title}
              </td>
              <td className="px-5 py-3 text-gray-600">{row.category}</td>
              <td className="px-5 py-3 text-right font-semibold text-green-700">
                {row.saves} {row.saves === 1 ? "user" : "users"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// =========================================================
// ADMIN - TRADITIONAL ATTIRE RENTALS
// =========================================================

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  returned: "bg-gray-100 text-gray-700 border-gray-200",
}

export function AdminRentals() {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    const loadRentals = async () => {
      try {
        const response = await fetch(`${API_URL}/rentals/`)

        if (!response.ok) throw new Error("Failed to load rentals.")

        setRentals(await response.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadRentals()
  }, [])

  const changeStatus = async (rentalId, action) => {
    setBusyId(rentalId)

    try {
      const response = await fetch(`${API_URL}/rentals/${rentalId}/${action}`, {
        method: "PUT",
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to update the rental.")
      }

      setRentals((current) =>
        current.map((rental) => (rental.id === data.id ? data : rental))
      )
    } catch (err) {
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading rentals...</p>
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  if (rentals.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <p className="font-semibold text-gray-800">No rental requests yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Requests made from Traditional Attire pages will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {rentals.map((rental) => (
        <div
          key={rental.id}
          className="rounded-2xl border border-gray-200 bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-900">
                {rental.cultural_title}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {rental.start_date} to {rental.end_date}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {rental.user_name} · {rental.phone}
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

          <div className="mt-4 flex flex-wrap gap-2">
            {rental.status === "pending" && (
              <>
                <button
                  type="button"
                  disabled={busyId === rental.id}
                  onClick={() => changeStatus(rental.id, "approve")}
                  className="rounded-lg bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                >
                  Approve
                </button>

                <button
                  type="button"
                  disabled={busyId === rental.id}
                  onClick={() => changeStatus(rental.id, "reject")}
                  className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            )}

            {rental.status === "approved" && (
              <button
                type="button"
                disabled={busyId === rental.id}
                onClick={() => changeStatus(rental.id, "returned")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Mark as returned
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
