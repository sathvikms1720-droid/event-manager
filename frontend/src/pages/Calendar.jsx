import BottomNav from "../components/BottomNav";
import { useEffect, useMemo, useState } from "react";
import { getEvents } from "../api/eventService";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronRight as Chevron,
  MapPin,
  Users,
  Video,
  ListChecks,
  CheckCircle2,
  Circle,
  Clock,
  X,
  Home,
  Calendar as CalendarIcon,
    UsersRound,
  Settings,
  CalendarDays,
  PartyPopper,
  Heart,
  CakeSlice,
  Utensils,
  Music2,
  Trophy,
  Wrench,
} from "lucide-react";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const DOT = {
  party: "bg-amber-500",
  wedding: "bg-rose-500",
  conference: "bg-blue-500",
  birthday: "bg-orange-500",
  dinner: "bg-purple-500",
  concert: "bg-violet-500",
  sports: "bg-emerald-500",
  workshop: "bg-teal-500",
};

const TEXT = {
  party: "text-amber-600",
  wedding: "text-rose-600",
  conference: "text-blue-600",
  birthday: "text-orange-600",
  dinner: "text-purple-600",
  concert: "text-violet-600",
  sports: "text-emerald-600",
  workshop: "text-teal-600",
};

const SOFT = {
  party: "bg-amber-50 text-amber-600",
  wedding: "bg-rose-50 text-rose-600",
  conference: "bg-blue-50 text-blue-600",
  birthday: "bg-orange-50 text-orange-600",
  dinner: "bg-purple-50 text-purple-600",
  concert: "bg-violet-50 text-violet-600",
  sports: "bg-emerald-50 text-emerald-600",
  workshop: "bg-teal-50 text-teal-600",
};
const LEGEND = [
  { label: "Party", type: "party" },
  { label: "Wedding", type: "wedding" },
  { label: "Conference", type: "conference" },
];
const EVENT_META = {
  party: {
    icon: PartyPopper,
    checklist: [
      "Confirm arrangements",
      "Check decorations",
      "Final client confirmation",
    ],
  },

  wedding: {
    icon: Heart,
    checklist: [
      "Confirm venue",
      "Check decorations",
      "Final client confirmation",
    ],
  },

  conference: {
    icon: UsersRound,
    checklist: [
      "Confirm speakers",
      "Prepare seating",
      "Check presentation setup",
    ],
  },

  birthday: {
    icon: CakeSlice,
    checklist: [
      "Confirm cake",
      "Check decorations",
      "Confirm guest arrangements",
    ],
  },

  dinner: {
    icon: Utensils,
    checklist: [
      "Confirm restaurant",
      "Confirm guest count",
      "Check table arrangements",
    ],
  },

  concert: {
    icon: Music2,
    checklist: [
      "Confirm performers",
      "Check sound setup",
      "Review event schedule",
    ],
  },

  sports: {
    icon: Trophy,
    checklist: [
      "Confirm participants",
      "Check venue setup",
      "Prepare equipment",
    ],
  },

  workshop: {
    icon: Wrench,
    checklist: [
      "Prepare materials",
      "Confirm participants",
      "Check equipment",
    ],
  },
};

function getEventMeta(type, id) {
  const normalizedType = String(type || "event").toLowerCase();

  const meta = EVENT_META[normalizedType] || EVENT_META.party;

  // Guest count is read from the database in mapApiEventToCalendarEvent.
  // Keep this function responsible only for event metadata.

  // Pick 2–3 checklist items based on the event ID.
  const checklistCount = 2 + ((Number(id) || 1) % 2);

  const checklist = meta.checklist
    .map((label, index) => ({
      label,
      done: ((Number(id) || 1) + index) % 3 === 0,
    }))
    .slice(0, checklistCount);

  return {
    icon: meta.icon,
    checklist,
  };
}

