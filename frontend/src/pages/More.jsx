import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
const styles = `
.mo-wrap{
    min-height:100vh;
    background:#f3f4f6;
    display:flex;
    justify-content:center;
    align-items:flex-start;
}
.mo-phone{
    width:100%;
    max-width:430px;
    min-height:100vh;
    background:#faf5ee;
    position:relative;
    padding:18px 14px 95px;
    .profile-arrow {
  margin-left: auto;
  border: none;
  background: transparent;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
}
.mo-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;}
.mo-top h1{margin:0;font-size:24px;font-weight:700;letter-spacing:-.4px;}
.mo-top p{margin:4px 0 0;font-size:13px;color:#9a8874;}
.mo-bell{position:relative;width:40px;height:40px;border-radius:50%;border:none;background:#f4e7d6;color:#b5793a;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.mo-bell .dot{position:absolute;top:7px;right:8px;width:8px;height:8px;border-radius:50%;background:#d05b4a;border:2px solid #f4e7d6;}
.mo-card{background:#fffdfa;border:1px solid #f0e4d4;border-radius:18px;box-shadow:0 1px 2px rgba(146,110,66,.06);overflow:hidden;}
.mo-profile{display:flex;align-items:center;gap:14px;padding:16px;width:100%;background:none;border:none;cursor:pointer;text-align:left;font:inherit;color:inherit;}
.mo-avatar{width:54px;height:54px;border-radius:50%;object-fit:cover;flex:none;border:2px solid #f2e2cd;}
.mo-profile h3{margin:0;font-size:15.5px;font-weight:700;}
.mo-profile span{display:block;font-size:12.5px;color:#b5793a;margin-top:2px;}
.mo-profile small{display:block;font-size:12px;color:#a89684;margin-top:2px;}
.mo-sec{font-size:13px;font-weight:700;margin:22px 0 8px 4px;}
.mo-quick{display:grid;grid-template-columns:repeat(4,1fr);padding:14px 6px;}
.mo-quick button{background:none;border:none;cursor:pointer;font:inherit;color:#5a4b3d;display:flex;flex-direction:column;align-items:center;gap:7px;font-size:11.5px;font-weight:600;padding:6px 2px;border-radius:12px;transition:background .2s;}
.mo-quick button:hover{background:#faf1e4;}
.mo-quick .ic{color:#b5793a;}
.mo-row{display:flex;align-items:center;gap:13px;padding:14px 16px;border-bottom:1px solid #f3ebe0;width:100%;background:none;border-left:none;border-right:none;border-top:none;cursor:pointer;font:inherit;color:inherit;text-align:left;transition:background .15s;}
.mo-row:last-child{border-bottom:none;}
.mo-row:hover{background:#fdf7ef;}
.mo-row .ic{color:#b5793a;flex:none;}
.mo-row .lbl{font-size:14px;font-weight:500;}
.mo-row .right{margin-left:auto;display:flex;align-items:center;gap:8px;color:#a89684;font-size:12.5px;}
.mo-pill{background:#f6e7d3;color:#b5793a;border-radius:999px;font-size:11px;font-weight:700;padding:2px 8px;}
.mo-switch{width:42px;height:24px;border-radius:999px;background:#e9dccb;border:none;position:relative;cursor:pointer;flex:none;transition:background .2s;}
.mo-switch.on{background:#bd7a2c;}
.mo-switch i{position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s;display:block;}
.mo-switch.on i{transform:translateX(18px);}
.mo-logout{margin-top:22px;width:100%;padding:14px;border-radius:14px;border:1px solid #f0d5cf;background:#fdf1ee;color:#c0503c;font-weight:700;font-size:14px;cursor:pointer;}
.mo-delete{
  margin-top:10px;
  width:100%;
  padding:14px;
  border-radius:14px;
  border:1px solid #f0c9c2;
  background:#fff8f6;
  color:#c0503c;
  font-weight:700;
  font-size:14px;
  cursor:pointer;
}

.mo-delete:active{
  transform:scale(.98);
}
.mo-ver{text-align:center;font-size:11.5px;color:#b0a191;margin-top:14px;}
.mo-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;

  background: rgba(45, 38, 31, 0.48);

  overflow: hidden;
}
.mo-sheet{
  background:transparent;
  width:100%;
  max-width:420px;
  max-height:calc(100vh - 32px);
  padding:0;
  overflow:hidden;
}
  .mo-sheet.profile-wrapper {
  max-height:calc(100vh - 32px);
  overflow:hidden;
  background:transparent;
  padding:0;
}
.mo-sheet h4{margin:0 0 4px;font-size:16px;font-weight:700;}
.mo-sheet p{margin:0 0 14px;font-size:13px;color:#9a8874;line-height:1.5;}
.mo-opt{display:flex;align-items:center;gap:10px;width:100%;padding:12px 14px;border-radius:12px;border:1px solid #f0e4d4;background:#fffdfa;font:inherit;color:inherit;cursor:pointer;margin-bottom:8px;font-size:13.5px;}
.mo-opt.sel{border-color:#bd7a2c;background:#fdf4e8;color:#8a6a45;font-weight:600;}
.mo-btn{width:100%;padding:13px;border-radius:12px;border:1px solid #ecdfcd;background:#fdf7ef;color:#8a6a45;font-weight:600;font-size:13.5px;cursor:pointer;margin-top:6px;}
.mo-btn.primary{background:#bd7a2c;border-color:#bd7a2c;color:#fff;}
.mo-input{width:100%;padding:11px 12px;border-radius:12px;border:1px solid #f0e4d4;background:#fffdfa;font:inherit;font-size:13.5px;color:#3a2f26;margin-bottom:10px;outline:none;}
.mo-input:focus{border-color:#d8a15f;}
.mo-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#3a2f26;color:#fdf7ef;padding:11px 18px;border-radius:999px;font-size:13px;font-weight:600;z-index:60;box-shadow:0 8px 20px rgba(58,47,38,.3);}
/* PROFILE EDIT POPUP */
.profile-modal {
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: hidden;
}
.profile-sheet {
  width: 100%;
  max-width: 430px;

  max-height: calc(100vh - 32px);

  background: #fffdfa;
  border-radius: 28px;

  padding: 20px 16px 18px;

  box-shadow:
    0 20px 60px rgba(55, 40, 25, 0.25);

  overflow-y: auto;
  overflow-x: hidden;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.profile-sheet::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.profile-back {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #f0e4d4;
  background: #fff8ef;
  color: #5a4b3d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.profile-title h4 {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
}

.profile-title p {
  margin: 3px 0 0;
  font-size: 12px;
  color: #9a8874;
}

.profile-photo-card {
  border: 1px solid #f0e4d4;
  border-radius: 18px;
  padding: 16px 10px 12px;
  background: #fffdfa;
}

.profile-photo-title {
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 12px;
  color: #2f2924;
}

.profile-image-wrap {
  position: relative;
  width: 104px;
  height: 104px;
  margin: 0 auto 16px;
}

.profile-main-image {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f5dcbf;
  background: #fff;
}

.profile-camera {
  position: absolute;
  right: -2px;
  bottom: -1px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid white;
  background: #fff4e5;
  color: #bd7a2c;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(90, 65, 40, .12);
}

.avatar-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid #f0e4d4;
  border-radius: 12px;
  overflow: hidden;
}

.avatar-option {
  border: none;
  border-right: 1px solid #f4eadf;
  background: #fffdfa;
  padding: 9px 4px;
  min-height: 62px;
  cursor: pointer;
  color: #5a4b3d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
}

.avatar-option:last-child {
  border-right: none;
}

.avatar-option.selected {
  background: #fff1df;
  color: #8d5d22;
}

.avatar-option .avatar-icon {
  font-size: 23px;
  line-height: 1;
}

.profile-fields {
  margin-top: 14px;
}

.profile-field {
  margin-bottom: 10px;
}

.profile-field label {
  display: block;
  margin: 0 0 5px;
  padding-left: 2px;
  font-size: 11px;
  color: #8f7c69;
}

.profile-field input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #f0e4d4;
  background: #fffdfa;
  color: #3a2f26;
  font: inherit;
  font-size: 13px;
  outline: none;
}

.profile-field input:focus {
  border-color: #d8a15f;
}

.profile-field input:disabled {
  background: #f8f5f1;
  color: #aaa19a;
}

.profile-save {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: #bd7a2c;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 2px;
  box-shadow: 0 5px 12px rgba(189, 122, 44, .18);
}

.profile-save:active {
  transform: scale(.98);
}
`;

