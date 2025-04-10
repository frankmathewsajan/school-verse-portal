
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
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
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  React.useEffect(() => {
    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-heading font-bold text-primary">
              SchoolVerse
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
            <NavLink to="/materials">Materials</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-foreground/80"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
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
            <NavLink to="/about" mobile>About</NavLink>
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
