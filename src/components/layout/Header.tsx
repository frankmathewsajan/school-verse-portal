import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
};

type ScrollLinkProps = {
  to: string;
  targetId?: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
};

const NavLink = ({ to, children, mobile = false, onClick }: NavLinkProps) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={cn(
      "text-foreground/80 font-medium hover:text-foreground transition-colors",
      mobile ? "w-full px-4 py-3 text-lg" : ""
    )}
  >
    {children}
  </Link>
);

const ScrollLink = ({ to, targetId, children, mobile = false, onClick }: ScrollLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Close mobile menu if provided
    if (onClick) {
      onClick();
    }
    
    if (location.pathname === to && targetId) {
      // Already on the target page, just scroll to the section
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to the page first, then scroll after navigation
      navigate(to);
      setTimeout(() => {
        if (targetId) {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    }
  };

  return (
    <a 
      href={to}
      onClick={handleClick}
      className={cn(
        "text-foreground/80 font-medium hover:text-foreground transition-colors cursor-pointer",
        mobile ? "w-full px-4 py-3 text-lg block" : ""
      )}
    >
      {children}
    </a>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };




  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={"rm.png"} alt="Logo" className="pt-2 h-[5pc] w-[5pc]" />
            <span className="text-xl md:text-2xl font-heading font-bold text-primary pb-2">
              St. G. D. Convent School
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <ScrollLink to="/" targetId="about">About</ScrollLink>
            <NavLink to="/gallery">Gallery</NavLink>
            <NavLink to="/materials">Materials</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">

            
            <Link to="/admin">
              <Button variant="outline" className="hidden md:flex">
                Admin Portal
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-in">
          <nav className="flex flex-col py-4">
            <NavLink to="/" mobile onClick={closeMobileMenu}>Home</NavLink>
            <ScrollLink to="/" targetId="about" mobile onClick={closeMobileMenu}>About</ScrollLink>
            <NavLink to="/gallery" mobile onClick={closeMobileMenu}>Gallery</NavLink>
            <NavLink to="/materials" mobile onClick={closeMobileMenu}>Materials</NavLink>
            <div className="px-4 py-3">
              <Link to="/admin" onClick={closeMobileMenu}>
                <Button variant="outline" className="w-full">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
