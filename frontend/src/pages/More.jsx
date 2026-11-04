import { useEffect, useState } from "react";
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
} from "lucide-react";

/* ============================================================
   Design tokens — warm editorial palette (matches Calendar)
   Cream paper · espresso ink · sand lines · amber accent
   ============================================================ */
const BG = "#faf7f2";
const CARD = "#FFFDF9";

/* Self-contained motion */
const GLOBAL_CSS = `
@keyframes moFade { from { opacity: 0 } to { opacity: 1 } }
@keyframes moRise { from { opacity: 0; transform: translateY(28px) scale(.98) } to { opacity: 1; transform: none } }
@keyframes moToast { from { opacity: 0; transform: translate(-50%, 12px) } to { opacity: 1; transform: translate(-50%, 0) } }
.mo-fade { animation: moFade .18s ease-out both }
.mo-rise { animation: moRise .3s cubic-bezier(.22,1,.36,1) both }
.mo-toast-in { animation: moToast .25s cubic-bezier(.22,1,.36,1) both }
@media (prefers-reduced-motion: reduce) {
  .mo-fade, .mo-rise, .mo-toast-in { animation: none }
}
`;

const AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";

const BOY_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80";

const GIRL_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80";

const MANAGEMENT = [
  { id: "clients", label: "Clients", icon: Users, count: 24 },
  { id: "events", label: "Events", icon: Calendar, count: 8 },
  { id: "payments", label: "Payments", icon: CreditCard, count: 3 },
  { id: "tasks", label: "Tasks", icon: SquareCheck, count: 12 },
  { id: "team", label: "Team", icon: UsersRound, count: 5 },
];

const THEMES = ["System", "Light", "Dark"];
const LANGUAGES = ["English", "हिन्दी", "Español", "Français", "Deutsch"];

