import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import {
  Bell,
  CalendarPlus,
  UserPlus,
  Calendar,
  Users,
  UsersRound,
  CreditCard,
  SquareCheck,
  Palette,
  Globe,
  Cloud,
  HelpCircle,
  Mail,
  Info,
  ChevronRight,
  X,
  Camera,
  ArrowLeft,
  LogOut,
  Trash2,
  TriangleAlert,
  CheckCircle2,
  Lock,
  Sparkles,
  Phone,
  ShieldCheck,
  Upload,
  Check,
  Sun,
  Moon,
  Smartphone,
  Pencil,
} from "lucide-react";

/* ============================================================
   Design tokens — Editorial Warm Paper Theme
   Cream canvas · Espresso typography · Golden Amber accents
   ============================================================ */
const BG = "#faf7f2";
const CARD = "#FFFDF9";

/* Self-contained motion & micro-interactions */
const GLOBAL_CSS = `
@keyframes moFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes moRise { from { opacity: 0; transform: translateY(24px) scale(0.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes moToast { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
@keyframes moPulseRing { 0% { transform: scale(0.96); opacity: 0.8; } 50% { transform: scale(1.04); opacity: 0.3; } 100% { transform: scale(0.96); opacity: 0.8; } }

.mo-fade { animation: moFade .18s cubic-bezier(.22,1,.36,1) both; }
.mo-rise { animation: moRise .28s cubic-bezier(.22,1,.36,1) both; }
.mo-toast-in { animation: moToast .24s cubic-bezier(.22,1,.36,1) both; }

/* Custom smooth scrollbar for sheets */
.mo-scroll::-webkit-scrollbar { width: 4px; }
.mo-scroll::-webkit-scrollbar-track { background: transparent; }
.mo-scroll::-webkit-scrollbar-thumb { background: #E5DACB; border-radius: 9999px; }

@media (prefers-reduced-motion: reduce) {
  .mo-fade, .mo-rise, .mo-toast-in { animation: none !important; }
}
`;

/* ============================================================
   CURATED PROFESSIONAL AVATAR COLLECTION (Male & Female)
   High-resolution studio portraits for event managers & planners
   ============================================================ */

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80";

const MALE_AVATARS = [
  {
    id: "m1",
    label: "Ethan",
    role: "Creative Director",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "m2",
    label: "Marcus",
    role: "Lead Coordinator",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "m3",
    label: "Julian",
    role: "Production Lead",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "m4",
    label: "David",
    role: "Executive Producer",
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "m5",
    label: "Arjun",
    role: "Operations Head",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "m6",
    label: "Lucas",
    role: "Client Relations",
    url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
  },
];

const FEMALE_AVATARS = [
  {
    id: "f1",
    label: "Elena",
    role: "Event Director",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "f2",
    label: "Sophia",
    role: "Creative Planner",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "f3",
    label: "Ananya",
    role: "Managing Partner",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "f4",
    label: "Chloe",
    role: "Brand Specialist",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "f5",
    label: "Maya",
    role: "Hospitality Lead",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "f6",
    label: "Isabella",
    role: "Experience Designer",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  },
];

// Helper: Convert uploaded photo into compressed JPEG data URL for local and PostgreSQL storage
function fileToCompressedDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Please select a valid image file."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected image."));

    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Could not process the selected image."));

      image.onload = () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");

        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Image processing is not supported on this device."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

const MANAGEMENT = [
  { id: "clients", label: "Clients", icon: Users, path: "/clients" },
  { id: "events", label: "Events", icon: Calendar, path: "/calendar" },
  { id: "payments", label: "Payments", icon: CreditCard, path: "/payments" },
  { id: "tasks", label: "Tasks", icon: SquareCheck, path: "/tasks" },
  { id: "team", label: "Team", icon: UsersRound, path: "/team" },
];

const THEMES = [
  { id: "System", label: "System Default", icon: Smartphone },
  { id: "Light", label: "Warm Editorial Light", icon: Sun },
  { id: "Dark", label: "Espresso Night", icon: Moon },
];

const LANGUAGES = [
  { code: "en", name: "English", sub: "Standard (US/UK)" },
  { code: "hi", name: "हिन्दी", sub: "Hindi" },
  { code: "es", name: "Español", sub: "Spanish" },
  { code: "fr", name: "Français", sub: "French" },
  { code: "de", name: "Deutsch", sub: "German" },
];

/* ============================================================
   SHARED ATOMS & MOLECULES (Aesthetic Editorial Styling)
   ============================================================ */

