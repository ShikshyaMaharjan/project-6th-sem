import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"
import indraJatraImage from "../assets/images/festivals/indra-jatra.jpg"
import dhimeImage from "../assets/images/festivals/dhime.jpg"
import { resolveImage } from "../config"

function Events() {
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const resultsRef = useRef(null)

  // Fetch events from FastAPI
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch("http://127.0.0.1:8000/events/")

        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }

        const data = await response.json()

        console.log("Events received from backend:", data)

        setEvents(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Event fetch error:", err)
        setError("Unable to load events. Please make sure the backend is running.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Get unique event types from backend
  const eventTypes = useMemo(() => {
    return [
      "All",
      ...new Set(events.map((event) => event.type).filter(Boolean)),
    ]
  }, [events])

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType =
        selectedType === "All" || event.type === selectedType

      return matchesSearch && matchesType
    })
  }, [events, searchTerm, selectedType])

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return []

    return events.filter((event) => {
      const search = searchTerm.toLowerCase()

      return (
        event.title?.toLowerCase().includes(search) ||
        event.type?.toLowerCase().includes(search) ||
        event.location?.toLowerCase().includes(search)
      )
    })
  }, [events, searchTerm])

  // Scroll to results
  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  // Category click
  const handleTypeClick = (type) => {
    setSelectedType(type)
    setSearchTerm("")

    scrollToResults()
  }

  // Search suggestion click
  const handleSuggestionClick = (event) => {
    setSearchTerm(event.title)
    setSelectedType("All")

    scrollToResults()
  }

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedType("All")
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* HERO */}
     {/* HERO */}
<section className="bg-white px-6 py-10 lg:px-8">
  <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-green-950 md:grid-cols-2">

    {/* LEFT — CONTENT */}
    <div className="flex min-h-[480px] flex-col justify-center px-8 py-12 sm:px-12 lg:px-16">

      <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-green-300">
        Cultural Experiences
      </p>

      <h1 className="max-w-lg text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
        Experience Nepal's
        <br />
        Living Culture
      </h1>

      <p className="mt-6 max-w-lg text-base leading-7 text-green-100/75 md:text-lg">
        Discover festivals, performances, exhibitions, and cultural
        experiences happening across Nepal.
      </p>

      <div className="mt-8">
        <button
          type="button"
          onClick={scrollToResults}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-green-950 transition hover:bg-green-100"
        >
          Explore
          <span>→</span>
        </button>
      </div>

    </div>

    {/* RIGHT — IMAGE */}
    <div className="relative min-h-[400px] md:min-h-[480px]">

      <img
        src={indraJatraImage}
        alt="Indra Jatra Celebration"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* TRANSPARENT CAPTION */}
      <div className="absolute bottom-6 right-6 rounded-lg bg-black/30 px-4 py-3 backdrop-blur-sm">
        <p className="text-sm font-medium text-white">
          Indra Jatra Celebration
        </p>

        <p className="mt-1 text-xs text-white/70">
          Kathmandu, Nepal
        </p>
      </div>

    </div>

  </div>
</section>

      {/* SEARCH + FILTER */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events, festivals, locations..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 pr-12 text-gray-900 outline-none transition focus:border-green-700 focus:bg-white focus:ring-2 focus:ring-green-100"
            />

            {/* SEARCH SUGGESTIONS */}
            {searchTerm.trim() && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

                {searchSuggestions.slice(0, 5).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => handleSuggestionClick(event)}
                    className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-green-50"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {event.title}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {event.type} · {event.location}
                      </p>
                    </div>

                    <span className="text-green-700">
                      →
                    </span>
                  </button>
                ))}

              </div>
            )}

            {/* NO SEARCH MATCH */}
            {searchTerm.trim() && searchSuggestions.length === 0 && !loading && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
                <p className="text-sm text-gray-500">
                  No matching events found.
                </p>
              </div>
            )}
          </div>

          {/* EVENT TYPE FILTERS */}
          <div className="mt-6 flex flex-wrap gap-3">
            {eventTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeClick(type)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  selectedType === type
                    ? "bg-green-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* EVENTS */}
      <section
        ref={resultsRef}
        className="scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                Upcoming Cultural Events
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                Discover what's happening
              </h2>

              <p className="mt-3 max-w-2xl text-gray-600">
                Discover events where you can experience Nepal's traditions,
                creativity, and community.
              </p>
            </div>

            {!loading && !error && (
              <p className="whitespace-nowrap text-sm font-medium text-gray-500">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "event" : "events"}
              </p>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="py-20 text-center">
              <p className="text-gray-500">
                Loading cultural events...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
              <p className="font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* EVENTS GRID */}
          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {filteredEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* IMAGE */}
                  {/* IMAGE */}
<div className="h-60 overflow-hidden bg-gray-100">
  {event.image === "indra-jatra.jpg" ? (
    <img
      src={indraJatraImage}
      alt={event.title}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  ) : event.image === "dhime.jpg" ? (
    <img
      src={dhimeImage}
      alt={event.title}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  ) : event.image ? (
    <img
      src={resolveImage(event.image)}
      alt={event.title}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  ) : (
    <div className="flex h-full items-center justify-center bg-green-50">
      <span className="text-sm font-medium text-green-700">
        Cultural Event
      </span>
    </div>
  )}
</div>

                  {/* CONTENT */}
                  <div className="p-6">

                    <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                      {event.type}
                    </span>

                    <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-green-800">
                      {event.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                      {event.description}
                    </p>

                    <div className="mt-6 space-y-2 text-sm text-gray-500">
                      <p>
                        📅 {event.date}
                      </p>

                      <p>
                        🕐 {event.time}
                      </p>

                      <p>
                        📍 {event.location}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-5">
                      <span className="text-sm font-semibold text-green-800">
                        View event →
                      </span>
                    </div>

                  </div>
                </Link>
              ))}

            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && filteredEvents.length === 0 && (
            <div className="rounded-3xl border border-gray-200 bg-gray-50 px-6 py-20 text-center">

              <h3 className="text-xl font-semibold text-gray-900">
                No events found
              </h3>

              <p className="mt-2 text-gray-500">
                Try a different search term or category.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
              >
                Clear Filters
              </button>

            </div>
          )}

        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-50">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">

          <h2 className="text-3xl font-semibold text-green-950">
            Have a cultural event to share?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Help bring Nepal's cultural activities and communities together
            by sharing upcoming events.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-flex rounded-xl bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-900"
          >
            Share an Event
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <p className="text-sm text-gray-500">
            © 2026 Culture Nepal. Preserving culture for future generations.
          </p>
        </div>
      </footer>

    </div>
  )
}

export default Events