import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Admin from "./pages/Admin"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import Events from "./pages/Events"
import About from "./pages/About"
import CulturalDetail from "./pages/CulturalDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"
import User from "./pages/User"
import EventDetail from "./pages/EventDetail"
import Organization from "./pages/Organization"
import Favorites from "./pages/Favorites"
import MyRentals from "./pages/MyRentals"
import RentAttire from "./pages/RentAttire"

import { getStoredUser } from "./config"

// Protect pages that require a specific logged-in role
function RequireRole({ roles, children }) {
  const user = getStoredUser()

  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/" replace />

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Explore Cultural Content */}
        <Route path="/explore" element={<Explore />} />

        {/* Cultural Details */}
        <Route path="/explore/:slug" element={<CulturalDetail />} />

        {/* Public Traditional Attire Rental Catalogue */}
        <Route path="/rent-attire" element={<RentAttire />} />

        {/* Events */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />

        {/* About */}
        <Route path="/about" element={<About />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard */}
        <Route
          path="/user"
          element={
            <RequireRole roles={["user"]}>
              <User />
            </RequireRole>
          }
        />

        {/* Favorites */}
        <Route path="/favorites" element={<Favorites />} />

        {/* User Rental History */}
        <Route path="/my-rentals" element={<MyRentals />} />

        {/* Organization Dashboard */}
        <Route
          path="/organization"
          element={
            <RequireRole roles={["organization"]}>
              <Organization />
            </RequireRole>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <RequireRole roles={["admin"]}>
              <Admin />
            </RequireRole>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App