function Switch({ on, onToggle, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B5793A]/30 ${
        on ? "bg-[#B5793A]" : "bg-[#E6DCCF]"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
          on ? "translate-x-5 shadow-md" : ""
        }`}
      />
    </button>
  );
}

function Row({ icon: Icon, label, right, badge, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-all hover:bg-[#F8F1E7]/70 active:bg-[#F2E8DC]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F6EFE5] text-[#B5793A] transition-transform duration-200 group-hover:scale-105">
        <Icon size={17} />
      </span>
      <span className="text-[13.5px] font-medium tracking-tight text-[#3B2F22]">{label}</span>
      <span className="ml-auto flex shrink-0 items-center gap-2 text-xs text-[#8A7966]">
        {badge}
        {right && <span className="text-xs font-medium text-[#8A7966]">{right}</span>}
        <ChevronRight size={15} className="text-[#CFC2B2] transition-transform duration-150 group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

const Pill = ({ children, variant = "amber" }) => {
  const styles = {
    amber: "bg-[#FDF4E7] text-[#A2672B] border-[#F2DEBF]",
    slate: "bg-[#F3EFE9] text-[#695847] border-[#E5DACB]",
    green: "bg-[#EEF7EE] text-[#2F6B38] border-[#D1EBD1]",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wide ${
        styles[variant] || styles.amber
      }`}
    >
      {children}
    </span>
  );
};

function Modal({ open, onClose, children }) {
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
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="mo-fade absolute inset-0 bg-[#241A12]/45 backdrop-blur-[3px]"
      />
      {/* Sheet Container */}
      <div className="mo-rise relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-[32px] border border-[#EEE5D8] bg-[#FFFDF9] shadow-[0_20px_50px_rgba(40,28,18,0.25)] sm:rounded-[32px]">
        {/* Mobile handle */}
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-[#E5DACB] sm:hidden" />
        {children}
      </div>
    </div>
  );
}

function SheetHeader({ title, subtitle, onClose, icon: Icon }) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#F4EDE2] px-5 pb-3.5 pt-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F6EFE5] text-[#B5793A] shadow-sm">
            <Icon size={19} />
          </span>
        )}
        <div>
          <h4 className="text-[16px] font-bold tracking-tight text-[#3B2F22]">{title}</h4>
          {subtitle && <p className="mt-0.5 text-xs leading-relaxed text-[#8A7966]">{subtitle}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E8DDCE] text-[#8A7966] transition-colors hover:bg-[#F6EFE5] active:scale-95"
      >
        <X size={15} />
      </button>
    </div>
  );
}

const PrimaryBtn = ({ children, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full rounded-xl bg-[#3B2F22] px-4 py-3 text-[13.5px] font-semibold text-[#FAF7F2] shadow-[0_4px_14px_rgba(59,47,34,0.18)] transition-all hover:bg-[#4E3F30] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
  >
    {children}
  </button>
);

const AmberBtn = ({ children, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full rounded-xl bg-gradient-to-r from-[#B5793A] to-[#A0642B] px-4 py-3 text-[13.5px] font-semibold text-white shadow-[0_4px_16px_rgba(181,121,58,0.28)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
  >
    {children}
  </button>
);

const GhostBtn = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-xl border border-[#EEE5D8] bg-white px-4 py-3 text-[13.5px] font-semibold text-[#7C6C5A] transition-colors hover:bg-[#F8F1E7] active:scale-[0.98]"
  >
    {children}
  </button>
);

const DangerBtn = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-xl bg-[#C0503C] px-4 py-3 text-[13.5px] font-semibold text-white shadow-[0_4px_14px_rgba(192,80,60,0.22)] transition-all hover:bg-[#AD4331] active:scale-[0.98]"
  >
    {children}
  </button>
);

function OptionButton({ selected, children, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-[13.5px] transition-all ${
        selected
          ? "border-[#E1BC8C] bg-[#FDF6ED] font-semibold text-[#8C521A] shadow-sm"
          : "border-[#EEE5D8] bg-white text-[#4D3E2F] hover:bg-[#F9F3EA]"
      }`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${selected ? "bg-[#F3E2CB] text-[#8C521A]" : "bg-[#F7F0E6] text-[#9E8B75]"}`}>
            <Icon size={16} />
          </span>
        )}
        <div>{children}</div>
      </div>
      {selected ? (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B5793A] text-white">
          <Check size={12} strokeWidth={2.5} />
        </span>
      ) : (
        <span className="h-4 w-4 rounded-full border border-[#D8CABE]" />
      )}
    </button>
  );
}

const SectionTitle = ({ children }) => (
  <div className="mb-2.5 ml-1 mt-7 flex items-center gap-2">
    <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A69480]">
      {children}
    </h2>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EAE0D3] to-transparent" />
  </div>
);

/* ============================================================
   MAIN COMPONENT: MORE.JSX
   ============================================================ */

