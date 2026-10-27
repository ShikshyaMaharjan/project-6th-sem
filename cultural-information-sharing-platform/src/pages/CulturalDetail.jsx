// import { Link, useParams } from "react-router-dom"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { API_URL, resolveImage, getStoredUser } from "../config"

function CulturalDetail() {
  const { slug } = useParams()
  const currentUser = getStoredUser()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Favorites
  const [isFavorite, setIsFavorite] = useState(false)

  // Reviews
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
  const [reviewMessage, setReviewMessage] = useState("")
  const [reviewSaving, setReviewSaving] = useState(false)

  // Attire rental
  const [rentalForm, setRentalForm] = useState({
    start_date: "",
    end_date: "",
    phone: currentUser?.phone || "",
    note: "",
  })
  const [rentalMessage, setRentalMessage] = useState("")
  const [rentalError, setRentalError] = useState("")
  const [rentalSaving, setRentalSaving] = useState(false)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [slug])

  // ================= LOAD THE ITEM FROM FASTAPI =================
  useEffect(() => {
    let cancelled = false

    const loadItem = async () => {
      setLoading(true)
      setItem(null)

      try {
        const response = await fetch(`${API_URL}/cultural/${slug}`)

        if (response.ok) {
          const data = await response.json()
          if (!cancelled) setItem({ ...data, image: resolveImage(data.image) })
        } else {
          // Older approved contributions use the slug contribution-<id>
          const match = slug.match(/^contribution-(\d+)$/)

          if (match) {
            const contributionResponse = await fetch(
              `${API_URL}/contributions/`
            )
            const contributions = contributionResponse.ok
              ? await contributionResponse.json()
              : []

            const contribution = contributions.find(
              (entry) =>
                entry.id === Number(match[1]) &&
                entry.status?.toLowerCase() === "approved"
            )

            if (contribution && !cancelled) {
              setItem({
                ...contribution,
                slug,
                image: resolveImage(contribution.image),
                isContribution: true,
              })
            }
          }
        }
      } catch (error) {
        console.error("Error loading cultural item:", error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadItem()

    return () => {
      cancelled = true
    }
  }, [slug])

  // ================= LOAD OTHER ITEMS (for related section) =================
  useEffect(() => {
    const loadAll = async () => {
      try {
        const response = await fetch(`${API_URL}/cultural/`)
        if (!response.ok) return
        const data = await response.json()
        setAllItems(
          data.map((entry) => ({ ...entry, image: resolveImage(entry.image) }))
        )
      } catch (error) {
        console.error("Error loading related items:", error)
      }
    }

    loadAll()
  }, [])

  const hasDatabaseRecord = item && !item.isContribution

  // ================= LOAD REVIEWS + FAVORITE STATE =================
  useEffect(() => {
    if (!hasDatabaseRecord) return

    const loadReviews = async () => {
      try {
        const response = await fetch(
          `${API_URL}/reviews/cultural/${item.id}`
        )
        if (!response.ok) return
        const data = await response.json()
        setReviews(data)

        const mine = data.find((review) => review.user_id === currentUser?.id)
        if (mine) {
          setReviewForm({ rating: mine.rating, comment: mine.comment || "" })
        }
      } catch (error) {
        console.error("Error loading reviews:", error)
      }
    }

    const loadFavorite = async () => {
      if (!currentUser?.id) return
      try {
        const response = await fetch(
          `${API_URL}/favorites/user/${currentUser.id}`
        )
        if (!response.ok) return
        const data = await response.json()
        setIsFavorite(data.some((entry) => entry.id === item.id))
      } catch (error) {
        console.error("Error loading favorite state:", error)
      }
    }

    loadReviews()
    loadFavorite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, hasDatabaseRecord])

  const toggleFavorite = async () => {
    if (!currentUser?.id) {
      alert("Please log in to save favorites.")
      return
    }

    try {
      const response = isFavorite
        ? await fetch(`${API_URL}/favorites/${currentUser.id}/${item.id}`, {
            method: "DELETE",
          })
        : await fetch(`${API_URL}/favorites/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: currentUser.id,
              cultural_id: item.id,
            }),
          })

      if (!response.ok) throw new Error("Request failed.")
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Favorite error:", error)
      alert("Could not update favorites. Please try again.")
    }
  }

  const submitReview = async (event) => {
    event.preventDefault()
    setReviewMessage("")

    if (!currentUser?.id) {
      setReviewMessage("Please log in to write a review.")
      return
    }

    setReviewSaving(true)

    try {
      const response = await fetch(`${API_URL}/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          cultural_id: item.id,
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to save review.")
      }

      setReviews((current) => {
        const others = current.filter((review) => review.id !== data.id)
        return [data, ...others]
      })
      setReviewMessage("Thank you! Your review has been saved.")
    } catch (error) {
      setReviewMessage(error.message)
    } finally {
      setReviewSaving(false)
    }
  }

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return

    try {
      const response = await fetch(
        `${API_URL}/reviews/${reviewId}?user_id=${currentUser.id}`,
        { method: "DELETE" }
      )

      if (!response.ok) throw new Error("Failed to delete review.")
      setReviews((current) => current.filter((review) => review.id !== reviewId))
    } catch (error) {
      alert(error.message)
    }
  }

  const submitRental = async (event) => {
    event.preventDefault()
    setRentalMessage("")
    setRentalError("")

   if (!currentUser?.id) {
  navigate("/login")
  return
}

    setRentalSaving(true)

    try {
      const response = await fetch(`${API_URL}/rentals/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          cultural_id: item.id,
          start_date: rentalForm.start_date,
          end_date: rentalForm.end_date,
          phone: rentalForm.phone,
          note: rentalForm.note || null,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : "Failed to send the rental request."
        )
      }

      setRentalMessage(
        "Your rental request was sent. You will be notified after the administrator reviews it."
      )
      setRentalForm({ ...rentalForm, start_date: "", end_date: "", note: "" })
    } catch (error) {
      setRentalError(error.message)
    } finally {
      setRentalSaving(false)
    }
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-8 py-20 text-center text-gray-500">
          Loading...
        </div>
      </div>
    )
  }

  // If the cultural item does not exist
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-4xl px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Cultural Item Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            The cultural information you are looking for is not available.
          </p>

          <Link
            to="/explore"
            className="mt-6 inline-block rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    )
  }

  // Find related items from the same category
  // (same community first, at most 3 shown)
  const relatedItems = allItems
    .filter(
      (relatedItem) =>
        relatedItem.category === item.category &&
        relatedItem.slug !== item.slug
    )
    .sort(
      (a, b) =>
        Number(b.community === item.community) -
        Number(a.community === item.community)
    )
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[500px] overflow-hidden bg-gray-900 md:h-[600px]">

       {/* ================= HERO IMAGE ================= */}

{item.category === "Heritage Sites" ? (
  <>
    {/* Heritage Site - full width like Home page */}
    {item.image ? (
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm text-white/60">
          No image available
        </span>
      </div>
    )}

    {/* Slight dark overlay */}
    <div className="absolute inset-0 bg-black/20" />
  </>
) : (
  <>
    {/* Other categories - blurred background */}
    {item.image && (
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center blur-xl"
        style={{
          backgroundImage: `url(${item.image})`,
        }}
      />
    )}

    <div className="absolute inset-0 bg-black/45" />

    {/* Keep complete image visible */}
    <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8">
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="h-full max-h-full w-auto max-w-full object-contain"
        />
      ) : (
        <span className="text-sm text-white/60">
          No image available
        </span>
      )}
    </div>
  </>
)}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Hero text */}
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-8 pb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-white">
              {item.category}
            </p>

            <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
              {item.title}
            </h1>

            {item.location && (
              <p className="mt-2 text-white/90">
                📍 {item.location}
              </p>
            )}

            {hasDatabaseRecord && item.category === "Traditional Attire" && (
              <a
                href="#rental"
                className="mt-4 mr-3 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-green-700"
              >
                Rent this attire
              </a>
            )}

            {hasDatabaseRecord && (
              <button
                type="button"
                onClick={toggleFavorite}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow transition hover:bg-white"
              >
                <span className={isFavorite ? "text-red-500" : "text-gray-400"}>
                  {isFavorite ? "♥" : "♡"}
                </span>
                {isFavorite ? "Saved to favorites" : "Save to favorites"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-6xl px-8 py-12">

        <div className="grid gap-10 lg:grid-cols-3">

          {/* ================= MAIN INFORMATION ================= */}
          <div className="lg:col-span-2">

            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              About
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              About {item.title}
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              {item.description}
            </p>

            {/* Cultural Significance */}
            {item.significance && (
              <div className="mt-10">
                <h3 className="text-2xl font-bold text-gray-900">
                  Cultural Significance
                </h3>

                <p className="mt-4 leading-8 text-gray-600">
                  {item.significance}
                </p>
              </div>
            )}

            {/* ================= REVIEWS ================= */}
            {hasDatabaseRecord && (
              <div className="mt-12 border-t pt-10">
                <h3 className="text-2xl font-bold text-gray-900">
                  Reviews
                </h3>

                <form
                  onSubmit={submitReview}
                  className="mt-5 rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {currentUser
                      ? "Share your experience"
                      : "Log in to write a review"}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <label
                      htmlFor="review-rating"
                      className="text-sm text-gray-600"
                    >
                      Rating
                    </label>

                    <select
                      id="review-rating"
                      value={reviewForm.rating}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, rating: e.target.value })
                      }
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {"★".repeat(value)} ({value})
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    rows={3}
                    placeholder="Write a short comment (optional)"
                    className="mt-3 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                  <div className="mt-3 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={reviewSaving || !currentUser}
                      className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
                    >
                      {reviewSaving ? "Saving..." : "Save review"}
                    </button>

                    {reviewMessage && (
                      <p className="text-sm text-gray-600">{reviewMessage}</p>
                    )}
                  </div>
                </form>

                <div className="mt-6 space-y-4">
                  {reviews.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No reviews yet. Be the first to review this item.
                    </p>
                  )}

                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-xl border bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {review.user_name}{" "}
                          <span className="ml-2 text-amber-500">
                            {"★".repeat(review.rating)}
                          </span>
                        </p>

                        {(currentUser?.id === review.user_id ||
                          currentUser?.role === "admin") && (
                          <button
                            type="button"
                            onClick={() => deleteReview(review.id)}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {review.comment && (
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ================= INFORMATION CARD ================= */}
          <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-lg font-bold text-gray-900">
              Information
            </h3>

            <div className="mt-5 space-y-5">

              {/* Category */}
              <div>
                <p className="text-sm text-gray-500">
                  Category
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {item.category}
                </p>
              </div>

              {/* Community */}
              {item.community && (
                <div>
                  <p className="text-sm text-gray-500">
                    Community
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {item.community}
                  </p>
                </div>
              )}

              {/* Location */}
              {item.location && (
                <div>
                  <p className="text-sm text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {item.location}
                  </p>
                </div>
              )}

              {/* Rating */}
              {averageRating && (
                <div>
                  <p className="text-sm text-gray-500">
                    Average rating
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    ★ {averageRating}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      ({reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </p>
                </div>
              )}

            </div>
          </aside>

        </div>

        {/* ================= TRADITIONAL ATTIRE RENTAL ================= */}
        {hasDatabaseRecord && item.category === "Traditional Attire" && (
          <section
            id="rental"
            className="mt-12 rounded-2xl border bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              Traditional Attire Rental
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              Request to rent {item.title}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Send a request and the administrator will review it. You can
              follow its status on the My Rentals page.
            </p>

            <form
              onSubmit={submitRental}
              className="mt-5 grid gap-4 md:grid-cols-2"
            >
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Start date
                </label>
                <input
                  type="date"
                  required
                  value={rentalForm.start_date}
                  onChange={(e) =>
                    setRentalForm({ ...rentalForm, start_date: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  End date
                </label>
                <input
                  type="date"
                  required
                  value={rentalForm.end_date}
                  onChange={(e) =>
                    setRentalForm({ ...rentalForm, end_date: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Contact phone
                </label>
                <input
                  type="tel"
                  required
                  value={rentalForm.phone}
                  onChange={(e) =>
                    setRentalForm({ ...rentalForm, phone: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Note (size, occasion...)
                </label>
                <input
                  type="text"
                  value={rentalForm.note}
                  onChange={(e) =>
                    setRentalForm({ ...rentalForm, note: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={rentalSaving || !currentUser}
                  className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
                >
                  {rentalSaving ? "Sending..." : "Send rental request"}
                </button>

                {!currentUser && (
                  <Link to="/login" className="text-sm font-semibold text-green-700">
                    Log in to request a rental
                  </Link>
                )}
              </div>

              {rentalMessage && (
                <p className="md:col-span-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
                  {rentalMessage}
                </p>
              )}

              {rentalError && (
                <p className="md:col-span-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {rentalError}
                </p>
              )}
            </form>
          </section>
        )}

        {/* ================= RELATED ITEMS ================= */}
        {relatedItems.length > 0 && (
          <section className="mt-16 border-t pt-12">

            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              Discover More
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Related Cultural Items
            </h2>

            <p className="mt-3 text-gray-600">
              Explore more cultural information from the same category.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">

              {relatedItems.map((relatedItem) => (
                <div
                  key={relatedItem.slug}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* Related Image */}
                  <div className="h-48 overflow-hidden bg-gray-100">

                    {relatedItem.image && (
                      <img
                        src={relatedItem.image}
                        alt={relatedItem.title}
                        className="h-full w-full object-contain transition duration-300 hover:scale-105"
                      />
                    )}

                  </div>

                  {/* Related Content */}
                  <div className="p-5">

                    <p className="text-sm font-semibold text-green-700">
                      {relatedItem.category}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-gray-900">
                      {relatedItem.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {relatedItem.description}
                    </p>

                    <Link
                      to={`/explore/${relatedItem.slug}`}
                      className="mt-4 inline-block font-semibold text-green-700 transition hover:text-green-900"
                    >
                      View Details →
                    </Link>

                  </div>
                </div>
              ))}

            </div>
          </section>
        )}

        {/* ================= BACK BUTTON ================= */}
        <div className="mt-12 border-t pt-8">

          <Link
            to="/explore"
            className="inline-flex items-center rounded-lg border bg-white px-5 py-3 font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
          >
            ← Back to Explore
          </Link>

        </div>

      </main>
    </div>
  )
}

export default CulturalDetail