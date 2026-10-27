import { Link, useNavigate } from "react-router-dom"

import { getStoredUser, clearLogin } from "../config"

function Navbar() {
  const navigate = useNavigate()
  const user = getStoredUser()

  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "organization"
      ? "/organization"
      : "/user"

  const handleLogout = () => {
    clearLogin()
    navigate("/login")
  }

  return (
    <nav className="flex items-center justify-between border-b bg-white px-8 py-5">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-green-700"
      >
        Culture Nepal
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-gray-700">
        <Link
          to="/"
          className="hover:text-green-700"
        >
          Home
        </Link>

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

        {/* Public Rental Catalogue */}
        <Link
          to="/rent-attire"
          className="hover:text-green-700"
        >
          Rent Attire
        </Link>

        <Link
          to="/about"
          className="hover:text-green-700"
        >
          About
        </Link>

        {/* User-only Links */}
        {user?.role === "user" && (
          <>
            <Link
              to="/favorites"
              className="hover:text-green-700"
            >
              Favorites
            </Link>

            <Link
              to="/my-rentals"
              className="hover:text-green-700"
            >
              My Rentals
            </Link>
          </>
        )}

        {/* Login / Dashboard / Logout */}
        {user ? (
          <>
            <Link
              to={dashboardPath}
              className="hover:text-green-700"
            >
              Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-green-700 px-5 py-2 text-white hover:bg-green-800"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="rounded-lg bg-green-700 px-5 py-2 text-white hover:bg-green-800"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar