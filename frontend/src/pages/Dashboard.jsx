import BottomNav from "../components/BottomNav";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../api/dashboardService";
import axios from "axios";

import {
  Search,
  SlidersHorizontal,
  Bell,
  Clock,
  X,
  MapPin,
  CalendarDays,
  Users,
  ChevronRight,
  CalendarPlus,
  UserPlus,
  CalendarRange,
  BellRing,
  Pencil,
  Trash2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

/* ---------------------------------------------------------
   API  (unchanged — do not modify)
--------------------------------------------------------- */

const API = axios.create({
  baseURL: "https://event-manager-pls6.onrender.com",
});

// Keeps the last loaded dashboard visible when navigating away and back.
// Each signed-in account gets its own cache entry.
const dashboardCache = new Map();

/* ---------------------------------------------------------
   USER AVATAR
--------------------------------------------------------- */

const avatarUser = "https://i.pravatar.cc/150?img=12";

/* ---------------------------------------------------------
   EVENT IMAGE FALLBACKS
   Backend already sends images, but these are used if
   an event doesn't have an image.
--------------------------------------------------------- */

const EVENT_IMAGES = {
  wedding:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=60",

  birthday:
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=60",

  corporate:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",

  engagement:
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=60",

  "baby shower":
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=60",

  housewarming:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=60",

  party:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",

  conference:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",

  dinner:
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80",

  concert:
    "https://images.unsplash.com/photo-1579829984491-b0460ee17cae?auto=format&fit=crop&fm=jpg&q=80&w=1200",

  sports:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",

  workshop:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",

  default:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=60",
};

/* ---------------------------------------------------------
   QUICK ACTIONS
--------------------------------------------------------- */

const quickActions = [
  {
    label: "Add Event",
    icon: CalendarPlus,
    bg: "bg-orange-50",
    fg: "text-orange-500",
    path: "/add-event",
  },
  {
    label: "Add Client",
    icon: UserPlus,
    bg: "bg-rose-50",
    fg: "text-rose-500",
    path: "/clients",
  },
  {
    label: "Calendar",
    icon: CalendarRange,
    bg: "bg-amber-50",
    fg: "text-amber-600",
    path: "/calendar",
  },
  {
    label: "Reminders",
    icon: BellRing,
    bg: "bg-violet-50",
    fg: "text-violet-500",
    path: "/reminders",
  },
];

/* ---------------------------------------------------------
   HELPERS  (unchanged — do not modify)
--------------------------------------------------------- */

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getEventImage = (event) => {
  if (event?.image) {
    return event.image;
  }

  const type = String(event?.event_type || "").toLowerCase().trim();

  return EVENT_IMAGES[type] || EVENT_IMAGES.default;
};

/* ---------------------------------------------------------
   CLIENT AVATARS
   Keep these collections and selection rules in sync with
   Clients.jsx so the Dashboard uses the same client photo.
--------------------------------------------------------- */

const MALE_CLIENT_AVATARS = [
  "https://i.pinimg.com/originals/10/8d/3b/108d3b91d89ff52b4826e41bb3724f28.jpg",
  "https://dl-file.cyberlink.com/web/content/prompt_chatgpt_photo_linkedin_after_8cb0bbaae7.jpg",
  "https://chatsmith.io/_next/image?q=75&url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjms1jm9u%2Fproduction%2F212e9b69192299df6c999e36a62731a2b54172b0-1024x1024.png%3Fw%3D1200%26q%3D75%26fit%3Dmax%26auto%3Dformat&w=3840",
  "https://media.chambers.com/individuals/3377238/ea71b95c-93ae-45a9-b731-6443858b462d/profile.png",
  "https://es.pinterest.com/pin/30047522508796300/",
];

const FEMALE_CLIENT_AVATARS = [
  "https://images.wondershare.es/filmora/ai-prompt/retrato-empresaria-profesional.png",
  "https://imagedelivery.net/QTx11AyQzp6Ss70cNfwJyQ/blog/photo-linkedin/photo-linkedin-0/public",
  "https://pub-76a8e7f982bf4089b119723db9d1cebd.r2.dev/seo/migrated/EDjfdklfngbg7yZaX7oX2_j0DOAUl5.png",
  "https://i.pinimg.com/736x/78/13/48/781348c74b850cff84646b88939d2685.jpg",
  "https://www.familylawprotection.com/wp-content/uploads/2022/04/Screen-Shot-2020-01-13-at-4.44.45-PM.jpg",
];

const getProfessionalClientAvatar = (gender, clientId = 0) => {
  const list =
    gender === "female" ? FEMALE_CLIENT_AVATARS : MALE_CLIENT_AVATARS;

  return list[Math.abs(Number(clientId) || 0) % list.length];
};

const getSavedClientAvatar = (client) => {
  // Clients.jsx saves the selected/uploaded image under this exact key.
  try {
    const savedAvatar = localStorage.getItem(
      `client_avatar_${client.id}`
    );

    if (savedAvatar) return savedAvatar;
  } catch (error) {
    console.warn("Unable to read saved client avatar:", error);
  }

  // Older clients may not have a local image saved yet. Use the same
  // profile-image fallback logic as the Clients page.
  const gender = (() => {
    try {
      return (
        localStorage.getItem(`client_gender_${client.id}`) ||
        client.gender ||
        "male"
      );
    } catch {
      return client.gender || "male";
    }
  })();

  return (
    client.avatar ||
    getProfessionalClientAvatar(gender, client.id)
  );
};

const getDateTime = (event) => {
  if (!event?.date) return new Date(0);

  const date = new Date(`${event.date} ${event.time || "12:00 AM"}`);

  if (Number.isNaN(date.getTime())) {
    return new Date(0);
  }

  return date;
};

const getStartsIn = (event) => {
  const target = getDateTime(event);
  const now = new Date();

  const difference = target.getTime() - now.getTime();

  if (difference <= 0) {
    return "Started";
  }

  const totalMinutes = Math.floor(difference / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const getDateParts = (date) => {
  if (!date) {
    return {
      day: "--",
      month: "---",
    };
  }

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return {
      day: "--",
      month: "---",
    };
  }

  return {
    day: parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
    }),
    month: parsed
      .toLocaleDateString("en-IN", {
        month: "short",
      })
      .toUpperCase(),
  };
};

