import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
.rm-wrap{min-height:100vh;background:#f7f1e8;display:flex;justify-content:center;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#3a2f26;}
.rm-phone{width:100%;max-width:420px;background:#faf5ee;min-height:100vh;padding:16px 14px 40px;}
.rm-tabs{display:flex;background:#f2e8dc;border-radius:14px;padding:4px;margin-bottom:14px;}
.rm-tab{flex:1;border:none;background:transparent;padding:10px;border-radius:11px;font-size:13.5px;font-weight:700;color:#9a8874;cursor:pointer;font-family:inherit;}
.rm-tab.on{background:#fffdfa;color:#bd7a2c;box-shadow:0 1px 3px rgba(146,110,66,.12);}
.rm-search-row{display:flex;gap:10px;margin-bottom:18px;}
.rm-search{flex:1;display:flex;align-items:center;gap:8px;background:#fffdfa;border:1px solid #f0e4d4;border-radius:14px;padding:0 12px;}
.rm-search input{flex:1;border:none;outline:none;background:transparent;padding:12px 0;font-size:13.5px;font-family:inherit;color:#3a2f26;}
.rm-search input::placeholder{color:#b0a191;}
.rm-filter{display:flex;align-items:center;gap:6px;background:#fffdfa;border:1px solid #f0e4d4;border-radius:14px;padding:0 14px;color:#b5793a;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}
.rm-filter.on{background:#f7ecdc;}
.rm-filters{display:flex;flex-wrap:wrap;gap:8px;margin:-8px 0 16px;}
.rm-chip{border:1px solid #ecdfcd;background:#fdf7ef;color:#8a6a45;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;}
.rm-chip.on{background:#bd7a2c;border-color:#bd7a2c;color:#fff;}
.rm-sec{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px;}
.rm-sec h2{margin:0;font-size:15px;font-weight:700;}
.rm-sec span{font-size:12px;color:#bd7a2c;font-weight:600;}
.rm-card{display:flex;gap:10px;background:#fffdfa;border:1px solid #f0e4d4;border-radius:18px;padding:10px;margin-bottom:12px;box-shadow:0 1px 2px rgba(146,110,66,.06);}
.rm-thumb{width:64px;height:78px;border-radius:12px;object-fit:cover;flex:none;background:#f2e6d6;}
.rm-date{width:48px;flex:none;background:#f7efe3;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 0;}
.rm-date b{font-size:17px;line-height:1;}
.rm-date i{font-style:normal;font-size:10px;color:#a08a70;text-transform:uppercase;letter-spacing:.5px;}
.rm-date u{text-decoration:none;font-size:10px;color:#a08a70;margin-top:2px;}
.rm-body{flex:1;min-width:0;}
.rm-body h3{margin:0 0 2px;font-size:14px;font-weight:700;}
.rm-body p{margin:0 0 6px;font-size:12px;color:#9a8874;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.rm-meta{display:flex;align-items:center;gap:5px;font-size:11.5px;color:#9a8874;margin-top:3px;}
.rm-side{display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:8px;flex:none;padding:2px 0;}
.rm-bell{width:32px;height:32px;border-radius:10px;border:none;background:#fdf1e0;color:#c98a34;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.rm-bell.off{background:#f3efe9;color:#b8ada0;}
.rm-dots{border:none;background:none;color:#b0a191;cursor:pointer;font-size:17px;line-height:1;padding:2px 6px;}
.rm-done{display:flex;flex-direction:column;align-items:center;gap:3px;color:#4a8f52;font-size:10px;font-weight:600;}
.rm-done .ring{width:26px;height:26px;border-radius:50%;border:1.6px solid #4a8f52;display:flex;align-items:center;justify-content:center;}
.rm-add{width:100%;background:#fffdfa;border:1.5px dashed #d8a15f;color:#bd7a2c;border-radius:14px;padding:13px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:22px;}
.rm-empty{background:#fffdfa;border:1px solid #f0e4d4;border-radius:16px;padding:22px;text-align:center;color:#9a8874;font-size:13px;margin-bottom:16px;}
.rm-viewall{width:100%;background:none;border:none;color:#bd7a2c;font-weight:600;font-size:13px;cursor:pointer;padding:10px;font-family:inherit;}
.rm-modal{position:fixed;inset:0;background:rgba(50,36,22,.45);display:flex;align-items:flex-end;justify-content:center;z-index:50;}
.rm-sheet{background:#fffdfa;width:100%;max-width:420px;border-radius:22px 22px 0 0;padding:18px;max-height:86vh;overflow:auto;}
.rm-sheet h4{margin:0 0 14px;font-size:15px;font-weight:700;}
.rm-lbl{display:block;font-size:12px;font-weight:600;color:#9a8874;margin:10px 0 5px;}
.rm-in{width:100%;box-sizing:border-box;border:1px solid #f0e4d4;background:#fdf9f3;border-radius:11px;padding:11px;font-size:13.5px;font-family:inherit;color:#3a2f26;outline:none;}
.rm-two{display:flex;gap:10px;}
.rm-two>div{flex:1;}
.rm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.rm-thumbbtn{border:2px solid transparent;border-radius:10px;overflow:hidden;padding:0;background:none;cursor:pointer;}
.rm-thumbbtn.sel{border-color:#bd7a2c;}
.rm-thumbbtn img{width:100%;height:52px;object-fit:cover;display:block;}
.rm-actions{display:flex;gap:10px;margin-top:16px;}
.rm-btn{flex:1;padding:12px;border-radius:12px;border:1px solid #ecdfcd;background:#fdf7ef;color:#8a6a45;font-weight:700;font-size:13.5px;cursor:pointer;font-family:inherit;}
.rm-btn.primary{background:#bd7a2c;border-color:#bd7a2c;color:#fff;}
.rm-btn.danger{color:#b5423a;border-color:#f0d6d3;background:#fdf3f2;}
.rm-menu{position:fixed;inset:0;background:rgba(50,36,22,.35);display:flex;align-items:flex-end;justify-content:center;z-index:60;}
.rm-menu-box{background:#fffdfa;width:100%;max-width:420px;border-radius:20px 20px 0 0;padding:10px;}
.rm-menu-box button{width:100%;text-align:left;border:none;background:none;padding:14px;font-size:14px;font-family:inherit;color:#3a2f26;cursor:pointer;border-radius:12px;}
.rm-menu-box button:hover{background:#faf3ea;}
.rm-menu-box button.danger{color:#b5423a;}
.rm-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:24px;background:#3a2f26;color:#fdf7ef;padding:10px 16px;border-radius:999px;font-size:12.5px;z-index:80;}
`;

const PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1470229722913-7ea0d1e1d1e1?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=70",
];

const Svg = ({ children, size = 16, color = "currentColor", w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const IcSearch = () => <Svg color="#b0a191"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>;
const IcFilter = () => <Svg><path d="M4 6h16M7 12h10M10 18h4" /></Svg>;
const IcBell = () => <Svg size={15}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></Svg>;
const IcClock = () => <Svg size={13} color="#b0a191"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
const IcPin = () => <Svg size={13} color="#b0a191"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Svg>;
const IcCheck = () => <Svg size={14} color="#4a8f52" w={2.4}><polyline points="20 6 9 17 4 12" /></Svg>;

const getEventPhoto = (eventType = "") => {
  const type = String(eventType).toLowerCase();

  if (type.includes("wedding")) return PHOTOS[0];
  if (type.includes("birthday")) return PHOTOS[3];
  if (type.includes("conference") || type.includes("corporate")) return PHOTOS[4];
  if (type.includes("dinner")) return PHOTOS[5];
  if (type.includes("concert") || type.includes("music")) return PHOTOS[6];
  if (type.includes("sports")) return PHOTOS[7];

  return PHOTOS[2];
};

const API = "http://127.0.0.1:8000";

const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const parts = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return { m: "—", d: "--", w: "" };
  return { m: MON[d.getMonth()], d: String(d.getDate()).padStart(2, "0"), w: DAY[d.getDay()] };
};
const hhmm = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${String(hr).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ap}`;
};

const TYPES = ["All", "Wedding", "Birthday", "Meeting", "Other"];

const mapEvent = (event, alertState = {}) => {
  const date = event.event_date || "";
  const time = event.event_time ? String(event.event_time).slice(0, 5) : "";

  return {
    id: event.id,
    title: event.event_name || "Untitled Event",
    sub: event.client_name || "No client",
    date,
    start: time,
    end: "",
    place: event.venue || "No venue",
    photo: getEventPhoto(event.event_type),
    alert: alertState[event.id] !== false,
    done:
      String(event.status || "").toLowerCase() === "completed" ||
      (date && date < new Date().toISOString().slice(0, 10)),
    type:
      String(event.event_type || "Other")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    notes: event.notes || "",
    guests: Number(event.guests ?? 0),
    raw: event,
  };
};

export default function Reminder() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [type, setType] = useState("All");
  const [menuId, setMenuId] = useState(null);
  const [toast, setToast] = useState("");
  const [showAllDone, setShowAllDone] = useState(false);
  const [loading, setLoading] = useState(true);

  const say = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 1800);
  };

  const loadEvents = async () => {
    try {
      setLoading(true);

      const savedAlerts = JSON.parse(
        localStorage.getItem("event_reminder_alerts") || "{}"
      );

      const response = await fetch(`${API}/events/`);

      if (!response.ok) {
        throw new Error("Failed to load events");
      }

      const data = await response.json();
      setItems((data || []).map((event) => mapEvent(event, savedAlerts)));
    } catch (error) {
      console.error("Failed to load reminder events:", error);
      setItems([]);
      say("Unable to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();

    return items
      .filter((e) => (type === "All" ? true : e.type === type))
      .filter(
        (e) =>
          !term ||
          `${e.title} ${e.sub} ${e.place} ${e.type}`
            .toLowerCase()
            .includes(term)
      )
      .sort((a, b) =>
        `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`)
      );
  }, [items, q, type]);

  const upcoming = filtered.filter((e) => !e.done);
  const completed = filtered.filter((e) => e.done);
  const list = tab === "upcoming" ? upcoming : completed;
  const shown = tab === "upcoming" || showAllDone ? list : list.slice(0, 2);

  const toggleAlert = (id) => {
    setItems((current) => {
      const updated = current.map((event) =>
        event.id === id ? { ...event, alert: !event.alert } : event
      );

      const alertState = {};
      updated.forEach((event) => {
        alertState[event.id] = event.alert;
      });

      localStorage.setItem(
        "event_reminder_alerts",
        JSON.stringify(alertState)
      );

      return updated;
    });

    const current = items.find((event) => event.id === id);
    say(current?.alert ? "Reminder off" : "Reminder on");
  };

  const deleteEvent = async (event) => {
    if (!event?.id) return;

    const confirmed = window.confirm(
      `Delete "${event.title}"? This will remove the event from your database.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API}/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setItems((current) => current.filter((item) => item.id !== event.id));
      setMenuId(null);
      say("Event deleted");
    } catch (error) {
      console.error(error);
      say("Failed to delete event");
    }
  };

  const active = items.find((e) => e.id === menuId);

  return (
    <div className="rm-wrap">
      <style>{styles}</style>
      <div className="rm-phone">
        <div className="rm-tabs">
          <button className={`rm-tab${tab === "upcoming" ? " on" : ""}`} onClick={() => setTab("upcoming")}>Upcoming</button>
          <button className={`rm-tab${tab === "completed" ? " on" : ""}`} onClick={() => setTab("completed")}>Completed</button>
        </div>

        <div className="rm-search-row">
          <label className="rm-search">
            <IcSearch />
            <input placeholder="Search events..." value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <button className={`rm-filter${showFilters ? " on" : ""}`} onClick={() => setShowFilters((v) => !v)}>
            <IcFilter /> Filter
          </button>
        </div>

        {showFilters && (
          <div className="rm-filters">
            {["All", ...TYPES].map((t) => (
              <button key={t} className={`rm-chip${type === t ? " on" : ""}`} onClick={() => setType(t)}>{t}</button>
            ))}
          </div>
        )}

        <div className="rm-sec">
          <h2>{tab === "upcoming" ? "Upcoming Events" : "Completed Events"}</h2>
          <span>{list.length} Events</span>
        </div>

        {loading ? (
          <div className="rm-empty">Loading your real events...</div>
        ) : shown.length === 0 ? (
          <div className="rm-empty">
            No {tab} events found.
          </div>
        ) : (
          shown.map((e) => {

          const p = parts(e.date);
          return (
            <div className="rm-card" key={e.id}>
              <img className="rm-thumb" src={e.photo} alt={`${e.title} cover`} loading="lazy" />
              <div className="rm-date">
                <i>{p.m}</i>
                <b>{p.d}</b>
                <u>{p.w}</u>
              </div>
              <div className="rm-body">
                <h3>{e.title}</h3>
                <p>{e.sub}</p>
                <div className="rm-meta"><IcClock /> {hhmm(e.start)}{e.end ? ` – ${hhmm(e.end)}` : ""}</div>
                <div className="rm-meta"><IcPin /> {e.place}</div>
                {e.guests > 0 && (
                  <div className="rm-meta">👥 {e.guests} guests</div>
                )}
              </div>
              <div className="rm-side">
                {e.done ? (
                  <div className="rm-done"><span className="ring"><IcCheck /></span>Completed</div>
                ) : (
                  <button
                    className={`rm-bell${e.alert ? "" : " off"}`}
                    aria-label={e.alert ? "Turn alert off" : "Turn alert on"}
                    onClick={() => toggleAlert(e.id)}
                  >
                    <IcBell />
                  </button>
                )}
                <button className="rm-dots" aria-label="More options" onClick={() => setMenuId(e.id)}>⋮</button>
              </div>
            </div>
          );
          })
        )}

        {tab === "upcoming" ? (
          <button className="rm-add" onClick={() => navigate("/add-event")}>
            + Add New Event
          </button>
        ) : (
          list.length > 2 && (
            <button className="rm-viewall" onClick={() => setShowAllDone((v) => !v)}>
              {showAllDone ? "Show Less" : "View All Completed Events ›"}
            </button>
          )
        )}
      </div>

      {menuId && active && (
        <div className="rm-menu" onClick={() => setMenuId(null)}>
          <div className="rm-menu-box" onClick={(ev) => ev.stopPropagation()}>
            <button
              onClick={() => {
                setMenuId(null);
                navigate("/add-event", {
                  state: {
                    editEvent: active.raw,
                  },
                });
              }}
            >
              Edit event
            </button>

            <button
              onClick={() => {
                setMenuId(null);
                toggleAlert(active.id);
              }}
            >
              {active.alert ? "Turn reminder off" : "Turn reminder on"}
            </button>

            <button className="danger" onClick={() => deleteEvent(active)}>
              Delete event
            </button>
          </div>
        </div>
      )}



      {toast && <div className="rm-toast">{toast}</div>}
    </div>
  );
}
