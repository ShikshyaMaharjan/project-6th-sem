import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { API_URL, resolveImage } from "../config";
import { AdminFavorites, AdminRentals } from "../components/AdminExtras";

export default function Admin() {
  function AccountAvatar({ name, organization = false }) {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);

  const initials = words.length
    ? (
        words[0].charAt(0) +
        (words.length > 1 ? words[words.length - 1].charAt(0) : "")
      ).toUpperCase()
    : organization ? "O" : "U";

  return (
    <span
      title={name || "Profile"}
      className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
        organization
          ? "bg-purple-100 text-purple-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {initials}
    </span>
  );
}
  // =========================================================
  // GENERAL STATE
  // =========================================================

  const [activeMenu, setActiveMenu] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // =========================================================
  // CURRENT USER
  // =========================================================

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // =========================================================
  // ORGANIZATION STATE
  // =========================================================

  const [organizations, setOrganizations] = useState([]);

  // =========================================================
  // USER STATE
  // =========================================================

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  // =========================================================
  // CONTRIBUTION STATE
  // =========================================================

  const [contributions, setContributions] = useState([]);
  const [contributionsLoading, setContributionsLoading] = useState(false);
  const [contributionsError, setContributionsError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // =========================================================
  // EVENT STATE
  // =========================================================

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");
  const [eventActionLoading, setEventActionLoading] = useState(null);

  // =========================================================
  // EVENT CREATE STATE
  // =========================================================

  const emptyEventForm = {
    title: "",
    type: "Festival",
    date: "",
    time: "",
    location: "",
    description: "",
    about: "",
    image: "",
  };

  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [eventSaving, setEventSaving] = useState(false);
  const [eventDeletingId, setEventDeletingId] = useState(null);

  // =========================================================
  // CONTRIBUTION CREATE STATE
  // =========================================================

  const emptyContributionForm = {
    title: "",
    category: "Heritage Sites",
    community: "",
    location: "",
    description: "",
    significance: "",
    image: "",
  };

  const [showContributionForm, setShowContributionForm] = useState(false);
  const [contributionForm, setContributionForm] = useState(
    emptyContributionForm
  );
  const [contributionSaving, setContributionSaving] = useState(false);
  const [contributionDeletingId, setContributionDeletingId] = useState(null);

  // =========================================================
  // CULTURAL CONTENT STATE
  // =========================================================

  const [culturalContent, setCulturalContent] = useState([]);
  const [culturalLoading, setCulturalLoading] = useState(false);
  const [culturalError, setCulturalError] = useState("");

  const [showCulturalForm, setShowCulturalForm] = useState(false);
  const [editingCulturalId, setEditingCulturalId] = useState(null);
  const [culturalSaving, setCulturalSaving] = useState(false);
  const [culturalDeletingId, setCulturalDeletingId] = useState(null);

  const emptyCulturalForm = {
  title: "",
  slug: "",
  category: "Heritage Sites",
  community: "Newar",
  location: "",
  description: "",
  significance: "",
  image: "",
  is_rentable: false,
};

  const [culturalForm, setCulturalForm] = useState(emptyCulturalForm);

  // =========================================================
  // MENU
  // =========================================================

  const menuItems = [
    { name: "Overview", icon: "⌂" },
    { name: "Cultural Content", icon: "▣" },
    { name: "Contributions", icon: "✎" },
    { name: "Events", icon: "◫" },
    { name: "Rentals", icon: "◈" },
    { name: "Organizations", icon: "♜" },
    { name: "Users", icon: "♙" },
  ];

  const managementItems = [
    { name: "Favorites", icon: "♡" },
    { name: "Settings", icon: "⚙" },
  ];

  // =========================================================
  // CULTURAL CATEGORIES
  // =========================================================

  const categoryOptions = [
    "All",
    "Heritage Sites",
    "Traditional Attire",
    "Jewelry",
    "Food & Recipes",
    "Festivals",
  ];

  // =========================================================
  // FETCH CULTURAL CONTENT
  // =========================================================

  const fetchCulturalContent = async () => {
    setCulturalLoading(true);
    setCulturalError("");

    try {
      const response = await fetch(`${API_URL}/cultural/`);

      if (!response.ok) {
        throw new Error("Failed to load cultural content.");
      }

      const data = await response.json();

      setCulturalContent(data);
    } catch (error) {
      console.error("Cultural content fetch error:", error);

      setCulturalError(
        error.message || "Unable to load cultural content."
      );
    } finally {
      setCulturalLoading(false);
    }
  };

  // =========================================================
  // FETCH CONTRIBUTIONS
  // =========================================================

  const fetchContributions = async () => {
    setContributionsLoading(true);
    setContributionsError("");

    try {
      const response = await fetch(`${API_URL}/contributions/`);

      if (!response.ok) {
        throw new Error("Failed to load contributions.");
      }

      const data = await response.json();

      setContributions(data);
    } catch (error) {
      console.error("Contribution fetch error:", error);

      setContributionsError(
        error.message || "Unable to load contributions."
      );
    } finally {
      setContributionsLoading(false);
    }
  };

  // =========================================================
  // FETCH EVENTS
  // =========================================================

  const fetchEvents = async () => {
    setEventsLoading(true);
    setEventsError("");

    try {
      const response = await fetch(`${API_URL}/events/admin/all`);

      if (!response.ok) {
        throw new Error("Failed to load events.");
      }

      const data = await response.json();

      setEvents(data);
    } catch (error) {
      console.error("Event fetch error:", error);

      setEventsError(
        error.message || "Unable to load events."
      );
    } finally {
      setEventsLoading(false);
    }
  };

  // =========================================================
  // FETCH ORGANIZATIONS
  // =========================================================

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${API_URL}/organizations/`);

      if (!response.ok) {
        throw new Error("Failed to load organizations.");
      }

      const data = await response.json();

      setOrganizations(data);
    } catch (error) {
      console.error("Organization fetch error:", error);
    }
  };

  // =========================================================
  // FETCH USERS
  // =========================================================

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError("");

    try {
      const response = await fetch(`${API_URL}/users/`);

      if (!response.ok) {
        throw new Error("Failed to load users.");
      }

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error("User fetch error:", error);

      setUsersError(
        error.message || "Unable to load users."
      );
    } finally {
      setUsersLoading(false);
    }
  };

  // =========================================================
  // LOAD DATA WHEN SECTION OPENS
  // =========================================================

  useEffect(() => {
    if (activeMenu === "Cultural Content") {
      fetchCulturalContent();
    }

    if (activeMenu === "Contributions") {
      fetchContributions();
    }

    if (activeMenu === "Events") {
      fetchEvents();
    }

    if (activeMenu === "Organizations") {
      fetchOrganizations();
    }

    if (activeMenu === "Users") {
      fetchUsers();
    }
  }, [activeMenu]);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCulturalContent();
    fetchOrganizations();
  }, []);

  // =========================================================
  // CULTURAL IMAGE HELPER
  // =========================================================

  const getCulturalImage = (item) => {
    // Images now come from the database: either a /media/... path
    // served by FastAPI or a full image URL entered by the admin.

    return resolveImage(item.image) || "";
  };

  // =========================================================
  // CULTURAL FILTER
  // =========================================================

  const filteredCulturalItems = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();

    return culturalContent.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const matchesSearch =
        !search ||
        item.title?.toLowerCase().includes(search) ||
        item.slug?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search) ||
        item.community?.toLowerCase().includes(search) ||
        item.location?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [
    culturalContent,
    searchQuery,
    selectedCategory,
  ]);

  // =========================================================
  // CULTURAL CATEGORY COUNTS
  // =========================================================

  const categoryCounts = useMemo(() => {
    return {
      "Heritage Sites": culturalContent.filter(
        (item) => item.category === "Heritage Sites"
      ).length,

      "Traditional Attire": culturalContent.filter(
        (item) => item.category === "Traditional Attire"
      ).length,

      Jewelry: culturalContent.filter(
        (item) => item.category === "Jewelry"
      ).length,

      "Food & Recipes": culturalContent.filter(
        (item) => item.category === "Food & Recipes"
      ).length,

      Festivals: culturalContent.filter(
        (item) => item.category === "Festivals"
      ).length,
    };
  }, [culturalContent]);

  // =========================================================
  // OPEN CREATE FORM
  // =========================================================

  const openCreateCulturalForm = () => {
    setEditingCulturalId(null);

    setCulturalForm({
      ...emptyCulturalForm,
    });

    setShowCulturalForm(true);
  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const openEditCulturalForm = (item) => {
    setEditingCulturalId(item.id);

    setCulturalForm({
  title: item.title || "",
  slug: item.slug || "",
  category: item.category || "Heritage Sites",
  community: item.community || "Newar",
  location: item.location || "",
  description: item.description || "",
  significance: item.significance || "",
  image: item.image || "",
  is_rentable: item.is_rentable ?? false,
});

    setShowCulturalForm(true);
  };

  // =========================================================
  // CLOSE CULTURAL FORM
  // =========================================================

  const closeCulturalForm = () => {
    if (culturalSaving) {
      return;
    }

    setShowCulturalForm(false);
    setEditingCulturalId(null);
    setCulturalForm({
      ...emptyCulturalForm,
    });
  };

  // =========================================================
  // HANDLE CULTURAL FORM CHANGE
  // =========================================================

  const handleCulturalFormChange = (event) => {
    const { name, value } = event.target;

    setCulturalForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================================
  // GENERATE SLUG
  // =========================================================

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // =========================================================
  // HANDLE TITLE CHANGE
  // =========================================================

  const handleTitleChange = (event) => {
    const title = event.target.value;

    setCulturalForm((current) => ({
      ...current,
      title,
      slug:
        !editingCulturalId ||
        current.slug === generateSlug(current.title)
          ? generateSlug(title)
          : current.slug,
    }));
  };

  // =========================================================
  // SAVE CULTURAL CONTENT
  // =========================================================

  const saveCulturalContent = async (event) => {
    event.preventDefault();

    if (!culturalForm.title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!culturalForm.slug.trim()) {
      alert("Please enter a slug.");
      return;
    }

    if (!culturalForm.category.trim()) {
      alert("Please select a category.");
      return;
    }

    if (!culturalForm.community.trim()) {
      alert("Please enter the community.");
      return;
    }

    if (!culturalForm.description.trim()) {
      alert("Please enter a description.");
      return;
    }

    setCulturalSaving(true);

    try {
      const url = editingCulturalId
        ? `${API_URL}/cultural/${editingCulturalId}`
        : `${API_URL}/cultural/`;

      const method = editingCulturalId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: culturalForm.title.trim(),
          slug: culturalForm.slug.trim(),
          category: culturalForm.category,
          community: culturalForm.community.trim(),
          location:
            culturalForm.location.trim() || null,
          description:
            culturalForm.description.trim(),
         significance:
  culturalForm.significance.trim() || null,
image:
  culturalForm.image.trim() || null,
is_rentable: culturalForm.is_rentable,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Failed to ${
              editingCulturalId
                ? "update"
                : "create"
            } cultural content.`
        );
      }

      const savedItem = await response.json();

      if (editingCulturalId) {
        setCulturalContent((current) =>
          current.map((item) =>
            item.id === savedItem.id
              ? savedItem
              : item
          )
        );

        alert(
          "Cultural information updated successfully."
        );
      } else {
        setCulturalContent((current) => [
          ...current,
          savedItem,
        ]);

        alert(
          "New cultural information created successfully."
        );
      }

      closeCulturalForm();
    } catch (error) {
      console.error(
        "Save cultural content error:",
        error
      );

      alert(
        error.message ||
          "Unable to save cultural information."
      );
    } finally {
      setCulturalSaving(false);
    }
  };

  // =========================================================
  // DELETE CULTURAL CONTENT
  // =========================================================

  const deleteCulturalContent = async (culturalId) => {
    const item = culturalContent.find(
      (culturalItem) =>
        culturalItem.id === culturalId
    );

    if (!item) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setCulturalDeletingId(culturalId);

    try {
      const response = await fetch(
        `${API_URL}/cultural/${culturalId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete cultural content."
        );
      }

      setCulturalContent((current) =>
        current.filter(
          (culturalItem) =>
            culturalItem.id !== culturalId
        )
      );

      alert(
        "Cultural information deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete cultural content error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete cultural information."
      );
    } finally {
      setCulturalDeletingId(null);
    }
  };

  // =========================================================
  // APPROVE CONTRIBUTION
  // =========================================================

  const approveContribution = async (
    contributionId
  ) => {
    setActionLoading(contributionId);

    try {
      const response = await fetch(
        `${API_URL}/contributions/${contributionId}/approve`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to approve contribution."
        );
      }

      const updatedContribution =
        await response.json();

      setContributions((current) =>
        current.map((contribution) =>
          contribution.id ===
          updatedContribution.id
            ? updatedContribution
            : contribution
        )
      );
    } catch (error) {
      console.error(
        "Approve contribution error:",
        error
      );

      alert(
        error.message ||
          "Failed to approve contribution."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // REJECT CONTRIBUTION
  // =========================================================

  const rejectContribution = async (
    contributionId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this contribution?"
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(contributionId);

    try {
      const response = await fetch(
        `${API_URL}/contributions/${contributionId}/reject`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to reject contribution."
        );
      }

      const updatedContribution =
        await response.json();

      setContributions((current) =>
        current.map((contribution) =>
          contribution.id ===
          updatedContribution.id
            ? updatedContribution
            : contribution
        )
      );
    } catch (error) {
      console.error(
        "Reject contribution error:",
        error
      );

      alert(
        error.message ||
          "Failed to reject contribution."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // APPROVE EVENT
  // =========================================================

  const approveEvent = async (eventId) => {
    setEventActionLoading(eventId);

    try {
      const response = await fetch(
        `${API_URL}/events/${eventId}/approve`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to approve event."
        );
      }

      const updatedEvent =
        await response.json();

      setEvents((current) =>
        current.map((event) =>
          event.id === updatedEvent.id
            ? updatedEvent
            : event
        )
      );
    } catch (error) {
      console.error(
        "Approve event error:",
        error
      );

      alert(
        error.message ||
          "Failed to approve event."
      );
    } finally {
      setEventActionLoading(null);
    }
  };

  // =========================================================
  // REJECT EVENT
  // =========================================================

  const rejectEvent = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this event?"
    );

    if (!confirmed) {
      return;
    }

    setEventActionLoading(eventId);

    try {
      const response = await fetch(
        `${API_URL}/events/${eventId}/reject`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to reject event."
        );
      }

      const updatedEvent =
        await response.json();

      setEvents((current) =>
        current.map((event) =>
          event.id === updatedEvent.id
            ? updatedEvent
            : event
        )
      );
    } catch (error) {
      console.error(
        "Reject event error:",
        error
      );

      alert(
        error.message ||
          "Failed to reject event."
      );
    } finally {
      setEventActionLoading(null);
    }
  };

  // =========================================================
  // DELETE CONTRIBUTION
  // =========================================================

  const deleteContribution = async (contributionId) => {
    const contribution = contributions.find(
      (item) => item.id === contributionId
    );

    if (!contribution) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${contribution.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setContributionDeletingId(contributionId);

    try {
      const response = await fetch(
        `${API_URL}/contributions/${contributionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || "Failed to delete contribution."
        );
      }

      setContributions((current) =>
        current.filter((item) => item.id !== contributionId)
      );

      alert("Contribution deleted successfully.");
    } catch (error) {
      console.error("Delete contribution error:", error);
      alert(error.message || "Unable to delete contribution.");
    } finally {
      setContributionDeletingId(null);
    }
  };

  // =========================================================
  // OPEN CONTRIBUTION CREATE FORM
  // =========================================================

  const openCreateContributionForm = () => {
    setContributionForm({ ...emptyContributionForm });
    setShowContributionForm(true);
  };

  // =========================================================
  // CLOSE CONTRIBUTION FORM
  // =========================================================

  const closeContributionForm = () => {
    if (contributionSaving) {
      return;
    }

    setShowContributionForm(false);
    setContributionForm({ ...emptyContributionForm });
  };

  // =========================================================
  // HANDLE CONTRIBUTION FORM CHANGE
  // =========================================================

  const handleContributionFormChange = (event) => {
    const { name, value } = event.target;

    setContributionForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE CONTRIBUTION
  // =========================================================

  const saveContribution = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      alert("Administrator information is not available.");
      return;
    }

    if (!contributionForm.title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!contributionForm.community.trim()) {
      alert("Please enter the community.");
      return;
    }

    if (!contributionForm.description.trim()) {
      alert("Please enter a description.");
      return;
    }

    setContributionSaving(true);

    try {
      const response = await fetch(`${API_URL}/contributions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          title: contributionForm.title.trim(),
          category: contributionForm.category,
          community: contributionForm.community.trim(),
          location: contributionForm.location.trim() || null,
          description: contributionForm.description.trim(),
          significance:
            contributionForm.significance.trim() || null,
          image: contributionForm.image.trim() || null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to create contribution."
        );
      }

      setContributions((current) => [data, ...current]);
      closeContributionForm();
      alert("Contribution created successfully.");
    } catch (error) {
      console.error("Create contribution error:", error);
      alert(error.message || "Unable to create contribution.");
    } finally {
      setContributionSaving(false);
    }
  };

  // =========================================================
  // OPEN EVENT CREATE FORM
  // =========================================================

  const openCreateEventForm = () => {
    setEventForm({ ...emptyEventForm });
    setShowEventForm(true);
  };

  // =========================================================
  // CLOSE EVENT FORM
  // =========================================================

  const closeEventForm = () => {
    if (eventSaving) {
      return;
    }

    setShowEventForm(false);
    setEventForm({ ...emptyEventForm });
  };

  // =========================================================
  // HANDLE EVENT FORM CHANGE
  // =========================================================

  const handleEventFormChange = (event) => {
    const { name, value } = event.target;

    setEventForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE ADMIN EVENT
  // =========================================================

  const saveAdminEvent = async (event) => {
    event.preventDefault();

    if (!eventForm.title.trim()) {
      alert("Please enter an event title.");
      return;
    }

    if (!eventForm.date.trim()) {
      alert("Please enter the event date.");
      return;
    }

    if (!eventForm.time.trim()) {
      alert("Please enter the event time.");
      return;
    }

    if (!eventForm.location.trim()) {
      alert("Please enter the event location.");
      return;
    }

    if (!eventForm.description.trim()) {
      alert("Please enter an event description.");
      return;
    }

    setEventSaving(true);

    try {
      const slug = eventForm.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      const response = await fetch(`${API_URL}/events/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          title: eventForm.title.trim(),
          type: eventForm.type,
          date: eventForm.date.trim(),
          time: eventForm.time.trim(),
          location: eventForm.location.trim(),
          description: eventForm.description.trim(),
          about: eventForm.about.trim() || null,
          image: eventForm.image.trim() || null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to create admin event."
        );
      }

      setEvents((current) => [data, ...current]);
      closeEventForm();
      alert("Event created successfully.");
    } catch (error) {
      console.error("Create admin event error:", error);
      alert(error.message || "Unable to create event.");
    } finally {
      setEventSaving(false);
    }
  };

  // =========================================================
  // DELETE EVENT
  // =========================================================

  const deleteEvent = async (eventId) => {
    const eventItem = events.find((item) => item.id === eventId);

    if (!eventItem) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${eventItem.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setEventDeletingId(eventId);

    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to delete event."
        );
      }

      setEvents((current) =>
        current.filter((item) => item.id !== eventId)
      );

      alert("Event deleted successfully.");
    } catch (error) {
      console.error("Delete event error:", error);
      alert(error.message || "Unable to delete event.");
    } finally {
      setEventDeletingId(null);
    }
  };

  // =========================================================
  // CHANGE MENU
  // =========================================================


  const changeMenu = (menu) => {
    setActiveMenu(menu);
    setSearchQuery("");
    setSelectedCategory("All");
  };

  // =========================================================
  // COUNTS
  // =========================================================

  const pendingCount = contributions.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = contributions.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = contributions.filter(
    (item) => item.status === "rejected"
  ).length;

  const pendingEventCount = events.filter(
    (event) => event.status === "pending"
  ).length;

  const approvedEventCount = events.filter(
    (event) => event.status === "approved"
  ).length;

  const rejectedEventCount = events.filter(
    (event) => event.status === "rejected"
  ).length;

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    if (status === "approved") {
      return "bg-green-50 text-green-700 border-green-100";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-100";
  };

  // =========================================================
  // EMPTY SECTION
  // =========================================================

  // eslint-disable-next-line no-unused-vars
  const renderEmptySection = (
    title,
    description,
    icon
  ) => {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 text-green-700 flex items-center justify-center text-3xl mb-5">
          {icon}
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="text-gray-500 text-sm max-w-md mx-auto mt-2 leading-6">
          {description}
        </p>
      </div>
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 bottom-0 z-20">
        {/* Logo */}

        <div className="px-6 py-6 border-b border-gray-100">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-green-700 text-white flex items-center justify-center text-xl font-semibold">
              C
            </div>

            <div>
              <h1 className="font-bold text-gray-900 text-lg">
                Culture Nepal
              </h1>

              <p className="text-xs text-gray-500">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Dashboard
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() =>
                  changeMenu(item.name)
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  activeMenu === item.name
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg w-5">
                  {item.icon}
                </span>

                {item.name}

                {item.name ===
                  "Contributions" &&
                  pendingCount > 0 && (
                    <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}

                {item.name === "Events" &&
                  pendingEventCount > 0 && (
                    <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs flex items-center justify-center">
                      {pendingEventCount}
                    </span>
                  )}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3 mt-8">
            Management
          </p>

          <div className="space-y-1">
            {managementItems.map((item) => (
              <button
                key={item.name}
                onClick={() =>
                  changeMenu(item.name)
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  activeMenu === item.name
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg w-5">
                  {item.icon}
                </span>

                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Profile */}

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.name || "Administrator"}
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="ml-64 flex-1">
        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeMenu}
            </h2>

            <p className="text-sm text-gray-500">
              Manage your Cultural Information Sharing Platform
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
              <span className="text-gray-400">
                ⌕
              </span>

              <input
                type="text"
                placeholder={
                  activeMenu ===
                  "Cultural Content"
                    ? "Search cultural content..."
                    : activeMenu ===
                      "Contributions"
                    ? "Search contributions..."
                    : activeMenu ===
                      "Events"
                    ? "Search events..."
                    : activeMenu ===
                      "Organizations"
                    ? "Search organizations..."
                    : activeMenu === "Users"
                    ? "Search users..."
                    : "Search..."
                }
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                className="bg-transparent outline-none text-sm w-48"
              />
            </div>

            <button
              type="button"
              className="relative text-gray-500 text-xl"
            >
              ♧

              {(pendingCount > 0 ||
                pendingEventCount > 0) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-green-700"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* =====================================================
            BODY
        ===================================================== */}

        <div className="p-8">
          {/* ===================================================
              OVERVIEW
          =================================================== */}

          {activeMenu === "Overview" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Good to see you,{" "}
                  {user?.name || "Admin"} 👋
                </h1>

                <p className="text-gray-500 mt-1">
                  Here's an overview of your Cultural Information Sharing Platform.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {/* Cultural Content */}

                <button
                  type="button"
                  onClick={() =>
                    changeMenu(
                      "Cultural Content"
                    )
                  }
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm text-left hover:border-green-200 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center text-xl">
                      ▣
                    </div>

                    <span className="text-xs text-green-600 font-medium">
                      Published
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-5">
                    Cultural Content
                  </p>

                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {culturalContent.length}
                  </h3>

                  <p className="text-xs text-gray-400 mt-2">
                    Across{" "}
                    {
                      Object.values(
                        categoryCounts
                      ).filter(
                        (count) => count > 0
                      ).length
                    }{" "}
                    categories
                  </p>
                </button>

                {/* Contributions */}

                <button
                  type="button"
                  onClick={() =>
                    changeMenu(
                      "Contributions"
                    )
                  }
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm text-left hover:border-yellow-200 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-11 h-11 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center text-xl">
                      ✎
                    </div>

                    <span className="text-xs text-yellow-600 font-medium">
                      {pendingCount > 0
                        ? `${pendingCount} pending`
                        : "No pending"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-5">
                    Contributions
                  </p>

                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {contributions.length}
                  </h3>

                  <p className="text-xs text-gray-400 mt-2">
                    {approvedCount} approved ·{" "}
                    {rejectedCount} rejected
                  </p>
                </button>

                {/* Events */}

                <button
                  type="button"
                  onClick={() =>
                    changeMenu("Events")
                  }
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm text-left hover:border-blue-200 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl">
                      ◫
                    </div>

                    <span className="text-xs text-blue-600 font-medium">
                      {pendingEventCount > 0
                        ? `${pendingEventCount} pending`
                        : "Connected"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-5">
                    Events
                  </p>

                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {events.length}
                  </h3>

                  <p className="text-xs text-gray-400 mt-2">
                    {approvedEventCount} approved ·{" "}
                    {rejectedEventCount} rejected
                  </p>
                </button>

                {/* Organizations */}

                <button
                  type="button"
                  onClick={() =>
                    changeMenu(
                      "Organizations"
                    )
                  }
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm text-left hover:border-purple-200 transition"
                >
                  <div className="flex justify-between items-start">
                   <AccountAvatar name="Organizations" organization />

                    <span className="text-xs text-purple-600 font-medium">
                      Connected
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-5">
                    Organizations
                  </p>

                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {organizations.length}
                  </h3>

                  <p className="text-xs text-gray-400 mt-2">
                    Registered cultural organizations
                  </p>
                </button>
              </div>

              {/* Cultural Categories */}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="font-bold text-gray-900 text-lg">
                        Cultural Categories
                      </h2>

                      <p className="text-sm text-gray-500">
                        Content currently available on the platform
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        changeMenu(
                          "Cultural Content"
                        )
                      }
                      className="text-sm text-green-700 font-medium hover:text-green-800"
                    >
                      Manage →
                    </button>
                  </div>

                  <div className="space-y-5">
                    {categoryOptions
                      .filter(
                        (category) =>
                          category !== "All"
                      )
                      .map((category) => {
                        const count =
                          categoryCounts[
                            category
                          ] || 0;

                        const percentage =
                          culturalContent.length
                            ? (count /
                                culturalContent.length) *
                              100
                            : 0;

                        return (
                          <div
                            key={category}
                          >
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                {category}
                              </span>

                              <span className="text-sm text-gray-500">
                                {count} items
                              </span>
                            </div>

                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600 rounded-full"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Quick Actions */}

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="font-bold text-gray-900 text-lg">
                    Quick Actions
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 mb-5">
                    Admin tools
                  </p>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() =>
                        changeMenu(
                          "Cultural Content"
                        )
                      }
                      className="w-full text-left px-4 py-3 rounded-xl bg-green-50 text-green-700 font-medium text-sm hover:bg-green-100"
                    >
                      Manage Cultural Content
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        changeMenu("Events")
                      }
                      className="w-full text-left px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium text-sm hover:bg-blue-100"
                    >
                      Manage Events
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        changeMenu(
                          "Contributions"
                        )
                      }
                      className="w-full text-left px-4 py-3 rounded-xl bg-yellow-50 text-yellow-700 font-medium text-sm hover:bg-yellow-100"
                    >
                      Review Contributions
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        changeMenu(
                          "Organizations"
                        )
                      }
                      className="w-full text-left px-4 py-3 rounded-xl bg-purple-50 text-purple-700 font-medium text-sm hover:bg-purple-100"
                    >
                      Manage Organizations
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===================================================
              CULTURAL CONTENT
          =================================================== */}

          {activeMenu === "Cultural Content" && (
            <>
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Cultural Content
                    </h1>

                    <p className="text-gray-500 mt-1">
                      Create, update, and delete official cultural information.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={
                        fetchCulturalContent
                      }
                      disabled={culturalLoading}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {culturalLoading
                        ? "Refreshing..."
                        : "Refresh"}
                    </button>

                    <button
                      type="button"
                      onClick={
                        openCreateCulturalForm
                      }
                      className="px-5 py-2.5 rounded-xl bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition"
                    >
                      + Add Cultural Information
                    </button>
                  </div>
                </div>
              </div>

              {/* Cultural Summary */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Total Content
                  </p>

                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {culturalContent.length}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Official cultural information
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Categories
                  </p>

                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {
                      Object.values(
                        categoryCounts
                      ).filter(
                        (count) => count > 0
                      ).length
                    }
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Cultural categories
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Showing
                  </p>

                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {
                      filteredCulturalItems.length
                    }
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Based on current filters
                  </p>
                </div>
              </div>

              {/* Error */}

              {culturalError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
                  {culturalError}
                </div>
              )}

              {/* Categories */}

              <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(
                    (category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() =>
                          setSelectedCategory(
                            category
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                          selectedCategory ===
                          category
                            ? "bg-green-700 text-white"
                            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {category}

                        {category !==
                          "All" && (
                          <span className="ml-2 opacity-70">
                            {categoryCounts[
                              category
                            ] || 0}
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Loading */}

              {culturalLoading &&
                culturalContent.length === 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                    <div className="text-2xl mb-3">
                      ...
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      Loading cultural content...
                    </p>
                  </div>
                )}

              {/* Cultural Cards */}

              {!culturalLoading &&
                filteredCulturalItems.length >
                  0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCulturalItems.map(
                      (item) => {
                        const image =
                          getCulturalImage(
                            item
                          );

                        return (
                          <div
                            key={item.id}
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                          >
                            {/* Image */}

                            <div className="h-48 bg-gray-100 overflow-hidden">
                              {image ? (
                                <img
                                  src={image}
                                  alt={
                                    item.title
                                  }
                                  className="w-full h-full object-cover"
                                  onError={(
                                    event
                                  ) => {
                                    event.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                  No image available
                                </div>
                              )}
                            </div>

                            {/* Content */}

                            <div className="p-5">
                              <div className="flex items-center justify-between gap-3 mb-3">
                                <span className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                                  {
                                    item.category
                                  }
                                </span>

                                <span className="text-xs text-gray-400">
                                  #{item.id}
                                </span>
                              </div>

                              <h2 className="text-lg font-bold text-gray-900">
                                {item.title}
                              </h2>

                              <p className="text-xs text-gray-500 mt-2">
                                Community:{" "}
                                {item.community ||
                                  "Not specified"}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                📍{" "}
                                {item.location ||
                                  "Not specified"}
                              </p>

                              <p className="text-sm text-gray-600 mt-3 leading-6 line-clamp-3">
                                {
                                  item.description
                                }
                              </p>

                              {/* Actions */}

                              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditCulturalForm(
                                      item
                                    )
                                  }
                                  className="flex-1 px-4 py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteCulturalContent(
                                      item.id
                                    )
                                  }
                                  disabled={
                                    culturalDeletingId ===
                                    item.id
                                  }
                                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition"
                                >
                                  {culturalDeletingId ===
                                  item.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

              {/* No Cultural Content */}

              {!culturalLoading &&
                !culturalError &&
                culturalContent.length ===
                  0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 text-green-700 flex items-center justify-center text-3xl mb-5">
                      ▣
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">
                      No Cultural Content Yet
                    </h2>

                    <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">
                      Add official cultural information using the button above.
                    </p>

                    <button
                      type="button"
                      onClick={
                        openCreateCulturalForm
                      }
                      className="mt-6 px-5 py-2.5 rounded-xl bg-green-700 text-white text-sm font-medium hover:bg-green-800"
                    >
                      + Add Cultural Information
                    </button>
                  </div>
                )}

              {/* No Search Results */}

              {!culturalLoading &&
                culturalContent.length >
                  0 &&
                filteredCulturalItems.length ===
                  0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                    <div className="text-3xl mb-3">
                      ⌕
                    </div>

                    <h2 className="font-bold text-gray-900">
                      No matching cultural content
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                      Try a different search term or category.
                    </p>
                  </div>
                )}
            </>
          )}

          {/* ===================================================
              CONTRIBUTIONS
          =================================================== */}

          {activeMenu === "Contributions" && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Contributions
                    </h1>

                    <p className="text-gray-500 mt-1">
                      Review cultural information submitted by users and organizations.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={openCreateContributionForm}
                      className="px-5 py-2.5 rounded-xl bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-700 transition"
                    >
                      + Create Contribution
                    </button>

                    <button
                      type="button"
                      onClick={fetchContributions}
                      disabled={contributionsLoading}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {contributionsLoading ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Pending Review
                  </p>

                  <p className="text-3xl font-bold text-yellow-600 mt-1">
                    {pendingCount}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Waiting for admin decision
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Approved
                  </p>

                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {approvedCount}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Approved contributions
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Rejected
                  </p>

                  <p className="text-3xl font-bold text-red-600 mt-1">
                    {rejectedCount}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Rejected contributions
                  </p>
                </div>
              </div>

              {contributionsError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
                  {contributionsError}
                </div>
              )}

              {contributionsLoading &&
                contributions.length === 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                    Loading contributions...
                  </div>
                )}

              {!contributionsLoading &&
                contributions.length === 0 &&
                !contributionsError && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-50 text-yellow-700 flex items-center justify-center text-3xl mb-5">
                      ✎
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">
                      No Contributions Yet
                    </h2>

                    <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">
                      There are currently no contributions submitted by users or organizations.
                    </p>
                  </div>
                )}

              {contributions.length > 0 && (
                <div className="space-y-5">
                  {contributions
                    .filter((contribution) => {
                      const search =
                        searchQuery
                          .toLowerCase()
                          .trim();

                      if (!search) {
                        return true;
                      }

                      return (
                        contribution.title
                          ?.toLowerCase()
                          .includes(search) ||
                        contribution.category
                          ?.toLowerCase()
                          .includes(search) ||
                        contribution.description
                          ?.toLowerCase()
                          .includes(search)
                      );
                    })
                    .map((contribution) => (
                      <div
                        key={
                          contribution.id
                        }
                        className="bg-white border border-gray-200 rounded-2xl p-6"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Image */}

                          <div className="w-full lg:w-52 h-40 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                            {contribution.image ? (
                              <img
                                src={
                                  resolveImage(contribution.image)
                                }
                                alt={
                                  contribution.title
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No image
                              </div>
                            )}
                          </div>

                          {/* Information */}

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                                {
                                  contribution.category
                                }
                              </span>

                              <span
                                className={`inline-flex px-3 py-1 rounded-full border text-xs font-medium capitalize ${getStatusStyle(
                                  contribution.status
                                )}`}
                              >
                                {
                                  contribution.status
                                }
                              </span>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900">
                              {
                                contribution.title
                              }
                            </h2>

                            <p className="text-sm text-gray-600 mt-3 leading-6">
                              {
                                contribution.description
                              }
                            </p>

                            <p className="text-xs text-gray-400 mt-4">
                              Contribution ID:{" "}
                              {
                                contribution.id
                              }
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Submitted by user ID:{" "}
                              {
                                contribution.user_id
                              }
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Community:{" "}
                              {
                                contribution.community
                              }
                            </p>
                          </div>

                          {/* Actions */}

                          <div className="w-full lg:w-44 flex lg:flex-col gap-3 justify-end">
                            {contribution.status === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    approveContribution(contribution.id)
                                  }
                                  disabled={
                                    actionLoading === contribution.id ||
                                    contributionDeletingId === contribution.id
                                  }
                                  className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-green-700 text-white text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition"
                                >
                                  {actionLoading === contribution.id
                                    ? "Processing..."
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    rejectContribution(contribution.id)
                                  }
                                  disabled={
                                    actionLoading === contribution.id ||
                                    contributionDeletingId === contribution.id
                                  }
                                  className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                deleteContribution(contribution.id)
                              }
                              disabled={
                                contributionDeletingId === contribution.id ||
                                actionLoading === contribution.id
                              }
                              className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition"
                            >
                              {contributionDeletingId === contribution.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}

          {/* ===================================================
              EVENTS
          =================================================== */}

          {activeMenu === "Events" && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Events
                    </h1>

                    <p className="text-gray-500 mt-1">
                      Review and manage cultural events submitted by organizations.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={openCreateEventForm}
                      className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition"
                    >
                      + Create Event
                    </button>

                    <button
                      type="button"
                      onClick={fetchEvents}
                      disabled={eventsLoading}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {eventsLoading ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Event Summary */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Pending Review
                  </p>

                  <p className="text-3xl font-bold text-yellow-600 mt-1">
                    {pendingEventCount}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Approved
                  </p>

                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {approvedEventCount}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Rejected
                  </p>

                  <p className="text-3xl font-bold text-red-600 mt-1">
                    {rejectedEventCount}
                  </p>
                </div>
              </div>

              {eventsError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
                  {eventsError}
                </div>
              )}

              {eventsLoading &&
                events.length === 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                    Loading events...
                  </div>
                )}

              {!eventsLoading &&
                events.length === 0 &&
                !eventsError && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-3xl mb-5">
                      ◫
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">
                      No Events Yet
                    </h2>

                    <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">
                      There are currently no events available in the system.
                    </p>
                  </div>
                )}

              {events.length > 0 && (
                <div className="space-y-5">
                  {events
                    .filter((event) => {
                      const search =
                        searchQuery
                          .toLowerCase()
                          .trim();

                      if (!search) {
                        return true;
                      }

                      return (
                        event.title
                          ?.toLowerCase()
                          .includes(search) ||
                        event.type
                          ?.toLowerCase()
                          .includes(search) ||
                        event.location
                          ?.toLowerCase()
                          .includes(search) ||
                        event.description
                          ?.toLowerCase()
                          .includes(search)
                      );
                    })
                    .map((event) => (
                      <div
                        key={event.id}
                        className="bg-white border border-gray-200 rounded-2xl p-6"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                                {event.type}
                              </span>

                              <span
                                className={`inline-flex px-3 py-1 rounded-full border text-xs font-medium capitalize ${getStatusStyle(
                                  event.status
                                )}`}
                              >
                                {event.status}
                              </span>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900">
                              {event.title}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">
                                  Date:
                                </span>{" "}
                                {event.date}
                              </div>

                              <div className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">
                                  Time:
                                </span>{" "}
                                {event.time}
                              </div>

                              <div className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">
                                  Location:
                                </span>{" "}
                                {event.location}
                              </div>

                              <div className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">
                                  Event ID:
                                </span>{" "}
                                {event.id}
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mt-4 leading-6">
                              {
                                event.description
                              }
                            </p>
                          </div>

                          <div className="w-full lg:w-44 flex lg:flex-col gap-3 justify-end">
                            {event.status === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    approveEvent(event.id)
                                  }
                                  disabled={
                                    eventActionLoading === event.id ||
                                    eventDeletingId === event.id
                                  }
                                  className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-green-700 text-white text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition"
                                >
                                  {eventActionLoading === event.id
                                    ? "Processing..."
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    rejectEvent(event.id)
                                  }
                                  disabled={
                                    eventActionLoading === event.id ||
                                    eventDeletingId === event.id
                                  }
                                  className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => deleteEvent(event.id)}
                              disabled={
                                eventDeletingId === event.id ||
                                eventActionLoading === event.id
                              }
                              className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition"
                            >
                              {eventDeletingId === event.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}

          {/* ===================================================
              ORGANIZATIONS
          =================================================== */}

          {activeMenu ===
            "Organizations" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Organizations
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage cultural organizations registered on the platform.
                </p>
              </div>

              {organizations.length ===
              0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-3xl mb-5">
                    ♜
                  </div>

                  <h2 className="text-xl font-bold text-gray-900">
                    No Organizations Yet
                  </h2>

                  <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">
                    There are currently no cultural organizations registered on the platform.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                      <p className="text-sm text-gray-500">
                        Total Organizations
                      </p>

                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {
                          organizations.length
                        }
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        Registered cultural organizations
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                      <p className="text-sm text-gray-500">
                        Organization Accounts
                      </p>

                      <p className="text-3xl font-bold text-purple-600 mt-1">
                        {
                          organizations.length
                        }
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        Active organization records
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                      <p className="text-sm text-gray-500">
                        Platform Role
                      </p>

                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        Organization
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        Accounts registered with this role
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="border-b border-gray-200 bg-gray-50">
        <tr>
          {["Profile", "Name", "Email", "Phone", "Role"].map((heading) => (
            <th
              key={heading}
              className="px-6 py-4 text-xs font-semibold uppercase text-gray-500"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {organizations
          .filter((organization) => {
            const search = searchQuery.toLowerCase().trim();

            return (
              !search ||
              [
                organization.name,
                organization.email,
                organization.phone,
              ].some((value) =>
                String(value || "").toLowerCase().includes(search)
              )
            );
          })
          .map((organization) => (
            <tr key={organization.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <AccountAvatar
                  name={organization.name}
                  organization
                />
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {organization.name}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {organization.email}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {organization.phone || "Not provided"}
              </td>

              <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  Organization
                </span>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
</div>
                </>
              )}
            </>
          )}

          {/* ===================================================
              USERS
          =================================================== */}

          {activeMenu === "Users" && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Users
                    </h1>

                    <p className="text-gray-500 mt-1">
                      View registered users and their platform roles.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={fetchUsers}
                    disabled={usersLoading}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {usersLoading
                      ? "Refreshing..."
                      : "Refresh"}
                  </button>
                </div>
              </div>

              {usersError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
                  {usersError}
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
                <p className="text-sm text-gray-500">
                  Total Registered Users
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {users.length}
                </p>
              </div>

              {usersLoading &&
                users.length === 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                    Loading users...
                  </div>
                )}

              {!usersLoading &&
                users.length === 0 &&
                !usersError && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 text-green-700 flex items-center justify-center text-3xl mb-5">
                      ♙
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">
                      No Users Yet
                    </h2>

                    <p className="text-gray-500 text-sm mt-2">
                      There are currently no registered users.
                    </p>
                  </div>
                )}

              {users.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                            Profile
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                            Name
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                            Email
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                            Phone
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                            Role
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {users
                          .filter((registeredUser) => {
                            const search =
                              searchQuery
                                .toLowerCase()
                                .trim();

                            if (!search) {
                              return true;
                            }

                            return (
                              registeredUser.name
                                ?.toLowerCase()
                                .includes(
                                  search
                                ) ||
                              registeredUser.email
                                ?.toLowerCase()
                                .includes(
                                  search
                                ) ||
                              registeredUser.phone
                                ?.toLowerCase()
                                .includes(
                                  search
                                ) ||
                              registeredUser.role
                                ?.toLowerCase()
                                .includes(
                                  search
                                )
                            );
                          })
                          .map(
                            (registeredUser) => (
                              <tr
                                key={
                                  registeredUser.id
                                }
                                className="hover:bg-gray-50"
                              >
                                <td className="px-6 py-4">
  <AccountAvatar
    name={registeredUser.name}
    organization={registeredUser.role === "organization"}
  />
</td>

                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                  {
                                    registeredUser.name
                                  }
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                  {
                                    registeredUser.email
                                  }
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                  {
                                    registeredUser.phone ||
                                    "Not provided"
                                  }
                                </td>

                                <td className="px-6 py-4">
                                  <span className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium capitalize">
                                    {
                                      registeredUser.role
                                    }
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===================================================
              FAVORITES
          =================================================== */}

          {activeMenu === "Favorites" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Favorites
                </h1>

                <p className="text-gray-500 mt-1">
                  View favorite cultural content and engagement information.
                </p>
              </div>

              <AdminFavorites />
            </>
          )}

          {/* ===================================================
              RENTALS
          =================================================== */}

          {activeMenu === "Rentals" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Traditional Attire Rentals
                </h1>

                <p className="text-gray-500 mt-1">
                  Review rental requests made by users.
                </p>
              </div>

              <AdminRentals />
            </>
          )}

          {/* ===================================================
              SETTINGS
          =================================================== */}

          {activeMenu === "Settings" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Settings
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage your administrator account and platform settings.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Admin Profile */}

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center text-xl font-semibold">
                      {user?.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "A"}
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        Administrator Profile
                      </h2>

                      <p className="text-sm text-gray-500">
                        Current logged-in administrator
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Name
                      </p>

                      <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700">
                        {user?.name ||
                          "Administrator"}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Email
                      </p>

                      <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 break-all">
                        {user?.email ||
                          "Not available"}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Role
                      </p>

                      <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700 font-medium">
                        Administrator
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Settings */}

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="font-bold text-gray-900 text-lg">
                    Platform Settings
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 mb-6">
                    General platform configuration.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Cultural Content
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {
                            culturalContent.length
                          } published items
                        </p>
                      </div>

                      <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Contributions
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {pendingCount} pending review
                        </p>
                      </div>

                      <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        Connected
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Events
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {pendingEventCount} pending review
                        </p>
                      </div>

                      <span className="text-xs font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                        Connected
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* =======================================================
          CREATE CONTRIBUTION MODAL
      ======================================================= */}

      {showContributionForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create Contribution
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Create a cultural contribution from the administrator panel.
                </p>
              </div>

              <button
                type="button"
                onClick={closeContributionForm}
                disabled={contributionSaving}
                className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveContribution} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={contributionForm.title}
                    onChange={handleContributionFormChange}
                    placeholder="Example: Traditional Newari Recipe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={contributionForm.category}
                    onChange={handleContributionFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  >
                    {categoryOptions
                      .filter((category) => category !== "All")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community *
                  </label>
                  <input
                    type="text"
                    name="community"
                    value={contributionForm.community}
                    onChange={handleContributionFormChange}
                    placeholder="Example: Newar"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={contributionForm.location}
                    onChange={handleContributionFormChange}
                    placeholder="Example: Kathmandu Valley"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL / Path
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={contributionForm.image}
                    onChange={handleContributionFormChange}
                    placeholder="Example: yomari.jpg or https://..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={contributionForm.description}
                    onChange={handleContributionFormChange}
                    rows="5"
                    placeholder="Enter the contribution description..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-y"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cultural Significance
                  </label>
                  <textarea
                    name="significance"
                    value={contributionForm.significance}
                    onChange={handleContributionFormChange}
                    rows="4"
                    placeholder="Explain the cultural significance..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-y"
                  />
                </div>
              </div>
              

              <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeContributionForm}
                  disabled={contributionSaving}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={contributionSaving}
                  className="px-6 py-2.5 rounded-xl bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 transition"
                >
                  {contributionSaving ? "Saving..." : "Create & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================
          CREATE EVENT MODAL
      ======================================================= */}

      {showEventForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create Event
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Create an official event from the administrator panel.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEventForm}
                disabled={eventSaving}
                className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveAdminEvent} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={handleEventFormChange}
                    placeholder="Example: Indra Jatra"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    name="type"
                    value={eventForm.type}
                    onChange={handleEventFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  >
                    <option value="Festival">Festival</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Cultural Program">Cultural Program</option>
                    <option value="Performance">Performance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="text"
                    name="date"
                    value={eventForm.date}
                    onChange={handleEventFormChange}
                    placeholder="Example: September 15, 2026"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={eventForm.time}
                    onChange={handleEventFormChange}
                    placeholder="Example: 10:00 AM"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleEventFormChange}
                    placeholder="Example: Basantapur Durbar Square"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL / Path
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={eventForm.image}
                    onChange={handleEventFormChange}
                    placeholder="Example: indra-jatra.jpg or https://..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={eventForm.description}
                    onChange={handleEventFormChange}
                    rows="5"
                    placeholder="Describe the event..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-y"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Event
                  </label>
                  <textarea
                    name="about"
                    value={eventForm.about}
                    onChange={handleEventFormChange}
                    rows="4"
                    placeholder="Provide additional information about the event..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-y"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeEventForm}
                  disabled={eventSaving}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={eventSaving}
                  className="px-6 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition"
                >
                  {eventSaving ? "Saving..." : "Create & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================
          CREATE / EDIT CULTURAL CONTENT MODAL
      ======================================================= */}

      {showCulturalForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            {/* Modal Header */}

            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCulturalId
                    ? "Edit Cultural Information"
                    : "Add Cultural Information"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingCulturalId
                    ? "Update the existing cultural information and save your changes."
                    : "Enter the cultural information to create a new official record."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeCulturalForm
                }
                disabled={culturalSaving}
                className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={
                saveCulturalContent
              }
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={culturalForm.title}
                    onChange={
                      handleTitleChange
                    }
                    placeholder="Example: Yomari"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                {/* Slug */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>

                  <input
                    type="text"
                    name="slug"
                    value={culturalForm.slug}
                    onChange={
                      handleCulturalFormChange
                    }
                    placeholder="example-yomari"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />

                  <p className="text-xs text-gray-400 mt-1">
                    Used as the unique URL identifier.
                  </p>
                </div>

                {/* Category */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={
                      culturalForm.category
                    }
                    onChange={
                      handleCulturalFormChange
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  >
                    {categoryOptions
                      .filter(
                        (category) =>
                          category !==
                          "All"
                      )
                      .map(
                        (category) => (
                          <option
                            key={
                              category
                            }
                            value={
                              category
                            }
                          >
                            {category}
                          </option>
                        )
                      )}
                  </select>
                </div>

                {/* Community */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community *
                  </label>

                  <input
                    type="text"
                    name="community"
                    value={
                      culturalForm.community
                    }
                    onChange={
                      handleCulturalFormChange
                    }
                    placeholder="Example: Newar"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                {/* Location */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={
                      culturalForm.location
                    }
                    onChange={
                      handleCulturalFormChange
                    }
                    placeholder="Example: Kathmandu Valley, Nepal"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Image */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL / Path
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={
                      culturalForm.image
                    }
                    onChange={
                      handleCulturalFormChange
                    }
                    placeholder="Example: yomari.jpg or https://..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />

                  <p className="text-xs text-gray-400 mt-1">
                    Optional. Existing cultural images are automatically matched with their existing frontend images.
                  </p>
                </div>

                {/* Description */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={
                      culturalForm.description
                    }
                    onChange={
                      handleCulturalFormChange
                    }
                    rows="5"
                    placeholder="Enter the main cultural information..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-y"
                    required
                  />
                </div>

                {/* Significance */}

                <div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Cultural Significance
  </label>

  <textarea
    name="significance"
    value={culturalForm.significance}
    onChange={handleCulturalFormChange}
    rows="4"
    placeholder="Explain the cultural importance or significance..."
    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-y"
  />
</div>

{/* Rental Availability */}
{["Traditional Attire", "Jewelry"].includes(
  culturalForm.category
) && (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Rental Availability
    </label>

    <label className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-4 cursor-pointer">
      <input
        type="checkbox"
        checked={culturalForm.is_rentable}
        onChange={(event) =>
          setCulturalForm((current) => ({
            ...current,
            is_rentable: event.target.checked,
          }))
        }
        className="h-5 w-5 accent-green-700"
      />

      <div>
        <p className="text-sm font-semibold text-gray-800">
          Available for Rental
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Enable this item to appear in the rental collection.
        </p>
      </div>
    </label>
  </div>
)}

</div>

{/* Form Actions */}
              

              

              <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={
                    closeCulturalForm
                  }
                  disabled={
                    culturalSaving
                  }
                  className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    culturalSaving
                  }
                  className="px-6 py-2.5 rounded-xl bg-green-700 text-white text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition"
                >
                  {culturalSaving
                    ? "Saving..."
                    : editingCulturalId
                    ? "Update & Save"
                    : "Create & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}