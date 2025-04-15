import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">St.G.D Convent School</h3>
            <p className="text-primary-foreground/80 max-w-xs">
              Empowering students through innovative education and comprehensive learning experiences since 2015.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Home</Link>
              <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">About Us</Link>
              <Link to="/gallery" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Gallery</Link>
              <Link to="/materials" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Learning Materials</Link>
              <Link to="/admin" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Admin Portal</Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Academic Calendar</a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Events</a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Parent Portal</a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Career Opportunities</a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Support</a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary-foreground/80 mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80">Siroli, Road Dhanouli, Agra, Uttar Pradesh</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-primary-foreground/80 flex-shrink-0" />
                <span className="text-primary-foreground/80">8077422014, 9084792142</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-primary-foreground/80 flex-shrink-0" />
                <span className="text-primary-foreground/80">st.g.dconventschool1@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-primary-foreground/10 py-4">
        <div className="container mx-auto px-4 text-center text-primary-foreground/80 text-sm">
          <p>© {currentYear} St.G.D Convent School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