/* ── SHARED PIECES ── */
function Switch({ on, onToggle, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        on ? "bg-amber-500" : "bg-[#E8DDCE]"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          on ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

function Row({ icon: Icon, label, right, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-[#F7F0E6]/70"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7F0E6] text-[#B5793A]">
        <Icon size={17} />
      </span>
      <span className="text-sm font-medium text-[#3B2F22]">{label}</span>
      <span className="ml-auto flex shrink-0 items-center gap-2 text-xs text-[#9C8A73]">
        {right}
        <ChevronRight size={15} className="text-[#D8CFC2] transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

const Pill = ({ children }) => (
  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
    {children}
  </span>
);

function Modal({ open, onClose, children }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="mo-fade absolute inset-0 bg-[#2A2018]/45 backdrop-blur-[2px]"
      />
      <div className="mo-rise relative flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-[28px] border border-[#EEE5D8] bg-[#FFFDF9] shadow-2xl sm:rounded-[28px]">
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-[#E8DDCE] sm:hidden" />
        {children}
      </div>
    </div>
  );
}

function SheetHeader({ title, subtitle, onClose, icon: Icon }) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-3 px-5 pb-3 pt-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F7F0E6] text-[#B5793A]">
            <Icon size={18} />
          </span>
        )}
        <div>
          <h4 className="text-base font-semibold text-[#3B2F22]">{title}</h4>
          {subtitle && <p className="mt-0.5 text-xs leading-relaxed text-[#9C8A73]">{subtitle}</p>}
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
  );
}

const PrimaryBtn = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full rounded-xl bg-[#3B2F22] px-4 py-3 text-sm font-semibold text-[#FAF7F2] shadow-sm transition-all hover:bg-[#4A3B2C] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
  >
    {children}
  </button>
);

const GhostBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-full rounded-xl border border-[#EEE5D8] bg-white px-4 py-3 text-sm font-semibold text-[#8A7966] transition-colors hover:bg-[#F7F0E6] active:scale-[0.98]"
  >
    {children}
  </button>
);

const DangerBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-full rounded-xl bg-[#C0503C] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#AD4432] active:scale-[0.98]"
  >
    {children}
  </button>
);

function OptionButton({ selected, children, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-[13.5px] transition-colors ${
        selected
          ? "border-amber-300 bg-amber-50 font-semibold text-amber-800"
          : "border-[#EEE5D8] bg-white text-[#5C4B3A] hover:bg-[#F7F0E6]"
      }`}
    >
      {children}
      {selected && <CheckCircle2 size={16} className="shrink-0 text-amber-600" />}
    </button>
  );
}

const SectionTitle = ({ children }) => (
  <h2 className="mb-2 ml-1 mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B3A28C]">
    {children}
  </h2>
);

/* ── MORE PAGE ── */
export default function More() {
  const [sheet, setSheet] = useState(null);
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [theme, setTheme] = useState("System");
  const [language, setLanguage] = useState("English");
  const [notifs, setNotifs] = useState({ push: true, email: false, reminders: true });
  const [backup, setBackup] = useState(true);
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [profile, setProfile] = useState({
    name: savedUser?.full_name || savedUser?.name || "",
    role: "Event Manager",
    email: savedUser?.email || "",
    phone: savedUser?.phone || "",
    avatar: savedUser?.avatar || AVATAR,
  });

  const [draft, setDraft] = useState(profile);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR);
  const [support, setSupport] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const close = () => setSheet(null);
  const notify = (m) => { setToast(m); close(); };

  const handleDeleteAccount = async () => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (!savedUser?.email) {
        setToast("User information not found");
        return;
      }

      const response = await fetch(
        `https://event-manager-pls6.onrender.com/auth/delete-account?email=${encodeURIComponent(
          savedUser.email
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete account");
      }

      // Remove login/session data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Close popup
      setSheet(null);

      // Go to login
      navigate("/login");

    } catch (error) {
      console.error("Delete account error:", error);
      setToast(error.message || "Failed to delete account");
    }
  };

  const openProfile = () => {
    setDraft(profile);
    setSelectedAvatar(profile.avatar || AVATAR);
    setSheet("profile");
  };

  const notificationsOn = Object.values(notifs).filter(Boolean).length;

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-5 pb-28" style={{ backgroundColor: BG }}>
      <style>{GLOBAL_CSS}</style>

      {/* HEADER */}
      <div className="flex items-start justify-between px-1 pt-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B3A28C]">
            Your account
          </p>
          <h1 className="mt-1 text-[26px] font-bold leading-tight text-[#3B2F22]">More</h1>
          <p className="mt-1 text-[12px] text-[#9C8A73]">
            Manage your account and app settings.
          </p>
        </div>

        <button
          aria-label="Notifications"
          onClick={() => setSheet("notifications")}
          className="relative mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#EEE5D8] bg-white shadow-sm transition-colors hover:bg-[#F7F0E6]"
        >
          <Bell className="h-[17px] w-[17px] text-[#8A7966]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#D05B4A]" />
        </button>
      </div>

      {/* PROFILE HERO CARD */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#EEE5D8] bg-[#FFFDF9] shadow-sm">
        <button
          onClick={openProfile}
          aria-label="Edit profile"
          className="group flex w-full items-center gap-3.5 p-4 text-left"
        >
          <span className="relative shrink-0">
            <img
              src={profile.avatar}
              alt="Profile photo"
              className="h-14 w-14 rounded-full border-2 border-[#F2E2CD] object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#3B2F22] text-white">
              <Camera size={10} />
            </span>
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-bold text-[#3B2F22]">
              {profile.name || "Your name"}
            </span>
            <span className="mt-0.5 block truncate text-[12px] font-medium text-[#B5793A]">
              {profile.role}
            </span>
            <span className="mt-0.5 block truncate text-[12px] text-[#A89684]">
              {profile.email || "—"}
            </span>
          </span>

          <ChevronRight size={16} className="shrink-0 text-[#D8CFC2] transition-transform group-hover:translate-x-0.5" />
        </button>

        <div className="grid grid-cols-3 divide-x divide-[#F1E9DD] border-t border-[#F1E9DD]">
          {[
            ["Events", MANAGEMENT[1].count],
            ["Clients", MANAGEMENT[0].count],
            ["Tasks", MANAGEMENT[3].count],
          ].map(([label, value]) => (
            <div key={label} className="px-2 py-3 text-center">
              <p className="text-[15px] font-bold text-[#3B2F22]">{value}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#B3A28C]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <SectionTitle>Quick Actions</SectionTitle>
      <div className="grid grid-cols-4 gap-2.5">
        {[
          { label: "Add Event", icon: CalendarPlus, tint: "bg-amber-100/70 text-amber-800", to: "/add-event" },
          { label: "Add Client", icon: UserPlus, tint: "bg-rose-100/70 text-rose-800", to: "/clients" },
          { label: "Calendar", icon: Calendar, tint: "bg-sky-100/70 text-sky-800", to: "/calendar" },
          { label: "Reminders", icon: Bell, tint: "bg-violet-100/70 text-violet-800", to: "/reminders" },
        ].map((q) => (
          <button
            key={q.label}
            onClick={() => navigate(q.to)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#EEE5D8] bg-[#FFFDF9] px-1 py-3.5 shadow-sm transition-all hover:border-[#E0D3C0] hover:shadow-md active:scale-[0.96]"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${q.tint}`}>
              <q.icon size={19} />
            </span>
            <span className="text-[10.5px] font-semibold text-[#5C4B3A]">{q.label}</span>
          </button>
        ))}
      </div>

      {/* MANAGEMENT */}
      <SectionTitle>Management</SectionTitle>
      <div className="overflow-hidden rounded-2xl border border-[#EEE5D8] bg-[#FFFDF9] shadow-sm">
        <div className="divide-y divide-[#F1E9DD]">
          {MANAGEMENT.map((m) => (
            <Row
              key={m.id}
              icon={m.icon}
              label={m.label}
              right={<Pill>{m.count}</Pill>}
              onClick={() => notify(`${m.label}: ${m.count} items`)}
            />
          ))}
        </div>
      </div>

      {/* PREFERENCES */}
      <SectionTitle>Preferences</SectionTitle>
      <div className="overflow-hidden rounded-2xl border border-[#EEE5D8] bg-[#FFFDF9] shadow-sm">
        <div className="divide-y divide-[#F1E9DD]">
          <Row
            icon={Bell}
            label="Notifications"
            right={<Pill>{notificationsOn} on</Pill>}
            onClick={() => setSheet("notifications")}
          />
          <Row icon={Palette} label="Appearance" right={theme} onClick={() => setSheet("theme")} />
          <Row icon={Globe} label="Language" right={language} onClick={() => setSheet("language")} />
          <div className="flex items-center gap-3.5 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7F0E6] text-[#B5793A]">
              <Cloud size={17} />
            </span>
            <span className="text-sm font-medium text-[#3B2F22]">Backup &amp; Sync</span>
            <span className="ml-auto flex items-center gap-2.5 text-xs text-[#9C8A73]">
              {backup ? "On" : "Off"}
              <Switch
                on={backup}
                label="Toggle backup and sync"
                onToggle={() => {
                  setBackup((b) => !b);
                  setToast(`Backup ${backup ? "disabled" : "enabled"}`);
                }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* SUPPORT */}
      <SectionTitle>Support</SectionTitle>
      <div className="overflow-hidden rounded-2xl border border-[#EEE5D8] bg-[#FFFDF9] shadow-sm">
        <div className="divide-y divide-[#F1E9DD]">
          <Row icon={HelpCircle} label="Help & FAQ" onClick={() => setSheet("help")} />
          <Row icon={Mail} label="Contact Support" onClick={() => setSheet("contact")} />
          <Row icon={Info} label="About App" onClick={() => setSheet("about")} />
        </div>
      </div>

      {/* LOG OUT / DELETE */}
      <button
        onClick={() => setSheet("logout")}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-[#F0D5CF] bg-[#FDF1EE] px-4 py-3.5 text-sm font-bold text-[#C0503C] transition-all hover:bg-[#FBE7E2] active:scale-[0.98]"
      >
        <LogOut size={16} />
        Log Out
      </button>

      <button
        onClick={() => setSheet("delete-account")}
        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#F0C9C2] bg-white px-4 py-3.5 text-sm font-bold text-[#C0503C] transition-all hover:bg-[#FDF6F4] active:scale-[0.98]"
      >
        <Trash2 size={15} />
        Delete Account
      </button>

      <p className="mt-5 text-center text-[11px] font-medium text-[#B0A191]">Version 1.0.0</p>

      {/* ── NOTIFICATIONS SHEET ── */}
      <Modal open={sheet === "notifications"} onClose={close}>
        <SheetHeader icon={Bell} title="Notifications" subtitle="Choose what you want to be alerted about." onClose={close} />
        <div className="space-y-2 px-4 pb-6">
          {[["push", "Push notifications"], ["email", "Email updates"], ["reminders", "Event reminders"]].map(([k, label]) => (
            <div key={k} className="flex items-center justify-between rounded-xl border border-[#EEE5D8] bg-white px-3.5 py-3">
              <span className="text-[13.5px] text-[#3B2F22]">{label}</span>
              <Switch
                on={notifs[k]}
                label={`Toggle ${label}`}
                onToggle={() => setNotifs((n) => ({ ...n, [k]: !n[k] }))}
              />
            </div>
          ))}
          <div className="pt-2">
            <PrimaryBtn onClick={() => notify("Notification settings saved")}>Done</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ── APPEARANCE SHEET ── */}
      <Modal open={sheet === "theme"} onClose={close}>
        <SheetHeader icon={Palette} title="Appearance" subtitle="Pick how the app should look." onClose={close} />
        <div className="space-y-2 px-4 pb-6">
          {THEMES.map((t) => (
            <OptionButton key={t} selected={theme === t} onClick={() => setTheme(t)}>
              {t}
            </OptionButton>
          ))}
          <div className="pt-2">
            <PrimaryBtn onClick={() => notify(`Appearance set to ${theme}`)}>Apply</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ── LANGUAGE SHEET ── */}
      <Modal open={sheet === "language"} onClose={close}>
        <SheetHeader icon={Globe} title="Language" subtitle="Select your preferred language." onClose={close} />
        <div className="space-y-2 px-4 pb-6">
          {LANGUAGES.map((l) => (
            <OptionButton key={l} selected={language === l} onClick={() => setLanguage(l)}>
              {l}
            </OptionButton>
          ))}
          <div className="pt-2">
            <PrimaryBtn onClick={() => notify(`Language set to ${language}`)}>Apply</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ── HELP SHEET ── */}
      <Modal open={sheet === "help"} onClose={close}>
        <SheetHeader icon={HelpCircle} title="Help & FAQ" subtitle="Quick answers to common questions." onClose={close} />
        <div className="space-y-2.5 overflow-y-auto px-4 pb-6">
          {[
            ["How do I create an event?", "Go to Quick Actions and tap Add Event, then slide to save."],
            ["Can I invite my team?", "Open Management → Team and add members by email."],
            ["Where is my data stored?", "Locally on this device, synced when Backup & Sync is on."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-xl border border-[#EEE5D8] bg-white px-4 py-3.5">
              <p className="text-[13.5px] font-semibold text-[#3B2F22]">{q}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#9A8874]">{a}</p>
            </div>
          ))}
          <div className="pt-1">
            <PrimaryBtn onClick={close}>Close</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ── CONTACT SHEET ── */}
      <Modal open={sheet === "contact"} onClose={close}>
        <SheetHeader icon={Mail} title="Contact Support" subtitle="Tell us what went wrong and we'll get back to you." onClose={close} />
        <div className="space-y-2 px-4 pb-6">
          <textarea
            rows={4}
            value={support}
            onChange={(e) => setSupport(e.target.value)}
            placeholder="Describe your issue…"
            className="w-full resize-none rounded-xl border border-[#EEE5D8] bg-white px-3.5 py-3 text-[13.5px] text-[#3A2F26] outline-none transition-colors placeholder:text-[#C4B5A0] focus:border-[#D8A15F]"
          />
          <PrimaryBtn disabled={!support.trim()} onClick={() => { setSupport(""); notify("Message sent to support"); }}>
            Send message
          </PrimaryBtn>
          <GhostBtn onClick={close}>Cancel</GhostBtn>
        </div>
      </Modal>

      {/* ── ABOUT SHEET ── */}
      <Modal open={sheet === "about"} onClose={close}>
        <SheetHeader icon={Info} title="About App" onClose={close} />
        <div className="space-y-2 px-4 pb-6">
          <p className="px-1 pb-1 text-[13px] leading-relaxed text-[#9A8874]">
            Event Manager helps you plan events, track clients, payments and tasks in one calm workspace.
          </p>
          <div className="flex items-center justify-between rounded-xl border border-[#EEE5D8] bg-white px-3.5 py-3 text-[13.5px]">
            <span className="text-[#5C4B3A]">Version</span>
            <span className="font-semibold text-[#3B2F22]">1.0.0</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#EEE5D8] bg-white px-3.5 py-3 text-[13.5px]">
            <span className="text-[#5C4B3A]">Build</span>
            <span className="font-semibold text-[#3B2F22]">2026.08</span>
          </div>
          <div className="pt-2">
            <PrimaryBtn onClick={close}>Close</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ── LOGOUT SHEET ── */}
      <Modal open={sheet === "logout"} onClose={close}>
        <SheetHeader icon={LogOut} title="Log out?" subtitle="You'll need to sign in again to access your events." onClose={close} />
        <div className="space-y-2 px-4 pb-6">
          <PrimaryBtn
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setSheet(null);
              navigate("/login");
            }}
          >
            Yes, log out
          </PrimaryBtn>
          <GhostBtn onClick={close}>Stay signed in</GhostBtn>
        </div>
      </Modal>

      {/* ── DELETE ACCOUNT SHEET ── */}
      <Modal open={sheet === "delete-account"} onClose={close}>
        <div className="px-5 pb-6 pt-5 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF0ED] text-[#C0503C]">
            <TriangleAlert size={28} />
          </span>
          <h4 className="mt-4 text-base font-bold text-[#3B2F22]">Delete Account?</h4>
          <p className="mx-auto mt-1.5 max-w-[280px] text-[13px] leading-relaxed text-[#9A8874]">
            This will permanently delete your account and all your data. This action cannot be undone.
          </p>
          <div className="mt-5 space-y-2 text-left">
            <DangerBtn onClick={handleDeleteAccount}>Delete Permanently</DangerBtn>
            <GhostBtn onClick={close}>Cancel</GhostBtn>
          </div>
        </div>
      </Modal>

      {/* ── EDIT PROFILE SHEET ── */}
      <Modal open={sheet === "profile"} onClose={close}>
        <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-4">
          <button
            type="button"
            onClick={close}
            aria-label="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EEE5D8] bg-white text-[#5C4B3A] transition-colors hover:bg-[#F7F0E6]"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h4 className="text-[17px] font-bold text-[#3B2F22]">Edit Profile</h4>
            <p className="mt-0.5 text-xs text-[#9C8A73]">Update the details shown across the app.</p>
          </div>
        </div>

        <div className="mo-fade space-y-4 overflow-y-auto px-4 pb-6">
          {/* Photo */}
          <div className="rounded-2xl border border-[#EEE5D8] bg-white p-4">
            <p className="mb-3 text-[13px] font-bold text-[#3B2F22]">Profile Photo</p>

            <div className="relative mx-auto mb-4 h-[104px] w-[104px]">
              <img
                src={selectedAvatar}
                alt="Profile"
                className="h-[104px] w-[104px] rounded-full border-4 border-[#F5DCBF] bg-white object-cover"
              />
              <label className="absolute -bottom-0.5 -right-0.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-[3px] border-white bg-[#FFF4E5] text-[#B5793A] shadow-md transition-transform active:scale-95">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    const imageUrl = URL.createObjectURL(file);

                    setSelectedAvatar(imageUrl);

                    setDraft({
                      ...draft,
                      avatar: imageUrl,
                    });
                  }}
                />
                <Camera size={16} />
              </label>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* Upload */}
              <label className={`flex min-h-[62px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border text-[11px] transition-colors ${
                selectedAvatar === "upload"
                  ? "border-amber-300 bg-amber-50 font-semibold text-amber-800"
                  : "border-[#EEE5D8] bg-white text-[#5C4B3A] hover:bg-[#F7F0E6]"
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    const imageUrl = URL.createObjectURL(file);

                    setSelectedAvatar(imageUrl);

                    setDraft({
                      ...draft,
                      avatar: imageUrl,
                    });
                  }}
                />
                <span className="text-[20px] leading-none">📷</span>
                <span>Upload</span>
              </label>

              {/* Boy */}
              <button
                type="button"
                className={`flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-xl border text-[11px] transition-colors ${
                  selectedAvatar === BOY_AVATAR
                    ? "border-amber-300 bg-amber-50 font-semibold text-amber-800"
                    : "border-[#EEE5D8] bg-white text-[#5C4B3A] hover:bg-[#F7F0E6]"
                }`}
                onClick={() => {
                  setSelectedAvatar(BOY_AVATAR);
                  setDraft({
                    ...draft,
                    avatar: BOY_AVATAR,
                  });
                }}
              >
                <span className="text-[20px] leading-none">👨🏻</span>
                <span>Boy</span>
              </button>

              {/* Girl */}
              <button
                type="button"
                className={`flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-xl border text-[11px] transition-colors ${
                  selectedAvatar === GIRL_AVATAR
                    ? "border-amber-300 bg-amber-50 font-semibold text-amber-800"
                    : "border-[#EEE5D8] bg-white text-[#5C4B3A] hover:bg-[#F7F0E6]"
                }`}
                onClick={() => {
                  setSelectedAvatar(GIRL_AVATAR);
                  setDraft({
                    ...draft,
                    avatar: GIRL_AVATAR,
                  });
                }}
              >
                <span className="text-[20px] leading-none">👩🏻</span>
                <span>Girl</span>
              </button>

              {/* Default */}
              <button
                type="button"
                className={`flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-xl border text-[11px] transition-colors ${
                  selectedAvatar === AVATAR
                    ? "border-amber-300 bg-amber-50 font-semibold text-amber-800"
                    : "border-[#EEE5D8] bg-white text-[#5C4B3A] hover:bg-[#F7F0E6]"
                }`}
                onClick={() => {
                  setSelectedAvatar(AVATAR);
                  setDraft({
                    ...draft,
                    avatar: AVATAR,
                  });
                }}
              >
                <span className="text-[20px] leading-none">👤</span>
                <span>Default</span>
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-3 rounded-2xl border border-[#EEE5D8] bg-white p-4">
            <div>
              <label className="mb-1.5 block pl-0.5 text-[10px] font-bold uppercase tracking-widest text-[#8F7C69]">
                Full Name
              </label>
              <input
                value={draft.name}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    name: e.target.value,
                  })
                }
                className="h-10 w-full rounded-xl border border-[#EEE5D8] bg-[#FFFDF9] px-3 text-[13px] text-[#3A2F26] outline-none transition-colors focus:border-[#D8A15F]"
              />
            </div>

            <div>
              <label className="mb-1.5 block pl-0.5 text-[10px] font-bold uppercase tracking-widest text-[#8F7C69]">
                Role / Designation
              </label>
              <input
                value={draft.role}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    role: e.target.value,
                  })
                }
                className="h-10 w-full rounded-xl border border-[#EEE5D8] bg-[#FFFDF9] px-3 text-[13px] text-[#3A2F26] outline-none transition-colors focus:border-[#D8A15F]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 pl-0.5 text-[10px] font-bold uppercase tracking-widest text-[#8F7C69]">
                <Lock size={10} /> Email
              </label>
              <input
                value={draft.email}
                disabled
                className="h-10 w-full rounded-xl border border-[#EEE5D8] bg-[#F8F5F1] px-3 text-[13px] text-[#AAA19A]"
              />
            </div>

            <div>
              <label className="mb-1.5 block pl-0.5 text-[10px] font-bold uppercase tracking-widest text-[#8F7C69]">
                Phone Number
              </label>
              <input
                value={draft.phone || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    phone: e.target.value,
                  })
                }
                placeholder="+91 98765 43210"
                className="h-10 w-full rounded-xl border border-[#EEE5D8] bg-[#FFFDF9] px-3 text-[13px] text-[#3A2F26] outline-none transition-colors placeholder:text-[#C4B5A0] focus:border-[#D8A15F]"
              />
            </div>

            <button
              type="button"
              className="mt-1 w-full rounded-xl bg-[#B5793A] py-3 text-[13px] font-semibold text-white shadow-[0_5px_14px_rgba(181,121,58,0.25)] transition-all hover:bg-[#A56C2F] active:scale-[0.98]"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("access_token");

                  if (!token) {
                    setToast("Please login again");
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
                      }),
                    }
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(
                      data.detail || "Failed to update profile"
                    );
                  }

                  // Save updated user returned by backend
                  localStorage.setItem(
                    "user",
                    JSON.stringify({
                      ...data.user,
                      avatar: selectedAvatar,
                    })
                  );

                  // Update More page immediately
                  setProfile({
                    ...draft,
                    name: data.user.full_name,
                    phone: data.user.phone || "",
                    avatar: selectedAvatar,
                  });

                  // Tell other pages/components that profile changed
                  window.dispatchEvent(new Event("profileUpdated"));

                  setToast("Profile updated successfully");
                  setSheet(null);

                } catch (error) {
                  console.error("Profile update error:", error);

                  setToast(
                    error.message || "Failed to update profile"
                  );
                }
              }}
            >
              ✓ &nbsp; Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* TOAST */}
      {toast && (
        <div className="mo-toast-in fixed bottom-7 left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#3A2F26] px-5 py-2.5 text-[13px] font-semibold text-[#FDF7EF] shadow-[0_8px_20px_rgba(58,47,38,0.3)]">
          {toast}
        </div>
      )}

      {sheet !== "profile" && (
        <BottomNav active="more" theme="amber" />
      )}
    </div>
  );
}