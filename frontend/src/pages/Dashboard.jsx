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
} from "lucide-react";

/* ---------------------------------------------------------
   API
--------------------------------------------------------- */

const API = axios.create({
  baseURL: "https://event-manager-pls6.onrender.com",
});

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
    fg: "text-orange-500",
    path: "/add-event",
  },
  {
    label: "Add Client",
    icon: UserPlus,
    fg: "text-rose-500",
    path: "/clients",
  },
  {
    label: "Calendar",
    icon: CalendarRange,
    fg: "text-amber-600",
    path: "/calendar",
  },
  {
    label: "Reminders",
    icon: BellRing,
    fg: "text-violet-500",
    path: "/reminders",
  },
];

/* ---------------------------------------------------------
   HELPERS
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


const getClientAvatar = (clientId) => {
  const id = Number(clientId) || 1;
  const imageNumber = ((id - 1) % 70) + 1;

  return `https://i.pravatar.cc/150?img=${imageNumber}`;
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

/* ---------------------------------------------------------
   ALL EVENT HELPERS
--------------------------------------------------------- */

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
    return "bg-gray-700 text-white";
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

  const [selectedEvent, setSelectedEvent] = useState(null);


  const [dashboardData, setDashboardData] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  /* -------------------------------------------------------
     LOAD DASHBOARD
  ------------------------------------------------------- */

  useEffect(() => {
    loadDashboard();
  }, []);
  useEffect(() => {
  const updateUserName = () => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    setUserName(user?.full_name || "User");
  };

  window.addEventListener("profileUpdated", updateUserName);

  return () => {
    window.removeEventListener("profileUpdated", updateUserName);
  };
}, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
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
        setClientsLoading(true);

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
      setLoading(false);
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
  .map((client) => {
    let savedAvatar = null;

    try {
      savedAvatar = localStorage.getItem(
        `client_avatar_${client.id}`
      );
    } catch {
      savedAvatar = null;
    }

    return {
      ...client,

      // Use the same image selected on Clients page
      avatar:
        savedAvatar ||
        client.avatar ||
        "https://i.pravatar.cc/150?img=12",

      tint:
        client.id % 4 === 0
          ? "bg-violet-100 text-violet-600"
          : client.id % 4 === 1
          ? "bg-rose-100 text-rose-600"
          : client.id % 4 === 2
          ? "bg-amber-100 text-amber-700"
          : "bg-emerald-100 text-emerald-700",
    };
  });

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
     LOADING
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center bg-gray-100">
        <div className="w-full max-w-[430px] min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto" />

            <p className="text-sm text-gray-500 mt-3">
              Loading dashboard...
            </p>
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
      <div className="min-h-screen w-full flex justify-center bg-gray-100">
        <div className="w-full max-w-[430px] min-h-screen bg-[#faf7f2] px-5 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-6 text-center shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Dashboard Error
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl"
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
    <div className="min-h-screen w-full flex justify-center bg-gray-100">
      <div className="w-full max-w-[430px] min-h-screen bg-[#faf7f2] relative pb-28">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="px-5 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={avatarUser}
              alt="Profile"
              width={512}
              height={512}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
            />

<div>
  <p className="text-sm text-[#9C8A73]">
    {greeting},
  </p>

  <h1
    className="text-xl font-semibold text-[#3B2F22]"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
    {userName} 👋
  </h1>
