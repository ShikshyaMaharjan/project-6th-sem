import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"
import rentImage from "../assets/images/rent.jpg"
import { API_URL, resolveImage } from "../config"

function RentAttire() {
  const [rentableItems, setRentableItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRentalItems = async () => {
      try {
        const response = await fetch(`${API_URL}/cultural/`)

        if (!response.ok) {
          throw new Error("Failed to fetch rental items.")
        }

        const data = await response.json()

        // Only Traditional Attire and Jewelry marked as rentable
        const availableItems = data
          .filter(
            (item) =>
              ["Traditional Attire", "Jewelry"].includes(item.category) &&
              item.is_rentable === true
          )
          .map((item) => ({
            ...item,
            image: resolveImage(item.image),
          }))

        setRentableItems(availableItems)
      } catch (error) {
        console.error("Error fetching rental items:", error)

        setError(
          "Rental items could not be loaded. Please make sure the backend is running."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRentalItems()
  }, [])

  // Filter by All / Traditional Attire / Jewelry
  const filteredItems =
    selectedCategory === "All"
      ? rentableItems
      : rentableItems.filter(
          (item) => item.category === selectedCategory
        )

  const categories = ["All", "Traditional Attire", "Jewelry"]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ================= HERO ================= */}
      <section
        className="relative flex min-h-[460px] items-center bg-cover bg-center px-8 py-24"
        style={{
          backgroundImage: `url(${rentImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative mx-auto w-full max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-300">
            Cultural Rental Collection
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
            Wear the Tradition
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-100">
            Discover traditional attire and jewelry available for rental and
            experience the cultural identity, craftsmanship, and traditions of
            Nepal's communities.
          </p>

          <a
            href="#rental-collection"
            className="mt-8 inline-flex rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Browse Rental Collection
          </a>
        </div>
      </section>

      {/* ================= RENTAL COLLECTION ================= */}
      <section
        id="rental-collection"
        className="scroll-mt-20 px-8 py-16"
      >
        <div className="mx-auto max-w-6xl">

          {/* Heading */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
                  Rental Collection
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  Available for Rent
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Browse traditional attire and jewelry currently available
                  for rental.
                </p>
              </div>

              {!loading && !error && (
                <p className="text-sm text-gray-500">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "item" : "items"}
                </p>
              )}
            </div>

            {/* ================= CATEGORY FILTERS ================= */}
            {!loading && !error && (
              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selectedCategory === category
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= LOADING ================= */}
          {loading && (
            <p className="mt-8 text-sm text-gray-500">
              Loading rental collection...
            </p>
          )}

          {/* ================= ERROR ================= */}
          {error && (
            <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* ================= RENTAL CARDS ================= */}
          {!loading && !error && filteredItems.length > 0 && (
            <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow">
                      Available to Rent
                    </span>

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                      {item.category}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>

                    {item.community && (
                      <p className="mt-3 text-xs text-gray-500">
                        Community:{" "}
                        <span className="font-medium text-gray-700">
                          {item.community}
                        </span>
                      </p>
                    )}

                    {item.location && (
                      <p className="mt-1 text-xs text-gray-500">
                        Location:{" "}
                        <span className="font-medium text-gray-700">
                          {item.location}
                        </span>
                      </p>
                    )}

                    <Link
                      to={`/explore/${item.slug}`}
                      className="mt-5 inline-flex items-center rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white transition hover:bg-green-800"
                    >
                      View & Rent
                      <span className="ml-2 transition group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ================= EMPTY STATE ================= */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                No rental items available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-gray-500">
                There are currently no items available in this rental category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default RentAttire