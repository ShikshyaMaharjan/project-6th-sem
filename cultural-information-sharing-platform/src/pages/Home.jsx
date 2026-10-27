import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar"
import { API_URL } from "../config"

import patanImage from "../assets/images/heritage/patan-durbar-square.jpg"
import kathmanduImage from "../assets/images/heritage/kathmandu-durbar-square.jpg"
import bhaktapurImage from "../assets/images/heritage/bhaktapur-durbar-square.jpg"
import yomariImage from "../assets/images/food/yomari.jpg"
import indraJatraImage from "../assets/images/festivals/indra-jatra.jpg"
import dhimeImage from "../assets/images/festivals/dhime.jpg"

function Home() {
  const [search, setSearch] = useState("")
  const [culturalItems, setCulturalItems] = useState([])
  const navigate = useNavigate()

  // Cultural content comes from FastAPI / PostgreSQL
  useEffect(() => {
    const fetchCulturalItems = async () => {
      try {
        const response = await fetch(`${API_URL}/cultural/`)

        if (!response.ok) return

        setCulturalItems(await response.json())
      } catch (error) {
        console.error("Error fetching cultural content:", error)
      }
    }

    fetchCulturalItems()
  }, [])

  // Search cultural items
  const searchResults =
    search.trim() === ""
      ? []
      : culturalItems.filter((item) => {
          const searchText = search.toLowerCase().trim()

          return (
            item.title?.toLowerCase().includes(searchText) ||
            item.category?.toLowerCase().includes(searchText) ||
            item.community?.toLowerCase().includes(searchText) ||
            item.description?.toLowerCase().includes(searchText)
          )
        })

  // Search button / Enter key
  const handleSearch = (e) => {
    e.preventDefault()

    if (searchResults.length > 0) {
      navigate(`/explore/${searchResults[0].slug}`)
      setSearch("")
    }
  }

  // Click a search suggestion
  const handleSuggestionClick = (slug) => {
    navigate(`/explore/${slug}`)
    setSearch("")
  }

  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      {/* ================= HERO ================= */}
      <section
        className="relative flex min-h-[600px] items-center bg-cover bg-center px-8 py-24"
        style={{
          backgroundImage: `url(${kathmanduImage})`,
        }}
      >

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Content */}
        <div className="relative mx-auto w-full max-w-6xl text-center">

          <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl">
            Discover the Richness of
            <span className="block text-green-300">
              Nepalese Culture
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-100">
            Explore heritage sites, traditional attire, food, festivals,
            stories, and cultural practices from communities across Nepal.
          </p>

          {/* ================= SEARCH ================= */}
          <div className="relative mx-auto mt-10 max-w-2xl">

            <form
              onSubmit={handleSearch}
              className="flex overflow-hidden rounded-full border border-white/30 bg-white shadow-lg transition focus-within:ring-2 focus-within:ring-green-300"
            >

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cultural heritage, food, festivals..."
                className="flex-1 bg-transparent px-6 py-4 text-gray-700 outline-none"
              />

              <button
                type="submit"
                className="bg-green-700 px-7 py-4 font-semibold text-white transition hover:bg-green-800"
              >
                Search
              </button>

            </form>

            {/* ================= SEARCH SUGGESTIONS ================= */}
            {search.trim() !== "" && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-lg">

                {searchResults.slice(0, 6).map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => handleSuggestionClick(item.slug)}
                    className="block w-full px-6 py-3 text-left transition hover:bg-green-50"
                  >

                    <span className="font-medium text-gray-800">
                      {item.title}
                    </span>

                    <span className="ml-2 text-sm text-gray-400">
                      {item.category}
                    </span>

                  </button>
                ))}

              </div>
            )}

            {/* ================= NO SEARCH RESULT ================= */}
            {search.trim() !== "" && searchResults.length === 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl bg-white px-6 py-3 text-left text-sm text-gray-500 shadow-lg">
                No results found
              </div>
            )}

          </div>

        </div>
      </section>


      {/* ================= CATEGORIES ================= */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-6xl">

          <h2 className="text-3xl font-bold text-gray-900">
            Explore Culture
          </h2>

          <p className="mt-2 text-gray-600">
            Discover different aspects of Nepalese culture.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {/* Heritage Sites */}
            <Link
              to="/explore"
              className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">
                Heritage Sites
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Explore historical and cultural places.
              </p>
            </Link>


            {/* Traditional Attire */}
            <Link
              to="/explore"
              className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">
                Traditional Attire
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Learn about traditional clothing.
              </p>
            </Link>


            {/* Jewelry */}
            <Link
              to="/explore"
              className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">
                Jewelry
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Discover traditional ornaments.
              </p>
            </Link>


            {/* Food */}
            <Link
              to="/explore"
              className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">
                Food & Recipes
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Explore traditional foods and recipes.
              </p>
            </Link>


            {/* Festivals */}
            <Link
              to="/explore"
              className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">
                Festivals
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Discover festivals and traditions.
              </p>
            </Link>

          </div>
        </div>
      </section>


      {/* ================= FEATURED CULTURE ================= */}
      <section className="bg-gray-50 px-8 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
                Featured
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                Explore Cultural Heritage
              </h2>

              <p className="mt-2 text-gray-600">
                Discover places and traditions that tell the story of Nepal.
              </p>
            </div>

            <Link
              to="/explore"
              className="hidden rounded-lg border px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-white md:block"
            >
              View All
            </Link>

          </div>


          {/* Featured Cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">

            {/* ================= PATAN ================= */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="h-56 bg-gray-200">
                <img
                  src={patanImage}
                  alt="Patan Durbar Square"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">

                <p className="text-sm font-medium text-green-700">
                  Heritage Site
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  Patan Durbar Square
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Explore the history, architecture, and cultural significance
                  of this historic heritage site.
                </p>

                <Link
                  to="/explore/patan-durbar-square"
                  className="mt-4 inline-block font-medium text-green-700 hover:text-green-900"
                >
                  Explore →
                </Link>

              </div>
            </div>


            {/* ================= YOMARI ================= */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="h-56 bg-gray-200">
                <img
                  src={yomariImage}
                  alt="Traditional Yomari"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">

                <p className="text-sm font-medium text-green-700">
                  Traditional Food
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  Yomari
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Learn about the traditional Newari delicacy and its cultural
                  importance.
                </p>

                <Link
                  to="/explore/yomari"
                  className="mt-4 inline-block font-medium text-green-700 hover:text-green-900"
                >
                  Explore →
                </Link>

              </div>
            </div>


            {/* ================= INDRA JATRA ================= */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="h-56 bg-gray-200">
                <img
                  src={indraJatraImage}
                  alt="Indra Jatra Festival"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">

                <p className="text-sm font-medium text-green-700">
                  Festival
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  Indra Jatra
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Discover the traditions, celebrations, and cultural meaning
                  behind this important festival.
                </p>

                <Link
                  to="/explore/indra-jatra"
                  className="mt-4 inline-block font-medium text-green-700 hover:text-green-900"
                >
                  Explore →
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= EVENTS ================= */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
                What's Happening
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                Upcoming Cultural Events
              </h2>

              <p className="mt-2 text-gray-600">
                Discover festivals, workshops, exhibitions, and cultural programs.
              </p>
            </div>

            <Link
              to="/events"
              className="hidden rounded-lg border px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 md:block"
            >
              View All Events
            </Link>

          </div>


          {/* Event Cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">

            {/* ================= EVENT 1 ================= */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="h-48 bg-gray-200">
                <img
                  src={indraJatraImage}
                  alt="Indra Jatra Celebration"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">

                <p className="text-sm font-semibold text-green-700">
                  Festival
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  Indra Jatra Celebration
                </h3>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>September 25, 2026</p>
                  <p>10:00 AM</p>
                  <p>Kathmandu Durbar Square</p>
                </div>

                <Link
                  to="/events"
                  className="mt-5 block w-full rounded-lg bg-green-700 px-4 py-3 text-center font-medium text-white transition hover:bg-green-800"
                >
                  View Details
                </Link>

              </div>
            </div>


            {/* ================= EVENT 2 ================= */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="h-48 bg-gray-200">
  <img
    src={dhimeImage}
    alt="Grand Dhimey Dance"
    className="h-full w-full object-cover"
  />
</div>

              <div className="p-6">

                <p className="text-sm font-semibold text-green-700">
                  Event
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  Grand Dhimey Dance
                </h3>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>September 23, 2026</p>
                  <p>2:00 PM</p>
                  <p>Basantapur</p>
                </div>

                <Link
                  to="/events"
                  className="mt-5 block w-full rounded-lg bg-green-700 px-4 py-3 text-center font-medium text-white transition hover:bg-green-800"
                >
                  View Details
                </Link>

              </div>
            </div>


            {/* ================= EVENT 3 ================= */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="h-48 bg-gray-200">
                <img
                  src={bhaktapurImage}
                  alt="Newari Art & Craft Exhibition"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">

                <p className="text-sm font-semibold text-green-700">
                  Exhibition
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  Newari Art & Craft Exhibition
                </h3>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>September 20, 2026</p>
                  <p>11:00 AM</p>
                  <p>Bhaktapur</p>
                </div>

                <Link
                  to="/events"
                  className="mt-5 block w-full rounded-lg bg-green-700 px-4 py-3 text-center font-medium text-white transition hover:bg-green-800"
                >
                  View Details
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-gray-50 px-8 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center">

          <div>

            <h3 className="text-lg font-bold text-green-700">
              Culture Nepal
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Preserving stories, traditions, and places for generations to come.
            </p>

          </div>


          <div className="flex gap-6 text-sm text-gray-600">

            <Link
              to="/explore"
              className="hover:text-green-700"
            >
              Explore
            </Link>

            <Link
              to="/events"
              className="hover:text-green-700"
            >
              Events
            </Link>

            <Link
              to="/about"
              className="hover:text-green-700"
            >
              About
            </Link>

          </div>


          <p className="text-xs text-gray-400">
            © 2026 Culture Nepal
          </p>

        </div>
      </footer>

    </div>
  )
}

export default Home