</div>
</div>

          <button
            type="button"
            aria-label="Notifications"
            onClick={() => navigate("/reminders")}
            className="relative w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center"
          >
            <Bell className="w-4.5 h-4.5 text-amber-500" />

            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </button>
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="px-4 mt-4">
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm px-3.5 py-3">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, clients, venues..."
              className="flex-1 bg-transparent text-[12px] text-gray-700 placeholder:text-gray-400 outline-none"
            />

            <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
          </div>
        </div>

        {/* =================================================
            NEXT EVENT
        ================================================= */}

        <div className="px-4 mt-4">
          {nextEvent ? (
            <button
              type="button"
              onClick={() => openEvent(nextEvent)}
              className="w-full text-left bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 p-3"
            >
              <div className="flex gap-3">

                <img
                  src={nextEvent.image}
                  alt={nextEvent.title}
                  width={800}
                  height={600}
                  className="w-[42%] h-[130px] object-cover rounded-2xl flex-shrink-0"
                />

                <div className="flex-1 min-w-0 pt-0.5">

                  <span className="inline-block bg-amber-50 text-amber-600 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border border-amber-100">
                    Next Event
                  </span>

                  <p className="text-[11px] font-semibold text-amber-500 mt-1.5">
                    {getNextDayLabel(nextEvent)} •{" "}
                    {nextEvent.time}
                  </p>

                  <h2 className="text-[15px] font-bold text-gray-900 mt-0.5 leading-snug">
                    {nextEvent.title}
                  </h2>

                  <div className="mt-2 space-y-1 text-[11px] text-gray-500">

                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />

                      {nextEvent.venue}
                    </p>

                    <p className="flex items-center gap-1.5 truncate">
                      <Users className="w-3 h-3 text-amber-400 shrink-0" />

                      {nextEvent.client}
                    </p>

                    {nextEvent.guests !== "--" && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Users className="w-3 h-3 text-amber-400 shrink-0" />

                        {nextEvent.guests} Guests
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-50">

                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Clock className="w-3 h-3" />

                  Starts in {nextEvent.starts_in}
                </div>

                <span className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                </span>
              </div>
            </button>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center">
              <CalendarDays className="w-8 h-8 text-gray-300 mx-auto" />

              <p className="text-sm font-semibold text-gray-700 mt-2">
                No upcoming events
              </p>

              <p className="text-[11px] text-gray-400 mt-1">
                Add an event to see it here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/add-event")}
                className="mt-4 bg-amber-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
              >
                Add Event
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            UPCOMING EVENTS
        ================================================= */}

        <div className="mt-6">

          <div className="px-4 flex justify-between items-center">
            <h2 className="font-bold text-gray-900 text-[15px]">
              Upcoming Events
            </h2>

            <button
              type="button"
              onClick={() => navigate("/calendar")}
              className="text-[11px] text-amber-500 font-semibold"
            >
              View All
            </button>
          </div>

          <div
            className="mt-3 flex gap-3 overflow-x-auto px-4 pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event)}
                  className="w-[155px] flex-shrink-0 text-left bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="relative">

                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      width={768}
                      height={512}
                      className="w-full h-[92px] object-cover"
                    />

                    <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm min-w-[34px]">
                      <p className="text-sm font-bold leading-none text-gray-900">
                        {event.day}
                      </p>

                      <p className="text-[9px] font-semibold text-gray-400 uppercase mt-0.5">
                        {event.month}
                      </p>
                    </div>

                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {event.status}
                    </span>
                  </div>

                  <div className="p-2.5">

                    <h3 className="text-[12px] font-semibold text-gray-900 truncate">
                      {event.title}
                    </h3>

                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 truncate">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />

                      {event.venue}
                    </p>

                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 truncate">
                      <Clock className="w-2.5 h-2.5 shrink-0" />

                      {event.time}
                    </p>

                    <p className="text-[10px] text-orange-500 mt-0.5 flex items-center gap-1 font-semibold">
                      <Users className="w-2.5 h-2.5 shrink-0" />

                      {event.guests || 0} Guests
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-5 text-center w-full">
                <p className="text-xs text-gray-400">
                  No matching events found.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="px-4 mt-5">

          <h2 className="font-bold text-gray-900 text-[15px]">
            Quick Actions
          </h2>

          <div className="mt-3 grid grid-cols-4 gap-2.5">

            {quickActions.map(
              ({ label, icon: Icon, fg, path }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(path)}
                  className="bg-white rounded-2xl py-3.5 flex flex-col items-center gap-2 border border-gray-100 shadow-sm active:scale-95 transition-transform"
                >
                  <Icon className={`w-5 h-5 ${fg}`} />

                  <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight px-1">
                    {label}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        {/* =================================================
            RECENT CLIENTS
        ================================================= */}

        <div className="mt-6">

          <div className="px-4 flex justify-between items-center">

            <h2 className="font-bold text-gray-900 text-[15px]">
              Recent Clients
            </h2>

            <button
              type="button"
              onClick={() => navigate("/clients")}
              className="text-[11px] text-amber-500 font-semibold"
            >
              View All
            </button>
          </div>

          <div
            className="mt-3 flex gap-4 overflow-x-auto px-4 pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {clientsLoading ? (
              <div className="px-4 py-3">
                <p className="text-xs text-gray-400">
                  Loading clients...
                </p>
              </div>
            ) : recentClients.length > 0 ? (
              recentClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => navigate("/clients")}
                  className="flex flex-col items-center gap-1.5 w-[62px] flex-shrink-0"
                >
                  <img
                    src={client.avatar}
                    alt={client.name}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="w-[54px] h-[54px] rounded-full object-cover ring-2 ring-white shadow"
                  />

                  <span className="text-[10px] text-gray-600 text-center truncate w-full font-medium">
                    {client.name?.split(" ")[0]}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3">
                <p className="text-xs text-gray-400">
                  No clients found.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            ALL EVENTS
        ================================================= */}

        <div className="px-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-gray-900 text-[15px]">
              All Events
            </h2>

            <button
              type="button"
              onClick={() => navigate("/calendar")}
              className="text-[11px] text-amber-500 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {filteredAllEvents.length > 0 ? (
              filteredAllEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event)}
                  className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.99] transition-transform"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      width={800}
                      height={500}
                      className="w-full h-[105px] object-cover"
                    />

                    <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm min-w-[36px]">
                      <p className="text-sm font-bold leading-none text-gray-900">
                        {event.day}
                      </p>

                      <p className="text-[8px] font-semibold text-gray-400 uppercase mt-0.5">
                        {event.month}
                      </p>
                    </div>

                    <span
                      className={`absolute top-2 right-2 text-[8px] font-bold px-2 py-1 rounded-full ${getStatusClasses(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div className="p-2.5">
                    <h3 className="text-[12px] font-bold text-gray-900 truncate">
                      {event.title}
                    </h3>

                    <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1 truncate">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      {event.venue}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-[9px] text-gray-400 flex items-center gap-1 truncate">
                        <Clock className="w-2.5 h-2.5 shrink-0" />
                        {event.time}
                      </p>

                      <p className="text-[9px] text-orange-500 font-semibold flex items-center gap-1 whitespace-nowrap">
                        <Users className="w-2.5 h-2.5 shrink-0" />
                        {event.guests || 0}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[9px] text-gray-400 truncate">
                        {event.client}
                      </span>

                      <span className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <ChevronRight className="w-3 h-3 text-amber-600" />
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <CalendarDays className="w-8 h-8 text-gray-300 mx-auto" />

                <p className="text-sm font-semibold text-gray-700 mt-2">
                  No events found
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  Add an event to see it here.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/add-event")}
                  className="mt-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
                >
                  Add Event
                </button>
              </div>
            )}
          </div>
        </div>

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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="relative">

              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-52 object-cover"
              />

              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow"
              >
                <X className="w-5 h-5 text-gray-800" />
              </button>

              <span className="absolute bottom-3 left-3 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
                {selectedEvent.badge}
              </span>
            </div>

            <div className="p-5 overflow-y-auto">

              <h2 className="text-xl font-bold text-gray-900">
                {selectedEvent.title}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Client: {selectedEvent.host}
              </p>

              <div className="mt-4 space-y-3">

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
                ].map(
                  ({
                    icon: Icon,
                    label,
                    value,
                    bg,
                    fg,
                  }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`${bg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}
                      >
                        <Icon
                          className={`w-5 h-5 ${fg}`}
                        />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          {label}
                        </p>

                        <p className="text-sm font-semibold text-gray-900">
                          {value}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-5">

                <h3 className="text-sm font-bold text-gray-900">
                  About Event
                </h3>

                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* =================================================
                  UPDATE + DELETE ACTIONS
              ================================================= */}

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleUpdateEvent}
                  className="flex items-center justify-center gap-2 bg-amber-50 text-amber-700 border border-amber-100 font-semibold py-3 rounded-xl shadow-sm transition active:scale-[0.98]"
                >
                  <Pencil className="w-4 h-4" />
                  Update
                </button>

                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 font-semibold py-3 rounded-xl shadow-sm transition active:scale-[0.98]"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="mt-3 w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold py-3 rounded-xl shadow transition active:scale-[0.98]"
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