import BottomNav from "../components/BottomNav";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  getClients,
  addClient,
  deleteClient as deleteClientAPI,
} from "../api/clientService";
import { getEvents } from "../api/eventService";

const MALE_AVATARS = [
  "https://i.pinimg.com/originals/10/8d/3b/108d3b91d89ff52b4826e41bb3724f28.jpg",
  "https://dl-file.cyberlink.com/web/content/prompt_chatgpt_photo_linkedin_after_8cb0bbaae7.jpg",
  "https://chatsmith.io/_next/image?q=75&url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjms1jm9u%2Fproduction%2F212e9b69192299df6c999e36a62731a2b54172b0-1024x1024.png%3Fw%3D1200%26q%3D75%26fit%3Dmax%26auto%3Dformat&w=3840",
  "https://media.chambers.com/individuals/3377238/ea71b95c-93ae-45a9-b731-6443858b462d/profile.png",
  "https://es.pinterest.com/pin/30047522508796300/"
];
const FEMALE_AVATARS = [
  "https://images.wondershare.es/filmora/ai-prompt/retrato-empresaria-profesional.png",

  "https://imagedelivery.net/QTx11AyQzp6Ss70cNfwJyQ/blog/photo-linkedin/photo-linkedin-0/public",

  "https://pub-76a8e7f982bf4089b119723db9d1cebd.r2.dev/seo/migrated/EDjfdklfngbg7yZaX7oX2_j0DOAUl5.png",

  "https://i.pinimg.com/736x/78/13/48/781348c74b850cff84646b88939d2685.jpg",

  "https://www.familylawprotection.com/wp-content/uploads/2022/04/Screen-Shot-2020-01-13-at-4.44.45-PM.jpg",
];
const AVATARS = [...MALE_AVATARS, ...FEMALE_AVATARS];

const getProfessionalAvatar = (gender, id = 0) => {
  const list = gender === "female" ? FEMALE_AVATARS : MALE_AVATARS;
  return list[Math.abs(Number(id) || 0) % list.length];
};

const INITIAL_CLIENTS = [
  {
    id: 1,
    name: "Rahul Sharma",
    tag: "VIP",
    phone: "+91 83102 98600",
    email: "rahul.sharma@email.com",
    avatar: AVATARS[0],
    gender: "male",
    imageMode: "professional",
    nextEvent: "Rahul & Priya Wedding",
    nextDate: "2026-08-05T18:00:00",
    events: 8,
    spent: 425000,
    addedAt: "2026-08-01",
  },
  {
    id: 2,
    name: "Priya Mehta",
    tag: "New",
    phone: "+91 98765 43210",
    email: "priya.mehta@email.com",
    avatar: AVATARS[5],
    gender: "female",
    imageMode: "professional",
    nextEvent: "Birthday Party",
    nextDate: "2026-08-26T19:00:00",
    events: 2,
    spent: 85000,
    addedAt: "2026-08-02",
  },
  {
    id: 3,
    name: "Akash Verma",
    tag: null,
    phone: "+91 91234 56789",
    email: "akash.verma@email.com",
    avatar: AVATARS[1],
    gender: "male",
    imageMode: "professional",
    nextEvent: "Corporate Launch",
    nextDate: "2026-08-24T11:00:00",
    events: 5,
    spent: 210000,
    addedAt: "2026-07-12",
  },
  {
    id: 4,
    name: "Neha Patel",
    tag: null,
    phone: "+91 99887 76655",
    email: "neha.patel@email.com",
    avatar: AVATARS[6],
    gender: "female",
    imageMode: "professional",
    nextEvent: "Engagement Party",
    nextDate: "2026-09-02T18:00:00",
    events: 3,
    spent: 125000,
    addedAt: "2026-06-20",
  },
  {
    id: 5,
    name: "Vikram Rao",
    tag: null,
    phone: "+91 90909 90909",
    email: "vikram.rao@email.com",
    avatar: AVATARS[2],
    gender: "male",
    imageMode: "professional",
    nextEvent: null,
    nextDate: null,
    events: 1,
    spent: 45000,
    addedAt: "2026-05-08",
  },
  {
    id: 6,
    name: "Sanya Kapoor",
    tag: "VIP",
    phone: "+91 98111 22233",
    email: "sanya.kapoor@email.com",
    avatar: AVATARS[7],
    gender: "female",
    imageMode: "professional",
    nextEvent: "Anniversary Dinner",
    nextDate: "2026-08-18T20:00:00",
    events: 6,
    spent: 315000,
    addedAt: "2026-04-15",
  },
];

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

function formatEventDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  const time = d
    .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    .toUpperCase();
  if (sameDay(d, today)) return `Today • ${time}`;
  if (sameDay(d, tomorrow)) return `Tomorrow • ${time}`;
  return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} • ${time}`;
}

const isUpcoming = (iso) => !!iso && new Date(iso).getTime() >= Date.now();

function Icon({ name, className = "h-4 w-4" }) {
  const paths = {
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    userPlus:
      "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M20 8v6M23 11h-6",
    calendar:
      "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M16 2v4M8 2v4M3 10h18",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
    search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
    sort: "M3 6h18M6 12h12M10 18h4",
    phone:
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
    mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
    more: "M12 6h.01M12 12h.01M12 18h.01",
    x: "M18 6L6 18M6 6l12 12",
    trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z",
    pin: "M12 17v5M8 3h8M9 3v5l-3 4v2h12v-2l-3-4V3",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

function StatCard({ icon, value, label, tone }) {
  return (
    <div className="rounded-2xl bg-card p-3 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${tone}`}
      >
        <Icon name={icon} />
      </div>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
      <p className="whitespace-nowrap text-[9px] leading-tight text-muted-foreground">{label}</p>
    </div>
  );
}

function Badge({ tag }) {
  if (!tag) return null;
  const cls =
    tag === "VIP"
      ? "bg-amber-100 text-amber-700"
      : "bg-violet-100 text-violet-700";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}
    >
      {tag === "VIP" && <Icon name="star" className="h-3 w-3" />}
      {tag}
    </span>
  );
}

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  tag: "",
  nextEvent: "",
  nextDate: "",
  events: 0,
  spent: 0,
  gender: "male",
  imageMode: "professional",
  avatar: "",
};

