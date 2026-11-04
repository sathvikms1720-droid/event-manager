import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API = axios.create({
  baseURL: "https://event-manager-pls6.onrender.com",
});

const PHOTO_OPTIONS = [
  {
    id: "party",
    label: "Party",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "wedding",
    label: "Wedding",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "conference",
    label: "Conference",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "birthday",
    label: "Birthday",
    url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dinner",
    label: "Dinner",
    url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "concert",
    label: "Concert",
    url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sports",
    label: "Sports",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "workshop",
    label: "Workshop",
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
  },
];

const EVENT_TYPES = ["Party", "Wedding", "Conference", "Birthday", "Dinner", "Concert", "Sports", "Workshop"];

const styles = `
/* ---------- Design tokens ---------- */
.ae-wrap{
  --bg:#f4ecdf;
  --surface:#fffdf8;
  --surface-2:#faf3e7;
  --border:#ebe0cc;
  --border-soft:#f2e9d8;
  --ink:#33281c;
  --ink-soft:#6f604c;
  --muted:#a2917a;
  --accent:#c1792b;
  --accent-deep:#9c5e1a;
  --accent-soft:#f8ecd6;
  --accent-tint:#fdf6ea;
  --success:#3f7d47;
  --success-soft:#e9f3e6;
  --shadow-card:0 1px 2px rgba(120,90,45,.05),0 6px 20px -8px rgba(120,90,45,.10);
  --shadow-float:0 12px 30px -10px rgba(120,90,45,.30);
  --radius-lg:20px;
  --radius-md:14px;

  min-height:100dvh;
  background:
    radial-gradient(120% 60% at 50% -10%, #f9f1e2 0%, var(--bg) 70%);
  display:flex;justify-content:center;
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  color:var(--ink);
  -webkit-font-smoothing:antialiased;
  letter-spacing:-.01em;
}
.ae-page{width:100%;max-width:430px;min-height:100dvh;display:flex;flex-direction:column;}

/* ---------- Header ---------- */
.ae-header{
  position:sticky;top:0;z-index:20;
  display:flex;align-items:center;gap:12px;
  padding:14px 16px 12px;
  background:color-mix(in srgb, #f7efe1 82%, transparent);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border-bottom:1px solid color-mix(in srgb, var(--border) 60%, transparent);
}
.ae-icon-btn{
  width:38px;height:38px;flex:none;border-radius:12px;border:1px solid var(--border);
  background:var(--surface);color:var(--accent-deep);
  display:flex;align-items:center;justify-content:center;cursor:pointer;
  transition:transform .15s ease, background .2s ease, border-color .2s ease;
}
.ae-icon-btn:hover{background:var(--accent-tint);border-color:#e3d2b4;}
.ae-icon-btn:active{transform:scale(.94);}
.ae-headings{display:flex;flex-direction:column;min-width:0;margin-right:auto;}
.ae-eyebrow{
  font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:var(--accent);margin-bottom:1px;
}
.ae-title{font-size:19px;font-weight:750;letter-spacing:-.02em;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

/* ---------- Sections ---------- */
.ae-body{padding:16px 16px 34px;display:flex;flex-direction:column;}
.ae-section{margin-bottom:18px;animation:ae-rise .45s cubic-bezier(.22,.9,.3,1) both;}
.ae-section:nth-child(2){animation-delay:.04s;}
.ae-section:nth-child(3){animation-delay:.08s;}
.ae-section:nth-child(4){animation-delay:.12s;}
.ae-section:nth-child(5){animation-delay:.16s;}
@keyframes ae-rise{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
.ae-section-label{
  display:flex;align-items:center;gap:8px;
  font-size:11px;font-weight:750;letter-spacing:.13em;text-transform:uppercase;
  color:var(--muted);margin:0 4px 8px;
}
.ae-section-label::after{content:"";height:1px;flex:1;background:linear-gradient(90deg,var(--border-soft),transparent);}

/* ---------- Cards ---------- */
.ae-card{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--radius-lg);
  box-shadow:var(--shadow-card);
  overflow:hidden;
}

/* ---------- Cover photo ---------- */
.ae-cover{padding:10px;}
.ae-cover-btn{
  position:relative;display:block;width:100%;padding:0;border:none;border-radius:var(--radius-md);
  background:var(--surface-2);cursor:pointer;overflow:hidden;aspect-ratio:16/8;
}
.ae-cover-btn img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s ease;}
.ae-cover-btn:hover img{transform:scale(1.03);}
.ae-cover-empty{
  width:100%;height:100%;min-height:128px;
  border:1.5px dashed #d9b985;border-radius:var(--radius-md);
  background:
    radial-gradient(90% 120% at 50% 0%, #fdf6e9 0%, var(--surface-2) 80%);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;
  color:var(--accent-deep);
}
.ae-cover-empty strong{font-size:13.5px;font-weight:700;color:var(--accent-deep);}
.ae-cover-empty span{font-size:12px;color:var(--muted);font-weight:500;}
.ae-cover-chip{
  position:absolute;right:10px;bottom:10px;
  display:flex;align-items:center;gap:6px;
  padding:7px 12px;border-radius:999px;border:none;cursor:pointer;
  background:rgba(35,25,12,.62);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  color:#fff;font-family:inherit;font-size:12px;font-weight:650;
  transition:background .2s ease;
}
.ae-cover-chip:hover{background:rgba(35,25,12,.8);}

/* ---------- Rows ---------- */
.ae-row{
  display:flex;align-items:center;gap:12px;
  min-height:56px;padding:10px 14px;
  border-bottom:1px solid var(--border-soft);
  transition:background .2s ease;
}
.ae-row:last-child{border-bottom:none;}
.ae-row:focus-within{background:var(--accent-tint);}
.ae-badge{
  width:34px;height:34px;flex:none;border-radius:11px;
  background:var(--accent-soft);color:var(--accent-deep);
  display:flex;align-items:center;justify-content:center;
  transition:background .2s ease,color .2s ease;
}
.ae-row:focus-within .ae-badge{background:var(--accent);color:#fff;}
.ae-label{font-size:13.5px;font-weight:650;color:var(--ink-soft);flex:none;}
.ae-field{margin-left:auto;display:flex;align-items:center;gap:8px;min-width:0;}
.ae-input{
  border:none;outline:none;background:transparent;text-align:right;
  font-size:14.5px;font-weight:600;color:var(--ink);font-family:inherit;
  width:160px;min-width:0;
}
.ae-input::placeholder{color:var(--muted);font-weight:500;}
.ae-input.narrow{width:132px;}
.ae-input:read-only:not([value=""]){color:var(--muted);cursor:default;}
.ae-input[type="date"],.ae-input[type="time"]{direction:ltr;text-align:right;}
.ae-input[type="date"]::-webkit-calendar-picker-indicator{opacity:.45;cursor:pointer;}
.ae-select{
  border:none;outline:none;background:transparent;cursor:pointer;max-width:172px;
  font-size:14.5px;font-weight:600;color:var(--ink);font-family:inherit;
  text-align:right;direction:rtl;text-align-last:right;appearance:none;-webkit-appearance:none;
  padding-right:2px;
}
.ae-select.ae-client-select{direction:ltr;text-align:right;text-align-last:right;}
.ae-select option{direction:ltr;font-weight:500;}
.ae-client-option-add{font-weight:750;color:var(--accent-deep);}
.ae-chevron{flex:none;color:#c6b59e;display:flex;}

/* ---------- Description ---------- */
.ae-desc{padding:14px 16px 10px;}
.ae-desc-head{display:flex;align-items:center;gap:12px;margin-bottom:8px;}
.ae-textarea{
  width:100%;border:none;outline:none;resize:none;background:transparent;
  font-size:14.5px;line-height:1.55;font-family:inherit;font-weight:500;color:var(--ink);
  min-height:72px;
}
.ae-textarea::placeholder{color:var(--muted);font-weight:500;}
.ae-count{display:flex;justify-content:flex-end;font-size:11px;font-weight:600;color:var(--muted);}
.ae-count.warn{color:var(--accent-deep);}

/* ---------- Guest stepper ---------- */
.ae-stepper{
  display:flex;align-items:center;gap:2px;
  border:1px solid var(--border);border-radius:999px;background:var(--surface-2);
  padding:3px;
}
.ae-stepper button{
  width:30px;height:30px;border-radius:50%;border:none;cursor:pointer;
  background:transparent;color:var(--accent-deep);font-size:17px;line-height:1;
  display:flex;align-items:center;justify-content:center;
  transition:background .15s ease,transform .1s ease,color .15s ease;
}
.ae-stepper button:hover:not(:disabled){background:var(--accent-soft);}
.ae-stepper button:active:not(:disabled){transform:scale(.9);}
.ae-stepper button:disabled{color:#d3c3aa;cursor:default;}
.ae-stepper input{
  width:52px;border:none;outline:none;background:transparent;text-align:center;
  font-size:14.5px;font-weight:700;color:var(--ink);font-family:inherit;
  -moz-appearance:textfield;
}
.ae-stepper input::-webkit-outer-spin-button,
.ae-stepper input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}

/* ---------- Reminder hint ---------- */
.ae-hint{
  display:flex;align-items:flex-start;gap:8px;
  padding:10px 16px 14px;font-size:12px;line-height:1.45;color:var(--muted);font-weight:500;
}

/* ---------- Slide to save ---------- */
.ae-slider{
  margin-top:26px;height:62px;border-radius:999px;position:relative;
  background:var(--surface-2);
  border:1px solid var(--border);
  box-shadow:inset 0 2px 6px rgba(120,90,45,.08);
  display:flex;align-items:center;user-select:none;overflow:hidden;touch-action:none;
  transition:background .35s ease,border-color .35s ease;
}
.ae-slider.done{background:var(--success-soft);border-color:#cfe3cc;}
.ae-slider-fill{
  position:absolute;left:0;top:0;bottom:0;
  background:linear-gradient(90deg,var(--accent-soft),#f0d6a6);
  border-radius:999px;pointer-events:none;
  transition:opacity .35s ease;
}
.ae-slider.done .ae-slider-fill{opacity:0;}
.ae-slider-text{
  width:100%;text-align:center;font-size:13.5px;font-weight:700;letter-spacing:.02em;
  color:var(--muted);position:relative;pointer-events:none;transition:color .3s ease;
}
.ae-slider.done .ae-slider-text{color:var(--success);}
.ae-knob{
  position:absolute;left:6px;top:5px;width:52px;height:52px;border-radius:50%;border:none;
  background:linear-gradient(140deg,#d99a45,#b06d1f);color:#fff;cursor:grab;
  display:flex;align-items:center;justify-content:center;
  box-shadow:var(--shadow-float);
  touch-action:none;will-change:transform;
}
.ae-slider.done .ae-knob{background:linear-gradient(140deg,#5ea867,#3f7d47);}
.ae-knob:active{cursor:grabbing;}

/* ---------- Saved banner ---------- */
.ae-saved{
  margin-top:14px;padding:13px 16px;border-radius:var(--radius-md);
  background:var(--success-soft);color:var(--success);
  font-size:13.5px;font-weight:700;text-align:center;
  display:flex;align-items:center;justify-content:center;gap:8px;
  animation:ae-pop .3s cubic-bezier(.3,1.4,.5,1) both;
}
@keyframes ae-pop{from{opacity:0;transform:scale(.94);}to{opacity:1;transform:scale(1);}}

/* ---------- Photo picker sheet ---------- */
.ae-modal{
  position:fixed;inset:0;z-index:50;
  background:rgba(40,28,14,.5);
  backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);
  display:flex;align-items:flex-end;justify-content:center;
  animation:ae-fade .2s ease both;
}
@keyframes ae-fade{from{opacity:0;}to{opacity:1;}}
.ae-sheet{
  background:var(--surface);width:100%;max-width:430px;
  border-radius:24px 24px 0 0;padding:10px 18px 20px;
  max-height:84dvh;overflow:auto;overscroll-behavior:contain;
  animation:ae-sheet-up .32s cubic-bezier(.24,.9,.32,1.05) both;
}
@keyframes ae-sheet-up{from{transform:translateY(60px);opacity:.4;}to{transform:none;opacity:1;}}
.ae-sheet-handle{width:40px;height:4px;border-radius:999px;background:var(--border);margin:4px auto 14px;}
.ae-sheet h4{margin:0 0 3px;font-size:16.5px;font-weight:750;letter-spacing:-.02em;}
.ae-sheet-sub{margin:0 0 14px;font-size:12.5px;color:var(--muted);font-weight:500;}
.ae-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;}
.ae-thumb{
  position:relative;border:none;border-radius:var(--radius-md);overflow:hidden;
  padding:0;background:none;cursor:pointer;aspect-ratio:1/1;
  outline:2px solid transparent;outline-offset:2px;
  transition:outline-color .2s ease,transform .15s ease;
}
.ae-thumb:active{transform:scale(.95);}
.ae-thumb.sel{outline-color:var(--accent);outline-width:2.5px;}
.ae-thumb img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.92);}
.ae-thumb.sel img{filter:saturate(1.05);}
.ae-thumb-label{
  position:absolute;left:0;right:0;bottom:0;padding:14px 6px 5px;
  background:linear-gradient(transparent,rgba(30,20,8,.72));
  color:#fff;font-size:11px;font-weight:650;text-align:left;text-shadow:0 1px 3px rgba(0,0,0,.5);
}
.ae-thumb-check{
  position:absolute;top:6px;right:6px;width:20px;height:20px;border-radius:50%;
  background:var(--accent);color:#fff;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 2px 6px rgba(0,0,0,.3);
}
.ae-custom-photo{
  width:100%;height:100%;min-height:86px;
  background:var(--accent-tint);border:1.5px dashed #d9b985;border-radius:var(--radius-md);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
  color:var(--accent-deep);
}
.ae-custom-photo.sel{background:var(--accent-soft);border-style:solid;border-color:var(--accent);}
.ae-custom-photo-plus{font-size:22px;font-weight:500;line-height:1;}
.ae-custom-photo-label{font-size:11px;font-weight:650;color:var(--accent-deep);padding:0 4px;text-align:center;}
.ae-sheet-actions{display:flex;gap:10px;margin-top:16px;}
.ae-btn{
  flex:1;padding:13px;border-radius:14px;cursor:pointer;
  border:1px solid var(--border);background:var(--surface-2);color:var(--ink-soft);
  font-family:inherit;font-size:14px;font-weight:700;
  transition:background .2s ease,transform .1s ease;
}
.ae-btn:hover{background:var(--accent-tint);}
.ae-btn:active{transform:scale(.97);}
.ae-btn.danger{color:#a34a3c;}
.ae-btn.primary{
  background:linear-gradient(140deg,#d99a45,#b06d1f);border-color:transparent;color:#fff;
  box-shadow:var(--shadow-float);
}
.ae-btn.primary:hover{background:linear-gradient(140deg,#e2a552,#b97522);}
`;

