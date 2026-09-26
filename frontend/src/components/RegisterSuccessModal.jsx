import { motion, AnimatePresence } from "framer-motion";

export default function RegisterSuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl"
        >
          {/* Animated Check */}
          <div className="mx-auto flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 12,
                delay: 0.2,
              }}
              className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#FFF7E7] to-[#FDE8BF] flex items-center justify-center shadow-lg"
            >
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#E7B56A]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [1, 1.35],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />

              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#C98A3A]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [1, 1.6],
                  opacity: [0.4, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: 0.4,
                }}
              />

              <motion.svg
                width="54"
                height="54"
                viewBox="0 0 52 52"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 250,
                }}
              >
                <motion.circle
                  cx="26"
                  cy="26"
                  r="23"
                  fill="#C98A3A"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                />

                <motion.path
                  d="M16 27 L23 34 L37 19"
                  fill="transparent"
                  stroke="#fff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    delay: 0.6,
                    duration: 0.5,
                  }}
                />
              </motion.svg>
            </motion.div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-3xl font-bold text-[#C8872F]"
          >
            Registration Successful!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-3 text-gray-500"
          >
            Congratulations! Your account has been created successfully.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClose}
            className="mt-8 w-full h-14 rounded-2xl bg-gradient-to-r from-[#C8872F] to-[#B66A18] text-white font-semibold text-lg"
          >
            Let's Get Started
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}