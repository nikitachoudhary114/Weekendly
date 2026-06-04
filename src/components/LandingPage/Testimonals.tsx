import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useThemeContext } from "@/context/ThemeProvider";

const Testimonials = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Manager",
      content:
        "Weekendly transformed how I plan my free time. No more wasted Saturdays wondering what to do - every weekend feels like a mini vacation now!",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Mike Rodriguez",
      role: "Software Developer",
      content:
        "The mood matching feature is incredible. Whether I want adventure or relaxation, Weekendly knows exactly what to suggest. My weekends have never been better.",
      rating: 5,
      avatar: "MR",
    },
    {
      name: "Emma Thompson",
      role: "Teacher",
      content:
        "Planning date nights and friend hangouts used to be so stressful. Now my boyfriend and I just use Weekendly and everything falls into place perfectly.",
      rating: 5,
      avatar: "ET",
    },
  ];

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  const [happyPlanners, setHappyPlanners] = useState(0);
  const [weekendsPlanned, setWeekendsPlanned] = useState(0);
  const [appRating, setAppRating] = useState(0);

  useEffect(() => {
    if (statsInView) {
      animate(0, 10000, {
        duration: 2,
        onUpdate: (v) => setHappyPlanners(Math.round(v)),
      });
      animate(0, 500000, {
        duration: 2.5,
        onUpdate: (v) => setWeekendsPlanned(Math.round(v)),
      });
      animate(0, 49, {
        duration: 2,
        onUpdate: (v) => setAppRating(Math.round(v)),
      });
    }
  }, [statsInView]);

  const sectionBg = isDark
    ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
    : "bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50";
  const cardBg = isDark
    ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 shadow-md"
    : "bg-white border border-gray-200 shadow-sm";
  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
 

  return (
    <section
      id="reviews"
      className={`py-20 md:py-24 relative overflow-hidden transition-colors ${sectionBg}`}
    >
      {/* Background Glow Accents */}
      <div className="absolute inset-0 -z-10">
        <div
          className={`absolute top-1/3 left-1/4 w-64 md:w-72 h-64 md:h-72 blur-3xl rounded-full transition-colors ${
            isDark ? "bg-violet-500/20" : "bg-violet-200/40"
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-64 md:w-72 h-64 md:h-72 blur-3xl rounded-full transition-colors ${
            isDark ? "bg-indigo-500/20" : "bg-indigo-200/40"
          }`}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            Weekend Warriors Love Us
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto transition-colors ${textSecondary}`}
          >
            Join thousands who've discovered the joy of perfectly planned
            weekends
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12 md:mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <Card
                className={`p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-105 ${cardBg} hover:shadow-xl`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <Quote
                  className={`w-7 h-7 sm:w-8 sm:h-8 mb-4 transition-colors ${
                    isDark ? "text-violet-400/40" : "text-violet-300/50"
                  }`}
                />

                <p
                  className={`leading-relaxed mb-6 text-sm sm:text-base transition-colors ${textSecondary}`}
                >
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-md text-sm sm:text-base"
                    style={{
                      backgroundImage: isDark
                        ? "linear-gradient(to bottom right, #8b5cf6, #6366f1)"
                        : "linear-gradient(to bottom right, #d8b4fe, #a5b4fc)",
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div
                      className={`font-semibold transition-colors ${textPrimary}`}
                    >
                      {testimonial.name}
                    </div>
                    <div
                      className={`text-sm transition-colors ${textSecondary}`}
                    >
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Block */}
        <div
          ref={statsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8"
        >
          {[
            {
              value: happyPlanners.toLocaleString(),
              label: "Happy Planners",
              color: "text-violet-400",
            },
            {
              value: weekendsPlanned.toLocaleString(),
              label: "Weekends Planned",
              color: "text-indigo-400",
            },
            {
              value: `${(appRating / 10).toFixed(1)}★`,
              label: "App Store Rating",
              color: "text-fuchsia-400",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border transition-colors ${
                isDark
                  ? "border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg hover:shadow-violet-500/20"
                  : "border-gray-200 bg-white shadow-sm hover:shadow-gray-300/20"
              }`}
            >
              <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div
                className={`text-sm sm:text-base mt-1 transition-colors ${textSecondary}`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
