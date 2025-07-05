import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink
} from 'lucide-react';
import { ContentService, type FooterSection } from '@/services/contentService';

const Footer = () => {
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    loadFooterSections();
  }, []);

  const loadFooterSections = async () => {
    try {
      const sections = await ContentService.getFooterSections();
      setFooterSections(sections);
    } catch (error) {
      console.error('Error loading footer sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFooterSection = (section: FooterSection) => {
    switch (section.section_type) {
      case 'links':
        return (
          <div key={section.id}>
            <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
            <nav className="flex flex-col space-y-2">
              {section.content.items?.map((item: any, index: number) => (
                <Link 
                  key={index}
                  to={item.url} 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        );

      case 'contact':
        return (
          <div key={section.id}>
            <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
            <div className="space-y-3">
              {section.content.address && (
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-primary-foreground/80 mt-1 flex-shrink-0" />
                  <span className="text-primary-foreground/80">{section.content.address}</span>
                </div>
              )}
              {section.content.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-primary-foreground/80 flex-shrink-0" />
                  <span className="text-primary-foreground/80">{section.content.phone}</span>
                </div>
              )}
              {section.content.email && (
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-primary-foreground/80 flex-shrink-0" />
                  <span className="text-primary-foreground/80">{section.content.email}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'social':
        return (
          <div key={section.id}>
            <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
            <div className="flex space-x-4">
              {section.content.platforms?.map((platform: any, index: number) => {
                const getSocialIcon = (iconName: string) => {
                  switch (iconName.toLowerCase()) {
                    case 'facebook':
                      return <Facebook size={20} />;
                    case 'twitter':
                      return <Twitter size={20} />;
                    case 'instagram':
                      return <Instagram size={20} />;
                    case 'youtube':
                      return <Youtube size={20} />;
                    default:
                      return <ExternalLink size={20} />;
                  }
                };

                return (
                  <a 
                    key={index}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    title={platform.name}
                  >
                    {getSocialIcon(platform.icon)}
                  </a>
                );
              })}
            </div>
          </div>
        );

      case 'custom':
        return (
          <div key={section.id}>
            <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
            <p className="text-primary-foreground/80 max-w-xs">
              {section.content.text}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // Fallback content when no sections are loaded or during loading
  const renderFallbackContent = () => (
    <>
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
    </>
  );
  
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading || footerSections.length === 0 ? (
            renderFallbackContent()
          ) : (
            footerSections.map((section) => renderFooterSection(section))
          )}
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
