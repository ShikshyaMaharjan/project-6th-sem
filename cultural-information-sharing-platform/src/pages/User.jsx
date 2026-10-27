
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { API_URL, resolveImage } from "../config"

export default function User() {
  const user = JSON.parse(localStorage.getItem("user"))

  const [showProfile, setShowProfile] = useState(false)

  const [showContributionForm, setShowContributionForm] = useState(false)

  // ================= MY CONTRIBUTIONS =================
  const [showMyContributions, setShowMyContributions] = useState(false)
  const [myContributions, setMyContributions] = useState([])
  const [loadingContributions, setLoadingContributions] = useState(false)
  const [contributionListError, setContributionListError] = useState("")

  const [contribution, setContribution] = useState({
    title: "",
    category: "",
    community: "",
    location: "",
    description: "",
    significance: "",
    image: null
  })

  const [submitting, setSubmitting] = useState(false)
  const [contributionMessage, setContributionMessage] = useState("")
  const [contributionError, setContributionError] = useState("")

  // ================= CULTURAL CONTENT (from the database) =================
  const [culturalItems, setCulturalItems] = useState([])

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

  // ================= CONTRIBUTION IMAGE UPLOAD =================
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    setUploadingImage(true)
    setContributionError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_URL}/contributions/upload`, {
        method: "POST",
        body: formData
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to upload the image.")
      }

      // Saved in the existing image field, so the rest of the
      // contribution flow does not change.
      setContribution((current) => ({ ...current, image: data.url }))
    } catch (error) {
      setContributionError(error.message || "Failed to upload the image.")
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  // ================= FETCH MY CONTRIBUTIONS =================
  useEffect(() => {
    const fetchMyContributions = async () => {
      if (!user?.id) return

      setLoadingContributions(true)
      setContributionListError("")

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/contributions/user/${user.id}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data?.detail || "Failed to load your contributions."
          )
        }

        setMyContributions(data)
      } catch (error) {
        setContributionListError(
          error.message || "Something went wrong."
        )
      } finally {
        setLoadingContributions(false)
      }
    }

    if (showMyContributions) {
      fetchMyContributions()
    }
  }, [showMyContributions, user?.id])

  // ================= SUBMIT CONTRIBUTION =================
  const handleContributionSubmit = async (e) => {
    e.preventDefault()

    setSubmitting(true)
    setContributionMessage("")
    setContributionError("")

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/contributions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            user_id: user?.id,
            title: contribution.title,
            category: contribution.category,
            community: contribution.community,
            location: contribution.location || null,
            description: contribution.description,
            significance: contribution.significance || null,
            image: contribution.image || null
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to submit contribution."
        )
      }

      setContributionMessage(
        "Your contribution has been submitted successfully and is waiting for admin review."
      )

      // Add the newly submitted contribution immediately
      setMyContributions((previous) => [data, ...previous])

      setContribution({
        title: "",
        category: "",
        community: "",
        location: "",
        description: "",
        significance: "",
        image: null
      })

    } catch (error) {
      setContributionError(
        error.message || "Something went wrong."
      )
    } finally {
      setSubmitting(false)
    }
  }

  const featuredItems = culturalItems
    .slice(0, 3)
    .map((item) => ({ ...item, image: resolveImage(item.image) }))

  // ================= STATUS STYLES =================
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "border-green-200 bg-green-50 text-green-700"

      case "rejected":
        return "border-red-200 bg-red-50 text-red-700"

      default:
        return "border-yellow-200 bg-yellow-50 text-yellow-700"
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] font-jakarta text-[#26332d]">

      {/* ================= NAVBAR ================= */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-8">

          {/* Logo */}
          <Link
            to="/"
            className="text-[22px] font-bold tracking-[-0.5px] text-green-800"
          >
            Culture Nepal
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-9 md:flex">

            <Link
              to="/"
              className="text-[14px] font-medium text-gray-500 transition hover:text-green-800"
            >
              Home
            </Link>

            <Link
              to="/explore"
              className="text-[14px] font-medium text-gray-500 transition hover:text-green-800"
            >
              Explore
            </Link>

            <Link
              to="/events"
              className="text-[14px] font-medium text-gray-500 transition hover:text-green-800"
            >
              Events
            </Link>

            <Link
              to="/about"
              className="text-[14px] font-medium text-gray-500 transition hover:text-green-800"
            >
              About
            </Link>

          </nav>

          {/* ================= CLICKABLE USER ================= */}
          <button
            onClick={() => setShowProfile(true)}
            className="group flex items-center gap-3 rounded-lg px-2 py-1.5 text-left transition hover:bg-gray-50"
          >

            <div className="hidden sm:block">

              <p className="text-[13px] font-semibold text-gray-800">
                {user?.name || "User"}
              </p>

              <p className="mt-0.5 text-[11px] capitalize text-gray-400">
                {user?.role || "User"}
              </p>

            </div>

            {/* User Initial */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-800">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>

            {/* Arrow */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400 transition group-hover:text-green-700"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>

          </button>

        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-[1400px] px-8 py-8">

        {/* ================= FEATURED CULTURAL CONTENT ================= */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">

          <div className="grid min-h-[360px] md:grid-cols-2">

            {/* Image */}
            <div className="relative h-[300px] md:h-auto">

              <img
                src={featuredItems[0]?.image}
                alt={featuredItems[0]?.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />

            </div>

            {/* Content */}
            <div className="flex flex-col justify-center px-8 py-10 md:px-12">

              <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-green-700">
                Featured cultural content
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.7px] text-gray-900 md:text-4xl">
                {featuredItems[0]?.title}
              </h1>

              <p className="mt-4 max-w-lg text-[14px] leading-7 text-gray-500">
                {featuredItems[0]?.description}
              </p>

              <div className="mt-7">

                <Link
                  to={`/explore/${featuredItems[0]?.slug}`}
                  className="inline-flex items-center rounded-lg bg-green-800 px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-green-900"
                >
                  View cultural details

                  <span className="ml-3">
                    →
                  </span>
                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* ================= QUICK ACCESS ================= */}
        <section className="mt-9">

          <div className="mb-5">

            <h2 className="text-xl font-semibold tracking-[-0.3px] text-gray-900">
              Quick access
            </h2>

            <p className="mt-1 text-[13px] text-gray-500">
              Access the main features of Culture Nepal.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* ================= EXPLORE ================= */}
            <Link
              to="/explore"
              className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-800">

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>

                </div>

                <span className="text-gray-300 transition group-hover:text-green-700">
                  →
                </span>

              </div>

              <h3 className="mt-5 text-[15px] font-semibold text-gray-900">
                Explore Culture
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-gray-500">
                Discover heritage sites, food, attire, jewelry and festivals.
              </p>

            </Link>

            {/* ================= EVENTS ================= */}
            <Link
              to="/events"
              className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-800">

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="17"
                      rx="2"
                    />

                    <path d="M16 2v4M8 2v4M3 10h18" />

                  </svg>

                </div>

                <span className="text-gray-300 transition group-hover:text-green-700">
                  →
                </span>

              </div>

              <h3 className="mt-5 text-[15px] font-semibold text-gray-900">
                Cultural Events
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-gray-500">
                Find festivals, exhibitions, workshops and cultural events.
              </p>

            </Link>

            {/* ================= CONTRIBUTIONS ================= */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-800">

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                  </svg>

                </div>

                <span className="text-[11px] font-semibold text-green-700">
                  {myContributions.length}
                </span>

              </div>

              <h3 className="mt-5 text-[15px] font-semibold text-gray-900">
                My Contributions
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-gray-500">
                Submit and manage your cultural contributions.
              </p>

              <button
                onClick={() => setShowMyContributions(true)}
                className="mt-4 text-sm font-semibold text-green-700 transition hover:text-green-900"
              >
                View my contributions →
              </button>

            </div>

            {/* ================= FAVORITES ================= */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-800">

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z" />
                </svg>

              </div>

              <h3 className="mt-5 text-[15px] font-semibold text-gray-900">
                My Favorites
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-gray-500">
                Keep track of cultural places and items you love.
              </p>

            <Link
  to="/favorites"
  className="mt-4 inline-block text-sm font-medium text-green-800"
>
  View My Favorites →
</Link>

            </div>

          </div>

        </section>

        {/* ================= CULTURAL DISCOVERIES ================= */}
        <section className="mt-10">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <h2 className="text-xl font-semibold tracking-[-0.3px] text-gray-900">
                Cultural discoveries
              </h2>

              <p className="mt-1 text-[13px] text-gray-500">
                Explore cultural content available on the platform.
              </p>

            </div>

            <Link
              to="/explore"
              className="text-[13px] font-semibold text-green-700 transition hover:text-green-900"
            >
              View all →
            </Link>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {featuredItems.map((item) => (

              <Link
                key={item.slug}
                to={`/explore/${item.slug}`}
                className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >

                {/* Image */}
                <div className="h-48 overflow-hidden">

                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                </div>

                {/* Content */}
                <div className="p-5">

                  <p className="text-[11px] font-semibold uppercase tracking-wide text-green-700">
                    {item.category}
                  </p>

                  <h3 className="mt-2 text-[16px] font-semibold tracking-[-0.2px] text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-4 text-[12px] font-semibold text-gray-600 transition group-hover:text-green-700">
                    View details →
                  </div>

                </div>

              </Link>

            ))}

          </div>

        </section>

        {/* ================= PROFILE + CONTRIBUTION ================= */}
        <section className="mt-10 grid gap-5 md:grid-cols-2">

          {/* Profile Information */}
          <div className="rounded-xl bg-white p-7 shadow-sm ring-1 ring-gray-200">

            <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-gray-400">
              Account
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.3px] text-gray-900">
              Profile information
            </h2>

            <div className="mt-6 space-y-5">

              <div>

                <p className="text-[11px] font-medium text-gray-400">
                  Name
                </p>

                <p className="mt-1 text-[14px] font-medium text-gray-800">
                  {user?.name || "User"}
                </p>

              </div>

              <div>

                <p className="text-[11px] font-medium text-gray-400">
                  Email
                </p>

                <p className="mt-1 text-[14px] font-medium text-gray-800">
                  {user?.email || "Not available"}
                </p>

              </div>

              <div>

                <p className="text-[11px] font-medium text-gray-400">
                  Account type
                </p>

                <p className="mt-1 text-[14px] font-medium capitalize text-gray-800">
                  {user?.role || "User"}
                </p>

              </div>

            </div>

          </div>

          {/* Contribution */}
          <div className="rounded-xl bg-green-900 p-7 text-white">

            <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-green-300">
              Community
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.3px]">
              Contribute to Culture Nepal
            </h2>

            <p className="mt-3 max-w-lg text-[13px] leading-6 text-green-100/80">
              Share cultural knowledge, stories, recipes, photographs and
              traditions to help build a richer community resource.
            </p>

            <button
              onClick={() => {
                setShowContributionForm(true)
                setContributionMessage("")
                setContributionError("")
              }}
              className="mt-6 rounded-lg bg-white px-5 py-2.5 text-[12px] font-semibold text-green-900 transition hover:bg-green-50"
            >
              Submit contribution
            </button>

            <p className="mt-3 text-[11px] text-green-200/60">
              Share your cultural knowledge with the community.
            </p>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 border-t border-gray-200 bg-white">

        <div className="mx-auto max-w-[1400px] px-8 py-6">

          <p className="text-center text-[11px] text-gray-400">
            © 2026 Culture Nepal · Cultural Preservation Platform
          </p>

        </div>

      </footer>

      {/* ===================================================== */}
      {/*                    PROFILE SIDEBAR                     */}
      {/* ===================================================== */}

      {showProfile && (
        <>

          {/* ================= OVERLAY ================= */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setShowProfile(false)}
          />

          {/* ================= SIDEBAR ================= */}
          <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-[390px] bg-white shadow-2xl">

            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-6">

              <h2 className="text-lg font-semibold tracking-[-0.2px] text-gray-900">
                Your Profile
              </h2>

              <button
                onClick={() => setShowProfile(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close profile"
              >

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>

              </button>

            </div>

            {/* ================= PROFILE DETAILS ================= */}
            <div className="border-b border-gray-200 px-7 py-7">

              <div className="flex items-center gap-4">

                {/* Large Initial */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-semibold text-green-800">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">

                  <h3 className="truncate text-[15px] font-semibold text-gray-900">
                    {user?.name || "User"}
                  </h3>

                  <p className="mt-1 truncate text-[12px] text-gray-400">
                    {user?.email || "No email available"}
                  </p>

                  <p className="mt-1 text-[11px] capitalize text-green-700">
                    {user?.role || "User"} account
                  </p>

                </div>

              </div>

            </div>

            {/* ================= SIDEBAR MENU ================= */}
            <div className="px-4 py-6">

              <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[1.2px] text-gray-400">
                Account
              </p>

              {/* Profile */}
              <button
                className="flex w-full items-center gap-3 rounded-lg bg-green-50 px-3 py-3 text-left text-[13px] font-semibold text-green-800"
              >

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
                </svg>

                Profile

              </button>

              {/* Contributions */}
              <button
                onClick={() => {
                  setShowProfile(false)
                  setShowMyContributions(true)
                }}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[13px] font-medium text-gray-600 transition hover:bg-gray-50 hover:text-green-800"
              >

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </svg>

                My Contributions

              </button>

              {/* Favorites */}
              <button
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[13px] font-medium text-gray-600 transition hover:bg-gray-50 hover:text-green-800"
              >

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z" />
                </svg>

                My Favorites

              </button>

              {/* Settings */}
              <button
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[13px] font-medium text-gray-600 transition hover:bg-gray-50 hover:text-green-800"
              >

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.5v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.5h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.5v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.4V13h-.4a1.7 1.7 0 0 0-1.6 2Z" />
                </svg>

                Settings

              </button>

            </div>

            {/* ================= SIDEBAR BOTTOM ================= */}
            <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 bg-white p-6">

              <button
                onClick={() => {
                  localStorage.removeItem("user")
                  localStorage.removeItem("token")
                  window.location.href = "/login"
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-[13px] font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                  <path d="M21 3v18" />
                </svg>

                Log out

              </button>

            </div>

          </aside>

        </>
      )}

      {/* ===================================================== */}
      {/*                 MY CONTRIBUTIONS MODAL                */}
      {/* ===================================================== */}

      {showMyContributions && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setShowMyContributions(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">

            <div className="max-h-[90vh] w-full max-w-[750px] overflow-hidden rounded-2xl bg-white shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[1.3px] text-green-700">
                    Community
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-gray-900">
                    My Contributions
                  </h2>

                  <p className="mt-1 text-[12px] text-gray-500">
                    Track the contributions you have submitted.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMyContributions(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close contributions"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>

              </div>

              {/* Body */}
              <div className="max-h-[65vh] overflow-y-auto px-7 py-6">

                {/* Error */}
                {contributionListError && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] leading-5 text-red-700">
                    {contributionListError}
                  </div>
                )}

                {/* Loading */}
                {loadingContributions ? (
                  <div className="py-12 text-center">

                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />

                    <p className="mt-4 text-[12px] text-gray-500">
                      Loading your contributions...
                    </p>

                  </div>
                ) : myContributions.length === 0 ? (

                  /* Empty state */
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">

                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                      </svg>

                    </div>

                    <h3 className="mt-4 text-[15px] font-semibold text-gray-900">
                      No contributions yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-[12px] leading-5 text-gray-500">
                      You have not submitted any cultural contributions yet.
                    </p>

                  </div>

                ) : (

                  /* Contribution list */
                  <div className="space-y-4">

                    {myContributions.map((item) => (

                      <div
                        key={item.id}
                        className="rounded-xl border border-gray-200 bg-white p-5"
                      >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div className="min-w-0">

                            <h3 className="text-[15px] font-semibold text-gray-900">
                              {item.title}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-2">

                              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600">
                                {item.category}
                              </span>

                              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600">
                                {item.community}
                              </span>

                              {item.location && (
                                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600">
                                  {item.location}
                                </span>
                              )}

                            </div>

                          </div>

                          {/* Status */}
                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold capitalize ${getStatusStyles(
                              item.status
                            )}`}
                          >
                            {item.status || "pending"}
                          </span>

                        </div>

                        <p className="mt-4 line-clamp-3 text-[12px] leading-5 text-gray-500">
                          {item.description}
                        </p>

                        {/* Pending */}
                        {item.status?.toLowerCase() === "pending" && (
                          <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">

                            <p className="text-[11px] font-semibold text-yellow-800">
                              Waiting for admin review
                            </p>

                            <p className="mt-1 text-[11px] leading-5 text-yellow-700">
                              Your contribution has been submitted and is currently being reviewed by the administrator.
                            </p>

                          </div>
                        )}

                        {/* Approved */}
                        {item.status?.toLowerCase() === "approved" && (
                          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3">

                            <p className="text-[11px] font-semibold text-green-800">
                              Contribution approved
                            </p>

                            <p className="mt-1 text-[11px] leading-5 text-green-700">
                              Your contribution has been approved and is now visible in Explore.
                            </p>

                          </div>
                        )}

                        {/* Rejected */}
                        {item.status?.toLowerCase() === "rejected" && (
                          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                            <p className="text-[11px] font-semibold text-red-800">
                              Contribution rejected
                            </p>

                            {item.admin_note ? (
                              <p className="mt-1 text-[11px] leading-5 text-red-700">
                                <span className="font-semibold">
                                  Admin note:
                                </span>{" "}
                                {item.admin_note}
                              </p>
                            ) : (
                              <p className="mt-1 text-[11px] leading-5 text-red-700">
                                Your contribution was not approved by the administrator.
                              </p>
                            )}

                          </div>
                        )}

                      </div>

                    ))}

                  </div>

                )}

              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-7 py-4">

                <p className="text-[11px] text-gray-500">
                  {myContributions.length} contribution
                  {myContributions.length !== 1 ? "s" : ""}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setShowMyContributions(false)
                    setShowContributionForm(true)
                    setContributionMessage("")
                    setContributionError("")
                  }}
                  className="rounded-lg bg-green-800 px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-green-900"
                >
                  + Submit contribution
                </button>

              </div>

            </div>

          </div>
        </>
      )}

      {/* ===================================================== */}
      {/*                 CONTRIBUTION FORM                     */}
      {/* ===================================================== */}

      {showContributionForm && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            onClick={() => {
              if (!submitting) setShowContributionForm(false)
            }}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div className="max-h-[90vh] w-full max-w-[650px] overflow-y-auto rounded-2xl bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[1.3px] text-green-700">
                    Community contribution
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-gray-900">
                    Share cultural knowledge
                  </h2>

                  <p className="mt-1 text-[12px] text-gray-500">
                    Submit information for the Culture Nepal community.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!submitting) setShowContributionForm(false)
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close contribution form"
                >

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>

                </button>

              </div>

              <form
                onSubmit={handleContributionSubmit}
                className="space-y-5 px-7 py-6"
              >

                {contributionMessage && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[12px] leading-5 text-green-800">
                    {contributionMessage}
                  </div>
                )}

                {contributionError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] leading-5 text-red-700">
                    {contributionError}
                  </div>
                )}

                <div>

                  <label className="text-[12px] font-semibold text-gray-700">
                    Title
                  </label>

                  <input
                    type="text"
                    required
                    value={contribution.title}
                    onChange={(e) =>
                      setContribution({
                        ...contribution,
                        title: e.target.value
                      })
                    }
                    placeholder="e.g. Traditional Yomari Recipe"
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-[13px] outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  <div>

                    <label className="text-[12px] font-semibold text-gray-700">
                      Category
                    </label>

                    <select
                      required
                      value={contribution.category}
                      onChange={(e) =>
                        setContribution({
                          ...contribution,
                          category: e.target.value
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select category
                      </option>

                      <option value="Heritage Sites">
                        Heritage Sites
                      </option>

                      <option value="Traditional Attire">
                        Traditional Attire
                      </option>

                      <option value="Jewelry">
                        Jewelry
                      </option>

                      <option value="Food & Recipes">
                        Food & Recipes
                      </option>

                      <option value="Festivals">
                        Festivals
                      </option>

                      <option value="Traditions & Customs">
                        Traditions & Customs
                      </option>

                      <option value="Language">
                        Language
                      </option>

                      <option value="Traditional Arts">
                        Traditional Arts
                      </option>

                    </select>

                  </div>

                  <div>

                    <label className="text-[12px] font-semibold text-gray-700">
                      Community
                    </label>

                    <select
  required
  value={contribution.community}
  onChange={(e) =>
    setContribution({
      ...contribution,
      community: e.target.value
    })
  }
  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
>
  <option value="" disabled>Select a community</option>
  <option value="Gurung">Gurung</option>
  <option value="Tamang">Tamang</option>
  <option value="Tharu">Tharu</option>
  <option value="Newar">Newar (Newari)</option>
</select>

                  </div>

                </div>

                <div>

                  <label className="text-[12px] font-semibold text-gray-700">
                    Location
                  </label>

                  <input
                    type="text"
                    value={contribution.location}
                    onChange={(e) =>
                      setContribution({
                        ...contribution,
                        location: e.target.value
                      })
                    }
                    placeholder="e.g. Kathmandu, Nepal"
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-[13px] outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                <div>

                  <label className="text-[12px] font-semibold text-gray-700">
                    Description
                  </label>

                  <textarea
                    required
                    rows="5"
                    value={contribution.description}
                    onChange={(e) =>
                      setContribution({
                        ...contribution,
                        description: e.target.value
                      })
                    }
                    placeholder="Describe the cultural practice, food, festival, place, tradition, etc."
                    className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-[13px] leading-6 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                <div>

                  <label className="text-[12px] font-semibold text-gray-700">
                    Cultural significance
                  </label>

                  <textarea
                    rows="4"
                    value={contribution.significance}
                    onChange={(e) =>
                      setContribution({
                        ...contribution,
                        significance: e.target.value
                      })
                    }
                    placeholder="Explain why this cultural knowledge is important."
                    className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-[13px] leading-6 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                <div>

                  <label className="text-[12px] font-semibold text-gray-700">
                    Image URL{" "}
                    <span className="font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    type="text"
                    value={contribution.image || ""}
                    onChange={(e) =>
                      setContribution({
                        ...contribution,
                        image: e.target.value || null
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-[13px] outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                  <p className="mt-3 text-[12px] text-gray-500">
                    Or upload an image (JPG, PNG or WEBP, up to 5 MB)
                  </p>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="mt-2 block w-full text-[12px] text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-green-700"
                  />

                  {uploadingImage && (
                    <p className="mt-2 text-[12px] text-gray-500">
                      Uploading...
                    </p>
                  )}

                  {contribution.image && (
                    <img
                      src={resolveImage(contribution.image)}
                      alt="Contribution preview"
                      className="mt-3 h-28 rounded-lg border border-gray-200 object-cover"
                    />
                  )}

                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setShowContributionForm(false)}
                    className="rounded-lg border border-gray-200 px-5 py-2.5 text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-green-800 px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit contribution"}
                  </button>

                </div>

              </form>

            </div>
          </div>
        </>
      )}

    </div>
  )
}