function Icon({ d, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}

const I = {
  bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  calPlus: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" /></>,
  userPlus: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></>,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
  check: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  team: <><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" /><circle cx="18" cy="9" r="3" /></>,
  paint: <><circle cx="12" cy="12" r="9" /><circle cx="8.5" cy="10" r="1" /><circle cx="12" cy="7.5" r="1" /><circle cx="15.5" cy="10" r="1" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" /></>,
  cloud: <><path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.2 10.5A4 4 0 0 0 7 19h10.5Z" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3 2.5V13" /><path d="M12 17h.01" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
};

const Chevron = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c2b1a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";

const BOY_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80";

const GIRL_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80";

const MANAGEMENT = [
  { id: "clients", label: "Clients", icon: I.users, count: 24 },
  { id: "events", label: "Events", icon: I.cal, count: 8 },
  { id: "payments", label: "Payments", icon: I.card, count: 3 },
  { id: "tasks", label: "Tasks", icon: I.check, count: 12 },
  { id: "team", label: "Team", icon: I.team, count: 5 },
];

const THEMES = ["System", "Light", "Dark"];
const LANGUAGES = ["English", "हिन्दी", "Español", "Français", "Deutsch"];

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
const [uploading, setUploading] = useState(false);
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

  const Row = ({ icon, label, right, onClick }) => (
    <button className="mo-row" onClick={onClick}>
      <span className="ic"><Icon d={icon} /></span>
      <span className="lbl">{label}</span>
      <span className="right">{right}<Chevron /></span>
    </button>
  );

  return (
    <div className="mo-wrap">
      <style>{styles}</style>
      <div className="mo-phone">
        <div className="mo-top">
          <div>
            <h1>More</h1>
            <p>Manage your account and app settings.</p>
          </div>
          <button className="mo-bell" aria-label="Notifications" onClick={() => setSheet("notifications")}>
            <Icon d={I.bell} />
            <span className="dot" />
          </button>
        </div>

        <div className="mo-card">
  <div className="mo-profile">
    <img
      className="mo-avatar"
      src={profile.avatar}
      alt="Profile photo"
    />

    <div>
      <h3>{profile.name}</h3>
      <span>{profile.role}</span>
      <small>{profile.email}</small>
    </div>

    <button
      type="button"
      className="profile-arrow"
      onClick={() => {
        setDraft(profile);
        setSelectedAvatar(profile.avatar || AVATAR);
        setSheet("profile");
      }}
      aria-label="Edit profile"
    >
      <Chevron />
    </button>
  </div>
</div>

        <h2 className="mo-sec">Quick Actions</h2>

<div className="mo-card mo-quick">

  {/* Add Event */}
  <button
    type="button"
    onClick={() => navigate("/add-event")}
  >
    <span className="ic">
      <Icon d={I.calPlus} size={22} />
    </span>
    Add Event
  </button>

  {/* Add Client */}
  <button
    type="button"
    onClick={() => navigate("/clients")}
  >
    <span className="ic">
      <Icon d={I.userPlus} size={22} />
    </span>
    Add Client
  </button>

  {/* Calendar */}
  <button
    type="button"
    onClick={() => navigate("/calendar")}
  >
    <span className="ic">
      <Icon d={I.cal} size={22} />
    </span>
    Calendar
  </button>

  {/* Reminders */}
  <button
    type="button"
    onClick={() => navigate("/reminders")}
  >
    <span className="ic">
      <Icon d={I.bell} size={22} />
    </span>
    Reminders
  </button>

</div>

        <h2 className="mo-sec">Management</h2>
        <div className="mo-card">
          {MANAGEMENT.map((m) => (
            <Row key={m.id} icon={m.icon} label={m.label}
              right={<span className="mo-pill">{m.count}</span>}
              onClick={() => notify(`${m.label}: ${m.count} items`)} />
          ))}
        </div>

        <h2 className="mo-sec">Preferences</h2>
        <div className="mo-card">
          <Row icon={I.bell} label="Notifications"
            right={Object.values(notifs).filter(Boolean).length + " on"}
            onClick={() => setSheet("notifications")} />
          <Row icon={I.paint} label="Appearance" right={theme} onClick={() => setSheet("theme")} />
          <Row icon={I.globe} label="Language" right={language} onClick={() => setSheet("language")} />
          <div className="mo-row" style={{ cursor: "default" }}>
            <span className="ic"><Icon d={I.cloud} /></span>
            <span className="lbl">Backup &amp; Sync</span>
            <span className="right" style={{ gap: 10 }}>
              {backup ? "On" : "Off"}
              <button className={`mo-switch${backup ? " on" : ""}`} aria-label="Toggle backup and sync"
                onClick={() => { setBackup((b) => !b); setToast(`Backup ${backup ? "disabled" : "enabled"}`); }}>
                <i />
              </button>
            </span>
          </div>
        </div>

        <h2 className="mo-sec">Support</h2>
        <div className="mo-card">
          <Row icon={I.help} label="Help & FAQ" onClick={() => setSheet("help")} />
          <Row icon={I.mail} label="Contact Support" onClick={() => setSheet("contact")} />
          <Row icon={I.info} label="About App" onClick={() => setSheet("about")} />
        </div>

        <button className="mo-logout" onClick={() => setSheet("logout")}>Log Out</button>
        <button
  className="mo-delete"
  onClick={() => setSheet("delete-account")}
>
  Delete Account
</button>
        <div className="mo-ver">Version 1.0.0</div>
      </div>

      {sheet && (
        <div
  className={`mo-modal ${
    sheet === "profile" ? "profile-modal" : ""
  }`}
  onClick={close}
>
          <div className="mo-sheet" onClick={(e) => e.stopPropagation()}>
            {sheet === "profile" && (
  <div className="profile-sheet">

    {/* Header */}
    <div className="profile-header">

      <button
        type="button"
        className="profile-back"
        onClick={close}
        aria-label="Back"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="profile-title">
        <h4>Edit Profile</h4>
        <p>Update the details shown across the app.</p>
      </div>

    </div>


    {/* Profile Photo */}
    <div className="profile-photo-card">

      <p className="profile-photo-title">
        Profile Photo
      </p>

      <div className="profile-image-wrap">

        <img
          src={selectedAvatar}
          alt="Profile"
          className="profile-main-image"
        />

        {/* Camera button */}
        <label className="profile-camera">

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

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7h4l2-2h4l2 2h4v12H4z" />
            <circle cx="12" cy="13" r="3" />
          </svg>

        </label>

      </div>


      {/* Avatar choices */}
      <div className="avatar-options">

        {/* Upload */}
        <label
          className={`avatar-option ${
            selectedAvatar === "upload" ? "selected" : ""
          }`}
        >

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

          <span className="avatar-icon">📷</span>
          <span>Upload</span>

        </label>


        {/* Boy */}
        <button
          type="button"
          className={`avatar-option ${
            selectedAvatar === BOY_AVATAR ? "selected" : ""
          }`}
          onClick={() => {
            setSelectedAvatar(BOY_AVATAR);
            setDraft({
              ...draft,
              avatar: BOY_AVATAR,
            });
          }}
        >
          <span className="avatar-icon">👨🏻</span>
          <span>Boy</span>
        </button>


        {/* Girl */}
        <button
          type="button"
          className={`avatar-option ${
            selectedAvatar === GIRL_AVATAR ? "selected" : ""
          }`}
          onClick={() => {
            setSelectedAvatar(GIRL_AVATAR);
            setDraft({
              ...draft,
              avatar: GIRL_AVATAR,
            });
          }}
        >
          <span className="avatar-icon">👩🏻</span>
          <span>Girl</span>
        </button>


        {/* Default */}
        <button
          type="button"
          className={`avatar-option ${
            selectedAvatar === AVATAR ? "selected" : ""
          }`}
          onClick={() => {
            setSelectedAvatar(AVATAR);
            setDraft({
              ...draft,
              avatar: AVATAR,
            });
          }}
        >
          <span className="avatar-icon">👤</span>
          <span>Default</span>
        </button>

      </div>

    </div>


    {/* Profile fields */}
    <div className="profile-fields">

      {/* Full Name */}
      <div className="profile-field">
        <label>Full Name</label>

        <input
          value={draft.name}
          onChange={(e) =>
            setDraft({
              ...draft,
              name: e.target.value,
            })
          }
        />
      </div>


      {/* Role */}
      <div className="profile-field">
        <label>Role / Designation</label>

        <input
          value={draft.role}
          onChange={(e) =>
            setDraft({
              ...draft,
              role: e.target.value,
            })
          }
        />
      </div>


      {/* Email */}
      <div className="profile-field">
        <label>Email</label>

        <input
          value={draft.email}
          disabled
        />
      </div>


      {/* Phone */}
      <div className="profile-field">
        <label>Phone Number</label>

        <input
          value={draft.phone || ""}
          onChange={(e) =>
            setDraft({
              ...draft,
              phone: e.target.value,
            })
          }
          placeholder="+91 98765 43210"
        />
      </div>


      {/* Save */}
      <button
        type="button"
        className="profile-save"
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
)}

            {sheet === "notifications" && (
              <>
                <h4>Notifications</h4>
                <p>Choose what you want to be alerted about.</p>
                {[["push", "Push notifications"], ["email", "Email updates"], ["reminders", "Event reminders"]].map(([k, label]) => (
                  <div key={k} className="mo-opt" style={{ justifyContent: "space-between" }}>
                    <span>{label}</span>
                    <button className={`mo-switch${notifs[k] ? " on" : ""}`} aria-label={`Toggle ${label}`}
                      onClick={() => setNotifs((n) => ({ ...n, [k]: !n[k] }))}><i /></button>
                  </div>
                ))}
                <button className="mo-btn primary" onClick={() => notify("Notification settings saved")}>Done</button>
              </>
            )}

            {sheet === "theme" && (
              <>
                <h4>Appearance</h4>
                <p>Pick how the app should look.</p>
                {THEMES.map((t) => (
                  <button key={t} className={`mo-opt${theme === t ? " sel" : ""}`} onClick={() => setTheme(t)}>{t}</button>
                ))}
                <button className="mo-btn primary" onClick={() => notify(`Appearance set to ${theme}`)}>Apply</button>
              </>
            )}

            {sheet === "language" && (
              <>
                <h4>Language</h4>
                <p>Select your preferred language.</p>
                {LANGUAGES.map((l) => (
                  <button key={l} className={`mo-opt${language === l ? " sel" : ""}`} onClick={() => setLanguage(l)}>{l}</button>
                ))}
                <button className="mo-btn primary" onClick={() => notify(`Language set to ${language}`)}>Apply</button>
              </>
            )}

            {sheet === "help" && (
              <>
                <h4>Help &amp; FAQ</h4>
                <p>Quick answers to common questions.</p>
                {[
                  ["How do I create an event?", "Go to Quick Actions and tap Add Event, then slide to save."],
                  ["Can I invite my team?", "Open Management → Team and add members by email."],
                  ["Where is my data stored?", "Locally on this device, synced when Backup & Sync is on."],
                ].map(([q, a]) => (
                  <div key={q} className="mo-opt" style={{ display: "block" }}>
                    <strong style={{ display: "block", marginBottom: 4 }}>{q}</strong>
                    <span style={{ color: "#9a8874" }}>{a}</span>
                  </div>
                ))}
                <button className="mo-btn primary" onClick={close}>Close</button>
              </>
            )}

            {sheet === "contact" && (
              <>
                <h4>Contact Support</h4>
                <p>Tell us what went wrong and we&apos;ll get back to you.</p>
                <textarea className="mo-input" rows={4} value={support} placeholder="Describe your issue…" onChange={(e) => setSupport(e.target.value)} />
                <button className="mo-btn primary" disabled={!support.trim()}
                  onClick={() => { setSupport(""); notify("Message sent to support"); }}>Send message</button>
                <button className="mo-btn" onClick={close}>Cancel</button>
              </>
            )}

            {sheet === "about" && (
              <>
                <h4>About App</h4>
                <p>Event Manager helps you plan events, track clients, payments and tasks in one calm workspace.</p>
                <div className="mo-opt" style={{ justifyContent: "space-between" }}><span>Version</span><span>1.0.0</span></div>
                <div className="mo-opt" style={{ justifyContent: "space-between" }}><span>Build</span><span>2026.08</span></div>
                <button className="mo-btn primary" onClick={close}>Close</button>
              </>
            )}

            {sheet === "logout" && (
  <>
    <h4>Log out?</h4>

    <p>
      You&apos;ll need to sign in again to access your events.
    </p>

    <button
      className="mo-btn primary"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setSheet(null);

        navigate("/login");
      }}
    >
      Yes, log out
    </button>

    <button
      className="mo-btn"
      onClick={close}
    >
      Stay signed in
    </button>
  </>
)}
            {sheet === "delete-account" && (
  <>
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#fff0ed",
        color: "#c0503c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 16px",
        fontSize: 28,
      }}
    >
      ⚠️
    </div>

    <h4 style={{ textAlign: "center" }}>
      Delete Account?
    </h4>

    <p style={{ textAlign: "center" }}>
      This will permanently delete your account and all your
      data. This action cannot be undone.
    </p>

    <button
      className="mo-btn"
      style={{
        background: "#c0503c",
        borderColor: "#c0503c",
        color: "#fff",
      }}
      onClick={handleDeleteAccount}
    >
      Delete Permanently
    </button>

    <button
      className="mo-btn"
      onClick={close}
    >
      Cancel
    </button>
  </>
)}
          </div>
        </div>
      )}

      {toast && <div className="mo-toast">{toast}</div>}
      {sheet !== "profile" && (
  <BottomNav active="more" theme="amber" />
)}
    </div>
  );
}
