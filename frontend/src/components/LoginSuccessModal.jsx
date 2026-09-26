import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export default function LoginSuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] bg-black/35 backdrop-blur-sm flex items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.75, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.75, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
          }}
          className="relative bg-white rounded-[30px] p-8 w-full max-w-sm text-center shadow-2xl overflow-hidden"
        >
          {/* Floating Particles */}

          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-green-300"
              style={{
                left: `${15 + i * 8}%`,
                top: `${15 + (i % 2) * 8}%`,
              }}
              animate={{
                y: [-5, 5, -5],
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}

          {/* Success Circle */}

          <div className="relative flex justify-center -mt-5 mb-12">
            {/* Outer Glow */}

           <motion.div
  className="absolute -top-5 w-36 h-36 rounded-full bg-green-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.6,
              }}
            />

            {/* Ripple */}

            <motion.div
  className="absolute -top-2 w-28 h-28 rounded-full border-4 border-green-300"
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            />

            {/* Check Circle */}

            <motion.div
              className="relative w-24 h-24 rounded-full bg-green-50 border-[4px] border-green-600 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 300,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.6,
                  type: "spring",
                }}
              >
                <Check
                  size={42}
                  strokeWidth={3.5}
                  className="text-green-600"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Title */}

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-3xl font-bold text-green-700"
          >
            Login Successful!
          </motion.h2>

          {/* Subtitle */}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-gray-500 mt-4 leading-7"
          >
             You have successfully
            <br />
            logged in to your account.
          </motion.p>

          {/* Continue Button */}

          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.96,
            }}
            onClick={onClose}
            className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold text-lg shadow-lg"
          >
            Continue
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}