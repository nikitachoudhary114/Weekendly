import { Button } from "@/components/ui/button";
import { Calendar, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useThemeContext } from "@/context/ThemeProvider";

const Navbar = () => {
  const { theme, toggleTheme } = useThemeContext();

  const isDark = theme === "dark";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-colors mb-20 ${
        isDark
          ? "bg-gray-950/80 border-gray-800"
          : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-md">
              <Calendar
                className={`w-6 h-6 ${isDark ? "text-white" : "text-gray-900"}`}
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Weekendly
            </span>
          </Link>

          {/* Desktop Navigation */}
          

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={`hover:bg-gray-200 dark:hover:bg-gray-800 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
              onClick={toggleTheme}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Link to="/activity">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>

          
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