const getTodayDateString = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getEffectiveEventStatus = (event) => {
  const eventDate = event?.date || event?.event_date || "";
  const today = getTodayDateString();

  // Any event before today's date is automatically treated as completed.
  if (eventDate && eventDate < today) {
    return "Completed";
  }

  return event?.status || "Upcoming";
};

const normalizeBackendEvent = (event) => {
  const date = event?.date || event?.event_date || "";
  const time = event?.time || event?.event_time || "";
  const parts = getDateParts(date);

  const normalized = {
    ...event,
    title: event?.title || event?.event_name || "Untitled Event",
    client: event?.client || event?.client_name || "Unknown Client",
    venue: event?.venue || "Venue not specified",
    date,
    time,
    status: getEffectiveEventStatus(event),
    guests: event?.guests ?? 0,
    day: parts.day,
    month: parts.month,
    image: getEventImage(event),
  };

  return {
    ...normalized,
    starts_in: getStartsIn(normalized),
  };
};

const getStatusClasses = (status) => {
  const value = String(status || "Upcoming").toLowerCase();

  if (value === "completed") {
    return "bg-stone-800 text-white";
  }

  if (value === "cancelled" || value === "canceled") {
    return "bg-red-500 text-white";
  }

  return "bg-emerald-500 text-white";
};

/* ---------------------------------------------------------
   DASHBOARD
--------------------------------------------------------- */

