import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import indraJatraImage from "../assets/images/festivals/indra-jatra.jpg"
import { resolveImage } from "../config"

function EventDetail() {
  const { slug } = useParams()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `http://127.0.0.1:8000/events/${slug}`
        )

        if (!response.ok) {
          if (response.status === 404) {
            setEvent(null)
            return
          }

          throw new Error("Failed to fetch event")
        }

        const data = await response.json()

        console.log("Event received from backend:", data)

        setEvent(data)
      } catch (err) {
        console.error("Event detail error:", err)
        setError("Unable to load this event.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [slug])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-gray-500">
            Loading event...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Something went wrong
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <Link
            to="/events"
            className="mt-6 inline-flex rounded-lg bg-green-800 px-5 py-3 text-sm font-semibold text-white hover:bg-green-900"
          >
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  // Event not found
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Event not found
          </h1>

          <p className="mt-3 text-gray-500">
            The event you are looking for does not exist.
          </p>

          <Link
            to="/events"
            className="mt-6 inline-flex rounded-lg bg-green-800 px-5 py-3 text-sm font-semibold text-white hover:bg-green-900"
          >
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f7f3] text-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="px-6 pt-8 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-green-950">
          <div className="grid md:grid-cols-2">

            {/* Content */}
            <div className="flex flex-col justify-center px-8 py-14 md:px-12 lg:px-16">
              <p className="text-xs font-semibold uppercase tracking-[2px] text-green-300">
                {event.type}
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
                {event.title}
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-green-100/75 md:text-base">
                {event.description}
              </p>

              <Link
                to="/events"
                className="mt-8 inline-flex w-fit items-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-green-900 transition hover:bg-green-50"
              >
                ← Back to Events
              </Link>
            </div>

            {/* Image */}
            <div className="relative min-h-[300px] bg-green-900">
              {event.image === "indra-jatra.jpg" ? (
                <img
                  src={indraJatraImage}
                  alt={event.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : event.image ? (
                <img
                  src={resolveImage(event.image)}
                  alt={event.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center">
                  <div className="text-center text-white/60">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/20">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="16"
                          rx="2"
                        />

                        <path d="M7 16l3-3 2 2 3-4 3 5" />
                      </svg>
                    </div>

                    <p className="mt-3 text-sm">
                      Event image
                    </p>

                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-green-950/40 to-transparent" />
            </div>

          </div>
        </div>
      </section>

      {/* Event Information */}
      <section className="px-6 py-14 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-8 lg:grid-cols-3">

            {/* About */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 lg:col-span-2">

              <p className="text-xs font-semibold uppercase tracking-[2px] text-green-700">
                About the event
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Experience the event
              </h2>

              <p className="mt-5 text-sm leading-7 text-gray-600">
                {event.about}
              </p>

            </div>

            {/* Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7">

              <p className="text-xs font-semibold uppercase tracking-[2px] text-green-700">
                Event details
              </p>

              <div className="mt-6 space-y-5">

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {event.date}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Time
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {event.time}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {event.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {event.type}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-7 md:px-10 lg:px-14">
          <p className="text-center text-xs text-gray-400">
            © 2026 Culture Nepal · Cultural Preservation Platform
          </p>
        </div>
      </footer>
    </div>
  )
}

export default EventDetail