function mapApiEventToCalendarEvent(event) {
  const [hours, minutes] = String(event.event_time || "00:00").split(":");
  const hour = Number(hours);
  const type = String(event.event_type || "party").trim().toLowerCase();
  const meta = getEventMeta(type, event.id);

  return {
    id: event.id,
    date: event.event_date,
    time: `${String(hour % 12 || 12).padStart(2, "0")}:${minutes}`,
    meridiem: hour >= 12 ? "PM" : "AM",
    type,
    title: event.event_name,
    subtitle: event.client_name || "No client",
    place: event.venue || "No venue",
    placeIcon: MapPin,
    icon: meta.icon,
    // IMPORTANT: use the actual guest count saved in the events table.
    guests: Number(event.guests ?? 0),
    checklist: meta.checklist,
    duration: event.status || "Upcoming",
    notes: event.notes || "",
  };
}

function formatSavedDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* appointments keyed by YYYY-MM-DD */
const APPOINTMENTS = {
  "2025-05-03": [
    { id: "sangeet", time: "06:00", meridiem: "PM", duration: "2 hrs", type: "event",
      title: "Sangeet Rehearsal", subtitle: "Rahul & Priya Wedding", place: "Studio 9, Ahmedabad",
      placeIcon: MapPin, icon: Users, guests: 14,
      notes: "Choreographer confirmed. Bring the updated song order and speakers.",
      checklist: [{ label: "Confirm choreographer", done: true }, { label: "Share song list", done: true }, { label: "Book sound system", done: false }] },
  ],
  "2025-05-07": [
    { id: "vendor", time: "10:30", meridiem: "AM", duration: "45 min", type: "meeting",
      title: "Vendor Sync", subtitle: "Catering & Decor", place: "Office",
      placeIcon: MapPin, icon: Users, guests: 5,
      notes: "Finalise menu tasting date and stage decor palette.",
      checklist: [{ label: "Collect catering quote", done: true }, { label: "Approve mood board", done: false }] },
  ],
  "2025-05-15": [
    { id: "payment", time: "09:00", meridiem: "AM", duration: "15 min", type: "reminder",
      title: "Advance Payment Due", subtitle: "Royal Palace booking", place: "Tasks",
      placeIcon: ListChecks, icon: CheckCircle2, guests: 0,
      notes: "40% advance to be transferred before the venue hold expires.",
      checklist: [{ label: "Send invoice to client", done: false }] },
  ],
  "2025-05-22": [
    { id: "wedding-meeting", time: "09:00", meridiem: "AM", duration: "1 hr", type: "event",
      title: "Wedding Meeting", subtitle: "Rahul & Priya Wedding", place: "Office",
      placeIcon: MapPin, icon: Users, guests: 6,
      notes: "Walk the couple through the final timeline and seating chart.",
      checklist: [{ label: "Print timeline", done: true }, { label: "Seating chart v3", done: true }, { label: "Guest list updates", done: false }] },
    { id: "venue-visit", time: "11:00", meridiem: "AM", duration: "1.5 hrs", type: "meeting",
      title: "Venue Visit", subtitle: "Royal Palace", place: "Ahmedabad",
      placeIcon: MapPin, icon: MapPin, guests: 4,
      notes: "Measure the mandap area and check power points for the lighting rig.",
      checklist: [{ label: "Carry measuring tape", done: false }, { label: "Photograph entrance", done: false }] },
    { id: "client-call", time: "02:00", meridiem: "PM", duration: "30 min", type: "reminder",
      title: "Client Call", subtitle: "Mehta Engagement", place: "Online Meeting",
      placeIcon: Video, icon: Video, guests: 3,
      notes: "Budget revision call — they want to add a live band.",
      checklist: [{ label: "Prepare revised budget", done: true }, { label: "Share band options", done: false }] },
    { id: "reception", time: "04:00", meridiem: "PM", duration: "1 hr", type: "event",
      title: "Reception Planning", subtitle: "Rahul & Priya Wedding", place: "Office",
      placeIcon: MapPin, icon: ListChecks, guests: 8,
      notes: "Lock the entry sequence, cake moment and first dance track.",
      checklist: [{ label: "Confirm entry sequence", done: false }, { label: "Order cake sample", done: true }] },
    { id: "proposals", time: "08:30", meridiem: "PM", duration: "20 min", type: "meeting",
      title: "Send Proposals", subtitle: "3 Pending", place: "Tasks",
      placeIcon: ListChecks, icon: CheckCircle2, guests: 0,
      notes: "Sharma, Kapoor and Iyer proposals are drafted and ready to send.",
      checklist: [{ label: "Sharma proposal", done: true }, { label: "Kapoor proposal", done: false }, { label: "Iyer proposal", done: false }] },
  ],
  "2025-05-26": [
    { id: "mehndi", time: "03:00", meridiem: "PM", duration: "3 hrs", type: "event",
      title: "Mehndi Setup", subtitle: "Kapoor Family", place: "Garden Lawn",
      placeIcon: MapPin, icon: Users, guests: 60,
      notes: "Umbrella decor arrives at 1 PM. Two mehndi artists booked.",
      checklist: [{ label: "Confirm artists", done: true }, { label: "Check seating count", done: false }] },
  ],
  "2025-05-30": [
    { id: "review", time: "12:00", meridiem: "PM", duration: "1 hr", type: "meeting",
      title: "Monthly Review", subtitle: "Team standup", place: "Office",
      placeIcon: MapPin, icon: Users, guests: 7,
      notes: "Review May bookings, pending payments and June pipeline.",
      checklist: [{ label: "Pull revenue report", done: false }] },
  ],
};

