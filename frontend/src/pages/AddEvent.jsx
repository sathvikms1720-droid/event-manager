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
.ae-wrap{min-height:100vh;background:#f7f1e8;display:flex;justify-content:center;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#3a2f26;}
.ae-phone{width:100%;max-width:420px;background:#faf5ee;min-height:100vh;padding:16px 14px 40px;}
.ae-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
.ae-icon-btn{width:38px;height:38px;border-radius:12px;border:none;background:#f2e6d6;color:#b5793a;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s;}
.ae-icon-btn:hover{background:#e9d8c1;}
.ae-title{font-size:19px;font-weight:700;letter-spacing:-.2px;}
.ae-card{background:#fffdfa;border:1px solid #f0e4d4;border-radius:18px;box-shadow:0 1px 2px rgba(146,110,66,.06);margin-bottom:14px;overflow:hidden;}
.ae-photo{display:flex;gap:16px;align-items:center;padding:18px;}
.ae-photo-box{width:92px;height:92px;border-radius:14px;border:1.5px dashed #d8a15f;background:#fdf4e8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#b5793a;font-size:12px;font-weight:600;cursor:pointer;flex:none;overflow:hidden;padding:0;}
.ae-photo-box img{width:100%;height:100%;object-fit:cover;}
.ae-photo h3{margin:0 0 4px;font-size:15px;font-weight:700;}
.ae-photo p{margin:0;font-size:13px;color:#9a8874;line-height:1.4;}
.ae-row{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #f3ebe0;}
.ae-row:last-child{border-bottom:none;}
.ae-badge{width:32px;height:32px;border-radius:9px;background:#f7ecdc;color:#b5793a;display:flex;align-items:center;justify-content:center;flex:none;}
.ae-label{font-size:14px;font-weight:600;flex:none;}
.ae-field{margin-left:auto;display:flex;align-items:center;gap:6px;}
.ae-input{border:none;outline:none;background:transparent;text-align:right;font-size:13.5px;color:#3a2f26;font-family:inherit;width:150px;}
.ae-input::placeholder{color:#b0a191;}
.ae-select{border:none;outline:none;background:transparent;font-size:13.5px;color:#3a2f26;font-family:inherit;text-align:right;direction:rtl;cursor:pointer;max-width:170px;}
.ae-client-select{direction:ltr;text-align:right;}
.ae-client-option-add{font-weight:700;}
.ae-desc{padding:14px 16px;}
.ae-desc-head{display:flex;align-items:center;gap:12px;margin-bottom:8px;}
.ae-textarea{width:100%;border:none;outline:none;resize:none;background:transparent;font-size:13.5px;font-family:inherit;color:#3a2f26;min-height:64px;}
.ae-count{text-align:right;font-size:11px;color:#b0a191;}
.ae-step{display:flex;align-items:center;gap:10px;margin-left:auto;}
.ae-step button{width:28px;height:28px;border-radius:50%;border:1px solid #ecdfcd;background:#fdf7ef;color:#b5793a;font-size:15px;cursor:pointer;line-height:1;}
.ae-step span{min-width:20px;text-align:center;font-size:14px;font-weight:600;}
.ae-slider{margin-top:22px;height:62px;border-radius:34px;background:#fdf4e8;border:1px solid #f0e0c9;display:flex;align-items:center;position:relative;user-select:none;overflow:hidden;touch-action:none;}
.ae-slider-fill{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#f6e3c6,#eccf9f);border-radius:34px;pointer-events:none;}
.ae-slider-text{width:100%;text-align:center;font-size:13.5px;color:#a8907a;font-weight:600;position:relative;pointer-events:none;}
.ae-knob{position:absolute;left:6px;top:6px;width:50px;height:50px;border-radius:50%;background:linear-gradient(140deg,#d99a45,#bd7a2c);color:#fff;display:flex;align-items:center;justify-content:center;border:none;cursor:grab;box-shadow:0 6px 14px rgba(189,122,44,.35);touch-action:none;}
.ae-knob:active{cursor:grabbing;}
.ae-slider.done .ae-slider-text{color:#8a6a45;}
.ae-saved{background:#e8f3e6;color:#3f6b3a;border-radius:14px;padding:12px;text-align:center;font-size:13.5px;font-weight:600;margin-top:14px;}

.ae-modal{position:fixed;inset:0;background:rgba(50,36,22,.45);display:flex;align-items:flex-end;justify-content:center;z-index:50;}
.ae-sheet{background:#fffdfa;width:100%;max-width:420px;border-radius:22px 22px 0 0;padding:18px;max-height:80vh;overflow:auto;}
.ae-sheet h4{margin:0 0 12px;font-size:15px;font-weight:700;}
.ae-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
.ae-thumb{border:2px solid transparent;border-radius:14px;overflow:hidden;padding:0;background:none;cursor:pointer;position:relative;}
.ae-thumb.sel{border-color:#bd7a2c;}
.ae-thumb img{width:100%;height:94px;object-fit:cover;display:block;}
.ae-thumb span{position:absolute;left:8px;bottom:6px;color:#fff;font-size:12px;font-weight:600;text-shadow:0 1px 4px rgba(0,0,0,.6);}
.ae-custom-photo{width:100%;height:94px;background:#fdf4e8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:#b5793a;}
.ae-custom-photo-plus{font-size:26px;font-weight:500;line-height:1;}
.ae-custom-photo-label{position:static!important;color:#8a6a45!important;font-size:12px!important;font-weight:600!important;text-shadow:none!important;}

.ae-sheet-actions{display:flex;gap:10px;margin-top:14px;}
.ae-btn{flex:1;padding:12px;border-radius:12px;border:1px solid #ecdfcd;background:#fdf7ef;color:#8a6a45;font-weight:600;font-size:13.5px;cursor:pointer;}
.ae-btn.primary{background:#bd7a2c;border-color:#bd7a2c;color:#fff;}
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
};

const Chevron = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c2b1a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

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
      if (isEditMode) {
      await API.put(
  `/events/${editEvent.id}`,
  payload,
  getAuthConfig()
);
      } else {
        await API.post("/events/", payload, getAuthConfig());
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


  return (
    <div className="ae-wrap">
      <style>{styles}</style>
      <div className="ae-phone">
        <div className="ae-top">
          <button className="ae-icon-btn" aria-label="Go back" onClick={() => navigate(-1)}>
            <Icon d={I.back} />
          </button>
          <h1 className="ae-title">{isEditMode ? "Update Event" : "Add Event"}</h1>
          <button className="ae-icon-btn" aria-label="Open calendar">
            <Icon d={I.cal} />
          </button>
        </div>

        <div className="ae-card">
          <div className="ae-photo">
            <button
              className="ae-photo-box"
              onClick={() => { setDraftPhoto(photo); setPickerOpen(true); }}
            >
              {photo ? (
                <img src={photo.url} alt={`${photo.label} event cover`} />
              ) : (
                <>
                  <Icon d={I.photo} size={22} />
                  Add Photo
                </>
              )}
            </button>
            <div>
              <h3>Event Photo</h3>
              <p>Add a photo to make your event memorable.</p>
            </div>
          </div>
        </div>

        <div className="ae-card">
          <div className="ae-row">
            <span className="ae-badge"><Icon d={I.note} /></span>
            <span className="ae-label">Event Name</span>
            <input className="ae-input" style={{ marginLeft: "auto" }} placeholder="Enter event name" value={form.name} onChange={set("name")} />
          </div>
          <div className="ae-row">
            <span className="ae-badge"><Icon d={I.cal} /></span>
            <span className="ae-label">Date</span>
            <input type="date" className="ae-input" style={{ marginLeft: "auto", width: 130 }} value={form.date} onChange={set("date")} />
            <Chevron />
          </div>
          <div className="ae-row">
            <span className="ae-badge"><Icon d={I.clock} /></span>
            <span className="ae-label">Time</span>
            <input type="time" className="ae-input" style={{ marginLeft: "auto", width: 100 }} value={form.time} onChange={set("time")} />
            <Chevron />
          </div>
          <div className="ae-row">
            <span className="ae-badge"><Icon d={I.pin} /></span>
            <span className="ae-label">Location</span>
            <input className="ae-input" style={{ marginLeft: "auto" }} placeholder="Add location" value={form.location} onChange={set("location")} />
            <Chevron />
          </div>
          {/* Client Details */}
<div className="ae-row">
  <span className="ae-badge">
    <Icon d={I.users} />
  </span>

  <span className="ae-label">Client Name</span>

  {clientSelection === "__new__" ? (
    <input
      className="ae-input"
      style={{ marginLeft: "auto" }}
      placeholder="Enter client name"
      value={form.clientName}
      onChange={set("clientName")}
      autoFocus
    />
  ) : (
    <select
      className="ae-select ae-client-select"
      style={{ marginLeft: "auto" }}
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

  <Chevron />
</div>

<div className="ae-row">
  <span className="ae-badge">
    <Icon d={I.users} />
  </span>

  <span className="ae-label">Client Phone</span>

  <input
    type="tel"
    className="ae-input"
    style={{ marginLeft: "auto" }}
    placeholder="Enter phone"
    value={form.clientPhone}
    onChange={set("clientPhone")}
    readOnly={clientSelection !== "" && clientSelection !== "__new__"}
  />

  <Chevron />
</div>

<div className="ae-row">
  <span className="ae-badge">
    <Icon d={I.note} />
  </span>

  <span className="ae-label">Client Email</span>

  <input
    type="email"
    className="ae-input"
    style={{ marginLeft: "auto" }}
    placeholder="Enter email"
    value={form.clientEmail}
    onChange={set("clientEmail")}
    readOnly={clientSelection !== "" && clientSelection !== "__new__"}
  />

  <Chevron />
</div>
          <div className="ae-row">
            <span className="ae-badge"><Icon d={I.users} /></span>
            <span className="ae-label">Event Type</span>
            <select className="ae-select" style={{ marginLeft: "auto" }} value={form.type} onChange={set("type")}>
              <option value="">Select type</option>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <Chevron />
          </div>
        </div>

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
            <div className="ae-count">{form.description.length}/300</div>
          </div>
        </div>

        <div className="ae-card">
          <div className="ae-row">
            <span className="ae-badge"><Icon d={I.users} /></span>
            <span className="ae-label">Expected Guests</span>
            <div className="ae-step">
  <button
    onClick={() =>
  setGuests(String(Math.max(0, (Number(guests) || 0) - 1)))
}
  >
    −
  </button>

<input
  type="number"
  value={guests}
  onChange={(e) => setGuests(e.target.value)}
  style={{
    width: "55px",
    textAlign: "center",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "15px",
    fontWeight: "600",
  }}
/>

  <button
    onClick={() =>
  setGuests(String((Number(guests) || 0) + 1))
}
  >
    +
  </button>
</div>
          </div>
          <div className="ae-row">
            <span className="ae-badge"><Icon d={I.money} /></span>
            <span className="ae-label">Budget (Optional)</span>
            <input className="ae-input" style={{ marginLeft: "auto" }} placeholder="Enter amount" value={form.budget} onChange={set("budget")} />
          </div>
          <div className="ae-row">
  <span className="ae-badge"><Icon d={I.bell} /></span>
  <span className="ae-label">Reminder Date</span>

  <input
    type="date"
    className="ae-input"
    style={{ marginLeft: "auto", width: "130px" }}
    value={form.reminderDate}
    onChange={set("reminderDate")}
  />

  <Chevron />
</div>

<div className="ae-row">
  <span className="ae-badge"><Icon d={I.clock} /></span>
  <span className="ae-label">Reminder Time</span>

  <input
    type="time"
    className="ae-input"
    style={{ marginLeft: "auto", width: "100px" }}
    value={form.reminderTime}
    onChange={set("reminderTime")}
  />

  <Chevron />
</div>
        </div>

        <div className={`ae-slider${saved ? " done" : ""}`} ref={trackRef}>
          <div
            className="ae-slider-fill"
            style={{ width: `${dragX + 56}px`, transition: dragging ? "none" : "width .3s ease" }}
          />
          <div className="ae-slider-text">
            {saved ? "Saved!" : isEditMode ? "Slide to right to update" : "Slide to right to save"}
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
            <Icon d={I.arrow} size={20} />
          </button>
        </div>


        {saved && (
          <div className="ae-saved">
            {isEditMode ? "Event updated" : "Event saved"}
            {form.name ? `: ${form.name}` : ""}!
          </div>
        )}
      </div>

      {pickerOpen && (
        <div className="ae-modal" onClick={() => setPickerOpen(false)}>
          <div className="ae-sheet" onClick={(e) => e.stopPropagation()}>
            <h4>Choose an event photo</h4>
            <div className="ae-grid">
              <button
                type="button"
                className={`ae-thumb${draftPhoto?.id === "custom" ? " sel" : ""}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="ae-custom-photo">
                  <span className="ae-custom-photo-plus">＋</span>
                  <span className="ae-custom-photo-label">Choose your image</span>
                </div>
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
                >
                  <img src={p.url} alt={`${p.label} event photo option`} loading="lazy" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
            <div className="ae-sheet-actions">
              <button className="ae-btn" onClick={() => { setPhoto(null); setPickerOpen(false); }}>Remove</button>
              <button className="ae-btn primary" onClick={() => { setPhoto(draftPhoto); setPickerOpen(false); }}>Use photo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
