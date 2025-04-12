
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
  mobile?: boolean;
};

const NavLink = ({ to, children, mobile = false }: NavLinkProps) => (
  <Link 
    to={to} 
    className={cn(
      "text-foreground/80 font-medium hover:text-foreground transition-colors",
      mobile ? "w-full px-4 py-3 text-lg" : ""
    )}
  >
    {children}
  </Link>
);

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);




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
            <NavLink to="/" mobile>Home</NavLink>
            <NavLink to="/gallery" mobile>Gallery</NavLink>
            <NavLink to="/materials" mobile>Materials</NavLink>
            <div className="px-4 py-3">
              <Link to="/admin">
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
