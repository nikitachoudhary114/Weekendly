import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  UtensilsCrossed,
  Smile,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useThemeContext } from "@/context/ThemeProvider";

const Features = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Drag, drop, and arrange your weekend activities with our intuitive calendar interface.",
      gradient: "from-violet-500/30 to-indigo-500/30",
    },
    {
      icon: UtensilsCrossed,
      title: "Meal Planning",
      description:
        "Discover restaurants, plan home cooking, or find the perfect brunch spots for your weekend.",
      gradient: "from-purple-500/30 to-fuchsia-500/30",
    },
    {
      icon: Smile,
      title: "Mood Matching",
      description:
        "Choose your weekend vibe - adventurous, relaxing, social, or romantic - and get personalized suggestions.",
      gradient: "from-indigo-500/30 to-violet-500/30",
    },
    {
      icon: Clock,
      title: "Time Optimization",
      description:
        "Smart algorithms ensure you have enough time for everything while avoiding rushed schedules.",
      gradient: "from-violet-500/30 to-fuchsia-500/30",
    },
    {
      icon: Users,
      title: "Social Coordination",
      description:
        "Invite friends, coordinate group activities, and share your weekend plans seamlessly.",
      gradient: "from-indigo-500/30 to-violet-500/30",
    },
    {
      icon: Zap,
      title: "Instant Updates",
      description:
        "Real-time weather, traffic, and venue updates keep your plans flexible and stress-free.",
      gradient: "from-violet-500/30 to-indigo-500/30",
    },
  ];

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Light theme classes
  const bgLight = "bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50";
  const cardBgLight = "bg-white border border-gray-200";
  const titleLight = "text-gray-800";
  const descLight = "text-gray-600";
  const hoverShadowLight = "hover:shadow-lg hover:shadow-gray-300/20";
  const buttonLight =
    "bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-400 text-white hover:shadow-lg hover:shadow-gray-300/30";

  return (
    <section
      id="features"
      className={`py-24 relative overflow-hidden transition-colors ${
        isDark
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
          : bgLight
      }`}
    >
      <div className="absolute inset-0 -z-10">
        <div
          className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl transition-colors ${
            isDark ? "bg-violet-500/20" : "bg-violet-200/40"
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl transition-colors ${
            isDark ? "bg-indigo-500/20" : "bg-indigo-200/40"
          }`}
        />
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <motion.h2
            className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent"
            variants={item}
          >
            Weekend Planning Made Simple
          </motion.h2>
          <motion.p
            className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors ${
              isDark ? "text-gray-400" : descLight
            }`}
            variants={item}
          >
            Every feature is designed to turn your weekend planning from a chore
            into an exciting preview of the amazing time ahead.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card
                className={`p-8 rounded-2xl transition-all duration-300 group flex flex-col justify-between h-full ${
                  isDark
                    ? "border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 hover:shadow-xl hover:shadow-violet-500/20"
                    : `${cardBgLight} ${hoverShadowLight}`
                } hover:scale-105`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-gradient-to-br ${feature.gradient}`}
                >
                  <feature.icon
                    className={`w-8 h-8 drop-shadow-md transition-colors ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <h3
                    className={`text-xl font-semibold mb-4 transition-colors ${
                      isDark ? "text-white" : titleLight
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`leading-relaxed transition-colors ${
                      isDark ? "text-gray-400" : descLight
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className={`text-lg px-8 py-6 font-semibold rounded-xl transition-all ${
              isDark
                ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/40 hover:scale-105"
                : buttonLight
            }`}
          >
            Explore All Features
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
