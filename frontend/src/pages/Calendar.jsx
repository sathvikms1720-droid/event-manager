import BottomNav from "../components/BottomNav";
import { useEffect, useMemo, useRef, useState } from "react";
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
  ListChecks,
  CheckCircle2,
  Circle,
  Clock,
  X,
  CalendarDays,
  UsersRound,
  PartyPopper,
  Heart,
  CakeSlice,
  Utensils,
  Music2,
  Trophy,
  Wrench,
} from "lucide-react";

/* ============================================================
   Design tokens — warm editorial palette
   Base: cream paper, espresso ink, sand lines, amber accent
   ============================================================ */
const BG = "#faf7f2";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* Per-type visual system: dot, text, soft chip and icon stay in sync */
const TYPE_STYLES = {
  party:      { dot: "bg-amber-500",   text: "text-amber-700",   soft: "bg-amber-100/70 text-amber-800",     icon: PartyPopper, checklist: ["Confirm arrangements", "Check decorations", "Final client confirmation"] },
  wedding:    { dot: "bg-rose-500",    text: "text-rose-700",    soft: "bg-rose-100/70 text-rose-800",       icon: Heart,       checklist: ["Confirm venue", "Check decorations", "Final client confirmation"] },
  conference: { dot: "bg-sky-600",     text: "text-sky-700",     soft: "bg-sky-100/70 text-sky-800",         icon: UsersRound,  checklist: ["Confirm speakers", "Prepare seating", "Check presentation setup"] },
  birthday:   { dot: "bg-fuchsia-500", text: "text-fuchsia-700", soft: "bg-fuchsia-100/70 text-fuchsia-800", icon: CakeSlice,   checklist: ["Confirm cake", "Check decorations", "Confirm guest arrangements"] },
  dinner:     { dot: "bg-orange-500",  text: "text-orange-700",  soft: "bg-orange-100/70 text-orange-800",   icon: Utensils,    checklist: ["Confirm restaurant", "Confirm guest count", "Check table arrangements"] },
  concert:    { dot: "bg-violet-500",  text: "text-violet-700",  soft: "bg-violet-100/70 text-violet-800",   icon: Music2,      checklist: ["Confirm performers", "Check sound setup", "Review event schedule"] },
  sports:     { dot: "bg-emerald-500", text: "text-emerald-700", soft: "bg-emerald-100/70 text-emerald-800", icon: Trophy,      checklist: ["Confirm participants", "Check venue setup", "Prepare equipment"] },
  workshop:   { dot: "bg-teal-500",    text: "text-teal-700",    soft: "bg-teal-100/70 text-teal-800",       icon: Wrench,      checklist: ["Prepare materials", "Confirm participants", "Check equipment"] },
};

const FALLBACK_STYLE = {
  dot: "bg-stone-400",
  text: "text-stone-600",
  soft: "bg-stone-100 text-stone-600",
  icon: CalendarDays,
  checklist: ["Confirm details", "Check arrangements", "Final client confirmation"],
};

const styleFor = (type) => TYPE_STYLES[String(type || "").trim().toLowerCase()] || FALLBACK_STYLE;

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