const navItems = [
  { label: "Home", icon: Home },
  { label: "Calendar", icon: CalendarIcon, active: true },
  { label: "Clients", icon: UsersRound },
  { label: "Settings", icon: Settings },
];

const toISO = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

function buildMonthGrid(year, month) {
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, muted: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, muted: false });
  let next = 1;
  while (cells.length < 42) cells.push({ day: next++, muted: true });
  return cells;
}

/* ── EVENT DETAILS SHEET ── */
function EventDetails({ appointment, dateLabel, onClose }) {
  if (!appointment) return null;
  const Icon = appointment.icon;
  const PlaceIcon = appointment.placeIcon;

  const Detail = ({ icon, label, children }) => (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {icon}{label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-gray-900">{children}</dd>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close details" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-md rounded-t-3xl border border-gray-100 bg-white p-6 shadow-xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${SOFT[appointment.type]}`}>
              <Icon size={20} />
            </span>
            <div>
              <span className={`text-[10px] font-semibold uppercase tracking-widest ${TEXT[appointment.type]}`}>
                {appointment.type}
              </span>
              <h2 className="text-lg font-semibold leading-tight text-gray-900">{appointment.title}</h2>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400">
            <X size={15} />
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">{appointment.notes}</p>

        <dl className="mt-5 grid grid-cols-2 gap-3">
          <Detail icon={<Clock size={14} />} label="When">{dateLabel} · {appointment.time} {appointment.meridiem}</Detail>
          <Detail icon={<Clock size={14} />} label="Duration">{appointment.duration}</Detail>
          <Detail icon={<PlaceIcon size={14} />} label="Where">{appointment.place}</Detail>
          <Detail icon={<Users size={14} />} label="Guests">
            {appointment.guests > 0 ? `${appointment.guests} people` : "No guests"}
          </Detail>
        </dl>

        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Checklist</h3>
          <ul className="mt-2 space-y-2">
            {appointment.checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                {item.done ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-gray-300" />}
                <span className={item.done ? "text-gray-400 line-through" : "text-gray-700"}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
          <MapPin size={13} />
          <span>{appointment.subtitle}</span>
        </div>
      </div>
    </div>
  );
}

/* ── CALENDAR PAGE ── */
export default function Calendar() {
  const navigate = useNavigate();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(today.getDate());
  const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await getEvents();

      console.log("Logged-in user's events:", response.data);

      setEvents(response.data || []);
    } catch (error) {
      console.error(
        "Error fetching user events:",
        error.response?.data || error
      );

      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState(null);
  const [openEvent, setOpenEvent] = useState(null);
  const [savedEventsOpen, setSavedEventsOpen] = useState(false);

  const [dateClickCount, setDateClickCount] = useState(0);
  const [clickedDate, setClickedDate] = useState(null);

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
    const handleDateClick = (day) => {
    // If user clicked a different date, start again from 1
    if (clickedDate !== day) {
      setClickedDate(day);
      setDateClickCount(1);
      setSelected(day);
      return;
    }

    const newCount = dateClickCount + 1;

    // Third click → Add Event page
    if (newCount === 3) {
      setDateClickCount(0);
      setClickedDate(null);
      setSelected(day);

      navigate("/add-event");
      return;
    }

    setDateClickCount(newCount);
    setSelected(day);
  };
  const shiftMonth = (delta) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelected(null);
  };

  const daySchedule = useMemo(() => {
    if (!selected) return [];

    const selectedDate = toISO(year, month, selected);

    const list = events
      .filter((event) => event.event_date === selectedDate)
      .map(mapApiEventToCalendarEvent);

    const q = query.trim().toLowerCase();

    return list.filter((a) =>
      (!activeType || a.type === activeType) &&
      (
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.place.toLowerCase().includes(q)
      )
    );
  }, [events, year, month, selected, query, activeType]);

  const savedEventGroups = useMemo(() => {
    const grouped = events.reduce((acc, event) => {
      if (!event.event_date) return acc;
      if (!acc[event.event_date]) acc[event.event_date] = [];
      acc[event.event_date].push(mapApiEventToCalendarEvent(event));
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) => {
          const timeA = a.time + a.meridiem;
          const timeB = b.time + b.meridiem;
          return timeA.localeCompare(timeB);
        }),
      }));
  }, [events]);

  const openSavedEvent = (appointment) => {
    const [savedYear, savedMonth, savedDay] = appointment.date.split("-").map(Number);
    setYear(savedYear);
    setMonth(savedMonth - 1);
    setSelected(savedDay);
    setActiveType(null);
    setQuery("");
    setSavedEventsOpen(false);
    setOpenEvent(appointment);
  };

  const selectedLabel = selected
    ? new Date(year, month, selected).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "Select a date";

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-white px-5 pb-28 pt-2">
      {/* HEADER */}
      {/* HEADER */}
<div className="px-5 pt-6 flex items-start justify-between">
  <div>
    <h1 className="text-[26px] font-bold text-gray-900 leading-tight">
      Calendar
    </h1>

    <p className="text-[11px] text-gray-400 mt-1">
      Plan your events and stay organized.
    </p>
  </div>

  <div className="flex items-center gap-2">
    <button
      type="button"
      aria-label="Search"
      className="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center"
    >
      <Search className="w-4 h-4 text-gray-500" />
    </button>

    <button
      type="button"
      aria-label="Show saved events"
      title="Show saved events"
      onClick={() => setSavedEventsOpen(true)}
      className="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center"
    >
      <SlidersHorizontal className="w-4 h-4 text-gray-500" />
    </button>
  </div>
</div>

      {/* MONTH SWITCHER */}
      <section className="mt-7 flex items-center justify-between">
        <button onClick={() => shiftMonth(-1)} aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm active:scale-95 transition-transform">
          <ChevronLeft size={17} />
        </button>
        <h2 className="text-base font-semibold text-gray-900">{MONTHS[month]} {year}</h2>
        <button onClick={() => shiftMonth(1)} aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm active:scale-95 transition-transform">
          <ChevronRight size={17} />
        </button>
      </section>

      {/* WEEKDAYS */}
      <div className="mt-5 grid grid-cols-7 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{d}</span>
        ))}
      </div>

      {/* DAY GRID */}
      <div className="mt-2 grid grid-cols-7">
        {cells.map((c, i) => {
          const isSelected = !c.muted && c.day === selected;
        const marks = c.muted
  ? []
  : [
      ...new Set(
        events
          .filter((event) => event.event_date === toISO(year, month, c.day))
          .map((event) => event.event_type.toLowerCase())
      ),
    ];
          return (
           <button
  key={`${i}-${c.day}`}
  disabled={c.muted}
  onClick={() => handleDateClick(c.day)}
  className="flex h-12 flex-col items-center justify-center gap-1"
>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors ${
                c.muted ? "text-gray-300" : isSelected ? "bg-gray-900 font-semibold text-white" : "text-gray-800 hover:bg-gray-100"
              }`}>{c.day}</span>
              <span className="flex h-1 items-center gap-0.5">
                {marks.map((m) => <span key={m} className={`h-1 w-1 rounded-full ${DOT[m]}`} />)}
              </span>
            </button>
          );
        })}
      </div>

      {/* LEGEND (also filters) */}
      <div className="mt-4 flex items-center justify-center gap-4">
        {LEGEND.map((l) => (
          <button key={l.type} onClick={() => setActiveType(activeType === l.type ? null : l.type)}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
              activeType === l.type ? `border-transparent ${SOFT[l.type]}` : "border-gray-100 text-gray-500"
            }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${DOT[l.type]}`} />
            {l.label}
          </button>
        ))}
      </div>

      {/* SELECTED DAY HEADER */}
      <div className="mt-7 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{selectedLabel}</h3>
        <button onClick={() => {
            const now = new Date();
            setYear(now.getFullYear()); setMonth(now.getMonth()); setSelected(now.getDate());
          }}
          className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
          Today
        </button>
      </div>

      {/* SCHEDULE LIST */}
      <section className="mt-3 space-y-3">
        {daySchedule.length === 0 && (
          <p className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
            {selected ? "Nothing scheduled for this day." : "Pick a date to see the schedule."}
          </p>
        )}
        {daySchedule.map((s) => {
          const Icon = s.icon;
          const PlaceIcon = s.placeIcon;
          return (
            <button key={s.id} onClick={() => setOpenEvent(s)}
              className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm active:scale-[0.99] transition-transform">
              <div className="w-12 shrink-0 text-center">
                <p className={`text-sm font-semibold ${TEXT[s.type]}`}>{s.time}</p>
                <p className="text-[10px] uppercase text-gray-400">{s.meridiem}</p>
              </div>
              <span className={`h-12 w-1 rounded-full ${DOT[s.type]}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{s.title}</p>
                <p className="truncate text-xs text-gray-500">{s.subtitle}</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                  <PlaceIcon size={11} />{s.place}
                </p>
              </div>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${SOFT[s.type]}`}>
                <Icon size={16} />
              </span>
              <Chevron size={15} className="text-gray-300" />
            </button>
          );
        })}
      </section>

      {/* BOTTOM NAV */}
        <BottomNav active="calendar" theme="purple" />

      {savedEventsOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            aria-label="Close saved events"
            onClick={() => setSavedEventsOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="relative max-h-[82vh] w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">My Events</h2>
                <p className="mt-0.5 text-xs text-gray-400">All your saved event dates</p>
              </div>
              <button
                onClick={() => setSavedEventsOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[calc(82vh-80px)] overflow-y-auto px-4 py-4 pb-8">
              {savedEventGroups.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                  <CalendarDays className="mx-auto text-gray-300" size={28} />
                  <p className="mt-3 text-sm text-gray-500">No saved events yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedEventGroups.map((group) => (
                    <section key={group.date}>
                      <div className="mb-2 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={15} className="text-gray-400" />
                          <span className="text-xs font-semibold text-gray-700">{formatSavedDate(group.date)}</span>
                        </div>
                        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-gray-500">
                          {group.items.length} {group.items.length === 1 ? "event" : "events"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {group.items.map((appointment) => {
                          const Icon = appointment.icon;
                          return (
                            <button
                              key={appointment.id}
                              onClick={() => openSavedEvent(appointment)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm transition-transform active:scale-[0.99]"
                            >
                              <span className={`h-12 w-1 shrink-0 rounded-full ${DOT[appointment.type] || "bg-gray-400"}`} />
                              <div className="w-14 shrink-0 text-center">
                                <p className={`text-xs font-semibold ${TEXT[appointment.type] || "text-gray-600"}`}>
                                  {appointment.time}
                                </p>
                                <p className="text-[9px] uppercase text-gray-400">{appointment.meridiem}</p>
                              </div>
                              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${SOFT[appointment.type] || "bg-gray-50 text-gray-500"}`}>
                                <Icon size={17} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900">{appointment.title}</p>
                                <p className="truncate text-xs text-gray-500">{appointment.subtitle}</p>
                                <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-gray-400">
                                  <MapPin size={10} />
                                  {appointment.place}
                                </p>
                              </div>
                              <Chevron size={15} className="shrink-0 text-gray-300" />
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <EventDetails appointment={openEvent} dateLabel={selectedLabel} onClose={() => setOpenEvent(null)} />
    </main>
  );
}
