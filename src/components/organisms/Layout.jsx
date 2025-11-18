import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import MobileNav from "@/components/organisms/MobileNav";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuToggle={handleMobileMenuToggle} />
      <MobileNav 
        isOpen={mobileMenuOpen} 
        onClose={handleMobileMenuClose}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;