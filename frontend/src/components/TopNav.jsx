import { useNavigate } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import { motion } from "framer-motion";

function TopNav({
  title = "Dashboard",
  onMenuClick,
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between"
    >
      {/* Menu */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onMenuClick}
        className="-ml-2 w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center"
      >
        <Menu className="w-6 h-6 text-white" />
      </motion.button>

      {/* Title */}
      <h1 className="text-white text-2xl font-bold">
        {title}
      </h1>

      {/* Notification */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/reminders")}
        className="-mr-2 w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center"
      >
        <Bell className="w-6 h-6 text-white" />
      </motion.button>
    </motion.div>
  );
}

export default TopNav;