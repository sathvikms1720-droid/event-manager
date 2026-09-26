import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Calendar, Plus, Users, MoreHorizontal } from "lucide-react";

const themes = {
  amber: {
    active: "text-[#B4650E]",
    inactive: "text-[#8A8178]",
    bg: "bg-[#FBF3E9]",
    fabBg: "bg-[#FBEEDF]",
    fabRing: "ring-white",
  },
};

function NavItem({ name, label, Icon, active, colors, onClick, filled }) {
  const isActive = active === name;
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 flex-1 ${
        isActive ? colors.active : colors.inactive
      }`}
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Icon
          className="w-4 h-4"
          strokeWidth={2}
          fill={isActive && filled ? "currentColor" : "none"}
        />
      </motion.div>
      <span className="text-[10px] font-medium leading-none">{label}</span>
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="w-4 h-[3px] rounded-full bg-current mt-0.5"
        />
      )}
    </motion.button>
  );
}

export function BottomNav({ active = "dashboard", theme = "amber" }) {
  const colors = themes[theme] || themes.amber;
  const navigate = useNavigate();

  return (
  <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-3 pb-0 z-50">
      <div
  className={`relative flex items-center h-[78px] rounded-[30px] ${colors.bg} shadow-[0_8px_24px_rgba(0,0,0,0.08)] px-2`}
>
        <NavItem
          name="dashboard"
          label="Dashboard"
          Icon={Home}
          filled
          active={active}
          colors={colors}
          onClick={() => navigate("/dashboard")}
        />
        <NavItem
          name="calendar"
          label="Calendar"
          Icon={Calendar}
          active={active}
          colors={colors}
          onClick={() => navigate("/calendar")}
        />

        {/* Spacer so the FAB doesn't overlap nav items */}
        <div className="w-24 shrink-0" />

        <NavItem
          name="clients"
          label="Clients"
          Icon={Users}
          active={active}
          colors={colors}
          onClick={() => navigate("/clients")}
        />
        <NavItem
          name="more"
          label="More"
          Icon={MoreHorizontal}
          active={active}
          colors={colors}
          onClick={() => navigate("/more")}
        />

        {/* Floating add button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/add-event")}
          className={`absolute left-1/2 -translate-x-1/2 -top-7 w-[68px] h-[68px] rounded-full
          ${colors.fabBg} ring-[6px] ${colors.fabRing}
          flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.1)]`}
        >
          <Plus className="w-7 h-7 text-[#B4650E]" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}

export default BottomNav;