function Icon({ d, size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}

const I = {
  back: <polyline points="15 18 9 12 15 6" />,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  photo: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  note: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></>,
  money: <><circle cx="12" cy="12" r="9" /><path d="M12 7v10M14.5 9.5h-4a1.75 1.75 0 0 0 0 3.5h3a1.75 1.75 0 0 1 0 3.5h-4" /></>,
  bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  edit: <><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></>,
  check: <polyline points="20 6 9 17 4 12" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4-4-8 8" /></>,
};

const Chevron = () => (
  <span className="ae-chevron">
    <Icon d={<polyline points="9 18 15 12 9 6" />} size={14} />
  </span>
);

function SectionLabel({ children }) {
  return <div className="ae-section-label">{children}</div>;
}

function Row({ icon, label, children }) {
  return (
    <div className="ae-row">
      <span className="ae-badge"><Icon d={icon} /></span>
      <span className="ae-label">{label}</span>
      <div className="ae-field">{children}<Chevron /></div>
    </div>
  );
}

export default function AddEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const editEvent = location.state?.editEvent || null;
  const isEditMode = Boolean(editEvent?.id);

  const [photo, setPhoto] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [draftPhoto, setDraftPhoto] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientSelection, setClientSelection] = useState("");
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    location: "",

    // Client details
    clientName: "",
    clientPhone: "",
    clientEmail: "",

    type: "",
    description: "",
    budget: "",
    reminderDate: "",
    reminderTime: "",
  });
  const [guests, setGuests] = useState("");
  const [saved, setSaved] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const startX = useRef(0);
  const fileInputRef = useRef(null);

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken");

    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
  };

  const handleCustomImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    const customPhoto = {
      id: "custom",
      label: "Your Image",
      url: imageUrl,
    };

    setDraftPhoto(customPhoto);
    setPhoto(customPhoto);

    e.target.value = "";
  };

  const normalizeTime = (value) => {
    if (!value) return "";
    return String(value).slice(0, 5);
  };

  const normalizeDate = (value) => {
    if (!value) return "";
    return String(value).slice(0, 10);
  };

  const loadClients = async () => {
    setClientsLoading(true);

    try {
      const response = await API.get("/clients/", getAuthConfig());
      setClients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load clients:", error);
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (!editEvent) return;

    setForm({
      name: editEvent.title || editEvent.event_name || "",
      date: normalizeDate(editEvent.date || editEvent.event_date),
      time: normalizeTime(editEvent.time || editEvent.event_time),
      location: editEvent.venue || "",
      clientName: editEvent.client || editEvent.client_name || "",
      clientPhone: editEvent.client_phone || "",
      clientEmail: editEvent.client_email || "",
      type: editEvent.event_type || "",
      description: editEvent.description || editEvent.notes || "",
      budget:
        editEvent.budget !== null && editEvent.budget !== undefined
          ? String(editEvent.budget)
          : "",
      reminderDate: editEvent.reminderDate || "",
      reminderTime: normalizeTime(editEvent.reminderTime),
    });

    setGuests(
      editEvent.guests !== null && editEvent.guests !== undefined
        ? String(editEvent.guests)
        : ""
    );

    if (editEvent.image) {
      setPhoto({
        id: "existing-event-photo",
        label: "Current",
        url: editEvent.image,
      });
    }
  }, [editEvent]);

  useEffect(() => {
    if (!editEvent || !clients.length) return;

    const matchedClient =
      clients.find((client) => Number(client.id) === Number(editEvent.client_id)) ||
      clients.find(
        (client) =>
          String(client.name || "").trim().toLowerCase() ===
          String(editEvent.client || editEvent.client_name || "").trim().toLowerCase()
      );

    if (matchedClient) {
      setClientSelection(String(matchedClient.id));
      setForm((current) => ({
        ...current,
        clientName: matchedClient.name || current.clientName,
        clientPhone: matchedClient.phone || current.clientPhone,
        clientEmail: matchedClient.email || current.clientEmail,
      }));
    }
  }, [editEvent, clients]);

  // Show only the 5 most recently added clients in the dropdown.
  // When editing an older event, keep its selected client visible too.
  const recentClients = [...clients]
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const selectedClientForEdit = clients.find(
    (client) => String(client.id) === String(clientSelection)
  );

  const dropdownClients = selectedClientForEdit &&
    !recentClients.some((client) => String(client.id) === String(selectedClientForEdit.id))
    ? [selectedClientForEdit, ...recentClients]
    : recentClients;

  const handleClientChange = (e) => {
    const value = e.target.value;
    setClientSelection(value);

    if (value === "__new__") {
      setForm((current) => ({
        ...current,
        clientName: "",
        clientPhone: "",
        clientEmail: "",
      }));
      return;
    }

    const selectedClient = clients.find(
      (client) => String(client.id) === String(value)
    );

    if (selectedClient) {
      setForm((current) => ({
        ...current,
        clientName: selectedClient.name || "",
        clientPhone: selectedClient.phone || "",
        clientEmail: selectedClient.email || "",
      }));
    }
  };

  const maxDrag = () => (trackRef.current ? trackRef.current.offsetWidth - 62 : 0);

  const onKnobDown = (e) => {
    if (saved) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX - dragX;
    setDragging(true);
  };

  const onKnobMove = (e) => {
    if (!dragging) return;
    const next = Math.min(Math.max(0, e.clientX - startX.current), maxDrag());
    setDragX(next);
  };

 const onKnobUp = async () => {
  if (!dragging) return;

  setDragging(false);

  if (dragX >= maxDrag() * 0.85) {
    setDragX(maxDrag());

    const payload = {
      client_name: form.clientName.trim(),
      client_phone: form.clientPhone.trim(),
      client_email: form.clientEmail.trim() || null,

      event_name: form.name.trim(),
      event_type: form.type,
      event_date: form.date,
      event_time: form.time,

      venue: form.location.trim() || null,
      budget: form.budget ? Number(form.budget) : null,
      advance_paid: isEditMode ? undefined : 0,
      remaining_amount: isEditMode
        ? undefined
        : form.budget
        ? Number(form.budget)
        : 0,

      status: editEvent?.status || "Upcoming",
      notes: form.description.trim() || null,
      guests: Number(guests) || 0,
    };

    if (payload.advance_paid === undefined) delete payload.advance_paid;
    if (payload.remaining_amount === undefined) delete payload.remaining_amount;

    try {
  let eventId;

  if (isEditMode) {
    await API.put(
      `/events/${editEvent.id}`,
      payload,
      getAuthConfig()
    );

    eventId = editEvent.id;
  } else {
    const eventResponse = await API.post(
      "/events/",
      payload,
      getAuthConfig()
    );

    eventId = eventResponse.data.id;
  }

  // Save reminder
  if (form.reminderDate && form.reminderTime) {
    await API.post(
      "/reminders/",
      {
        event_id: eventId,
        title: form.name.trim(),
        reminder_datetime: `${form.reminderDate}T${form.reminderTime}:00`,
      },
      getAuthConfig()
    );
  } else if (isEditMode) {
    // Remove existing reminder if reminder was cleared
    const reminderResponse = await API.get(
      "/reminders/",
      getAuthConfig()
    );

    const existingReminder = reminderResponse.data.find(
      (reminder) =>
        Number(reminder.event_id) === Number(eventId)
    );

    if (existingReminder) {
      await API.delete(
        `/reminders/${existingReminder.id}`,
        getAuthConfig()
      );
    }
  }

  setSaved(true);

      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (error) {
      console.error(
        isEditMode ? "Failed to update event:" : "Failed to save event:",
        error
      );

      setDragX(0);

      alert(
        error.response?.data?.detail ||
          (isEditMode
            ? "Failed to update event. Please try again."
            : "Failed to save event. Please try again.")
      );
    }
  } else {
    setDragX(0);
  }
};

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const guestsNum = Number(guests) || 0;
  const descLength = form.description.length;

  return (
    <div className="ae-wrap">
      <style>{styles}</style>
      <div className="ae-page">
        <header className="ae-header">
          <button className="ae-icon-btn" aria-label="Go back" onClick={() => navigate(-1)}>
            <Icon d={I.back} />
          </button>
          <div className="ae-headings">
            <span className="ae-eyebrow">{isEditMode ? "Editing" : "New"}</span>
            <h1 className="ae-title">{isEditMode ? "Update Event" : "Add Event"}</h1>
          </div>
          <button className="ae-icon-btn" aria-label="Open calendar">
            <Icon d={I.cal} />
          </button>
        </header>

        <div className="ae-body">
          {/* ---------- Cover photo ---------- */}
          <section className="ae-section">
            <div className="ae-card ae-cover">
              <button
                className="ae-cover-btn"
                onClick={() => { setDraftPhoto(photo); setPickerOpen(true); }}
                aria-label={photo ? "Change event photo" : "Add event photo"}
              >
                {photo ? (
                  <>
                    <img src={photo.url} alt={`${photo.label} event cover`} />
                    <span className="ae-cover-chip">
                      <Icon d={I.edit} size={13} />
                      Edit
                    </span>
                  </>
                ) : (
                  <span className="ae-cover-empty">
                    <Icon d={I.photo} size={24} />
                    <strong>Add a cover photo</strong>
                    <span>Choose from presets or upload your own</span>
                  </span>
                )}
              </button>
            </div>
          </section>

          {/* ---------- Basics ---------- */}
          <section className="ae-section">
            <SectionLabel>Event details</SectionLabel>
            <div className="ae-card">
              <Row icon={I.note} label="Event Name">
                <input className="ae-input" placeholder="Enter event name" value={form.name} onChange={set("name")} />
              </Row>
              <Row icon={I.cal} label="Date">
                <input type="date" className="ae-input narrow" value={form.date} onChange={set("date")} />
              </Row>
              <Row icon={I.clock} label="Time">
                <input type="time" className="ae-input narrow" value={form.time} onChange={set("time")} />
              </Row>
              <Row icon={I.pin} label="Location">
                <input className="ae-input" placeholder="Add location" value={form.location} onChange={set("location")} />
              </Row>
              <Row icon={I.users} label="Event Type">
                <select className="ae-select" value={form.type} onChange={set("type")}>
                  <option value="">Select type</option>
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Row>
            </div>
          </section>

          {/* ---------- Client ---------- */}
          <section className="ae-section">
            <SectionLabel>Client</SectionLabel>
            <div className="ae-card">
              <Row icon={I.users} label="Client Name">
                {clientSelection === "__new__" ? (
                  <input
                    className="ae-input"
                    placeholder="Enter client name"
                    value={form.clientName}
                    onChange={set("clientName")}
                    autoFocus
                  />
                ) : (
                  <select
                    className="ae-select ae-client-select"
                    value={clientSelection}
                    onChange={handleClientChange}
                  >
                    <option value="">
                      {clientsLoading ? "Loading..." : "Select client"}
                    </option>

                    {dropdownClients.map((client) => (
                      <option key={client.id} value={String(client.id)}>
                        {client.name}
                      </option>
                    ))}

                    <option value="__new__" className="ae-client-option-add">
                      + Add New Client
                    </option>
                  </select>
                )}
              </Row>

              <Row icon={I.users} label="Client Phone">
                <input
                  type="tel"
                  className="ae-input"
                  placeholder="Enter phone"
                  value={form.clientPhone}
                  onChange={set("clientPhone")}
                  readOnly={clientSelection !== "" && clientSelection !== "__new__"}
                />
              </Row>

              <Row icon={I.note} label="Client Email">
                <input
                  type="email"
                  className="ae-input"
                  placeholder="Enter email"
                  value={form.clientEmail}
                  onChange={set("clientEmail")}
                  readOnly={clientSelection !== "" && clientSelection !== "__new__"}
                />
              </Row>
            </div>
          </section>

          {/* ---------- Description ---------- */}
          <section className="ae-section">
            <SectionLabel>Notes</SectionLabel>
            <div className="ae-card">
              <div className="ae-desc">
                <div className="ae-desc-head">
                  <span className="ae-badge"><Icon d={I.note} /></span>
                  <span className="ae-label">Description</span>
                </div>
                <textarea
                  className="ae-textarea"
                  maxLength={300}
                  placeholder="Add event description..."
                  value={form.description}
                  onChange={set("description")}
                />
                <div className={`ae-count${descLength >= 270 ? " warn" : ""}`}>
                  {descLength}/300
                </div>
              </div>
            </div>
          </section>

          {/* ---------- Logistics & reminder ---------- */}
          <section className="ae-section">
            <SectionLabel>Planning</SectionLabel>
            <div className="ae-card">
              <div className="ae-row">
                <span className="ae-badge"><Icon d={I.users} /></span>
                <span className="ae-label">Expected Guests</span>
                <div className="ae-field" style={{ gap: 6 }}>
                  <div className="ae-stepper">
                    <button
                      type="button"
                      aria-label="Remove one guest"
                      disabled={guestsNum <= 0}
                      onClick={() => setGuests(String(Math.max(0, guestsNum - 1)))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      aria-label="Expected guests"
                    />
                    <button
                      type="button"
                      aria-label="Add one guest"
                      onClick={() => setGuests(String(guestsNum + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <Row icon={I.money} label="Budget (Optional)">
                <input className="ae-input" placeholder="Enter amount" inputMode="decimal" value={form.budget} onChange={set("budget")} />
              </Row>
              <Row icon={I.bell} label="Reminder Date">
                <input type="date" className="ae-input narrow" value={form.reminderDate} onChange={set("reminderDate")} />
              </Row>
              <Row icon={I.clock} label="Reminder Time">
                <input type="time" className="ae-input narrow" value={form.reminderTime} onChange={set("reminderTime")} />
              </Row>
              <div className="ae-hint">
                <Icon d={I.bell} size={13} />
                <span>
                  A reminder is created only when both date and time are set. Clearing
                  them while editing removes the saved reminder.
                </span>
              </div>
            </div>
          </section>

          {/* ---------- Slide to save ---------- */}
          <div className={`ae-slider${saved ? " done" : ""}`} ref={trackRef}>
            <div
              className="ae-slider-fill"
              style={{ width: `${dragX + 58}px`, transition: dragging ? "none" : "width .3s ease" }}
            />
            <div className="ae-slider-text">
              {saved ? "Saved!" : isEditMode ? "Slide right to update" : "Slide right to save"}
            </div>
            <button
              className="ae-knob"
              aria-label="Slide right to save event"
              style={{
                transform: `translateX(${dragX}px)`,
                transition: dragging ? "none" : "transform .3s ease",
              }}
              onPointerDown={onKnobDown}
              onPointerMove={onKnobMove}
              onPointerUp={onKnobUp}
              onPointerCancel={onKnobUp}
            >
              <Icon d={saved ? I.check : I.arrow} size={20} />
            </button>
          </div>

          {saved && (
            <div className="ae-saved">
              <Icon d={I.check} size={15} />
              {isEditMode ? "Event updated" : "Event saved"}
              {form.name ? `: ${form.name}` : ""}!
            </div>
          )}
        </div>
      </div>

      {pickerOpen && (
        <div className="ae-modal" onClick={() => setPickerOpen(false)}>
          <div className="ae-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ae-sheet-handle" />
            <h4>Choose an event photo</h4>
            <p className="ae-sheet-sub">Pick a preset or upload your own image.</p>
            <div className="ae-grid">
              <button
                type="button"
                className={`ae-thumb${draftPhoto?.id === "custom" ? " sel" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Choose your own image"
              >
                <span className={`ae-custom-photo${draftPhoto?.id === "custom" ? " sel" : ""}`}>
                  <span className="ae-custom-photo-plus"><Icon d={I.image} size={20} /></span>
                  <span className="ae-custom-photo-label">Your image</span>
                </span>
                {draftPhoto?.id === "custom" && (
                  <span className="ae-thumb-check"><Icon d={I.check} size={12} /></span>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleCustomImage}
              />

              {PHOTO_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  className={`ae-thumb${draftPhoto?.id === p.id ? " sel" : ""}`}
                  onClick={() => setDraftPhoto(p)}
                  aria-label={`Select ${p.label} photo`}
                >
                  <img src={p.url} alt={`${p.label} event photo option`} loading="lazy" />
                  <span className="ae-thumb-label">{p.label}</span>
                  {draftPhoto?.id === p.id && (
                    <span className="ae-thumb-check"><Icon d={I.check} size={12} /></span>
                  )}
                </button>
              ))}
            </div>
            <div className="ae-sheet-actions">
              <button className="ae-btn danger" onClick={() => { setPhoto(null); setPickerOpen(false); }}>Remove</button>
              <button className="ae-btn primary" onClick={() => { setPhoto(draftPhoto); setPickerOpen(false); }}>Use photo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}