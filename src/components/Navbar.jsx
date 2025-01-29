import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Update as UpdateIcon,
  Add as AddIcon,
  ShoppingCart as SalesIcon,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: DashboardIcon },
    { path: "/inventory", label: "Inventory", icon: InventoryIcon },
    { path: "/update-stock", label: "Update Stock", icon: UpdateIcon },
    { path: "/add-product", label: "Add Product", icon: AddIcon },
    { path: "/sales", label: "Sales", icon: SalesIcon },
  ];

  const IpadnavItems = [
    { path: "/", label: "Dashboard", icon: DashboardIcon },
    { path: "/inventory", label: "Inventory", icon: InventoryIcon },
    { path: "/update-stock", label: "Update Stock", icon: UpdateIcon },
    { path: "/add-product", label: "Add Product", icon: AddIcon },
    { path: "/sales", label: "Sales", icon: SalesIcon },
  ];

  const MobilenavItems = [
    { path: "/", label: "Dashboard", icon: DashboardIcon },
    { path: "/inventory", label: "Inventory", icon: InventoryIcon },
    { path: "/update-stock", label: "Update Stock", icon: UpdateIcon },
    { path: "/sales", label: "Sales", icon: SalesIcon },
  ];

  const isIpadScreen = useMediaQuery(
    "(min-width: 768px) and (max-width: 1024px)"
  );

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Desktop Navigation
  const DesktopNav = () => (
    <nav className="block  lg:hidden fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 shadow-xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold">Stock Manager</h1>
          <p className="text-sm text-blue-200">Inventory System</p>
        </div>
        <div className="bg-white/10 rounded-full p-1">
          <UserButton />
        </div>
      </div>

      <ul className="space-y-3">
        {navItems.map(({ path, label, icon: Icon }) => (
          <motion.li
            key={path}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleNavigation(path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive(path)
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-blue-100 hover:bg-white/10"
                }`}
            >
              <Icon
                className={`text-2xl ${isActive(path) ? "text-white" : "text-blue-200"
                  }`}
              />
              <span className="font-medium">{label}</span>
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  );

  // Mobile Navigation
  const MobileNav = () => (
    <>
      {/* Top Bar */}
      <div className="hidden   fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 lg:flex justify-between items-center z-50">
        <h1 className="text-lg font-bold text-gray-800">Stock Manager</h1>

        <UserButton />
      </div>

      {/* Mobile Menu Overlay */}
      {/* <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Menu</h2>
                  <p className="text-sm text-blue-200">Inventory System</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  <CloseIcon />
                </button>
              </div>
              <ul className="space-y-3">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <motion.li
                    key={path}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => handleNavigation(path)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive(path)
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-blue-100 hover:bg-white/10"
                        }`}
                    >
                      <Icon
                        className={`text-2xl ${isActive(path) ? "text-white" : "text-blue-200"
                          }`}
                      />
                      <span className="font-medium">{label}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Bottom Navigation Bar */}

      <div className="hidden sm:block fixed bottom-28 right-5 bg-blue-600    shadow-lg z-50 rounded-full">
        <button
          onClick={() => handleNavigation("/add-product")}
          className={`flex items-center justify-center w-12 h-12 rounded-full ${isActive("/add-product")
              ? "text-blue-600 bg-gray-50  "
              : "text-gray-50 bg-blue-600"
            }`}
        >
          <AddIcon />
        </button>
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      >
        <div className="flex justify-around items-center px-2 py-1">
          {isMobileMenuOpen
            ? MobilenavItems.map(({ path, label, icon: Icon }) => (
              <motion.button
                key={path}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigation(path)}
                className={`flex flex-col items-center py-2 px-4 rounded-lg ${isActive(path)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon
                  className={`text-2xl ${isActive(path) ? "text-blue-600" : "text-gray-400"
                    }`}
                />
                <span className="text-xs mt-1 font-medium">{label}</span>
              </motion.button>
            ))
            : isIpadScreen
              ? IpadnavItems.map(({ path, label, icon: Icon }) => (
                <motion.button
                  key={path}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNavigation(path)}
                  className={`flex flex-col items-center py-2 px-4 rounded-lg ${isActive(path)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Icon
                    className={`text-2xl ${isActive(path) ? "text-blue-600" : "text-gray-400"
                      }`}
                  />
                  <span className="text-xs mt-1 font-medium">{label}</span>
                </motion.button>
              ))
              : MobilenavItems.map(({ path, label, icon: Icon }) => (
                <motion.button
                  key={path}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNavigation(path)}
                  className={`flex flex-col items-center py-2 px-4 rounded-lg ${isActive(path)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Icon
                    className={`text-2xl ${isActive(path) ? "text-blue-600" : "text-gray-400"
                      }`}
                  />
                  <span className="text-xs mt-1 font-medium">{label}</span>
                </motion.button>
              ))}
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}

export default Navbar;
