import React, { useState, useEffect } from "react";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

import SearchBar from "./SearchBar";
import GradientText from "../../ReactBitsComponent/GradientText";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/orderHistory", label: "Order History"},
    { to: "/setting", label:"Setting"}
  ];

  const NavItems = ({ onClick }) => (
    <nav className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const UserActions = () => (
    <div className="flex items-center space-x-6">
      <SearchBar />
      <Link
        to="/auth/login"
        aria-label="Account"
        className="text-foreground hover:text-primary transition-colors"
      >
        <User size={20} />
      </Link>
      <Link
        to="/cart"
        aria-label="Cart"
        className="text-foreground hover:text-primary transition-colors relative"
      >
        <ShoppingCart size={20} />
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          3
        </span>
      </Link>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "py-3 bg-white/90 blur-backdrop shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link to="/">
            <GradientText
              colors={["#50bbf5", "#5069f5", "#50bbf5", "#5069f5", "#50bbf5"]}
              className="text-2xl"
              animationSpeed={3}
              showBorder={false}
            >
              nextgentech
            </GradientText>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavItems />
          </div>

          <div className="hidden md:flex">
            <UserActions />
          </div>

          <button
            className="md:hidden cursor-pointer text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-[57px] right-0 h-screen w-[300px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 space-y-6">
          <NavItems onClick={() => setIsMenuOpen(false)} />
          <div className="border-t border-gray-100 pt-4">
            <UserActions />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