export default function More() {
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(null);
  const [toast, setToast] = useState("");
  const [theme, setTheme] = useState("System");
  const [language, setLanguage] = useState("English");
  const [notifs, setNotifs] = useState({ push: true, email: false, reminders: true });
  const [backup, setBackup] = useState(true);
  // Account-specific management counts
const [managementCounts, setManagementCounts] = useState({
  clients: null,
  events: null,
});
  // Avatar Picker Tab inside Edit Profile Modal: "all" | "male" | "female"
  const [avatarTab, setAvatarTab] = useState("all");

  const savedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [profile, setProfile] = useState({
    name: savedUser?.full_name || savedUser?.name || "Sathvik M S",
    role: "Event Manager & Producer",
    email: savedUser?.email || "manager@eventflow.studio",
    phone: savedUser?.phone || "+91 98765 43210",
    avatar: savedUser?.profile_image || savedUser?.avatar || DEFAULT_AVATAR,
  });

  const [draft, setDraft] = useState(profile);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || DEFAULT_AVATAR);
  const [support, setSupport] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Use the same authenticated endpoints as Dashboard.jsx.
  // Dashboard counts events from /events/ and clients from /clients/.
  useEffect(() => {
    let cancelled = false;

    const fetchManagementCounts = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        if (!cancelled) setManagementCounts({ clients: null, events: null });
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Keep the two requests independent, just like Dashboard.jsx.
      try {
        const eventResponse = await fetch(
          "https://event-manager-pls6.onrender.com/events/",
          { method: "GET", headers }
        );

        if (!eventResponse.ok) {
          throw new Error(`Events request failed (${eventResponse.status})`);
        }

        const eventData = await eventResponse.json();
        if (!cancelled) {
          setManagementCounts((current) => ({
            ...current,
            events: Array.isArray(eventData) ? eventData.length : 0,
          }));
        }
      } catch (error) {
        console.error("Could not load account event count:", error);
        if (!cancelled) {
          setManagementCounts((current) => ({ ...current, events: null }));
        }
      }

      try {
        const clientResponse = await fetch(
          "https://event-manager-pls6.onrender.com/clients/",
          { method: "GET", headers }
        );

        if (!clientResponse.ok) {
          throw new Error(`Clients request failed (${clientResponse.status})`);
        }

        const clientData = await clientResponse.json();
        if (!cancelled) {
          setManagementCounts((current) => ({
            ...current,
            clients: Array.isArray(clientData) ? clientData.length : 0,
          }));
        }
      } catch (error) {
        console.error("Could not load account client count:", error);
        if (!cancelled) {
          setManagementCounts((current) => ({ ...current, clients: null }));
        }
      }
    };

    fetchManagementCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  const close = () => setSheet(null);
  const notify = (m) => {
    setToast(m);
    close();
  };

  const openProfile = () => {
    setDraft(profile);
    setSelectedAvatar(profile.avatar || DEFAULT_AVATAR);
    setAvatarTab("all");
    setSheet("profile");
  };

  /* ---------------------------------------------------------
     BACKEND: DELETE ACCOUNT
  --------------------------------------------------------- */
  const handleDeleteAccount = async () => {
    try {
      const activeUser = JSON.parse(localStorage.getItem("user") || "null");

      if (!activeUser?.email) {
        setToast("User information not found");
        return;
      }

      const response = await fetch(
        `https://event-manager-pls6.onrender.com/auth/delete-account?email=${encodeURIComponent(
          activeUser.email
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete account");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      setSheet(null);
      navigate("/login");
    } catch (error) {
      console.error("Delete account error:", error);
      setToast(error.message || "Failed to delete account");
    }
  };

  /* ---------------------------------------------------------
     CUSTOM AVATAR UPLOAD (Compressed Canvas JPEG)
  --------------------------------------------------------- */
  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await fileToCompressedDataUrl(file);
      setSelectedAvatar(imageData);
      setDraft((current) => ({
        ...current,
        avatar: imageData,
      }));
      setToast("Custom photo loaded! Tap Save Changes.");
    } catch (error) {
      console.error("Profile image processing error:", error);
      setToast(error.message || "Could not process profile image");
    } finally {
      event.target.value = "";
    }
  };

  /* ---------------------------------------------------------
     BACKEND: SAVE PROFILE CHANGES
  --------------------------------------------------------- */
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        // Fallback for offline or local session demo
        const updatedLocal = {
          ...(savedUser || {}),
          full_name: draft.name,
          phone: draft.phone || "",
          profile_image: selectedAvatar,
          avatar: selectedAvatar,
        };
        localStorage.setItem("user", JSON.stringify(updatedLocal));

        setProfile({
          ...draft,
          avatar: selectedAvatar,
        });

        window.dispatchEvent(new Event("profileUpdated"));
        setToast("Profile saved locally");
        setSheet(null);
        return;
      }

      const response = await fetch(
        "https://event-manager-pls6.onrender.com/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: draft.name,
            phone: draft.phone || "",
            profile_image: selectedAvatar,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update profile");
      }

      // Save updated user returned by backend
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
          profile_image: data.user.profile_image,
          avatar: data.user.profile_image || selectedAvatar,
        })
      );

      // Update state immediately
      setProfile({
        ...draft,
        name: data.user.full_name || draft.name,
        phone: data.user.phone || draft.phone || "",
        avatar: data.user.profile_image || selectedAvatar,
      });

      // Broadcast event so Dashboard, Clients, and Navbars reflect the new avatar
      window.dispatchEvent(new Event("profileUpdated"));

      setToast("Profile updated successfully");
      setSheet(null);
    } catch (error) {
      console.error("Profile update error:", error);
      setToast(error.message || "Failed to update profile");
    }
  };

  const notificationsOn = Object.values(notifs).filter(Boolean).length;

  // Filtered list of avatars for the picker
  const visibleAvatars = useMemo(() => {
    if (avatarTab === "male") return MALE_AVATARS;
    if (avatarTab === "female") return FEMALE_AVATARS;
    return [...MALE_AVATARS, ...FEMALE_AVATARS];
  }, [avatarTab]);

  return (
    <div
      className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 selection:bg-[#F3E2CB] selection:text-[#3B2F22]"
      style={{ backgroundColor: BG }}
    >
      <style>{GLOBAL_CSS}</style>

      {/* TOP BAR / AMBIENT HEADER */}
      <div className="flex items-start justify-between px-1 pt-7">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B5793A]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#A69480]">
              Account &amp; Studio
            </p>
          </div>
          <h1 className="mt-1.5 text-[28px] font-extrabold tracking-tight text-[#3B2F22]">
            More
          </h1>
          <p className="mt-0.5 text-[12.5px] font-medium text-[#8A7966]">
            Tailor your studio preferences and identity
          </p>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setSheet("notifications")}
          className="relative mt-1 flex h-10 w-10 items-center justify-center rounded-2xl border border-[#EEE5D8] bg-[#FFFDF9] shadow-[0_2px_8px_rgba(59,47,34,0.06)] transition-all hover:bg-[#F8F1E7] active:scale-95"
        >
          <Bell className="h-[17px] w-[17px] text-[#7A6956]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#C0503C]" />
        </button>
      </div>

      {/* PROFILE HERO CARD (Senior Designer Aesthetic) */}
      <div className="mt-5 overflow-hidden rounded-[24px] border border-[#EEE5D8] bg-[#FFFDF9] shadow-[0_4px_20px_-2px_rgba(59,47,34,0.06)] transition-all hover:border-[#E2D4C3]">
        <button
          type="button"
          onClick={openProfile}
          aria-label="Edit profile"
          className="group relative flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-[#FAF3E9]/50"
        >
          {/* Avatar with luxury golden ring & edit badge */}
          <span className="relative shrink-0">
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#E1BC8C] to-[#FAF1E3] opacity-70 blur-[1px]" />
            <img
              src={profile.avatar}
              alt="Profile avatar"
              className="relative h-15 w-15 rounded-full border-2 border-white bg-[#F4EDE2] object-cover shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#3B2F22] text-[#FAF7F2] shadow-sm transition-transform duration-200 group-hover:scale-110">
              <Pencil size={9.5} />
            </span>
          </span>

          {/* User info */}
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5">
              <span className="block truncate text-[15.5px] font-bold text-[#3B2F22]">
                {profile.name || "Event Manager"}
              </span>
              <Sparkles size={13} className="shrink-0 text-[#B5793A]" />
            </span>
            <span className="mt-0.5 block truncate text-[12px] font-semibold text-[#B5793A]">
              {profile.role}
            </span>
            <span className="mt-0.5 block truncate text-[11.5px] text-[#8F7D6B]">
              {profile.email || "No email linked"}
            </span>
          </span>

          {/* Edit chip */}
          <span className="flex shrink-0 items-center gap-1 rounded-xl border border-[#EEE5D8] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#8A7966] shadow-2xs transition-colors group-hover:border-[#E2D4C3] group-hover:bg-[#F8F1E7]">
            Edit
            <ChevronRight size={13} className="text-[#CFC2B2] transition-transform group-hover:translate-x-0.5" />
          </span>
        </button>

        {/* Studio Stats Summary */}
        <div className="grid grid-cols-3 divide-x divide-[#F1E9DD] border-t border-[#F1E9DD] bg-[#FCFAF5]">
          {[
            ["Events", managementCounts.events ?? "—", "Total"],
            ["Clients", managementCounts.clients ?? "—", "Total"],
            ["Tasks", "—", "Not available"],
          ].map(([label, value, tag]) => (
            <div key={label} className="px-2 py-3 text-center">
              <p className="text-[16px] font-extrabold text-[#3B2F22]">{value}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#A69480]">
                {label}
              </p>
              <span className="mt-0.5 inline-block text-[9.5px] font-medium text-[#8F7D6B]">
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <SectionTitle>Quick Studio Actions</SectionTitle>
      <div className="grid grid-cols-4 gap-2.5">
        {[
          { label: "Add Event", icon: CalendarPlus, tint: "bg-[#FFF4E5] text-[#B5793A] border-[#F2DEBF]", to: "/add-event" },
          { label: "Add Client", icon: UserPlus, tint: "bg-[#FDF0ED] text-[#C0503C] border-[#F5D5CF]", to: "/clients" },
          { label: "Calendar", icon: Calendar, tint: "bg-[#EEF5FC] text-[#2C6EAD] border-[#CFE1F4]", to: "/calendar" },
          { label: "Reminders", icon: Bell, tint: "bg-[#F4EFFC] text-[#6E4BA3] border-[#E2D4F5]", to: "/reminders" },
        ].map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => navigate(q.to)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#EEE5D8] bg-[#FFFDF9] px-1 py-3.5 shadow-[0_2px_8px_rgba(59,47,34,0.03)] transition-all hover:-translate-y-0.5 hover:border-[#E2D4C3] hover:shadow-[0_6px_16px_rgba(59,47,34,0.07)] active:scale-95"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${q.tint} shadow-2xs`}>
              <q.icon size={18} />
            </span>
            <span className="text-[11px] font-semibold text-[#4D3E2F]">{q.label}</span>
          </button>
        ))}
      </div>

      {/* MANAGEMENT */}
      <SectionTitle>Management</SectionTitle>
      <div className="overflow-hidden rounded-[22px] border border-[#EEE5D8] bg-[#FFFDF9] shadow-[0_2px_12px_rgba(59,47,34,0.03)]">
        <div className="divide-y divide-[#F1E9DD]">
          {MANAGEMENT.map((m) => {
            const count =
              m.id === "clients"
                ? managementCounts.clients ?? "—"
                : m.id === "events"
                ? managementCounts.events ?? "—"
                : "—";

            return (
              <Row
                key={m.id}
                icon={m.icon}
                label={m.label}
                badge={<Pill>{count}</Pill>}
                onClick={() => {
                  if (m.path) navigate(m.path);
                  else notify(`${m.label}: ${count} records`);
                }}
              />
            );
          })}
        </div>
      </div>

      {/* PREFERENCES */}
      <SectionTitle>Preferences &amp; System</SectionTitle>
      <div className="overflow-hidden rounded-[22px] border border-[#EEE5D8] bg-[#FFFDF9] shadow-[0_2px_12px_rgba(59,47,34,0.03)]">
        <div className="divide-y divide-[#F1E9DD]">
          <Row
            icon={Bell}
            label="Notifications"
            badge={<Pill variant="amber">{notificationsOn} active</Pill>}
            onClick={() => setSheet("notifications")}
          />
          <Row
            icon={Palette}
            label="Appearance"
            right={theme}
            onClick={() => setSheet("theme")}
          />
          <Row
            icon={Globe}
            label="Language"
            right={language}
            onClick={() => setSheet("language")}
          />
          <div className="flex items-center gap-3.5 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F6EFE5] text-[#B5793A]">
              <Cloud size={17} />
            </span>
            <div>
              <p className="text-[13.5px] font-medium text-[#3B2F22]">Cloud Backup &amp; Sync</p>
              <p className="text-[10.5px] text-[#8F7D6B]">Automatically keep studio data updated</p>
            </div>
            <span className="ml-auto flex items-center gap-2.5 text-xs text-[#8A7966]">
              <Switch
                on={backup}
                label="Toggle backup and sync"
                onToggle={() => {
                  setBackup((b) => !b);
                  setToast(`Cloud Sync ${backup ? "paused" : "activated"}`);
                }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* SUPPORT & ASSISTANCE */}
      <SectionTitle>Support &amp; Community</SectionTitle>
      <div className="overflow-hidden rounded-[22px] border border-[#EEE5D8] bg-[#FFFDF9] shadow-[0_2px_12px_rgba(59,47,34,0.03)]">
        <div className="divide-y divide-[#F1E9DD]">
          <Row icon={HelpCircle} label="Help Center &amp; FAQ" onClick={() => setSheet("help")} />
          <Row icon={Mail} label="Contact Support Team" onClick={() => setSheet("contact")} />
          <Row icon={Info} label="About Event Studio" onClick={() => setSheet("about")} />
        </div>
      </div>

      {/* ACCOUNT ACTIONS (LOGOUT & DANGER ZONE) */}
      <div className="mt-8 space-y-2.5">
        <button
          type="button"
          onClick={() => setSheet("logout")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#EEE5D8] bg-[#FFFDF9] px-4 py-3.5 text-[13.5px] font-bold text-[#5C4B3A] shadow-2xs transition-all hover:bg-[#F8F1E7] active:scale-[0.98]"
        >
          <LogOut size={16} className="text-[#8A7966]" />
          Log Out of Studio
        </button>

        <button
          type="button"
          onClick={() => setSheet("delete-account")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#F2D7D1] bg-[#FDF4F2] px-4 py-3 text-[13px] font-semibold text-[#C0503C] transition-all hover:bg-[#FBEBE8] active:scale-[0.98]"
        >
          <Trash2 size={15} />
          Delete Account &amp; Data
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-1 text-center">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A69480]">
          <ShieldCheck size={13} className="text-[#B5793A]" />
          Event Manager Studio · Enterprise Grade
        </div>
        <p className="text-[10px] text-[#C4B5A3]">Version 2.4.0 (Build 2026.11)</p>
      </div>

      {/* ============================================================
         EDIT PROFILE SHEET (With Multiple Male & Female Avatars)
         ============================================================ */}
      <Modal open={sheet === "profile"} onClose={close}>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#F4EDE2] px-5 pb-3.5 pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={close}
              aria-label="Back"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E8DDCE] bg-white text-[#5C4B3A] transition-colors hover:bg-[#F8F1E7] active:scale-95"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h4 className="text-[17px] font-extrabold tracking-tight text-[#3B2F22]">
                Edit Studio Profile
              </h4>
              <p className="text-xs text-[#8A7966]">Personalize your identity across the app</p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-1 text-[#A69480] hover:text-[#3B2F22]"
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="mo-scroll space-y-4 overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(88vh - 80px)" }}>
          {/* Active Avatar Spotlight Preview */}
          <div className="relative overflow-hidden rounded-2xl border border-[#EEE5D8] bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E9] p-4 text-center shadow-2xs">
            <div className="relative mx-auto h-[108px] w-[108px]">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#E1BC8C] via-[#FAF1E3] to-[#B5793A] opacity-50 blur-sm" />
              <img
                src={selectedAvatar}
                alt="Selected Avatar Preview"
                className="relative h-[108px] w-[108px] rounded-full border-4 border-white bg-[#F6EFE5] object-cover shadow-md"
              />
              <label
                htmlFor="avatar-file-input"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#B5793A] text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                title="Upload custom photo"
              >
                <Camera size={15} />
              </label>
              <input
                id="avatar-file-input"
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarUpload}
              />
            </div>
            <p className="mt-2.5 text-[13px] font-bold text-[#3B2F22]">
              {draft.name || "Your Name"}
            </p>
            <p className="text-[11px] font-semibold text-[#B5793A]">
              Tap any photo below to switch immediately
            </p>
          </div>

          {/* AVATAR SELECTOR (Male & Female Collections) */}
          <div className="rounded-2xl border border-[#EEE5D8] bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12.5px] font-bold text-[#3B2F22]">Choose Profile Photo</p>
                <p className="text-[11px] text-[#8A7966]">Curated male and female executive portraits</p>
              </div>

              {/* Upload Button */}
              <label
                htmlFor="avatar-file-input-btn"
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E5DACB] bg-[#FAF5EE] px-2.5 py-1.5 text-[11px] font-semibold text-[#8C521A] transition-colors hover:bg-[#F2E5D3] active:scale-95"
              >
                <Upload size={12} />
                <span>Upload</span>
              </label>
              <input
                id="avatar-file-input-btn"
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarUpload}
              />
            </div>

            {/* Filter Tabs: All, Gentlemen, Ladies */}
            <div className="mt-3 flex rounded-xl border border-[#EFE7DC] bg-[#FAF7F2] p-1">
              {[
                { id: "all", label: `All (${MALE_AVATARS.length + FEMALE_AVATARS.length})` },
                { id: "male", label: `👨🏻 Gentlemen (${MALE_AVATARS.length})` },
                { id: "female", label: `👩🏻 Ladies (${FEMALE_AVATARS.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAvatarTab(tab.id)}
                  className={`flex-1 rounded-lg py-1.5 text-[11.5px] font-bold transition-all ${
                    avatarTab === tab.id
                      ? "bg-white text-[#8C521A] shadow-xs"
                      : "text-[#8F7D6B] hover:text-[#3B2F22]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Avatars Grid */}
            <div className="mt-3.5 grid grid-cols-4 gap-2.5 sm:grid-cols-6">
              {visibleAvatars.map((av) => {
                const isSelected = selectedAvatar === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av.url);
                      setDraft((d) => ({ ...d, avatar: av.url }));
                    }}
                    className={`group relative flex flex-col items-center gap-1 rounded-xl p-1 transition-all ${
                      isSelected
                        ? "scale-105"
                        : "hover:opacity-90 active:scale-95"
                    }`}
                  >
                    <div
                      className={`relative h-13 w-13 overflow-hidden rounded-full border-2 transition-all ${
                        isSelected
                          ? "border-[#B5793A] ring-2 ring-[#B5793A]/30 shadow-md"
                          : "border-[#EFE7DC] group-hover:border-[#D5C4B0]"
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.label}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center bg-[#B5793A]/35 backdrop-blur-[0.5px]">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#B5793A] shadow-sm">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] truncate max-w-full text-center font-medium ${
                        isSelected ? "font-bold text-[#8C521A]" : "text-[#7A6956]"
                      }`}
                    >
                      {av.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5 rounded-2xl border border-[#EEE5D8] bg-white p-4 shadow-2xs">
            <div>
              <label className="mb-1 block pl-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8F7C69]">
                Full Name
              </label>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="e.g. Sathvik M S"
                className="h-10.5 w-full rounded-xl border border-[#EEE5D8] bg-[#FFFDF9] px-3.5 text-[13.5px] font-medium text-[#3A2F26] outline-none transition-colors focus:border-[#B5793A] focus:ring-2 focus:ring-[#B5793A]/15"
              />
            </div>

            <div>
              <label className="mb-1 block pl-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8F7C69]">
                Role / Title
              </label>
              <input
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                placeholder="e.g. Lead Event Coordinator"
                className="h-10.5 w-full rounded-xl border border-[#EEE5D8] bg-[#FFFDF9] px-3.5 text-[13.5px] font-medium text-[#3A2F26] outline-none transition-colors focus:border-[#B5793A] focus:ring-2 focus:ring-[#B5793A]/15"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 pl-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8F7C69]">
                <Lock size={10} /> Email (Registered Identity)
              </label>
              <input
                value={draft.email}
                disabled
                className="h-10.5 w-full cursor-not-allowed rounded-xl border border-[#EEE5D8] bg-[#F7F3ED] px-3.5 text-[13px] text-[#A69480]"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 pl-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8F7C69]">
                <Phone size={10} /> Contact Phone Number
              </label>
              <input
                value={draft.phone || ""}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="h-10.5 w-full rounded-xl border border-[#EEE5D8] bg-[#FFFDF9] px-3.5 text-[13.5px] font-medium text-[#3A2F26] outline-none transition-colors placeholder:text-[#C4B5A0] focus:border-[#B5793A] focus:ring-2 focus:ring-[#B5793A]/15"
              />
            </div>

            <div className="pt-2">
              <AmberBtn onClick={handleSaveProfile}>
                ✓ &nbsp; Save Profile Changes
              </AmberBtn>
            </div>
          </div>
        </div>
      </Modal>

      {/* ============================================================
         NOTIFICATIONS SHEET
         ============================================================ */}
      <Modal open={sheet === "notifications"} onClose={close}>
        <SheetHeader
          icon={Bell}
          title="Notification Preferences"
          subtitle="Configure instant alerts for events and updates."
          onClose={close}
        />
        <div className="space-y-2.5 px-5 pb-6 pt-3">
          {[
            ["push", "Push notifications", "Instant device alerts for scheduled events"],
            ["email", "Email summaries", "Weekly digest and major client reminders"],
            ["reminders", "Event reminders", "Advance alert 2 hours before event start"],
          ].map(([k, label, desc]) => (
            <div
              key={k}
              className="flex items-center justify-between rounded-xl border border-[#EEE5D8] bg-white p-3.5 shadow-2xs"
            >
              <div>
                <p className="text-[13.5px] font-medium text-[#3B2F22]">{label}</p>
                <p className="text-[11px] text-[#8F7D6B]">{desc}</p>
              </div>
              <Switch
                on={notifs[k]}
                label={`Toggle ${label}`}
                onToggle={() => setNotifs((n) => ({ ...n, [k]: !n[k] }))}
              />
            </div>
          ))}
          <div className="pt-2">
            <PrimaryBtn onClick={() => notify("Notification settings updated")}>
              Done
            </PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ============================================================
         APPEARANCE SHEET
         ============================================================ */}
      <Modal open={sheet === "theme"} onClose={close}>
        <SheetHeader
          icon={Palette}
          title="App Appearance"
          subtitle="Choose the look and feel of your studio."
          onClose={close}
        />
        <div className="space-y-2.5 px-5 pb-6 pt-3">
          {THEMES.map((t) => (
            <OptionButton
              key={t.id}
              icon={t.icon}
              selected={theme === t.id}
              onClick={() => setTheme(t.id)}
            >
              <span className="block font-medium">{t.label}</span>
            </OptionButton>
          ))}
          <div className="pt-2">
            <PrimaryBtn onClick={() => notify(`Appearance set to ${theme}`)}>
              Apply Theme
            </PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ============================================================
         LANGUAGE SHEET
         ============================================================ */}
      <Modal open={sheet === "language"} onClose={close}>
        <SheetHeader
          icon={Globe}
          title="Studio Language"
          subtitle="Select your preferred working language."
          onClose={close}
        />
        <div className="space-y-2.5 px-5 pb-6 pt-3">
          {LANGUAGES.map((l) => (
            <OptionButton
              key={l.code}
              selected={language === l.name}
              onClick={() => setLanguage(l.name)}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-[#3B2F22]">{l.name}</span>
                <span className="text-[11px] text-[#8A7966]">{l.sub}</span>
              </div>
            </OptionButton>
          ))}
          <div className="pt-2">
            <PrimaryBtn onClick={() => notify(`Language set to ${language}`)}>
              Save Language
            </PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ============================================================
         HELP & FAQ SHEET
         ============================================================ */}
      <Modal open={sheet === "help"} onClose={close}>
        <SheetHeader
          icon={HelpCircle}
          title="Help &amp; Documentation"
          subtitle="Quick answers for managing events and clients."
          onClose={close}
        />
        <div className="space-y-2.5 overflow-y-auto px-5 pb-6 pt-3" style={{ maxHeight: "60vh" }}>
          {[
            [
              "How do I add a new event?",
              "Tap 'Add Event' in Quick Actions above or the calendar tab to schedule and assign vendors.",
            ],
            [
              "Can I invite team members?",
              "Yes, navigate to Management → Team to send invites and assign event roles.",
            ],
            [
              "How do client event popups work?",
              "From the Dashboard or Clients page, tapping any client displays their full booking history and timeline.",
            ],
            [
              "Where is profile photo data stored?",
              "Profile photos are optimized and synchronized securely with your backend database and locally cached for instant loading.",
            ],
          ].map(([q, a]) => (
            <div key={q} className="rounded-xl border border-[#EEE5D8] bg-white p-3.5 shadow-2xs">
              <p className="text-[13.5px] font-semibold text-[#3B2F22]">{q}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-[#8A7966]">{a}</p>
            </div>
          ))}
          <div className="pt-1">
            <PrimaryBtn onClick={close}>Close Help</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ============================================================
         CONTACT SUPPORT SHEET
         ============================================================ */}
      <Modal open={sheet === "contact"} onClose={close}>
        <SheetHeader
          icon={Mail}
          title="Contact Studio Support"
          subtitle="Direct line to our technical and account team."
          onClose={close}
        />
        <div className="space-y-2.5 px-5 pb-6 pt-3">
          <textarea
            rows={4}
            value={support}
            onChange={(e) => setSupport(e.target.value)}
            placeholder="Tell us what you need assistance with..."
            className="w-full resize-none rounded-xl border border-[#EEE5D8] bg-white p-3.5 text-[13.5px] text-[#3A2F26] outline-none transition-colors placeholder:text-[#C4B5A0] focus:border-[#B5793A] focus:ring-2 focus:ring-[#B5793A]/15"
          />
          <PrimaryBtn
            disabled={!support.trim()}
            onClick={() => {
              setSupport("");
              notify("Your message has been sent to our team.");
            }}
          >
            Send Message
          </PrimaryBtn>
          <GhostBtn onClick={close}>Cancel</GhostBtn>
        </div>
      </Modal>

      {/* ============================================================
         ABOUT APP SHEET
         ============================================================ */}
      <Modal open={sheet === "about"} onClose={close}>
        <SheetHeader
          icon={Info}
          title="About Event Studio"
          subtitle="Crafted for professional event curators"
          onClose={close}
        />
        <div className="space-y-2.5 px-5 pb-6 pt-3">
          <p className="text-[12.5px] leading-relaxed text-[#8A7966]">
            Event Studio is an editorial, calm, and high-performance management tool designed to track
            events, client bookings, vendors, and tasks seamlessly.
          </p>
          <div className="flex items-center justify-between rounded-xl border border-[#EEE5D8] bg-white px-3.5 py-3 text-[13px]">
            <span className="text-[#8A7966]">Version</span>
            <span className="font-bold text-[#3B2F22]">2.4.0</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#EEE5D8] bg-white px-3.5 py-3 text-[13px]">
            <span className="text-[#8A7966]">Build Date</span>
            <span className="font-bold text-[#3B2F22]">November 2026</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#EEE5D8] bg-white px-3.5 py-3 text-[13px]">
            <span className="text-[#8A7966]">Backend Protocol</span>
            <span className="font-bold text-[#B5793A]">REST API v2 · PostgreSQL</span>
          </div>
          <div className="pt-2">
            <PrimaryBtn onClick={close}>Close</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ============================================================
         LOGOUT SHEET
         ============================================================ */}
      <Modal open={sheet === "logout"} onClose={close}>
        <SheetHeader
          icon={LogOut}
          title="Log out of your account?"
          subtitle="You will be returned to the sign-in screen."
          onClose={close}
        />
        <div className="space-y-2.5 px-5 pb-6 pt-3">
          <PrimaryBtn
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("access_token");
              localStorage.removeItem("user");
              setSheet(null);
              navigate("/login");
            }}
          >
            Yes, Log Out
          </PrimaryBtn>
          <GhostBtn onClick={close}>Stay Signed In</GhostBtn>
        </div>
      </Modal>

      {/* ============================================================
         DELETE ACCOUNT SHEET
         ============================================================ */}
      <Modal open={sheet === "delete-account"} onClose={close}>
        <div className="px-6 pb-6 pt-5 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDF0ED] text-[#C0503C] shadow-xs">
            <TriangleAlert size={28} />
          </span>
          <h4 className="mt-4 text-lg font-bold text-[#3B2F22]">Permanently Delete Account?</h4>
          <p className="mx-auto mt-2 max-w-[290px] text-[12.5px] leading-relaxed text-[#8A7966]">
            This will permanently remove your events, client history, team links, and account profile from our servers.
            This action cannot be undone.
          </p>
          <div className="mt-6 space-y-2.5 text-left">
            <DangerBtn onClick={handleDeleteAccount}>
              Yes, Permanently Delete Everything
            </DangerBtn>
            <GhostBtn onClick={close}>Keep Account Safe</GhostBtn>
          </div>
        </div>
      </Modal>

      {/* FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div className="mo-toast-in fixed bottom-20 left-1/2 z-[110] -translate-x-1/2 whitespace-nowrap rounded-full border border-[#4E3F30] bg-[#3B2F22] px-5 py-2.5 text-[12.5px] font-semibold text-[#FAF7F2] shadow-[0_10px_25px_rgba(40,28,18,0.35)]">
          {toast}
        </div>
      )}

      {/* BOTTOM NAVIGATION (Hidden while editing profile for maximum focus) */}
      {sheet !== "profile" && (
        <BottomNav active="more" theme="amber" />
      )}
    </div>
  );
}