function ClientForm({ initial, onCancel, onSave }) {
  const startingForm = initial ?? EMPTY;
  const [form, setForm] = useState({
    ...EMPTY,
    ...startingForm,
    gender: startingForm.gender || "male",
    imageMode: startingForm.imageMode || "professional",
  });

  const set = (k) => (e) =>
    setForm((current) => ({ ...current, [k]: e.target.value }));

  const chooseProfessionalImage = (gender, index = 0) => {
    const list = gender === "female" ? FEMALE_AVATARS : MALE_AVATARS;

    setForm((current) => ({
      ...current,
      gender,
      imageMode: "professional",
      avatar: list[index % list.length],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxSize = 600;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");

        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.82);

        setForm((current) => ({
          ...current,
          imageMode: "custom",
          avatar: compressedImage,
        }));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const professionalOptions =
    form.gender === "female" ? FEMALE_AVATARS : MALE_AVATARS;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        onSave(form);
      }}
      className="space-y-3"
    >
      {/* Profile image */}
      <div className="rounded-2xl bg-gray-50 p-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={
                form.avatar ||
                getProfessionalAvatar(form.gender, form.id)
              }
              alt="Client preview"
              className="h-28 w-24 rounded-xl object-cover object-center shadow-md ring-4 ring-white"
            />

            <label
              htmlFor="client-image"
              className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
              title="Choose your own image"
            >
              <Icon name="edit" className="h-3.5 w-3.5" />
            </label>

            <input
              id="client-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <p className="mt-2 text-xs font-medium text-gray-700">
            LinkedIn-style Professional Photo
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Face centered • suit/blazer • clean background
          </p>
        </div>

        {/* Gender */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-muted-foreground">
            Gender
          </label>

          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => chooseProfessionalImage("male", 0)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                form.gender === "male"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-input bg-white text-muted-foreground"
              }`}
            >
              Male
            </button>

            <button
              type="button"
              onClick={() => chooseProfessionalImage("female", 0)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                form.gender === "female"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-input bg-white text-muted-foreground"
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* Professional image choices */}
        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground">
            Professional image
          </p>

          <div className="mt-2 grid grid-cols-5 gap-2">
            {professionalOptions.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => chooseProfessionalImage(form.gender, index)}
                className={`overflow-hidden rounded-lg p-0.5 transition ${
                  form.imageMode === "professional" &&
                  form.avatar === image
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
                title={`Professional ${form.gender} photo ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`Professional ${form.gender} option ${index + 1}`}
                  className="h-14 w-11 rounded-md object-cover object-center"
                />
              </button>
            ))}

            <label
              htmlFor="client-image"
              className={`flex h-14 w-11 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-white text-gray-500 ${
                form.imageMode === "custom"
                  ? "ring-2 ring-primary ring-offset-2"
                  : ""
              }`}
              title="Upload your own image"
            >
              <Icon name="edit" className="h-4 w-4" />
            </label>
          </div>
        </div>
      </div>

      {[
        ["Full name", "name", "text", "Rahul Sharma"],
        ["Phone", "phone", "text", "+91 90000 00000"],
        ["Email", "email", "email", "name@email.com"],
        ["Next event", "nextEvent", "text", "Wedding"],
      ].map(([label, key, type, ph]) => (
        <label
          key={key}
          className="block text-xs font-medium text-muted-foreground"
        >
          {label}
          <input
            type={type}
            value={form[key] ?? ""}
            onChange={set(key)}
            placeholder={ph}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
          />
        </label>
      ))}

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-medium text-muted-foreground">
          Next event date
          <input
            type="datetime-local"
            value={form.nextDate ?? ""}
            onChange={set("nextDate")}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
          />
        </label>

        <label className="block text-xs font-medium text-muted-foreground">
          Tag
          <select
            value={form.tag ?? ""}
            onChange={set("tag")}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
          >
            <option value="">None</option>
            <option value="VIP">VIP</option>
            <option value="New">New</option>
          </select>
        </label>

        <label className="block text-xs font-medium text-muted-foreground">
          Total events
          <input
            type="number"
            min="0"
            value={form.events}
            onChange={set("events")}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
          />
        </label>

        <label className="block text-xs font-medium text-muted-foreground">
          Total spent (₹)
          <input
            type="number"
            min="0"
            value={form.spent}
            onChange={set("spent")}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
          />
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-input bg-background py-2.5 text-sm font-medium text-foreground"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Save client
        </button>
      </div>
    </form>
  );
}

function Sheet({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
       className="w-full max-w-[420px] bg-white rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <Icon name="x" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default function Clients() {
  const [clients, setClients] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
useEffect(() => {
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");

      const [clientsResponse, eventsResponse] = await Promise.all([
        getClients(),
        getEvents(),
      ]);

      const backendClients = clientsResponse.data || [];
      const events = eventsResponse.data || [];

      console.log("Logged-in user's clients:", backendClients);
      console.log("Logged-in user's events:", events);

      const mappedClients = backendClients.map((client) => {
        const clientEvents = events.filter(
          (event) => event.client_id === client.id
        );

        const upcomingEvents = clientEvents
          .filter((event) => {
            if (!event.event_date || !event.event_time) {
              return false;
            }

            const dateTime = new Date(
              `${event.event_date}T${event.event_time}`
            );

            return dateTime >= new Date();
          })
          .sort((a, b) => {
            const dateA = new Date(
              `${a.event_date}T${a.event_time}`
            );

            const dateB = new Date(
              `${b.event_date}T${b.event_time}`
            );

            return dateA - dateB;
          });

        const nextEvent = upcomingEvents[0];

        const totalSpent = clientEvents.reduce(
          (total, event) => total + Number(event.budget || 0),
          0
        );

        let savedAvatar = null;
        let savedGender = null;
        let savedImageMode = null;

        try {
          savedAvatar = localStorage.getItem(`client_avatar_${client.id}`);
          savedGender = localStorage.getItem(`client_gender_${client.id}`);
          savedImageMode = localStorage.getItem(`client_image_mode_${client.id}`);
        } catch {
          savedAvatar = null;
          savedGender = null;
          savedImageMode = null;
        }

        const gender = savedGender || client.gender || "male";

        return {
          ...client,

          avatar:
            savedAvatar ||
            client.avatar ||
            getProfessionalAvatar(gender, client.id),

          gender,
          imageMode: savedImageMode || "professional",

          tag: null,

          events: clientEvents.length,

          spent: totalSpent,

          nextEvent: nextEvent?.event_name || null,

          nextDate: nextEvent
            ? `${nextEvent.event_date}T${nextEvent.event_time}`
            : null,

          addedAt: client.created_at
            ? client.created_at.slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        };
      });

      setClients(mappedClients);
    } catch (error) {
      console.error(
        "Failed to load clients:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.detail ||
          "Unable to load clients"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchClients();
}, []);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const menuRef = useRef(null);
  useEffect(() => {
  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuId(null);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);
  const [pinnedClients, setPinnedClients] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pinned_clients") || "[]");
    } catch {
      return [];
    }
  });
  const [editing, setEditing] = useState(null); // client | "new" | null
  const [detail, setDetail] = useState(null);

  const stats = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7);
    return {
      total: clients.length,
      newThisMonth: clients.filter((c) => (c.addedAt ?? "").startsWith(month)).length,
      activeEvents: clients.reduce(
        (n, c) => n + (isUpcoming(c.nextDate) ? 1 : 0),
        0,
      ),
      repeat: clients.filter((c) => Number(c.events) > 1).length,
    };
  }, [clients]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = clients.filter((c) =>
      !q
        ? true
        : [c.name, c.phone, c.email].some((v) => (v ?? "").toLowerCase().includes(q)),
    );
    const sorters = {
      default: (a, b) => {
        const aPinned = pinnedClients.includes(a.id) ? 1 : 0;
        const bPinned = pinnedClients.includes(b.id) ? 1 : 0;

        if (aPinned !== bPinned) {
          return bPinned - aPinned;
        }

        return (b.addedAt ?? "").localeCompare(a.addedAt ?? "");
      },
      name: (a, b) => {
        const aPinned = pinnedClients.includes(a.id) ? 1 : 0;
        const bPinned = pinnedClients.includes(b.id) ? 1 : 0;

        if (aPinned !== bPinned) {
          return bPinned - aPinned;
        }

        return a.name.localeCompare(b.name);
      },
      events: (a, b) => {
        const aPinned = pinnedClients.includes(a.id) ? 1 : 0;
        const bPinned = pinnedClients.includes(b.id) ? 1 : 0;

        if (aPinned !== bPinned) {
          return bPinned - aPinned;
        }

        return b.events - a.events;
      },
      spent: (a, b) => {
        const aPinned = pinnedClients.includes(a.id) ? 1 : 0;
        const bPinned = pinnedClients.includes(b.id) ? 1 : 0;

        if (aPinned !== bPinned) {
          return bPinned - aPinned;
        }

        return b.spent - a.spent;
      },
      recent: (a, b) => {
        const aPinned = pinnedClients.includes(a.id) ? 1 : 0;
        const bPinned = pinnedClients.includes(b.id) ? 1 : 0;

        if (aPinned !== bPinned) {
          return bPinned - aPinned;
        }

        return (b.addedAt ?? "").localeCompare(a.addedAt ?? "");
      },
    };

    return [...list].sort(sorters[sort] || sorters.default);
  }, [clients, query, sort]);

  const saveClient = async (form) => {
  try {
    const payload = {
      name: form.name?.trim() || "",
      phone: form.phone?.trim() || "",
      email: form.email?.trim() || "",
      address: form.address?.trim() || null,
      notes: form.notes?.trim() || null,
    };

    // =========================
    // EDIT EXISTING CLIENT
    // =========================
    if (form.id) {
      const updatedClient = {
        ...form,
        events: Number(form.events) || 0,
        spent: Number(form.spent) || 0,
        tag: form.tag || null,
        gender: form.gender || "male",
        imageMode: form.imageMode || "professional",
        avatar:
          form.avatar ||
          getProfessionalAvatar(form.gender || "male", form.id),
      };

      try {
        localStorage.setItem(
          `client_avatar_${form.id}`,
          updatedClient.avatar
        );

        localStorage.setItem(
          `client_gender_${form.id}`,
          updatedClient.gender
        );

        localStorage.setItem(
          `client_image_mode_${form.id}`,
          updatedClient.imageMode
        );
      } catch (error) {
        console.error("Failed to save client profile image:", error);
      }

      setClients((currentClients) =>
        currentClients.map((client) =>
          client.id === form.id ? updatedClient : client
        )
      );

      setEditing(null);
      return;
    }

    // =========================
    // ADD NEW CLIENT
    // =========================

    // Save client permanently in backend / PostgreSQL
    const response = await addClient(payload);

    const savedClient = response.data;

    // IMPORTANT:
    // Use the ID generated by PostgreSQL/backend
    const newClientId = savedClient.id;

    const newAvatar =
      form.avatar ||
      getProfessionalAvatar(form.gender || "male", newClientId);

    const newClient = {
      ...savedClient,

      id: newClientId,

      gender: form.gender || "male",
      imageMode: form.imageMode || "professional",
      avatar: newAvatar,

      tag: form.tag || null,

      events: 0,
      spent: 0,

      nextEvent: null,
      nextDate: null,

      addedAt: savedClient.created_at
        ? savedClient.created_at.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    };

    // Save profile image locally
    try {
      localStorage.setItem(
        `client_avatar_${newClientId}`,
        newAvatar
      );

      localStorage.setItem(
        `client_gender_${newClientId}`,
        newClient.gender
      );

      localStorage.setItem(
        `client_image_mode_${newClientId}`,
        newClient.imageMode
      );
    } catch (error) {
      console.error("Failed to save client profile image:", error);
    }

    // Show the newly created client immediately
    setClients((currentClients) => [
      newClient,
      ...currentClients,
    ]);

    setEditing(null);

  } catch (error) {
    console.error(
      "Failed to save client:",
      error.response?.data || error
    );

    alert(
      error.response?.data?.detail ||
        "Failed to save client. Please try again."
    );
  }
};

  const togglePinClient = (clientId) => {
    setPinnedClients((current) => {
      const next = current.includes(clientId)
        ? current.filter((id) => id !== clientId)
        : [clientId, ...current];

      localStorage.setItem("pinned_clients", JSON.stringify(next));
      return next;
    });

    setMenuId(null);
  };

  const deleteClient = async (clientId) => {
  

  const confirmed = window.confirm(
    "Delete this client and all their events?"
  );

  if (!confirmed) return;

  try {
    await deleteClientAPI(clientId);

    setClients((currentClients) =>
      currentClients.filter((client) => client.id !== clientId)
    );

    try {
      localStorage.removeItem(`client_avatar_${clientId}`);
      localStorage.removeItem(`client_gender_${clientId}`);
      localStorage.removeItem(`client_image_mode_${clientId}`);
    } catch (error) {
      console.error("Failed to remove client profile image:", error);
    }

    setMenuId(null);

    if (detail?.id === clientId) {
      setDetail(null);
    }

  } catch (error) {
    console.error("Failed to delete client:", error);

    alert(
      error.response?.data?.detail ||
      "Failed to delete client."
    );
  }
};

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-muted/40 pb-16"
      
    >
      <div className="mx-auto w-full max-w-md px-4 pt-6">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Clients</h1>
            <p className="text-xs text-muted-foreground">
              Manage and build strong relationships.
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing("new");
            }}
            aria-label="Add client"
            className="rounded-full bg-white p-2.5 text-foreground shadow-sm"
          >
            <Icon name="userPlus" />
          </button>
        </header>

        <div className="mt-5 grid grid-cols-4 gap-2.5">
          <StatCard
            icon="users"
            value={stats.total}
            label="Total Clients"
            tone="bg-amber-100 text-amber-700"
          />
          <StatCard
            icon="userPlus"
            value={stats.newThisMonth}
            label="New This Month"
            tone="bg-violet-100 text-violet-700"
          />
          <StatCard
            icon="calendar"
            value={stats.activeEvents}
            label="Active Events"
            tone="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon="star"
            value={stats.repeat}
            label="Repeat Clients"
            tone="bg-orange-100 text-orange-700"
          />
        </div>

        <div className="relative mt-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-card px-3.5 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <Icon name="search" className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients by name, phone or email..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSortOpen((v) => !v);
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3.5 py-2.5 text-sm text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <Icon name="sort" />
            Sort
          </button>
          {sortOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-12 z-20 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
            >
              {[
                ["default", "Default"],
                ["name", "Name (A–Z)"],
                ["events", "Most events"],
                ["spent", "Highest spend"],
                ["recent", "Recently added"],
              ].map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => {
                    setSort(k);
                    setSortOpen(false);
                  }}
                  className={`block w-full px-3.5 py-2.5 text-left text-sm hover:bg-gray-100 ${
                    sort === k ? "font-semibold text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
  <div className="rounded-2xl bg-card py-10 text-center text-sm text-muted-foreground">
    Loading clients...
  </div>
)}

{error && !loading && (
  <div className="rounded-2xl bg-card py-10 text-center text-sm text-red-500">
    {error}
  </div>
)}

<div className="mt-4 space-y-3">
          {visible.map((c) => (
          <article
  key={c.id}
  onClick={() => setDetail(c)}
 className="relative cursor-pointer overflow-visible rounded-2xl bg-card shadow-[0_1px_4px_rgba(0,0,0,0.07)]"
>
  {/* Client top section */}
  <div className="px-3.5 py-3">
    <div className="flex items-start gap-2.5">
      {/* Avatar */}
      <img
        src={c.avatar}
        alt={c.name}
        loading="lazy"
        className="h-11 w-11 shrink-0 rounded-full object-cover object-center"
      />

      {/* Client details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {c.name}
          </h3>

          {pinnedClients.includes(c.id) && (
            <span
              className="shrink-0 text-[10px] text-amber-500"
              title="Pinned client"
              aria-label="Pinned client"
            >
              📌
            </span>
          )}
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Icon name="phone" className="h-3 w-3 shrink-0" />
          <span className="truncate">{c.phone}</span>
        </p>

        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Icon name="mail" className="h-3 w-3 shrink-0" />
          <span className="truncate">{c.email || "No email"}</span>
        </p>
      </div>

      {/* Statistics */}
      <div className="flex shrink-0 items-center gap-4 pt-1 text-right">
        <div>
          <p className="text-[9px] text-muted-foreground">
            Total Events
          </p>
          <p className="text-sm font-semibold text-foreground">
            {c.events || 0}
          </p>
        </div>

        <div className="h-7 w-px bg-gray-100" />

        <div>
          <p className="text-[9px] text-muted-foreground">
            Total Spent
          </p>
          <p className="text-sm font-semibold text-foreground">
            {inr(c.spent)}
          </p>
        </div>

        {/* Three dots */}
        <button
          aria-label="Client actions"
          onClick={(e) => {
            e.stopPropagation();
            setMenuId(menuId === c.id ? null : c.id);
          }}
          className="ml-0.5 text-muted-foreground"
        >
          <Icon name="more" className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>

  {/* Event section */}
  <div className="border-t border-gray-100 bg-background/50 px-3.5 py-2.5">
    <div className="flex items-center justify-between gap-2">
      
      {/* Event information */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
          <Icon name="calendar" className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-medium text-orange-500">
            Upcoming Event
          </p>

          {c.nextEvent ? (
            <>
              <p className="truncate text-[10px] font-semibold text-foreground">
                {c.nextEvent}
              </p>

              <p className="text-[9px] text-muted-foreground">
                {formatEventDate(c.nextDate)}
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] font-semibold text-foreground">
                No Upcoming Events
              </p>

              <p className="text-[9px] text-muted-foreground">
                Add an event to get started
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action button */}
      {c.nextEvent ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDetail(c);
          }}
          className="shrink-0 rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-[9px] font-medium text-orange-500"
        >
          View Event
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = "/add-event";
          }}
          className="shrink-0 rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-[9px] font-medium text-orange-500"
        >
          Add Event
        </button>
      )}
    </div>
  </div>
{/* Three-dot menu */}
{menuId === c.id && (
  <div
  ref={menuRef}
  onClick={(e) => e.stopPropagation()}
  className="absolute right-3 top-10 z-50 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
>
    {/* Pin / Unpin — always at the top */}
    <button
      onClick={() => togglePinClient(c.id)}
      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-gray-900 hover:bg-amber-50"
    >
      <Icon name="pin" className="h-4 w-4 text-amber-500" />
      {pinnedClients.includes(c.id) ? "Unpin" : "Pin"}
    </button>

    {/* Edit */}
    <button
      onClick={() => {
        setEditing(c);
        setMenuId(null);
      }}
      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-50"
    >
      <Icon name="edit" className="h-4 w-4" />
      Edit
    </button>

    {/* Call */}
    <a
      href={`tel:${c.phone}`}
      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-50"
    >
      <Icon name="phone" className="h-4 w-4" />
      Call
    </a>

    {/* Email */}
    <a
      href={`mailto:${c.email}`}
      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-50"
    >
      <Icon name="mail" className="h-4 w-4" />
      Email
    </a>

    {/* Add Event */}
    <button
      onClick={() => {
        setMenuId(null);
        window.location.href = "/add-event";
      }}
      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-50"
    >
      <Icon name="calendar" className="h-4 w-4" />
      Add Event
    </button>

    {/* Delete Client */}
    <button
      onClick={() => deleteClient(c.id)}
      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
    >
      <Icon name="trash" className="h-4 w-4" />
      Delete Client
    </button>
  </div>
)}

</article>
          ))}

          {visible.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border bg-card py-10 text-center text-sm text-muted-foreground">
              No clients match “{query}”.
            </p>
          )}
        </div>
      </div>

      {editing && (
        <Sheet
          title={editing === "new" ? "Add client" : "Edit client"}
          onClose={() => setEditing(null)}
        >
          <ClientForm
            initial={
              editing === "new"
                ? EMPTY
                : { ...editing, nextDate: editing.nextDate?.slice(0, 16) ?? "" }
            }
            onCancel={() => setEditing(null)}
            onSave={saveClient}
          />
        </Sheet>
      )}

      {detail && (
        <Sheet title={detail.name} onClose={() => setDetail(null)}>
          <div className="flex items-center gap-3">
            <img
              src={
                detail.avatar ||
                getProfessionalAvatar(detail.gender || "male", detail.id)
              }
              alt={detail.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <Badge tag={detail.tag} />
              <p className="mt-1 text-sm text-muted-foreground">{detail.phone}</p>
              <p className="text-sm text-muted-foreground">{detail.email}</p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-muted p-3">
              <dt className="text-xs text-muted-foreground">Total events</dt>
              <dd className="font-semibold text-foreground">{detail.events}</dd>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <dt className="text-xs text-muted-foreground">Total spent</dt>
              <dd className="font-semibold text-foreground">{inr(detail.spent)}</dd>
            </div>
            <div className="col-span-2 rounded-xl bg-muted p-3">
              <dt className="text-xs text-muted-foreground">Next event</dt>
              <dd className="font-semibold text-foreground">
                {detail.nextEvent
                  ? `${detail.nextEvent} — ${formatEventDate(detail.nextDate)}`
                  : "No upcoming event"}
              </dd>
            </div>
          </dl>
        </Sheet>
        
      )}
      <BottomNav active="clients" theme="purple" />
    </div>
  );
}