function getEventMeta(type, id) {
  const normalizedType = String(type || "event").toLowerCase();
  const style = styleFor(normalizedType);

  // Guest count is read from the database in mapApiEventToCalendarEvent.
  // Keep this function responsible only for event metadata.

  // Pick 2–3 checklist items based on the event ID.
  const checklistCount = 2 + ((Number(id) || 1) % 2);

  const checklist = style.checklist
    .map((label, index) => ({
      label,
      done: ((Number(id) || 1) + index) % 3 === 0,
    }))
    .slice(0, checklistCount);

  return {
    icon: style.icon,
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

/* Self-contained motion — no external animation library needed */
const GLOBAL_CSS = `
@keyframes calFade { from { opacity: 0 } to { opacity: 1 } }
@keyframes calRise { from { opacity: 0; transform: translateY(28px) scale(.98) } to { opacity: 1; transform: none } }
@keyframes calShimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
.cal-fade { animation: calFade .18s ease-out both }
.cal-rise { animation: calRise .3s cubic-bezier(.22,1,.36,1) both }
.cal-skeleton {
  background: linear-gradient(90deg, #f1e9dd 25%, #faf5ec 50%, #f1e9dd 75%);
  background-size: 200% 100%;
  animation: calShimmer 1.4s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .cal-fade, .cal-rise, .cal-skeleton { animation: none }
}
`;

/* ── EVENT DETAILS SHEET ── */
function EventDetails({ appointment, dateLabel, onClose }) {
  const open = Boolean(appointment);

  // Escape-to-close and body scroll lock (hooks stay unconditional).
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  if (!open) return null;

  const Icon = appointment.icon;
  const PlaceIcon = appointment.placeIcon;
  const style = styleFor(appointment.type);
  const whenLabel = appointment.date ? formatSavedDate(appointment.date) : dateLabel;
  const doneCount = appointment.checklist.filter((i) => i.done).length;
  const total = appointment.checklist.length;

  const Detail = ({ icon, label, children }) => (
    <div className="rounded-2xl border border-[#EEE5D8] bg-[#F7F0E6] p-3">
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#9C8A73]">
        {icon}{label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[#3B2F22]">{children}</dd>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        aria-label="Close details"
        onClick={onClose}
        className="cal-fade absolute inset-0 bg-[#2A2018]/45 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="cal-rise relative w-full max-w-md rounded-t-[28px] border border-[#EEE5D8] bg-[#FFFDF9] p-6 pb-8 shadow-2xl sm:rounded-[28px]"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E8DDCE] sm:hidden" />

        {/* Identity row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.soft}`}>
              <Icon size={21} />
            </span>
            <div>
              <span className={`text-[10px] font-semibold uppercase tracking-widest ${style.text}`}>
                {appointment.type}
              </span>
              <h2 className="text-lg font-semibold leading-tight text-[#3B2F22]">
                {appointment.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E8DDCE] text-[#9C8A73] transition-colors hover:bg-[#F7F0E6]"
          >
            <X size={15} />
          </button>
        </div>

        {appointment.notes && (
          <p className="mt-4 border-l-2 border-[#EEE5D8] pl-3 text-sm italic leading-relaxed text-[#8A7966]">
            {appointment.notes}
          </p>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-3">
          <Detail icon={<Clock size={14} />} label="When">
            {whenLabel} · {appointment.time} {appointment.meridiem}
          </Detail>
          <Detail icon={<ListChecks size={14} />} label="Status">{appointment.duration}</Detail>
          <Detail icon={<PlaceIcon size={14} />} label="Where">{appointment.place}</Detail>
          <Detail icon={<Users size={14} />} label="Guests">
            {appointment.guests > 0 ? `${appointment.guests} people` : "No guests"}
          </Detail>
        </dl>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#9C8A73]">Checklist</h3>
            <span className="text-[11px] font-semibold text-[#8A7966]">{doneCount}/{total}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F1E9DD]">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: total ? `${(doneCount / total) * 100}%` : "0%" }}
            />
          </div>
          <ul className="mt-3 space-y-2">
            {appointment.checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                {item.done
                  ? <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                  : <Circle size={16} className="shrink-0 text-[#D8CFC2]" />}
                <span className={item.done ? "text-[#9C8A73] line-through" : "text-[#5C4B3A]"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-[#F1E9DD] pt-4 text-xs text-[#9C8A73]">
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
  const [showSearch, setShowSearch] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [openEvent, setOpenEvent] = useState(null);
  const [savedEventsOpen, setSavedEventsOpen] = useState(false);

  const [dateClickCount, setDateClickCount] = useState(0);
  const [clickedDate, setClickedDate] = useState(null);

  const searchRef = useRef(null);
  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  /* Event dots per date, keyed by YYYY-MM-DD */
  const dotsByDate = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      if (!event.event_date) return;
      const type = String(event.event_type || "").trim().toLowerCase();
      if (!map[event.event_date]) map[event.event_date] = [];
      if (!map[event.event_date].includes(type)) map[event.event_date].push(type);
    });
    return map;
  }, [events]);

  /* Legend built from the types actually in the user's events */
  const legendTypes = useMemo(() => {
    const seen = [];
    Object.values(dotsByDate).forEach((types) =>
      types.forEach((t) => { if (!seen.includes(t)) seen.push(t); })
    );
    return seen;
  }, [dotsByDate]);

  const monthEventCount = useMemo(() => {
    const prefix = toISO(year, month, 1).slice(0, 7);
    return events.filter((e) => String(e.event_date || "").startsWith(prefix)).length;
  }, [events, year, month]);

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

  const goToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelected(now.getDate());
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

  const isToday = (day) =>
    !selected || day === today.getDate()
      ? year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
      : false;

  const selectedLabel = selected
    ? new Date(year, month, selected).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "Select a date";

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-2" style={{ backgroundColor: BG }}>
      <style>{GLOBAL_CSS}</style>

      {/* HEADER */}
      <div className="flex items-start justify-between px-1 pt-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B3A28C]">
            Your schedule
          </p>
          <h1 className="mt-1 text-[26px] font-bold leading-tight text-[#3B2F22]">Calendar</h1>
          <p className="mt-1 text-[12px] text-[#9C8A73]">
            Plan your events and stay organized.
          </p>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <button
            type="button"
            aria-label="Search events"
            aria-expanded={showSearch}
            onClick={() => {
              setShowSearch((v) => !v);
              if (showSearch) setQuery("");
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-colors ${
              showSearch
                ? "border-amber-200 bg-amber-50"
                : "border-[#EEE5D8] bg-white"
            }`}
          >
            {showSearch
              ? <X className="h-4 w-4 text-amber-700" />
              : <Search className="h-4 w-4 text-[#8A7966]" />}
          </button>

          <button
            type="button"
            aria-label="Show saved events"
            title="Show saved events"
            onClick={() => setSavedEventsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEE5D8] bg-white shadow-sm transition-colors hover:bg-[#F7F0E6]"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#8A7966]" />
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      {showSearch && (
        <div className="cal-rise mt-4 flex items-center gap-2 rounded-2xl border border-[#EEE5D8] bg-white px-3 py-2.5 shadow-sm">
          <Search className="h-4 w-4 shrink-0 text-[#9C8A73]" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, client or venue…"
            className="w-full bg-transparent text-sm text-[#3B2F22] outline-none placeholder:text-[#C4B5A0]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F7F0E6] text-[#9C8A73]"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* MONTH SWITCHER */}
      <section className="mt-6 flex items-center justify-between rounded-2xl border border-[#EEE5D8] bg-white p-2 shadow-sm">
        <button
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#8A7966] transition-colors hover:bg-[#F7F0E6] active:scale-95"
        >
          <ChevronLeft size={17} />
        </button>

        <div className="text-center">
          <h2 className="text-[15px] font-semibold leading-tight text-[#3B2F22]">
            {MONTHS[month]} <span className="font-normal text-[#9C8A73]">{year}</span>
          </h2>
          <p className="text-[10px] font-medium uppercase tracking-widest text-[#B3A28C]">
            {monthEventCount} {monthEventCount === 1 ? "event" : "events"}
          </p>
        </div>

        <button
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#8A7966] transition-colors hover:bg-[#F7F0E6] active:scale-95"
        >
          <ChevronRight size={17} />
        </button>
      </section>

      {/* WEEKDAYS */}
      <div className="mt-4 grid grid-cols-7 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-[10px] font-semibold uppercase tracking-widest text-[#9C8A73]">
            {d}
          </span>
        ))}
      </div>

      {/* DAY GRID */}
      <div className="mt-1 grid grid-cols-7">
        {cells.map((c, i) => {
          const isSelected = !c.muted && c.day === selected;
          const isTodayCell = !c.muted && isToday(c.day);
          const marks = c.muted
            ? []
            : dotsByDate[toISO(year, month, c.day)] || [];

          return (
            <button
              key={`${i}-${c.day}`}
              disabled={c.muted}
              onClick={() => handleDateClick(c.day)}
              aria-pressed={isSelected}
              aria-label={c.muted ? undefined : `${MONTHS[month]} ${c.day}, ${year}`}
              aria-current={isTodayCell ? "date" : undefined}
              className={`flex h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
                c.muted ? "cursor-default" : "hover:bg-[#F7F0E6]"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-all ${
                  c.muted
                    ? "text-[#E2D9CB]"
                    : isSelected
                      ? "bg-amber-500 font-semibold text-white shadow-[0_4px_12px_-2px_rgba(245,158,11,0.45)]"
                      : isTodayCell
                        ? "font-semibold text-amber-700 ring-1 ring-inset ring-amber-300"
                        : "text-[#3B2F22]"
                }`}
              >
                {c.day}
              </span>
              <span className="flex h-1.5 items-center gap-0.5">
                {marks.slice(0, 3).map((m) => (
                  <span
                    key={m}
                    className={`h-1 w-1 rounded-full ${styleFor(m).dot} ${
                      activeType && m !== activeType ? "opacity-25" : ""
                    }`}
                  />
                ))}
                {marks.length > 3 && (
                  <span className="text-[7px] font-bold leading-none text-[#9C8A73]">+</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* LEGEND (also filters) */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setActiveType(null)}
          aria-pressed={!activeType}
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
            !activeType
              ? "border-transparent bg-[#3B2F22] text-[#FAF7F2]"
              : "border-[#EEE5D8] bg-white text-[#8A7966]"
          }`}
        >
          All
        </button>
        {legendTypes.map((t) => {
          const style = styleFor(t);
          return (
            <button
              key={t}
              onClick={() => setActiveType(activeType === t ? null : t)}
              aria-pressed={activeType === t}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                activeType === t
                  ? "border-transparent bg-white ring-1 ring-[#E8DDCE]"
                  : "border-[#EEE5D8] bg-white text-[#8A7966]"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {capitalize(t)}
            </button>
          );
        })}
      </div>

      {/* SELECTED DAY HEADER */}
      <div className="mt-7 flex items-center justify-between px-1">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold text-[#3B2F22]">{selectedLabel}</h3>
          {selected && daySchedule.length > 0 && (
            <span className="rounded-full bg-[#F7F0E6] px-2 py-0.5 text-[10px] font-semibold text-[#8A7966]">
              {daySchedule.length}
            </span>
          )}
        </div>
        <button
          onClick={goToday}
          className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 transition-colors hover:bg-amber-100"
        >
          Today
        </button>
      </div>

      {/* SCHEDULE LIST */}
      <section className="mt-3 space-y-3">
        {/* Loading skeletons */}
        {loading && [0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-[#EEE5D8] bg-white p-3.5">
            <div className="cal-skeleton h-9 w-9 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="cal-skeleton h-3 w-2/5 rounded-full" />
              <div className="cal-skeleton h-3 w-4/5 rounded-full" />
            </div>
          </div>
        ))}

        {!loading && daySchedule.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#E8DDCE] bg-white/50 p-8 text-center">
            <CalendarDays className="mx-auto text-[#D8CFC2]" size={30} />
            <p className="mt-3 text-sm font-medium text-[#8A7966]">
              {selected ? "Nothing scheduled for this day." : "Pick a date to see the schedule."}
            </p>
            {selected && (
              <p className="mt-1 text-[11px] text-[#B3A28C]">
                Tap the same date twice more to add an event.
              </p>
            )}
          </div>
        )}

        {!loading && daySchedule.map((s) => {
          const Icon = s.icon;
          const PlaceIcon = s.placeIcon;
          const style = styleFor(s.type);
          return (
            <button
              key={s.id}
              onClick={() => setOpenEvent(s)}
              className="group flex w-full items-center gap-3 rounded-2xl border border-[#EEE5D8] bg-white p-3.5 text-left shadow-sm transition-all duration-200 hover:border-[#E0D3C0] hover:shadow-md active:scale-[0.98]"
            >
              <div className="w-11 shrink-0 text-center">
                <p className={`text-[13px] font-bold leading-none ${style.text}`}>{s.time}</p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-[#9C8A73]">
                  {s.meridiem}
                </p>
              </div>
              <span className={`h-11 w-1 shrink-0 rounded-full ${style.dot}`} />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate text-sm font-semibold text-[#3B2F22]">{s.title}</p>
                  <span className="shrink-0 rounded-full bg-[#F7F0E6] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#8A7966]">
                    {s.duration}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-[#8A7966]">{s.subtitle}</p>
                <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-[#9C8A73]">
                  <PlaceIcon size={11} className="shrink-0" />{s.place}
                </p>
              </div>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.soft}`}>
                <Icon size={16} />
              </span>
              <Chevron size={15} className="shrink-0 text-[#D8CFC2] transition-transform group-hover:translate-x-0.5" />
            </button>
          );
        })}
      </section>

      {/* BOTTOM NAV */}
      <BottomNav active="calendar" theme="purple" />

      {/* SAVED EVENTS SHEET */}
      {savedEventsOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button
            aria-label="Close saved events"
            onClick={() => setSavedEventsOpen(false)}
            className="cal-fade absolute inset-0 bg-[#2A2018]/45 backdrop-blur-[2px]"
          />

          <div className="cal-rise relative max-h-[82vh] w-full max-w-md overflow-hidden rounded-t-[28px] border border-[#EEE5D8] bg-[#FFFDF9] shadow-2xl sm:rounded-[28px]">
            <div className="flex items-center justify-between border-b border-[#F1E9DD] bg-[#FFFDF9] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#3B2F22]">My Events</h2>
                <p className="mt-0.5 text-xs text-[#9C8A73]">All your saved event dates</p>
              </div>
              <button
                onClick={() => setSavedEventsOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DDCE] text-[#9C8A73] transition-colors hover:bg-[#F7F0E6]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[calc(82vh-72px)] overflow-y-auto px-4 py-4 pb-8">
              {savedEventGroups.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E8DDCE] p-8 text-center">
                  <CalendarDays className="mx-auto text-[#D8CFC2]" size={28} />
                  <p className="mt-3 text-sm text-[#8A7966]">No saved events yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedEventGroups.map((group) => (
                    <section key={group.date}>
                      <div className="mb-2 flex items-center justify-between rounded-xl bg-[#F7F0E6] px-3 py-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={15} className="text-[#9C8A73]" />
                          <span className="text-xs font-semibold text-[#5C4B3A]">
                            {formatSavedDate(group.date)}
                          </span>
                        </div>
                        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-[#8A7966]">
                          {group.items.length} {group.items.length === 1 ? "event" : "events"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {group.items.map((appointment) => {
                          const Icon = appointment.icon;
                          const style = styleFor(appointment.type);
                          return (
                            <button
                              key={appointment.id}
                              onClick={() => openSavedEvent(appointment)}
                              className="group flex w-full items-center gap-3 rounded-2xl border border-[#EEE5D8] bg-white p-3 text-left shadow-sm transition-all duration-200 hover:border-[#E0D3C0] hover:shadow-md active:scale-[0.98]"
                            >
                              <span className={`h-12 w-1 shrink-0 rounded-full ${style.dot}`} />
                              <div className="w-12 shrink-0 text-center">
                                <p className={`text-xs font-bold leading-none ${style.text}`}>
                                  {appointment.time}
                                </p>
                                <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-[#9C8A73]">
                                  {appointment.meridiem}
                                </p>
                              </div>
                              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.soft}`}>
                                <Icon size={17} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[#3B2F22]">
                                  {appointment.title}
                                </p>
                                <p className="truncate text-xs text-[#8A7966]">{appointment.subtitle}</p>
                                <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-[#9C8A73]">
                                  <MapPin size={10} className="shrink-0" />
                                  {appointment.place}
                                </p>
                              </div>
                              <Chevron size={15} className="shrink-0 text-[#D8CFC2] transition-transform group-hover:translate-x-0.5" />
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

      <EventDetails
        appointment={openEvent}
        dateLabel={selectedLabel}
        onClose={() => setOpenEvent(null)}
      />
    </main>
  );
}