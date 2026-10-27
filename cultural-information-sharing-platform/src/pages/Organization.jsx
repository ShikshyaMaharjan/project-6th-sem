import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

const API_URL = "http://127.0.0.1:8000"

export default function Organization() {
  const navigate = useNavigate()

  const [organization, setOrganization] = useState(null)
  const [events, setEvents] = useState([])
  const [notifications, setNotifications] = useState([])

  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    type: "Festival",
    date: "",
    time: "",
    location: "",
    description: "",
    about: "",
    image: "",
  })

  // --------------------------------------------------
  // GET LOGGED-IN ORGANIZATION
  // --------------------------------------------------

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      navigate("/login")
      return
    }

    try {
      const user = JSON.parse(storedUser)

      console.log("Logged-in user:", user)

      if (!user || !user.id) {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        navigate("/login")
        return
      }

      if (user.role !== "organization") {
        navigate("/")
        return
      }

      setOrganization(user)
    } catch (err) {
      console.error("Invalid user data:", err)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      navigate("/login")
    }
  }, [navigate])

  // --------------------------------------------------
  // LOAD ORGANIZATION EVENTS
  // --------------------------------------------------

  useEffect(() => {
    if (!organization?.id) return

    const loadEvents = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `${API_URL}/events/organization/${organization.id}`
        )

        if (!response.ok) {
          throw new Error("Unable to load your events.")
        }

        const data = await response.json()

        console.log("Organization events:", data)

        setEvents(data)
      } catch (err) {
        console.error("Event loading error:", err)
        setError("Unable to load your events.")
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [organization])

  // --------------------------------------------------
  // LOAD NOTIFICATIONS
  // --------------------------------------------------

  useEffect(() => {
    if (!organization?.id) return

    const loadNotifications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/notifications/user/${organization.id}`
        )

        if (!response.ok) {
          throw new Error("Unable to load notifications.")
        }

        const data = await response.json()

        console.log("Organization notifications:", data)

        setNotifications(data)
      } catch (err) {
        console.error("Notification loading error:", err)
      }
    }

    loadNotifications()
  }, [organization])

  // --------------------------------------------------
  // EVENT COUNTS
  // --------------------------------------------------

  const pendingCount = events.filter(
    (event) => event.status === "pending"
  ).length

  const approvedCount = events.filter(
    (event) => event.status === "approved"
  ).length

  const rejectedCount = events.filter(
    (event) => event.status === "rejected"
  ).length

  // --------------------------------------------------
  // NOTIFICATION COUNT
  // --------------------------------------------------

  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.is_read
  ).length

  // --------------------------------------------------
  // FORM CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // --------------------------------------------------
  // CREATE EVENT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!organization?.id) {
      setError("Organization information is missing.")
      return
    }

    setSubmitting(true)
    setError("")

    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")

    try {
      const response = await fetch(`${API_URL}/events/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: organization.id,
          slug,
          title: formData.title,
          type: formData.type,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          description: formData.description,
          about: formData.about || null,
          image: formData.image || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create event."
        )
      }

      console.log("Created event:", data)

      setEvents((previous) => [
        ...previous,
        data,
      ])

      setFormData({
        title: "",
        type: "Festival",
        date: "",
        time: "",
        location: "",
        description: "",
        about: "",
        image: "",
      })

      setShowAddForm(false)
    } catch (err) {
      console.error("Create event error:", err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // --------------------------------------------------
  // DELETE EVENT
  // --------------------------------------------------

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    )

    if (!confirmed) return

    try {
      setError("")

      const response = await fetch(
        `${API_URL}/events/${eventId}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete event."
        )
      }

      setEvents((previous) =>
        previous.filter(
          (event) => event.id !== eventId
        )
      )
    } catch (err) {
      console.error("Delete error:", err)
      setError(err.message)
    }
  }

  // --------------------------------------------------
  // MARK NOTIFICATION AS READ
  // --------------------------------------------------

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PUT",
        }
      )

      if (!response.ok) {
        throw new Error(
          "Unable to mark notification as read."
        )
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      )
    } catch (err) {
      console.error(
        "Notification read error:",
        err
      )
    }
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate("/login")
  }

  // --------------------------------------------------
  // LOADING SCREEN
  // --------------------------------------------------

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

            <p className="text-sm text-gray-500">
              Loading organization dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 rounded-3xl bg-gradient-to-r from-green-800 to-green-600 p-7 text-white shadow-lg md:p-9">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-green-100">
                Organization Dashboard
              </p>

              <h1 className="text-3xl font-bold md:text-4xl">
                Welcome, {organization.name || "Organization"}!
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-green-50 md:text-base">
                Manage your cultural events and share
                your organization's activities with the
                community.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                to="/events"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-800 shadow-sm transition hover:bg-green-50"
              >
                View Events
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Logout
              </button>

            </div>
          </div>
        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>

          </div>
        )}

        {/* ==========================================
            STATISTICS
        ========================================== */}

        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Events */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  My Events
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {events.length}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Cultural events created
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                📅
              </div>

            </div>
          </div>

          {/* Account */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Account Type
                </p>

                <p className="mt-2 text-2xl font-bold capitalize text-gray-900">
                  {organization.role || "Organization"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Verified account role
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🏛️
              </div>

            </div>
          </div>

          {/* Email */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">

            <div className="flex items-start justify-between">

              <div className="min-w-0">

                <p className="text-sm font-medium text-gray-500">
                  Organization Email
                </p>

                <p className="mt-2 truncate text-base font-bold text-gray-900">
                  {organization.email}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Registered email address
                </p>

              </div>

              <div className="ml-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                ✉️
              </div>

            </div>
          </div>

        </div>

        {/* ==========================================
            EVENT STATUS SUMMARY
        ========================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          {/* Pending */}

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-yellow-700">
                  Pending Events
                </p>

                <p className="mt-1 text-2xl font-bold text-yellow-800">
                  {pendingCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                ⏳
              </div>

            </div>

            <p className="mt-2 text-xs text-yellow-700">
              Waiting for administrator approval
            </p>

          </div>

          {/* Approved */}

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-green-700">
                  Approved Events
                </p>

                <p className="mt-1 text-2xl font-bold text-green-800">
                  {approvedCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                ✓
              </div>

            </div>

            <p className="mt-2 text-xs text-green-700">
              Publicly visible events
            </p>

          </div>

          {/* Rejected */}

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Rejected Events
                </p>

                <p className="mt-1 text-2xl font-bold text-red-800">
                  {rejectedCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-xl">
                !
              </div>

            </div>

            <p className="mt-2 text-xs text-red-700">
              Events rejected by administrator
            </p>

          </div>

        </div>

        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}

        <div className="mb-8">

          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <button
              onClick={() => setShowAddForm(true)}
              className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
            >

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                +
              </div>

              <h3 className="font-semibold text-gray-900">
                Create Event
              </h3>

              <p className="mt-1 text-sm leading-5 text-gray-500">
                Publish a festival, workshop,
                exhibition, or cultural activity.
              </p>

            </button>

            <Link
              to="/events"
              className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                👁️
              </div>

              <h3 className="font-semibold text-gray-900">
                Explore Events
              </h3>

              <p className="mt-1 text-sm leading-5 text-gray-500">
                View cultural events available
                on the public platform.
              </p>

            </Link>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl">
                🏛️
              </div>

              <h3 className="font-semibold text-gray-900">
                Organization Profile
              </h3>

              <p className="mt-1 text-sm leading-5 text-gray-500">
                Organization profile management
                will be available here.
              </p>

            </div>

          </div>
        </div>

        {/* ==========================================
            NOTIFICATIONS
        ========================================== */}

        <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Updates about your organization's events.
              </p>
            </div>

            {unreadNotificationCount > 0 && (
              <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                {unreadNotificationCount} unread
              </span>
            )}

          </div>

          <div className="p-6">

            {notifications.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
                  🔔
                </div>

                <h3 className="font-semibold text-gray-900">
                  No notifications
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  You will receive notifications when
                  there are updates about your events.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {notifications.map((notification) => (

                  <div
                    key={notification.id}
                    className={`rounded-xl border p-5 ${
                      notification.is_read
                        ? "border-gray-200 bg-gray-50"
                        : "border-blue-200 bg-blue-50"
                    }`}
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>

                          {!notification.is_read && (
                            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
                              New
                            </span>
                          )}

                        </div>

                        <p className="mt-2 text-sm leading-6 text-gray-700">
                          {notification.message}
                        </p>

                        {notification.created_at && (
                          <p className="mt-2 text-xs text-gray-500">
                            {new Date(
                              notification.created_at
                            ).toLocaleString()}
                          </p>
                        )}

                      </div>

                      {!notification.is_read && (
                        <button
                          onClick={() =>
                            markNotificationAsRead(
                              notification.id
                            )
                          }
                          className="w-fit rounded-lg border border-blue-300 bg-white px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                        >
                          Mark as read
                        </button>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>
        </section>

        {/* ==========================================
            ADD EVENT FORM
        ========================================== */}

        {showAddForm && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create New Event
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a cultural event to the platform.
                </p>
              </div>

              <button
                onClick={() => setShowAddForm(false)}
                className="rounded-lg px-3 py-2 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 bg-gray-50 p-6 md:grid-cols-2"
            >

              {/* Title */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Indra Jatra Cultural Celebration"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
                />

              </div>

              {/* Type */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Type *
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
                >

                  <option value="Festival">
                    Festival
                  </option>

                  <option value="Cultural Performance">
                    Cultural Performance
                  </option>

                  <option value="Workshop">
                    Workshop
                  </option>

                  <option value="Exhibition">
                    Exhibition
                  </option>

                  <option value="Heritage Event">
                    Heritage Event
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* Date */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
                />

              </div>

              {/* Time */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Time *
                </label>

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
                />

              </div>

              {/* Location */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Location *
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Patan Durbar Square"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
                />

              </div>

              {/* Description */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description of the event..."
                  rows="3"
                  required
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
                />

              </div>

              {/* About */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  About the Event
                </label>

                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Provide detailed information about the event..."
                  rows="4"
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
                />

              </div>

              {/* Image */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Optional image URL"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Image upload can be added later.
                </p>

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 md:col-span-2">

                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Creating..."
                    : "Create Event"}
                </button>

              </div>

            </form>
          </section>
        )}

        {/* ==========================================
            MY EVENTS
        ========================================== */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                My Events
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Events created by your organization.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              + Add Event
            </button>

          </div>

          <div className="p-6">

            {/* Loading */}

            {loading && (
              <div className="py-14 text-center">

                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

                <p className="text-sm text-gray-500">
                  Loading your events...
                </p>

              </div>
            )}

            {/* Empty */}

            {!loading && events.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-14 text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
                  📅
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  No events yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Your organization hasn't created
                  any cultural events yet. Create your
                  first event to share it with the
                  community.
                </p>

                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-5 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Create First Event
                </button>

              </div>
            )}

            {/* Events */}

            {!loading && events.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">

                {events.map((event) => (

                  <article
                    key={event.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-green-200 hover:shadow-md"
                  >

                    {/* Image */}

                    {event.image ? (

                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-48 w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-green-50 to-green-100 text-4xl">
                        🏛️
                      </div>

                    )}

                    <div className="p-5">

                      {/* Type + ID + Status */}

                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            {event.type}
                          </span>

                          <span className="text-xs text-gray-400">
                            #{event.id}
                          </span>

                        </div>

                        {/* STATUS */}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            event.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : event.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {event.status || "pending"}
                        </span>

                      </div>

                      {/* Title */}

                      <h3 className="text-lg font-bold text-gray-900">
                        {event.title}
                      </h3>

                      {/* Description */}

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                        {event.description}
                      </p>

                      {/* Event Information */}

                      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500">

                        <p>
                          <span className="font-semibold text-gray-700">
                            Date:
                          </span>{" "}
                          {event.date}
                        </p>

                        <p>
                          <span className="font-semibold text-gray-700">
                            Time:
                          </span>{" "}
                          {event.time}
                        </p>

                        <p>
                          <span className="font-semibold text-gray-700">
                            Location:
                          </span>{" "}
                          {event.location}
                        </p>

                      </div>

                      {/* Status Message */}

                      {event.status === "pending" && (
                        <div className="mt-4 rounded-xl bg-yellow-50 px-4 py-3 text-xs leading-5 text-yellow-700">
                          This event is waiting for administrator approval.
                        </div>
                      )}

                      {event.status === "approved" && (
                        <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-xs leading-5 text-green-700">
                          This event has been approved and is publicly visible.
                        </div>
                      )}

                      {event.status === "rejected" && (
                        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                          This event was rejected. Please check your notifications for more information.
                        </div>
                      )}

                      {/* Buttons */}

                      <div className="mt-5 flex gap-2">

                        {/* View Event only for approved */}

                        {event.status === "approved" && (
                          <Link
                            to={`/events/${event.slug}`}
                            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            View Event
                          </Link>
                        )}

                        <button
                          onClick={() =>
                            handleDelete(event.id)
                          }
                          className={`rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 ${
                            event.status !== "approved"
                              ? "flex-1"
                              : ""
                          }`}
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  </article>

                ))}

              </div>
            )}

          </div>
        </section>

      </main>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="mt-12 border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            © 2026 Culture Nepal
          </p>

          <p>
            Discover • Preserve • Share
          </p>

        </div>

      </footer>

    </div>
  )
}