export default function Dashboard() {
  const hour = new Date().getHours();

  let greeting;

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const navigate = useNavigate();

  const savedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [userName, setUserName] = useState(
    savedUser?.full_name || "User"
  );
  const [userAvatar, setUserAvatar] = useState(
    savedUser?.avatar || avatarUser
  );

  // Use the access token as the cache key so accounts never share dashboard data.
  const dashboardCacheKey =
    localStorage.getItem("access_token") ||
    savedUser?.id ||
    savedUser?.email ||
    "guest";
  const cachedDashboard = dashboardCache.get(dashboardCacheKey);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [dashboardData, setDashboardData] = useState(
    cachedDashboard?.dashboardData ?? null
  );
  const [allEvents, setAllEvents] = useState(
    cachedDashboard?.allEvents ?? []
  );
  const [clients, setClients] = useState(cachedDashboard?.clients ?? []);

  const [loading, setLoading] = useState(!cachedDashboard);
  const [clientsLoading, setClientsLoading] = useState(!cachedDashboard);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* -------------------------------------------------------
     LOAD DASHBOARD  (unchanged — do not modify)
  ------------------------------------------------------- */

  useEffect(() => {
    // Show cached data immediately; refresh it in the background on return.
    loadDashboard({ showLoader: !cachedDashboard });
  }, []);

  useEffect(() => {
    if (dashboardData) {
      dashboardCache.set(dashboardCacheKey, {
        dashboardData,
        allEvents,
        clients,
      });
    }
  }, [dashboardData, allEvents, clients, dashboardCacheKey]);

  useEffect(() => {
    const updateUserName = () => {
      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      setUserName(user?.full_name || "User");
      setUserAvatar(user?.avatar || avatarUser);
    };

    window.addEventListener("profileUpdated", updateUserName);

    return () => {
      window.removeEventListener("profileUpdated", updateUserName);
    };
  }, []);

  const loadDashboard = async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) setLoading(true);
      setError("");

      /* Dashboard data */
      const dashboardResponse = await getDashboard();

      setDashboardData(dashboardResponse.data);

      /* ---------------------------------------------------
         Load ALL SAVED EVENTS
         /dashboard/ returns only recent events, while
         /events/ returns every saved event.
      --------------------------------------------------- */

      try {
        const token = localStorage.getItem("access_token");

        const eventResponse = await API.get("/events/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User events:", eventResponse.data);

        setAllEvents(eventResponse.data || []);
      } catch (eventError) {
        console.error(
          "Failed to load user events:",
          eventError?.response?.data || eventError
        );

        setAllEvents([]);
      }

      /* ---------------------------------------------------
         Clients API requires authentication
      --------------------------------------------------- */

      try {
        if (showLoader) setClientsLoading(true);

        const token = localStorage.getItem("access_token");

        const clientResponse = await API.get("/clients/", {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        setClients(clientResponse.data || []);
      } catch (clientError) {
        console.error("Failed to load clients:", clientError);

        setClients([]);

        /*
          We don't stop the Dashboard if the clients request
          fails. Events can still be displayed.
        */
      } finally {
        setClientsLoading(false);
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to load dashboard data."
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  /* -------------------------------------------------------
     ALL SAVED EVENTS
  ------------------------------------------------------- */

  const events = allEvents
    .map(normalizeBackendEvent)
    .sort((a, b) => getDateTime(a) - getDateTime(b));

  // All Events: newest saved event first.
  const allEventsNewestFirst = [...events].sort((a, b) => {
    const createdA = new Date(a.created_at || 0).getTime();
    const createdB = new Date(b.created_at || 0).getTime();

    if (createdB !== createdA) {
      return createdB - createdA;
    }

    // If created_at is unavailable/equal, show the latest event date first.
    return getDateTime(b) - getDateTime(a);
  });

  /* -------------------------------------------------------
     NEXT EVENT
  ------------------------------------------------------- */

  const now = new Date();

  const todayDate = getTodayDateString();

  const upcomingOnly = events.filter(
    (event) => event.date >= todayDate
  );

  const nextEvent = upcomingOnly.length > 0
    ? upcomingOnly[0]
    : null;

  /* -------------------------------------------------------
     UPCOMING EVENTS
  ------------------------------------------------------- */

  const upcomingEvents = upcomingOnly.slice(0, 8);

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  const searchText = search.trim().toLowerCase();

  const filteredEvents = upcomingEvents.filter((event) => {
    if (!searchText) return true;

    return (
      event.title?.toLowerCase().includes(searchText) ||
      event.client?.toLowerCase().includes(searchText) ||
      event.venue?.toLowerCase().includes(searchText) ||
      event.status?.toLowerCase().includes(searchText) ||
      event.event_type?.toLowerCase().includes(searchText)
    );
  });

  const filteredAllEvents = allEventsNewestFirst.filter((event) => {
    if (!searchText) return true;

    return (
      event.title?.toLowerCase().includes(searchText) ||
      event.client?.toLowerCase().includes(searchText) ||
      event.venue?.toLowerCase().includes(searchText) ||
      event.status?.toLowerCase().includes(searchText) ||
      event.event_type?.toLowerCase().includes(searchText)
    );
  });

  const filteredClients = clients.filter((client) => {
    if (!searchText) return true;

    return (
      client.name?.toLowerCase().includes(searchText) ||
      client.phone?.toLowerCase().includes(searchText) ||
      client.email?.toLowerCase().includes(searchText)
    );
  });

  /* -------------------------------------------------------
     RECENT CLIENTS
  ------------------------------------------------------- */

  const recentClients = [...filteredClients]
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 8)
    .map((client) => ({
      ...client,

      // Always resolve the image from the same per-client profile
      // image saved by Clients.jsx. Never use one shared dashboard avatar.
      avatar: getSavedClientAvatar(client),

        tint:
          client.id % 4 === 0
            ? "bg-violet-50 text-violet-600"
            : client.id % 4 === 1
            ? "bg-rose-50 text-rose-600"
            : client.id % 4 === 2
            ? "bg-amber-50 text-amber-700"
            : "bg-emerald-50 text-emerald-700",
    }));

  /* -------------------------------------------------------
     SUMMARY STATS (computed from loaded data)
  ------------------------------------------------------- */

  const totalGuests = events.reduce(
    (sum, event) => sum + (Number(event.guests) || 0),
    0
  );

  const stats = [
    {
      label: "Total Events",
      value: events.length,
      icon: CalendarDays,
      tint: "bg-amber-50 text-amber-600",
    },
    {
      label: "Upcoming",
      value: upcomingOnly.length,
      icon: Sparkles,
      tint: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Clients",
      value: clients.length,
      icon: Users,
      tint: "bg-rose-50 text-rose-500",
    },
  ];

  /* -------------------------------------------------------
     OPEN EVENT
  ------------------------------------------------------- */

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;

    // Pass the selected event to the Add Event page so it can be edited.
    navigate("/add-event", {
      state: { editEvent: selectedEvent },
    });

    setSelectedEvent(null);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedEvent.title}"?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");

      await API.delete(`/events/${selectedEvent.id}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      setSelectedEvent(null);
      await loadDashboard();
    } catch (deleteError) {
      console.error("Failed to delete event:", deleteError);

      alert(
        deleteError?.response?.data?.detail ||
          "Failed to delete event. Please try again."
      );
    }
  };

  const openEvent = (event) => {
    if (!event) return;

    setSelectedEvent({
      ...event,

      host: event.client || "Unknown Client",

      guests: event.guests ?? 0,

      description:
        event.description ||
        event.notes ||
        `${event.title} is scheduled on ${event.date} at ${event.time}.`,

      badge: event.status || "Upcoming",
    });
  };

  /* -------------------------------------------------------
     LOADING SKELETON
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center bg-stone-100">
        <style>{loadingStyles}</style>

        <div className="w-full max-w-[430px] min-h-screen bg-[#faf8f4] relative pb-28">
          <div className="px-5 pt-7 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="skeleton w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <div className="skeleton h-3 w-24 rounded-full" />
                <div className="skeleton h-4 w-32 rounded-lg" />
              </div>
            </div>

            <div className="skeleton w-11 h-11 rounded-full" />
          </div>

          <div className="px-5 mt-6">
            <div className="skeleton h-12 rounded-2xl" />
          </div>

          <div className="px-5 mt-5">
            <div className="skeleton h-[210px] rounded-[28px]" />
          </div>

          <div className="px-5 mt-5 grid grid-cols-3 gap-2.5">
            <div className="skeleton h-[86px] rounded-2xl" />
            <div className="skeleton h-[86px] rounded-2xl" />
            <div className="skeleton h-[86px] rounded-2xl" />
          </div>

          <div className="px-5 mt-6">
            <div className="skeleton h-4 w-36 rounded-lg" />
          </div>

          <div className="mt-4 px-5 flex gap-3 overflow-hidden">
            <div className="skeleton h-[170px] w-[158px] rounded-3xl shrink-0" />
            <div className="skeleton h-[170px] w-[158px] rounded-3xl shrink-0" />
            <div className="skeleton h-[170px] w-[158px] rounded-3xl shrink-0" />
          </div>

          <div className="px-5 mt-6">
            <div className="skeleton h-4 w-28 rounded-lg" />
          </div>

          <div className="px-5 mt-4 grid grid-cols-4 gap-2.5">
            <div className="skeleton h-[84px] rounded-2xl" />
            <div className="skeleton h-[84px] rounded-2xl" />
            <div className="skeleton h-[84px] rounded-2xl" />
            <div className="skeleton h-[84px] rounded-2xl" />
          </div>

          <div className="px-5 mt-6 grid grid-cols-2 gap-3">
            <div className="skeleton h-[180px] rounded-3xl" />
            <div className="skeleton h-[180px] rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     ERROR
  ------------------------------------------------------- */

  if (error) {
    return (
      <div className="min-h-screen w-full flex justify-center bg-stone-100">
        <div className="w-full max-w-[430px] min-h-screen bg-[#faf8f4] px-5 flex items-center justify-center">
          <div className="bg-white rounded-[28px] p-7 text-center shadow-[0_20px_50px_-30px_rgba(28,25,23,0.25)] border border-stone-100">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-red-400" />
            </div>

            <h2 className="text-lg font-bold text-stone-900 mt-4 tracking-tight">
              Dashboard Error
            </h2>

            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
              {error}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-6 bg-stone-900 text-white text-sm font-semibold px-7 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     MAIN UI
  ------------------------------------------------------- */

  return (
    <div className="min-h-screen w-full flex justify-center bg-stone-100">
      <style>{dashboardStyles}</style>

      <div className="w-full max-w-[430px] min-h-screen bg-[#faf8f4] relative pb-32 shadow-[0_0_80px_rgba(0,0,0,0.06)]">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="px-5 pt-7 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="relative shrink-0"
            >
              <img
                src={userAvatar}
                alt="Profile"
                width={512}
                height={512}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-[0_4px_14px_rgba(0,0,0,0.10)]"
              />

              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-[2.5px] ring-[#faf8f4]" />
            </button>

            <div className="min-w-0">
              <p className="text-[11px] font-medium text-stone-400 tracking-wide uppercase">
                {greeting}
              </p>

              <h1 className="text-[22px] leading-tight font-semibold text-stone-900 truncate display-font">
                {userName}
              </h1>
            </div>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            onClick={() => navigate("/reminders")}
            className="relative w-11 h-11 rounded-full bg-white border border-stone-200/70 shadow-sm flex items-center justify-center active:scale-95 transition-transform"
          >
            <Bell className="w-[18px] h-[18px] text-stone-700" />

            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>
        </header>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="px-5">
          <div className="flex items-center gap-2.5 bg-white rounded-2xl border border-stone-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] pl-4 pr-3 py-3.5 focus-within:border-stone-300 focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
            <Search className="w-[17px] h-[17px] text-stone-400 shrink-0" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, clients, venues…"
              className="flex-1 min-w-0 bg-transparent text-[13px] text-stone-800 placeholder:text-stone-400 outline-none"
            />

            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
              >
                <X className="w-3.5 h-3.5 text-stone-500" />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Filters"
                onClick={() => navigate("/calendar")}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            NEXT EVENT — FEATURE CARD
        ================================================= */}

        <div className="px-5 mt-5">
          {nextEvent ? (
            <button
              type="button"
              onClick={() => openEvent(nextEvent)}
              className="group w-full text-left relative rounded-[28px] overflow-hidden shadow-[0_24px_50px_-24px_rgba(28,25,23,0.45)] active:scale-[0.99] transition-transform"
            >
              <img
                src={nextEvent.image}
                alt={nextEvent.title}
                width={800}
                height={600}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/45 to-stone-900/10" />

              <div className="relative p-5 pt-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-[9px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Next Event
                  </span>

                  <span className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-950 text-[10px] font-bold px-3 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    {nextEvent.starts_in}
                  </span>
                </div>

                <h2 className="text-white text-[20px] font-bold mt-9 leading-snug display-font">
                  {nextEvent.title}
                </h2>

                <p className="text-[11px] font-semibold text-amber-300 mt-1 tracking-wide">
                  {getNextDayLabel(nextEvent)} • {nextEvent.time}
                </p>

                <div className="mt-3.5 space-y-1.5 text-[12px] text-white/85">
                  <p className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="truncate">{nextEvent.venue}</span>
                  </p>

                  <p className="flex items-center gap-2 truncate">
                    <Users className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="truncate">
                      {nextEvent.client}
                      {nextEvent.guests !== "--" &&
                        ` · ${nextEvent.guests} guests`}
                    </span>
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-3.5">
                  <span className="text-[11px] font-medium text-white/60">
                    Tap to view details
                  </span>

                  <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:rotate-[-45deg] transition-transform">
                    <ArrowUpRight className="w-4 h-4 text-stone-900" />
                  </span>
                </div>
              </div>
            </button>
          ) : (
            <div className="bg-white rounded-[28px] border border-stone-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-7 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-amber-500" />
              </div>

              <p className="text-[15px] font-semibold text-stone-800 mt-4">
                No upcoming events
              </p>

              <p className="text-[12px] text-stone-400 mt-1">
                Plan something beautiful — add your first event.
              </p>

              <button
                type="button"
                onClick={() => navigate("/add-event")}
                className="mt-5 bg-stone-900 text-white text-xs font-semibold px-5 py-3 rounded-2xl active:scale-[0.98] transition-transform"
              >
                Add Event
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            SUMMARY STATS
        ================================================= */}

        <div className="px-5 mt-4 grid grid-cols-3 gap-2.5">
          {stats.map(({ label, value, icon: Icon, tint }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-stone-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-3"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${tint}`}>
                <Icon className="w-4 h-4" />
              </div>

              <p className="text-[19px] font-bold text-stone-900 mt-2 leading-none tabular-nums display-font">
                {value}
              </p>

              <p className="text-[9.5px] font-medium text-stone-400 mt-1 tracking-wide uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* =================================================
            UPCOMING EVENTS
        ================================================= */}

        <section className="mt-7">
          <div className="px-5 flex justify-between items-baseline">
            <h2 className="font-bold text-stone-900 text-[16px] display-font">
              Upcoming Events
            </h2>

            <button
              type="button"
              onClick={() => navigate("/calendar")}
              className="text-[12px] text-stone-500 font-semibold flex items-center gap-0.5 hover:text-stone-800 transition-colors"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3.5 flex gap-3.5 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event)}
                  className="w-[160px] shrink-0 text-left bg-white rounded-3xl border border-stone-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden active:scale-[0.98] transition-transform"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      width={768}
                      height={512}
                      className="w-full h-[96px] object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur rounded-xl px-2.5 py-1.5 text-center shadow-sm min-w-[36px]">
                      <p className="text-[15px] font-bold leading-none text-stone-900 display-font">
                        {event.day}
                      </p>

                      <p className="text-[8px] font-bold text-stone-400 uppercase mt-0.5 tracking-widest">
                        {event.month}
                      </p>
                    </div>

                    <span
                      className={`absolute bottom-2 right-2 text-[8.5px] font-bold px-2 py-1 rounded-full ${getStatusClasses(
                        event.status
                      )} shadow-sm`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div className="p-3">
                    <h3 className="text-[12.5px] font-bold text-stone-900 truncate">
                      {event.title}
                    </h3>

                    <p className="text-[10px] text-stone-400 mt-1.5 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {event.venue}
                    </p>

                    <p className="text-[10px] text-stone-400 mt-1 flex items-center gap-1 truncate">
                      <Clock className="w-3 h-3 shrink-0" />
                      {event.time}
                    </p>

                    <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[9.5px] font-semibold text-orange-500 flex items-center gap-1 truncate">
                        <Users className="w-3 h-3 shrink-0" />
                        {event.guests || 0} Guests
                      </span>

                      <ChevronRight className="w-3 h-3 text-stone-300 shrink-0" />
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-5 py-6 text-center w-full">
                <p className="text-[12px] text-stone-400">
                  No matching events found.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="px-5 mt-5">
          <h2 className="font-bold text-stone-900 text-[16px] display-font">
            Quick Actions
          </h2>

          <div className="mt-3.5 grid grid-cols-4 gap-2.5">
            {quickActions.map(
              ({ label, icon: Icon, bg, fg, path }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(path)}
                  className="bg-white rounded-2xl py-4 px-1 flex flex-col items-center gap-2.5 border border-stone-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-transform"
                >
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}
                  >
                    <Icon className={`w-[18px] h-[18px] ${fg}`} />
                  </span>

                  <span className="text-[10px] font-semibold text-stone-600 text-center leading-tight">
                    {label}
                  </span>
                </button>
              )
            )}
          </div>
        </section>

        {/* =================================================
            RECENT CLIENTS
        ================================================= */}

        <section className="mt-7">
          <div className="px-5 flex justify-between items-baseline">
            <h2 className="font-bold text-stone-900 text-[16px] display-font">
              Recent Clients
            </h2>

            <button
              type="button"
              onClick={() => navigate("/clients")}
              className="text-[12px] text-stone-500 font-semibold flex items-center gap-0.5 hover:text-stone-800 transition-colors"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3.5 flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {clientsLoading ? (
              <div className="px-4 py-3">
                <p className="text-xs text-stone-400">
                  Loading clients…
                </p>
              </div>
            ) : recentClients.length > 0 ? (
              recentClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => navigate("/clients")}
                  className="flex flex-col items-center gap-2 w-[64px] shrink-0 active:scale-95 transition-transform"
                >
                  <span
                    className={`relative w-[56px] h-[56px] rounded-full p-[2.5px] bg-gradient-to-br ${
                      client.id % 2 === 0
                        ? "from-amber-300 to-orange-400"
                        : "from-rose-300 to-violet-400"
                    }`}
                  >
                    <img
                      src={client.avatar}
                      alt={client.name}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="w-full h-full rounded-full object-cover ring-2 ring-white"
                    />
                  </span>

                  <span className="text-[10px] font-medium text-stone-600 text-center truncate w-full">
                    {client.name?.split(" ")[0]}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3">
                <p className="text-xs text-stone-400">
                  No clients found.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            ALL EVENTS
        ================================================= */}

        <section className="px-5 mt-7">
          <div className="flex justify-between items-baseline">
            <h2 className="font-bold text-stone-900 text-[16px] display-font">
              All Events
            </h2>

            <button
              type="button"
              onClick={() => navigate("/calendar")}
              className="text-[12px] text-stone-500 font-semibold flex items-center gap-0.5 hover:text-stone-800 transition-colors"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3.5 grid grid-cols-2 gap-3">
            {filteredAllEvents.length > 0 ? (
              filteredAllEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event)}
                  className="text-left bg-white rounded-3xl border border-stone-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden active:scale-[0.98] transition-transform"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      width={800}
                      height={500}
                      className="w-full h-[108px] object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur rounded-xl px-2.5 py-1.5 text-center shadow-sm min-w-[36px]">
                      <p className="text-[15px] font-bold leading-none text-stone-900 display-font">
                        {event.day}
                      </p>

                      <p className="text-[8px] font-bold text-stone-400 uppercase mt-0.5 tracking-widest">
                        {event.month}
                      </p>
                    </div>

                    <span
                      className={`absolute bottom-2 right-2 text-[8.5px] font-bold px-2 py-1 rounded-full ${getStatusClasses(
                        event.status
                      )} shadow-sm`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div className="p-3">
                    <h3 className="text-[12.5px] font-bold text-stone-900 truncate">
                      {event.title}
                    </h3>

                    <p className="text-[9.5px] text-stone-400 mt-1.5 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {event.venue}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <p className="text-[9.5px] text-stone-400 flex items-center gap-1 truncate">
                        <Clock className="w-3 h-3 shrink-0" />
                        {event.time}
                      </p>

                      <p className="text-[9.5px] text-orange-500 font-semibold flex items-center gap-1 whitespace-nowrap">
                        <Users className="w-3 h-3 shrink-0" />
                        {event.guests || 0}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <span className="text-[9.5px] font-medium text-stone-500 truncate">
                        {event.client}
                      </span>

                      <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                        <ChevronRight className="w-3 h-3 text-stone-500" />
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-2 bg-white rounded-3xl border border-stone-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-7 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-stone-400" />
                </div>

                <p className="text-[15px] font-semibold text-stone-800 mt-4">
                  No events found
                </p>

                <p className="text-[12px] text-stone-400 mt-1">
                  Add an event to see it here.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/add-event")}
                  className="mt-5 bg-stone-900 text-white text-xs font-semibold px-5 py-3 rounded-2xl active:scale-[0.98] transition-transform"
                >
                  Add Event
                </button>
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            BOTTOM NAV
        ================================================= */}

        <BottomNav
          active="dashboard"
          theme="purple"
        />
      </div>

      {/* ===================================================
          EVENT DETAIL MODAL
      =================================================== */}

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-sm modal-backdrop"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-[430px] bg-[#faf8f4] rounded-t-[28px] sm:rounded-[28px] overflow-hidden max-h-[90vh] flex flex-col modal-sheet shadow-[0_-10px_60px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative shrink-0">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-52 object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/20" />

              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow active:scale-95 transition-all"
              >
                <X className="w-4.5 h-4.5 text-stone-800" />
              </button>

              <span
                className={`absolute bottom-4 left-4 text-[11px] font-bold px-3 py-1.5 rounded-full shadow ${getStatusClasses(
                  selectedEvent.badge
                )}`}
              >
                {selectedEvent.badge}
              </span>
            </div>

            <div className="p-5 overflow-y-auto">
              <h2 className="text-[22px] font-bold text-stone-900 leading-snug display-font">
                {selectedEvent.title}
              </h2>

              <p className="text-[12px] text-stone-500 mt-1 flex items-center gap-1.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${
                    selectedEvent.host && selectedEvent.host !== "Unknown Client"
                      ? "bg-orange-400"
                      : "bg-stone-300"
                  }`}
                >
                  {initials(selectedEvent.host) || "?"}
                </span>
                Client: {selectedEvent.host}
              </p>

              <div className="mt-5 bg-white rounded-2xl border border-stone-200/70 p-4 space-y-3.5">
                {[
                  {
                    icon: CalendarDays,
                    label: "Date",
                    value: selectedEvent.date || "--",
                    bg: "bg-amber-50",
                    fg: "text-amber-600",
                  },
                  {
                    icon: Clock,
                    label: "Time",
                    value: selectedEvent.time || "--",
                    bg: "bg-orange-50",
                    fg: "text-orange-500",
                  },
                  {
                    icon: MapPin,
                    label: "Venue",
                    value: selectedEvent.venue || "--",
                    bg: "bg-rose-50",
                    fg: "text-rose-500",
                  },
                  {
                    icon: Users,
                    label: "Guests",
                    value: `${selectedEvent.guests || 0} invited`,
                    bg: "bg-emerald-50",
                    fg: "text-emerald-600",
                  },
                ].map(({ icon: Icon, label, value, bg, fg }) => (
                  <div key={label} className="flex items-center gap-3.5">
                    <div
                      className={`${bg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-[18px] h-[18px] ${fg}`} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                        {label}
                      </p>

                      <p className="text-[13.5px] font-semibold text-stone-900 truncate">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <h3 className="text-[14px] font-bold text-stone-900 display-font">
                  About Event
                </h3>

                <p className="text-[13px] text-stone-500 mt-1.5 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* =============================================
                  UPDATE + DELETE ACTIONS
              ============================================= */}

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleUpdateEvent}
                  className="flex items-center justify-center gap-2 bg-white text-stone-800 border border-stone-200 font-semibold text-[13px] py-3.5 rounded-2xl shadow-sm transition active:scale-[0.98]"
                >
                  <Pencil className="w-4 h-4" />
                  Update
                </button>

                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 font-semibold text-[13px] py-3.5 rounded-2xl shadow-sm transition active:scale-[0.98]"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="mt-3 w-full bg-stone-900 text-white font-semibold text-[13px] py-3.5 rounded-2xl shadow transition active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STYLES — fonts, skeletons, animations (scoped to this page)
========================================================= */

const dashboardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .display-font {
    font-family: 'Playfair Display', Georgia, serif;
    letter-spacing: -0.01em;
  }

  .scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .modal-backdrop {
    animation: fadeIn 0.2s ease-out;
  }

  .modal-sheet {
    animation: sheetUp 0.28s cubic-bezier(0.32, 0.72, 0, 1);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes sheetUp {
    from { transform: translateY(48px); opacity: 0.6; }
    to { transform: translateY(0); opacity: 1; }
  }

  body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }
`;

const loadingStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }

  .skeleton {
    background: linear-gradient(
      100deg,
      #edeae3 40%,
      #f6f4ef 50%,
      #edeae3 60%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { background-position: 150% 0; }
    100% { background-position: -50% 0; }
  }
`;

/* =========================================================
   ACTIVITY TIME FORMATTER
========================================================= */

function formatActivityTime(dateValue) {
  if (!dateValue) {
    return "Recently";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = new Date();

  const difference = now.getTime() - date.getTime();

  const minutes = Math.floor(
    difference / (1000 * 60)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   NEXT EVENT DAY LABEL
========================================================= */

function getNextDayLabel(event) {
  const eventDate = getDateTime(event);
  const today = new Date();

  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(
    tomorrowStart.getDate() + 1
  );

  const eventStart = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate()
  );

  if (eventStart.getTime() === todayStart.getTime()) {
    return "Today";
  }

  if (
    eventStart.getTime() ===
    tomorrowStart.getTime()
  ) {
    return "Tomorrow";
  }

  return eventStart.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}