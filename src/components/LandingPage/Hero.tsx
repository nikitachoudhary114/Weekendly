import { Button } from "@/components/ui/button";
import { CalendarDays, Sparkles, Heart, Sun, Coffee, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { useThemeContext } from "@/context/ThemeProvider";
import { motion } from "framer-motion";

const Hero = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const bgLight = "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200";
  const textLight = "text-gray-800";
  const descLight = "text-gray-600";
  const borderLight = "border-gray-200";
  const outlineBtnLight =
    "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800";

  return (
    <section
      className={`relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden transition-colors pt-24 sm:pt-32 lg:pt-0 lg:pb-5 ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-800"
          : bgLight
      }`}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='24' height='24' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 24 0 L 0 0 0 24' fill='none' stroke='rgba(0,0,0,0.03)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start sm:items-center">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-2 mb-4 sm:mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles
                className={`w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 animate-pulse`}
              />
              <span className="font-medium tracking-wider uppercase text-xs sm:text-sm text-indigo-600">
                Weekend Magic Awaits
              </span>
            </motion.div>

            <motion.h1
              className={`text-3xl sm:text-4xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-snug sm:leading-tight ${
                isDark ? "text-white" : textLight
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Plan Your{" "}
              <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Perfect Weekend
              </span>
            </motion.h1>

            <motion.p
              className={`text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed max-w-md sm:max-w-2xl mx-auto lg:mx-0 transition-colors ${
                isDark ? "text-gray-300" : descLight
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Turn ordinary Saturdays and Sundays into extraordinary adventures.
              Choose activities, plan meals, set your mood, and let Weekendly
              craft your personalized weekend schedule.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link to="/activity">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="inline-flex items-center justify-center text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg transition">
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
                    Start Planning
                  </Button>
                </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="https://drive.google.com/file/d/18xU72XL3UohF0QzFEVGm1Fgs88mHw64A/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className={`inline-flex items-center justify-center text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl gap-2 transition ${
                      isDark
                        ? "border border-gray-600 text-gray-400 hover:bg-gray-800/60 hover:text-white"
                        : outlineBtnLight
                    }`}
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    See How It Works
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            {/* Feature badges */}
            <motion.div
              className={`mt-8 sm:mt-12 flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-8 transition-colors ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm">Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm">No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm">Instant Setup</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Interactive preview card */}
          <motion.div
            className="relative mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div
              className={`relative w-full aspect-[4/3] rounded-2xl shadow-2xl border overflow-hidden ${
                isDark
                  ? "border-gray-700 bg-gradient-to-br from-gray-900 via-indigo-950 to-violet-950"
                  : `border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 ${borderLight}`
              }`}
            >
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                    Saturday · Live
                  </span>
                  <span className="flex items-center gap-1 text-sm opacity-80">
                    <Sun className="w-4 h-4 text-amber-400" />
                    24°C
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Coffee, time: "9:00 AM", label: "Brunch & café", color: "from-orange-400/20 to-amber-400/20" },
                    { icon: Sun, time: "2:00 PM", label: "Park walk", color: "from-green-400/20 to-emerald-400/20" },
                    { icon: Music, time: "7:00 PM", label: "Live music", color: "from-violet-400/20 to-purple-400/20" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm ${
                        isDark
                          ? "border-gray-700 bg-gray-800/60"
                          : "border-gray-200 bg-white/80"
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.15 }}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
                      >
                        <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div>
                        <p className="text-xs opacity-60">{item.time}</p>
                        <p className="font-semibold text-sm">{item.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-center opacity-50">
                  Drag activities · Weather-aware picks
                </p>
              </div>
            </div>
            <motion.div
              className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full opacity-80 blur-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-6 -left-8 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full opacity-70 blur-lg"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>

      {/* Floating Accent Elements */}
      <motion.div
        className={`absolute top-20 left-12 w-6 h-6 rounded-full opacity-60 ${
          isDark ? "bg-indigo-400" : "bg-indigo-600/70"
        }`}
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        className={`absolute bottom-32 right-16 w-8 h-8 rounded-full opacity-40 ${
          isDark ? "bg-cyan-400" : "bg-cyan-500/60"
        }`}
        animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1,
        }}
      />
      <motion.div
        className={`absolute top-1/3 right-15 w-4 h-4 rounded-full opacity-50 ${
          isDark ? "bg-violet-400" : "bg-violet-500/60"
        }`}
        animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1.5,
        }}
      />
    </section>
  );
};

export default Hero;
