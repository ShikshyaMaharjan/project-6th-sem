import { Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

import Navbar from "../components/Navbar"
import exploreImage from "../assets/images/explore.jpg"
import { API_URL, resolveImage, getStoredUser } from "../config"

const categories = [
  {
    name: "Heritage Sites",
    description: "Historic places, monuments, and cultural landmarks.",
  },
  {
    name: "Traditional Attire",
    description: "Traditional clothing and the stories behind them.",
  },
  {
    name: "Jewelry",
    description: "Traditional ornaments and local craftsmanship.",
  },
  {
    name: "Food & Recipes",
    description: "Traditional dishes, ingredients, and recipes.",
  },
  {
    name: "Festivals",
    description: "Festivals, celebrations, and living traditions.",
  },
]

function Explore() {
  const [selectedCategory, setSelectedCategory] =
    useState("Heritage Sites")

  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Cultural content from FastAPI / PostgreSQL (single source of truth)
  const [culturalItems, setCulturalItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadError, setLoadError] = useState("")

  // Community filter ("" = all communities)
  const [selectedCommunity, setSelectedCommunity] = useState("")

  // Favorites of the logged-in user (ids of cultural items)
  const [favoriteIds, setFavoriteIds] = useState([])
  const currentUser = getStoredUser()

  // Approved user contributions
  const [approvedContributions, setApprovedContributions] = useState([])

  const resultsRef = useRef(null)

  /*
   * =========================================================
   * FETCH CULTURAL CONTENT FROM THE DATABASE
   * =========================================================
   */

  useEffect(() => {
    const fetchCulturalItems = async () => {
      try {
        const response = await fetch(`${API_URL}/cultural/`)

        if (!response.ok) {
          throw new Error("Failed to fetch cultural content.")
        }

        const data = await response.json()

        setCulturalItems(
          data.map((item) => ({
            ...item,
            image: resolveImage(item.image),
          }))
        )
      } catch (error) {
        console.error("Error fetching cultural content:", error)
        setLoadError(
          "Cultural content could not be loaded. Please make sure the backend is running."
        )
      } finally {
        setLoadingItems(false)
      }
    }

    fetchCulturalItems()
  }, [])

  /*
   * =========================================================
   * FETCH FAVORITES OF THE LOGGED-IN USER
   * =========================================================
   */

  useEffect(() => {
    if (!currentUser?.id) return

    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `${API_URL}/favorites/user/${currentUser.id}`
        )

        if (!response.ok) return

        const data = await response.json()
        setFavoriteIds(data.map((item) => item.id))
      } catch (error) {
        console.error("Error fetching favorites:", error)
      }
    }

    fetchFavorites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleFavorite = async (event, item) => {
    event.preventDefault()
    event.stopPropagation()

    if (!currentUser?.id) {
      alert("Please log in to save favorites.")
      return
    }

    const isSaved = favoriteIds.includes(item.id)

    try {
      const response = isSaved
        ? await fetch(
            `${API_URL}/favorites/${currentUser.id}/${item.id}`,
            { method: "DELETE" }
          )
        : await fetch(`${API_URL}/favorites/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: currentUser.id,
              cultural_id: item.id,
            }),
          })

      if (!response.ok) throw new Error("Request failed.")

      setFavoriteIds((current) =>
        isSaved
          ? current.filter((id) => id !== item.id)
          : [...current, item.id]
      )
    } catch (error) {
      console.error("Favorite error:", error)
      alert("Could not update favorites. Please try again.")
    }
  }

  /*
   * =========================================================
   * FETCH APPROVED CONTRIBUTIONS
   * =========================================================
   */

  useEffect(() => {
    const fetchApprovedContributions = async () => {
      try {
        const response = await fetch(`${API_URL}/contributions/`)

        if (!response.ok) {
          throw new Error("Failed to fetch contributions.")
        }

        const data = await response.json()

        // Only approved contributions are shown publicly
        const approved = data.filter(
          (item) => item.status?.toLowerCase() === "approved"
        )

        setApprovedContributions(approved)
      } catch (error) {
        console.error(
          "Error fetching approved contributions:",
          error
        )
      }
    }

    fetchApprovedContributions()
  }, [])

  /*
   * =========================================================
   * COMBINE STATIC CULTURAL ITEMS + APPROVED CONTRIBUTIONS
   * =========================================================
   */

  const contributionItems = approvedContributions.map(
    (contribution) => ({
      slug: `contribution-${contribution.id}`,
      title: contribution.title,
      category: contribution.category,
      description: contribution.description,
      image: resolveImage(contribution.image),
      community: contribution.community,
      location: contribution.location,
      significance: contribution.significance,
      isContribution: true,
      contributionId: contribution.id,
    })
  )

  // Approving a contribution now creates a database record, so skip
  // any contribution whose title already exists in the cultural list.
  const knownTitles = new Set(
    culturalItems.map((item) => item.title?.toLowerCase().trim())
  )

  const allCulturalItems = [
    ...culturalItems,
    ...contributionItems.filter(
      (item) => !knownTitles.has(item.title?.toLowerCase().trim())
    ),
  ]

  // Communities available in the filter
  const communityOptions = [
    ...new Set(
      allCulturalItems.map((item) => item.community).filter(Boolean)
    ),
  ].sort()

  /*
   * =========================================================
   * CATEGORY + SEARCH FILTER
   * =========================================================
   */

  const filteredItems = allCulturalItems.filter((item) => {
    const search = searchTerm.toLowerCase().trim()

    if (search !== "") {
      return (
        item.title?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.community?.toLowerCase().includes(search) ||
        item.location?.toLowerCase().includes(search)
      )
    }

    return (
  item.category === selectedCategory &&
  (
    selectedCategory === "Heritage Sites" ||
    selectedCommunity === "" ||
    item.community === selectedCommunity
  )
)
  })

  /*
   * =========================================================
   * CATEGORY CHANGE
   * =========================================================
   */

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchTerm("")
    setShowSuggestions(false)
    setSelectedCommunity("")

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const handleSearch = (e) => {
    e?.preventDefault()

    setShowSuggestions(false)

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  /*
   * =========================================================
   * SEARCH SUGGESTION CLICK
   * =========================================================
   */

  const handleSuggestionClick = (title) => {
    setSearchTerm(title)
    setShowSuggestions(false)

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  /*
   * =========================================================
   * SEARCH SUGGESTIONS
   * =========================================================
   */

  const suggestions =
    searchTerm.trim() === ""
      ? []
      : allCulturalItems.filter((item) => {
          const search = searchTerm.toLowerCase().trim()

          return (
            item.title?.toLowerCase().includes(search) ||
            item.category?.toLowerCase().includes(search) ||
            item.description?.toLowerCase().includes(search) ||
            item.community?.toLowerCase().includes(search) ||
            item.location?.toLowerCase().includes(search)
          )
        })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ================= HERO ================= */}
      <section
        className="relative flex min-h-[460px] items-center bg-cover bg-center px-8 py-24"
        style={{
          backgroundImage: `url(${exploreImage})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative mx-auto w-full max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-300">
            Explore
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
            Explore Nepalese Culture
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-100">
            Discover cultural places, traditions, attire, jewelry,
            food, festivals, and stories from different communities.
          </p>

          {/* ================= SEARCH ================= */}
          <form
            onSubmit={handleSearch}
            className="relative mt-9 max-w-2xl"
          >
            <div
              className={`flex overflow-hidden border border-gray-200 bg-white shadow-lg ${
                showSuggestions && suggestions.length > 0
                  ? "rounded-t-2xl"
                  : "rounded-2xl"
              }`}
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => {
                  if (searchTerm.trim() !== "") {
                    setShowSuggestions(true)
                  }
                }}
                placeholder="Search cultural places, food, festivals..."
                className="min-w-0 flex-1 bg-transparent px-6 py-4 text-gray-800 outline-none"
              />

              <button
                type="submit"
                className="bg-green-700 px-7 font-semibold text-white transition hover:bg-green-800"
              >
                Search
              </button>
            </div>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-30 overflow-hidden rounded-b-2xl bg-white shadow-lg">
                {suggestions.slice(0, 6).map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() =>
                      handleSuggestionClick(item.title)
                    }
                    className="flex w-full items-center justify-between px-6 py-3.5 text-left transition hover:bg-green-50"
                  >
                    <span className="font-medium text-gray-900">
                      {item.title}
                    </span>

                    <span className="ml-4 text-sm text-gray-500">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {showSuggestions &&
              searchTerm.trim() !== "" &&
              suggestions.length === 0 && (
                <div className="absolute left-0 right-0 top-full z-30 rounded-b-2xl bg-white px-6 py-4 shadow-lg">
                  <p className="text-sm text-gray-500">
                    No cultural items found.
                  </p>
                </div>
              )}
          </form>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              Discover
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Browse by Category
            </h2>

            <p className="mt-3 text-gray-600">
              Explore different aspects of Nepalese culture through
              one place.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const isSelected =
                selectedCategory === category.name

              return (
                <button
                  key={category.name}
                  onClick={() =>
                    handleCategoryChange(category.name)
                  }
                  className={`group rounded-2xl border p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isSelected
                      ? "border-green-600 bg-green-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-green-300"
                  }`}
                >
                  <div
                    className={`mb-4 h-1 w-10 rounded-full transition ${
                      isSelected
                        ? "bg-green-700"
                        : "bg-gray-200 group-hover:bg-green-500"
                    }`}
                  ></div>

                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {category.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= RESULTS ================= */}
      <section
        ref={resultsRef}
        className="scroll-mt-24 px-8 pb-20"
      >
        <div className="mx-auto max-w-6xl">
          {/* Results heading */}
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
                Cultural Collection
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {searchTerm
                  ? "Search Results"
                  : "Cultural Highlights"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {searchTerm ? (
                  <>
                    Results for{" "}
                    <span className="font-semibold text-gray-800">
                      "{searchTerm}"
                    </span>
                  </>
                ) : (
                  <>
                    Exploring{" "}
                    <span className="font-semibold text-gray-800">
                      {selectedCategory}
                    </span>
                  </>
                )}
              </p>
            </div>

            <p className="text-sm text-gray-500">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"}
            </p>
          </div>

          {/* ================= COMMUNITY FILTER ================= */}
          {communityOptions.length > 0 && !searchTerm &&
          selectedCategory !== "Heritage Sites" && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Community
              </span>

              {["", ...communityOptions].map((community) => (
                <button
                  key={community || "all"}
                  type="button"
                  onClick={() => setSelectedCommunity(community)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    selectedCommunity === community
                      ? "border-green-700 bg-green-700 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-green-600 hover:text-green-700"
                  }`}
                >
                  {community || "All"}
                </button>
              ))}
            </div>
          )}

          {loadingItems && (
            <p className="mt-8 text-sm text-gray-500">
              Loading cultural content...
            </p>
          )}

          {loadError && (
            <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </p>
          )}

          {/* ================= CARDS ================= */}
          {filteredItems.length > 0 ? (
            <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item.slug}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                  
                    {!item.isContribution && (
                      <button
                        type="button"
                        onClick={(event) => toggleFavorite(event, item)}
                        aria-label={
                          favoriteIds.includes(item.id)
                            ? "Remove from favorites"
                            : "Save to favorites"
                        }
                        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow transition hover:scale-110"
                      >
                        <span
                          className={
                            favoriteIds.includes(item.id)
                              ? "text-red-500"
                              : "text-gray-400"
                          }
                        >
                          {favoriteIds.includes(item.id) ? "♥" : "♡"}
                        </span>
                      </button>
                    )}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain  transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                        {item.category}
                      </p>

                      {item.isContribution && (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                          Community Contribution
                        </span>
                      )}
                    </div>

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
                      className="mt-5 inline-flex items-center font-semibold text-green-700 transition hover:text-green-900"
                    >
                      View Details
                      <span className="ml-2 transition group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : loadingItems ? null : (
            /* ================= EMPTY STATE ================= */
            <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                No cultural items found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-gray-500">
                We couldn't find anything matching your search.
                Try another keyword or browse a different category.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCommunity("")
                  setShowSuggestions(false)
                }}
                className="mt-6 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white transition hover:bg-green-800"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Explore